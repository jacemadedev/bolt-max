import { Brain, Clock, Gauge } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { useStore } from '@/lib/store';

const TOKEN_LIMIT = 10000;

export function Stats() {
  const { monthlyTokens, lastTokenReset } = useStore();
  const tokensLeft = TOKEN_LIMIT - monthlyTokens;
  
  // Calculate days until reset
  const now = new Date();
  const resetDate = lastTokenReset ? new Date(lastTokenReset) : now;
  resetDate.setMonth(resetDate.getMonth() + 1);
  const daysUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Tokens Used"
        value={monthlyTokens.toLocaleString()}
        description={`Resets in ${daysUntilReset} days`}
        icon={Brain}
        trend={monthlyTokens > TOKEN_LIMIT * 0.8 ? 'down' : 'up'}
      />
      <StatsCard
        title="Tokens Left"
        value={tokensLeft.toLocaleString()}
        description={`Monthly limit: ${TOKEN_LIMIT.toLocaleString()}`}
        icon={Gauge}
        trend={tokensLeft < TOKEN_LIMIT * 0.2 ? 'down' : undefined}
      />
      <StatsCard
        title="Usage"
        value={`${((monthlyTokens / TOKEN_LIMIT) * 100).toFixed(1)}%`}
        description="Of monthly allowance"
        icon={Clock}
        trend={monthlyTokens > TOKEN_LIMIT * 0.8 ? 'down' : 'up'}
      />
    </div>
  );
}