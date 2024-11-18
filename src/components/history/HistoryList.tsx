import { MessageSquare, Terminal, CheckCircle, XCircle, Trash } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryDetails } from './HistoryDetails';
import type { HistoryItem } from '@/lib/types';

interface HistoryListProps {
  items: HistoryItem[];
  onDelete?: (id: string) => Promise<void>;
}

export function HistoryList({ items, onDelete }: HistoryListProps) {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const getIcon = (type: 'chat' | 'completion') => {
    return type === 'chat' ? MessageSquare : Terminal;
  };

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

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-black rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Requests</h2>
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500 dark:text-gray-400"
            >
              No history items yet
            </motion.div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-neutral-800">
              <AnimatePresence>
                {items.map((item, index) => {
                  const Icon = getIcon(item.type);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="py-4 flex items-center gap-4"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-blue-50 dark:bg-neutral-900 flex items-center justify-center"
                      >
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                          <motion.span 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-400"
                          >
                            {item.model}
                          </motion.span>
                          <motion.div whileHover={{ scale: 1.2 }}>
                            {item.status === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                            )}
                          </motion.div>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600 dark:text-neutral-400">
                          <span>{item.tokens_used} tokens</span>
                          <span>{item.response_time}</span>
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedItem(item)}
                          className="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-neutral-900 rounded-lg transition-colors"
                        >
                          View Details
                        </motion.button>
                        {onDelete && (
                          <motion.button 
                            whileHover={{ scale: 1.1, rotate: 20 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onDelete(item.id)}
                            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedItem && (
          <HistoryDetails 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}