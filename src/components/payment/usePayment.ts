import { useState } from 'react';
import type { PricingPlan } from '@/lib/types';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentIntent = async (plan: PricingPlan, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment intent');
      }

      const data = await response.json();
      return data.clientSecret;
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to initialize payment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPaymentIntent,
    loading,
    error,
  };
}