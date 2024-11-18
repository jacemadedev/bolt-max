export interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: string;
}

export interface Chat {
  id: number;
  title: string;
  messages: Message[];
  model: string;
  tokensUsed: number;
  lastActive: string;
}

export interface HistoryItem {
  id: string;
  user_id: string;
  type: 'chat' | 'completion';
  model: string;
  title: string;
  tokens_used: number;
  response_time: string;
  created_at: string;
  status: 'success' | 'error';
  messages?: Message[];
  prompt?: string;
  completion?: string;
}

export type HistoryItemInsert = Omit<HistoryItem, 'id' | 'created_at'>

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  tokenLimit: number;
  highlighted?: boolean;
  stripePriceId: string | null;
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'canceled' | 'expired';
  currentPeriodEnd: string;
  tokenLimit: number;
  tokensUsed: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export interface Subscription {
  planId: string;
  status: string;
  tokenLimit: number;
  tokensUsed: number;
  currentPeriodEnd: string;
}