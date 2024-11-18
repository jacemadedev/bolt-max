import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chat, Message, UserSubscription } from './types';
import { createChatCompletion } from './openai';
import { addHistoryItem } from './history';
import { useAuth } from './auth';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface AppState {
  chats: Chat[];
  currentChatId: number | null;
  apiKey: string | null;
  subscription: UserSubscription | null;
  monthlyTokens: number;
  lastTokenReset: string | null;
  addChat: () => void;
  addMessage: (chatId: number, content: string, isUser: boolean) => Promise<void>;
  setCurrentChat: (chatId: number | null) => void;
  setApiKey: (key: string | null) => void;
  setSubscription: (subscription: UserSubscription | null) => void;
  resetTokenCount: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      apiKey: null,
      subscription: null,
      monthlyTokens: 0,
      lastTokenReset: null,

      addChat: () => set((state) => {
        const newChat: Chat = {
          id: Date.now(),
          title: 'New Chat',
          messages: [],
          model: 'gpt-3.5-turbo',
          tokensUsed: 0,
          lastActive: new Date().toISOString(),
        };
        return { 
          chats: [...state.chats, newChat],
          currentChatId: newChat.id
        };
      }),

      addMessage: async (chatId, content, isUser) => {
        // Check token limit based on subscription
        const { monthlyTokens, lastTokenReset, subscription } = get();
        const tokenLimit = subscription?.tokenLimit || 10000; // Free tier default
        const now = new Date();
        const resetDate = lastTokenReset ? new Date(lastTokenReset) : null;
        
        // Reset monthly tokens if it's been a month
        if (!resetDate || now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
          get().resetTokenCount();
        } else if (monthlyTokens >= tokenLimit) {
          throw new Error(`Monthly token limit (${tokenLimit.toLocaleString()}) reached. Please upgrade your plan for more tokens.`);
        }

        const timestamp = new Date().toISOString();
        const newMessage: Message = {
          id: Date.now(),
          content,
          isUser,
          timestamp,
        };

        // First update the UI with the user's message
        set((state) => ({
          chats: state.chats.map(chat =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, newMessage] }
              : chat
          )
        }));

        // If it's a user message, get AI response
        if (isUser) {
          const startTime = Date.now();
          const chat = get().chats.find(c => c.id === chatId);
          if (!chat) return;

          // Convert messages to OpenAI format
          const messages: ChatCompletionMessageParam[] = chat.messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          }));

          // Add the new user message
          messages.push({ role: 'user', content });

          try {
            // Get AI response using the custom API key if available
            const response = await createChatCompletion(messages, {
              model: chat.model,
              apiKey: get().apiKey,
            });

            const responseTime = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;

            // Update monthly token count
            set(state => ({
              monthlyTokens: state.monthlyTokens + response.tokensUsed
            }));

            // Create AI message
            const aiMessage: Message = {
              id: Date.now(),
              content: response.content,
              isUser: false,
              timestamp: new Date().toISOString()
            };

            // Update chat with AI response
            set((state) => ({
              chats: state.chats.map(c =>
                c.id === chatId
                  ? {
                      ...c,
                      messages: [...c.messages, aiMessage],
                      tokensUsed: c.tokensUsed + response.tokensUsed,
                      lastActive: aiMessage.timestamp
                    }
                  : c
              )
            }));

            // Add to history
            const user = useAuth.getState().user;
            if (user) {
              const historyItem = {
                user_id: user.id,
                type: 'chat' as const,
                model: response.model,
                title: `Chat Completion - ${response.tokensUsed} tokens`,
                tokens_used: response.tokensUsed,
                response_time: responseTime,
                status: response.status,
                messages: chat.messages,
                prompt: content,
                completion: response.content
              };

              try {
                await addHistoryItem(historyItem);
              } catch (error) {
                console.error('Failed to save to history:', error);
              }
            }
          } catch (error) {
            // Remove the user message if AI response fails
            set((state) => ({
              chats: state.chats.map(chat =>
                chat.id === chatId
                  ? { ...chat, messages: chat.messages.slice(0, -1) }
                  : chat
              )
            }));
            throw error;
          }
        }
      },

      setCurrentChat: (chatId) => set({ currentChatId: chatId }),
      
      setApiKey: (apiKey) => set({ apiKey }),

      setSubscription: (subscription) => set({ subscription }),

      resetTokenCount: () => set({
        monthlyTokens: 0,
        lastTokenReset: new Date().toISOString()
      }),
    }),
    {
      name: 'ai-dashboard-storage',
      partialize: (state) => ({
        apiKey: state.apiKey,
        monthlyTokens: state.monthlyTokens,
        lastTokenReset: state.lastTokenReset,
        chats: state.chats,
      }),
    }
  )
);