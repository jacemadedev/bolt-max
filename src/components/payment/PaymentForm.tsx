import { useState, useEffect } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PricingPlan } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { usePayment } from './usePayment';

interface PaymentFormProps {
  plan: PricingPlan;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentForm({ plan, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createPaymentIntent, error: paymentError } = usePayment();

  useEffect(() => {
    if (paymentError) {
      onError(paymentError);
    }
  }, [paymentError, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      onError("Payment configuration is incomplete");
      return;
    }

    if (!user.email) {
      onError("Please verify your email address before proceeding");
      return;
    }

    setLoading(true);

    try {
      // Get client secret
      const clientSecret = await createPaymentIntent(plan, user.id);
      
      if (!clientSecret) {
        throw new Error("Failed to create payment intent");
      }

      // Submit form
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw submitError;
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard?success=true`,
          receipt_email: user.email, // Add email for receipt
        },
      });

      if (confirmError) {
        throw confirmError;
      }

      onSuccess();
    } catch (err) {
      const error = err as Error;
      onError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-md mx-auto">
      {/* Plan Summary */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {plan.name} Plan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly subscription
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${plan.price}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              per month
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Includes:
          </p>
          <ul className="space-y-2">
            {plan.features.slice(0, 3).map((feature) => (
              <li key={feature} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-600 rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment Element */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Payment Details
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            Secured by Stripe
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <PaymentElement />
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={!stripe || loading}
        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay ${plan.price.toFixed(2)}
          </>
        )}
      </motion.button>

      {/* Terms */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        By confirming your subscription, you allow {plan.name} Plan to charge your card for this payment and future payments in accordance with their terms.{' '}
        <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline">
          View Terms
        </button>
      </p>
    </form>
  );
}