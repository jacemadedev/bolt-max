import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className="rounded-full p-3 bg-blue-50 dark:bg-neutral-900">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {trend && (
          <span className={cn(
            "mr-2",
            trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
        <span className="text-gray-600 dark:text-neutral-400">{description}</span>
      </div>
    </div>
  );
}