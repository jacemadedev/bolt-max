import type { PricingPlan } from './types';

const standardFeatures = [
  'Advanced chat interface',
  'Priority response time',
  'Unlimited chats',
  'Email support',
  'Custom API key support',
  'History export',
  'Team collaboration',
  'GPT-4 access',
  'API access'
];

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out our services',
    price: 0,
    interval: 'monthly',
    tokenLimit: 10000,
    features: [
      '10,000 tokens per month',
      ...standardFeatures
    ],
    stripePriceId: null
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Great for regular users',
    price: 10,
    interval: 'monthly',
    tokenLimit: 100000,
    highlighted: true,
    features: [
      '100,000 tokens per month',
      ...standardFeatures
    ],
    stripePriceId: 'price_1QLvDIHMs7qfi0lLYpo5xibE'
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power users and teams',
    price: 29,
    interval: 'monthly',
    tokenLimit: 500000,
    features: [
      '500,000 tokens per month',
      ...standardFeatures
    ],
    stripePriceId: 'price_1QLvDiHMs7qfi0lLODvkbRlX'
  }
];