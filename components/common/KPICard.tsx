'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  status?: 'good' | 'warning' | 'critical';
  icon?: React.ReactNode;
}

export function KPICard({ 
  label, 
  value, 
  unit, 
  trend, 
  status = 'good',
  icon 
}: KPICardProps) {
  const statusColors = {
    good: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    critical: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };

  const trendColor = trend && trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className={`p-6 rounded-lg border ${statusColors[status]} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
        </div>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
        {unit && <span className="text-sm text-slate-600 dark:text-slate-400">{unit}</span>}
      </div>

      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );
}
