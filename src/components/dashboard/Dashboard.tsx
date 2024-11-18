import { useState, useEffect } from 'react';
import { DashboardLayout } from '../layout/DashboardLayout';
import { Stats } from './Stats';
import { ActivityList } from './ActivityList';
import { ChatBox } from '../chat/ChatBox';
import { PricingBanner } from '../pricing/PricingBanner';
import { PricingModal } from '../pricing/PricingModal';
import { SubscriptionCard } from './SubscriptionCard';
import { getHistory } from '@/lib/history';
import { getSubscription } from '@/lib/subscription';
import { useAuth } from '@/lib/auth';
import { useNavigate } from '@/lib/navigate';
import type { HistoryItem, Subscription } from '@/lib/types';
import { AlertCircle } from 'lucide-react';

export function Dashboard() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const { user } = useAuth();
  const { currentPage } = useNavigate();

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [historyData, subscriptionData] = await Promise.all([
          getHistory(user.id),
          getSubscription(user.id)
        ]);

        setItems(historyData);
        setSubscription(subscriptionData);
        
        // Show pricing modal for free users
        if (!subscriptionData || subscriptionData.status !== 'active') {
          setShowPricing(true);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout currentPage={currentPage}>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage={currentPage}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track your token usage and response times
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: Just now</span>
            <button 
              onClick={() => window.location.reload()}
              className="px-3 py-1.5 text-sm bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        <PricingBanner
          tokensLeft={subscription?.tokenLimit || 10000}
          tokenLimit={subscription?.tokenLimit || 10000}
          onUpgrade={() => setShowPricing(true)}
        />

        <SubscriptionCard
          currentPlan={subscription?.planId || 'free'}
          onUpgrade={() => setShowPricing(true)}
        />

        <div className="mb-8">
          <Stats />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityList items={items} loading={loading} />
          <div className="h-[400px]">
            <ChatBox />
          </div>
        </div>
      </div>

      {showPricing && (
        <PricingModal 
          isOpen={showPricing} 
          onClose={() => setShowPricing(false)} 
        />
      )}
    </DashboardLayout>
  );
}