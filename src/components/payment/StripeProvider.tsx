import { ReactNode } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { Appearance } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#0071e3',
    colorBackground: '#ffffff',
    colorText: '#1d1d1f',
    colorDanger: '#ff3b30',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    spacingUnit: '4px',
    borderRadius: '12px',
  },
  rules: {
    '.Input': {
      border: '1px solid #e5e7eb',
      boxShadow: 'none',
      fontSize: '16px',
      padding: '12px',
      transition: 'all 0.2s ease',
    },
    '.Input:focus': {
      border: '1px solid #0071e3',
      boxShadow: '0 0 0 1px #0071e3',
    },
    '.Input::placeholder': {
      color: '#86868b',
    },
    '.Input--invalid': {
      border: '1px solid #ff3b30',
      boxShadow: 'none',
    },
    '.Error': {
      color: '#ff3b30',
      fontSize: '14px',
      marginTop: '8px',
    },
  },
};

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const options = {
    appearance,
    mode: 'payment' as const,
    currency: 'usd',
    amount: 1000,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}