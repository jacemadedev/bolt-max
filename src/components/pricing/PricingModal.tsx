import { useState } from 'react';
import { X, Check, Zap, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pricingPlans } from '@/lib/pricing';
import { useAuth } from '@/lib/auth';
import { PaymentForm } from '../payment/PaymentForm';
import { StripeProvider } from '../payment/StripeProvider';
import type { PricingPlan } from '@/lib/types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

export function PricingModal({ isOpen, onClose, currentPlan }: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSelectPlan = (plan: PricingPlan) => {
    if (!plan.stripePriceId) {
      setError('This plan is not available for purchase');
      return;
    }
    
    if (!user) {
      setError('Please sign in to upgrade your plan');
      return;
    }

    setError(null);
    setSelectedPlan(plan);
  };

  const handlePaymentSuccess = () => {
    // Show success message and close modal
    alert('Payment successful! Your subscription has been activated.');
    onClose();
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setSelectedPlan(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {selectedPlan ? 'Complete Your Purchase' : 'Upgrade Your Plan'}
              </h2>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {selectedPlan 
                  ? 'Enter your payment details to subscribe' 
                  : 'Choose the perfect plan for your needs'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedPlan ? (
            <StripeProvider>
              <PaymentForm
                plan={selectedPlan}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </StripeProvider>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-2xl border ${
                    plan.highlighted
                      ? 'border-blue-600 dark:border-blue-500'
                      : 'border-gray-200 dark:border-gray-800'
                  } p-6 ${
                    plan.highlighted
                      ? 'bg-blue-50/50 dark:bg-blue-900/20'
                      : 'bg-white dark:bg-gray-900'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                      Popular
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {plan.description}
                    </p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        /month
                      </span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={currentPlan === plan.id || !plan.stripePriceId}
                    className={`mt-6 w-full py-2 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                      currentPlan === plan.id
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        : plan.highlighted
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900'
                    }`}
                  >
                    {currentPlan === plan.id ? (
                      'Current Plan'
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        {plan.price === 0 ? 'Get Started' : 'Select Plan'}
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All plans include automatic monthly renewals.{' '}
            <button className="text-blue-600 dark:text-blue-400 hover:underline">
              View Terms
            </button>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}