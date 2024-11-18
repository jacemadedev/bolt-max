import { motion, AnimatePresence } from 'framer-motion';
import type { HistoryItem } from '@/lib/types';

interface ActivityListProps {
  items: HistoryItem[];
  loading?: boolean;
}

export function ActivityList({ items, loading = false }: ActivityListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 dark:bg-neutral-900 rounded w-1/4 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No recent activity
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}