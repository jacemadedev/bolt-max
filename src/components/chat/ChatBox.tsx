import { SendHorizontal, Plus, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from './ChatMessage';
import { useStore } from '@/lib/store';

interface ChatBoxProps {
  isFullPage?: boolean;
}

export function ChatBox({ isFullPage = false }: ChatBoxProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { chats, currentChatId, addChat, addMessage, monthlyTokens } = useStore();
  
  const currentChat = currentChatId ? chats.find(chat => chat.id === currentChatId) : null;
  const messages = currentChat?.messages || [];

  const TOKEN_LIMIT = 10000;
  const isNearLimit = monthlyTokens > TOKEN_LIMIT * 0.8;
  const tokensLeft = TOKEN_LIMIT - monthlyTokens;

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    try {
      // If no chat exists, create one first
      if (!currentChatId) {
        addChat();
        // Get the latest state after adding chat
        const state = useStore.getState();
        // Send message to the newly created chat
        await addMessage(state.currentChatId!, message, true);
      } else {
        await addMessage(currentChatId, message, true);
      }
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    addChat();
    setMessage('');
    setError(null);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col bg-white dark:bg-black rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 ${isFullPage ? 'h-full' : 'h-[400px]'}`}
    >
      {/* Chat Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between"
      >
        <h2 className="font-medium text-gray-900 dark:text-white">
          {currentChat?.title || 'New Chat'}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNewChat}
          className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
          title="New Chat"
        >
          <Plus className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
        </motion.button>
      </motion.div>

      {/* Token Warning */}
      {isNearLimit && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-900/50"
        >
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">
              {tokensLeft <= 0 
                ? 'Monthly token limit reached. Please try again next month or upgrade your account.'
                : `Only ${tokensLeft.toLocaleString()} tokens left this month.`}
            </p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50"
          >
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex items-center justify-center text-gray-500 dark:text-neutral-400"
          >
            Start a new conversation
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <ChatMessage
                key={msg.id}
                message={msg.content}
                isUser={msg.isUser}
                animate={true}
                delay={index * 0.1}
              />
            ))}
          </AnimatePresence>
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-neutral-900 rounded-2xl px-4 py-2 flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border-t border-gray-100 dark:border-neutral-800"
      >
        <div className="flex gap-3">
          <motion.input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isLoading ? 'AI is thinking...' : 'Type your message...'}
            disabled={isLoading || tokensLeft <= 0}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            whileFocus={{ scale: 1.02 }}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-neutral-900"
          />
          <motion.button
            onClick={handleSend}
            disabled={isLoading || !message.trim() || tokensLeft <= 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors disabled:bg-blue-400 dark:disabled:bg-blue-600"
          >
            <SendHorizontal className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}