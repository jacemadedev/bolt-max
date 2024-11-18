import { config } from './config';

interface ApiError extends Error {
  code?: string;
  status?: number;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.api.baseUrl}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'API request failed') as ApiError;
      error.code = data.code;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (err) {
    const error = err as Error;
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}