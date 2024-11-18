export interface HistoryItem {
  id: number;
  type: 'chat' | 'completion';
  model: string;
  title: string;
  tokensUsed: number;
  responseTime: string;
  timestamp: string;
  status: 'success' | 'error';
}