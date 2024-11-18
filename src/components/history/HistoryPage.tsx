import { Trash2 } from 'lucide-react';
import { HistoryList } from './HistoryList';
import { HistoryStats } from './HistoryStats';
import { DashboardLayout } from '../layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { getHistory, clearHistory, deleteHistoryItem } from '@/lib/history';
import { useAuth } from '@/lib/auth';
import type { HistoryItem } from '@/lib/types';

export function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchHistory = async () => {
      try {
        const data = await getHistory(user.id);
        setItems(data);
      } catch (err) {
        setError('Failed to load history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleClearHistory = async () => {
    if (!user || !confirm('Are you sure you want to clear all history?')) return;

    try {
      await clearHistory(user.id);
      setItems([]);
    } catch (err) {
      console.error(err);
      setError('Failed to clear history');
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout currentPage="history">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-medium text-gray-900 dark:text-white">History</h1>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
              View and analyze your past API requests
            </p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading history...</p>
          </div>
        ) : (
          <>
            <HistoryStats items={items} />
            <HistoryList 
              items={items} 
              onDelete={async (id) => {
                if (!user) return;
                try {
                  await deleteHistoryItem(id, user.id);
                  setItems(items.filter(item => item.id !== id));
                } catch (err) {
                  console.error(err);
                  setError('Failed to delete item');
                }
              }} 
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}