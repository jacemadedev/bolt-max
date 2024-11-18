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
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return { 
      statusCode: 400, 
      body: JSON.stringify({ error: 'Missing signature or webhook secret' })
    };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      webhookSecret
    );

    switch (stripeEvent.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        const { userId, priceId } = paymentIntent.metadata;

        const planId = getPlanIdFromPriceId(priceId);
        const tokenLimit = getTokenLimitFromPlanId(planId);

        const subscription = await stripe.subscriptions.create({
          customer: paymentIntent.customer as string,
          items: [{ price: priceId }],
          metadata: { userId },
        });

        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: paymentIntent.customer,
            stripe_subscription_id: subscription.id,
            plan_id: planId,
            status: 'active',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            token_limit: tokenLimit,
            tokens_used: 0
          });

        if (error) throw error;
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0].price.id;
        const planId = getPlanIdFromPriceId(priceId);
        const tokenLimit = getTokenLimitFromPlanId(planId);

        const { error } = await supabase
          .from('subscriptions')
          .update({
            plan_id: planId,
            status: subscription.status === 'active' ? 'active' : 'expired',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            token_limit: tokenLimit
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) throw error;
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) throw error;
        break;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.error('Webhook error:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' }),
    };
  }
};

function getPlanIdFromPriceId(priceId: string): string {
  switch (priceId) {
    case 'price_1QLvDIHMs7qfi0lLYpo5xibE':
      return 'basic';
    case 'price_1QLvDiHMs7qfi0lLODvkbRlX':
      return 'pro';
    default:
      return 'free';
  }
}

function getTokenLimitFromPlanId(planId: string): number {
  switch (planId) {
    case 'basic':
      return 100000;
    case 'pro':
      return 500000;
    default:
      return 10000;
  }
}

export { handler };