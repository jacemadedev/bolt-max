import { supabase } from './supabase';
import type { UserSubscription } from './types';

export async function getSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to handle no rows gracefully

    if (error) throw error;
    if (!data) {
      // Return default free tier subscription when no subscription exists
      return {
        planId: 'free',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        tokenLimit: 10000,
        tokensUsed: 0,
        stripeCustomerId: null,
        stripeSubscriptionId: null
      };
    }

    return {
      planId: data.plan_id,
      status: data.status,
      currentPeriodEnd: data.current_period_end,
      tokenLimit: data.token_limit,
      tokensUsed: data.tokens_used,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id
    };
  } catch (error) {
    console.error('Failed to fetch subscription:', error);
    // Return default free tier subscription on error
    return {
      planId: 'free',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      tokenLimit: 10000,
      tokensUsed: 0,
      stripeCustomerId: null,
      stripeSubscriptionId: null
    };
  }
}