import OpenAI from 'openai';
import { type ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string | null;
}

const defaultOptions: ChatOptions = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1000
};

export async function createChatCompletion(
  messages: ChatCompletionMessageParam[],
  options: ChatOptions = {}
) {
  const startTime = Date.now();
  
  try {
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Use custom API key if provided, otherwise fall back to environment variable
    const apiKey = options.apiKey || import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('No API key available. Please provide an OpenAI API key in the settings.');
    }

    // Initialize OpenAI client with the appropriate API key
    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    const completion = await openai.chat.completions.create({
      model: mergedOptions.model!,
      messages,
      temperature: mergedOptions.temperature,
      max_tokens: mergedOptions.maxTokens,
    });

    const responseTime = ((Date.now() - startTime) / 1000).toFixed(2);
    
    return {
      content: completion.choices[0].message.content || '',
      tokensUsed: completion.usage?.total_tokens ?? 0,
      responseTime: `${responseTime}s`,
      model: mergedOptions.model!,
      status: 'success' as const
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    return {
      content: error instanceof Error 
        ? `Error: ${error.message}`
        : 'An error occurred while processing your request. Please check your API key and try again.',
      tokensUsed: 0,
      responseTime: '0s',
      model: options.model ?? defaultOptions.model!,
      status: 'error' as const
    };
  }
}