import { Crown, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { pricingPlans } from '@/lib/pricing';

interface SubscriptionCardProps {
  currentPlan: string;
  onUpgrade: () => void;
}

export function SubscriptionCard({ currentPlan, onUpgrade }: SubscriptionCardProps) {
  const plan = pricingPlans.find(p => p.id === currentPlan);
  const nextPlan = pricingPlans.find(p => p.price > (plan?.price || 0));

  if (!plan) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
            <Crown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {plan.name} Plan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {plan.tokenLimit.toLocaleString()} tokens per month
            </p>
          </div>
        </div>

        {nextPlan && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgrade}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <span>Upgrade to {nextPlan.name}</span>
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {plan.features.slice(0, 3).map((feature) => (
          <div
            key={feature}
            className="px-4 py-3 bg-gray-50 dark:bg-neutral-900 rounded-xl text-sm text-gray-600 dark:text-gray-400"
          >
            {feature}
          </div>
        ))}
      </div>

      {plan.id === 'free' && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Upgrade to Basic or Pro for increased token limits and advanced features
          </p>
        </div>
      )}
    </motion.div>
  );
}