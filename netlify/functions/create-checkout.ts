import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { priceId, userId, returnUrl } = JSON.parse(event.body || '{}');

    if (!priceId || !userId || !returnUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required parameters' }),
      };
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    // Get or create Stripe customer
    let customerId: string;
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: userId,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      client_reference_id: userId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${returnUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/dashboard?canceled=true`,
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
      allow_promotion_codes: true,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: error instanceof Error ? error.message : 'Failed to create checkout session'
      }),
    };
  }
};

export { handler };