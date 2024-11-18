import { Brain, Clock, MessageSquare, Terminal, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { HistoryItem } from '@/lib/types';

interface HistoryDetailsProps {
  item: HistoryItem;
  onClose: () => void;
}

export function HistoryDetails({ item, onClose }: HistoryDetailsProps) {
  const Icon = item.type === 'chat' ? MessageSquare : Terminal;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-black rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto border border-gray-100 dark:border-neutral-800"
      >
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-full bg-blue-50 dark:bg-neutral-900 flex items-center justify-center"
              >
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-neutral-400" />
            </motion.button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-3">Request Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-gray-600 dark:text-neutral-400" />
                <span className="text-sm text-gray-900 dark:text-white">Model: {item.model}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600 dark:text-neutral-400" />
                <span className="text-sm text-gray-900 dark:text-white">Response Time: {item.response_time}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-3">Usage Statistics</h3>
            <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">Prompt Tokens</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {Math.floor(item.tokens_used * 0.4)}
                  </p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">Completion Tokens</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {Math.floor(item.tokens_used * 0.6)}
                  </p>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-neutral-400">Total Tokens</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.tokens_used}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {item.messages && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-3">Conversation</h3>
              <div className="space-y-4">
                {item.messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: msg.isUser ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        msg.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {(item.prompt || item.completion) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-3">Raw Data</h3>
              <div className="space-y-4">
                {item.prompt && (
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">Prompt</p>
                    <pre className="text-sm bg-gray-50 dark:bg-neutral-900 p-4 rounded-xl overflow-auto">
                      {item.prompt}
                    </pre>
                  </motion.div>
                )}
                {item.completion && (
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <p className="text-sm font-medium text-gray-600 dark:text-neutral-400 mb-1">Completion</p>
                    <pre className="text-sm bg-gray-50 dark:bg-neutral-900 p-4 rounded-xl overflow-auto">
                      {item.completion}
                    </pre>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-neutral-800">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-2 px-4 bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-gray-900 dark:text-white rounded-xl transition-colors"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}