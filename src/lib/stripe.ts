import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from './auth';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface CreateCheckoutError {
  message: string;
  code?: string;
}

export async function createCheckoutSession(priceId: string) {
  try {
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to initialize');

    // Get current user
    const { user } = useAuth.getState();
    if (!user) throw new Error('You must be logged in to subscribe');

    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId: user.id,
        returnUrl: window.location.origin,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create checkout session');
    }

    const { sessionId } = data;
    if (!sessionId) throw new Error('No session ID returned');

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error('Stripe redirect error:', error);
      throw new Error(error.message || 'Failed to redirect to checkout');
    }
  } catch (err) {
    const error = err as Error | CreateCheckoutError;
    console.error('Payment error:', error);
    throw new Error('message' in error ? error.message : 'Failed to process payment');
  }
}