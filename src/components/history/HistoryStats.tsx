import { Brain, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HistoryItem } from '@/lib/types';

interface HistoryStatsProps {
  items: HistoryItem[];
}

export function HistoryStats({ items }: HistoryStatsProps) {
  const totalTokens = items.reduce((sum, item) => sum + item.tokens_used, 0);
  const successRate = items.length > 0 
    ? (items.filter(item => item.status === 'success').length / items.length) * 100
    : 0;
  
  const avgResponseTime = items.length > 0
    ? items.reduce((sum, item) => {
        const time = parseFloat(item.response_time.replace('s', ''));
        return sum + (isNaN(time) ? 0 : time);
      }, 0) / items.length
    : 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <motion.div 
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-full bg-blue-50 dark:bg-neutral-900 flex items-center justify-center"
          >
            <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Total Tokens</p>
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              {totalTokens.toLocaleString()}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-full bg-green-50 dark:bg-neutral-900 flex items-center justify-center"
          >
            <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Success Rate</p>
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              {successRate.toFixed(1)}%
            </motion.p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={item}
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-black p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800"
      >
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-full bg-purple-50 dark:bg-neutral-900 flex items-center justify-center"
          >
            <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </motion.div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Avg Response Time</p>
            <motion.p 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              {avgResponseTime.toFixed(1)}s
            </motion.p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}