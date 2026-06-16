'use client';

import { KPICard } from '@/components/common/KPICard';
import { SimpleChart } from '@/components/common/SimpleChart';
import { BarChart3, Users, Footprints, Armchair, User2, AlertCircle } from 'lucide-react';

export default function OverviewPage() {
  const kpis = [
    {
      label: 'Waiting Area Status',
      value: 45,
      unit: 'visitors',
      trend: 12,
      status: 'good' as const,
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      label: 'Queue Length',
      value: 12,
      unit: 'people',
      trend: -8,
      status: 'good' as const,
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    },
    {
      label: 'Footfall Today',
      value: 1248,
      unit: 'visitors',
      trend: 15,
      status: 'good' as const,
      icon: <Footprints className="w-6 h-6 text-blue-600" />,
    },
    {
      label: 'Chair Occupancy',
      value: 82,
      unit: '%',
      trend: 5,
      status: 'good' as const,
      icon: <Armchair className="w-6 h-6 text-blue-600" />,
    },
    {
      label: 'Active Employees',
      value: 24,
      unit: 'staff',
      trend: 0,
      status: 'good' as const,
      icon: <User2 className="w-6 h-6 text-blue-600" />,
    },
    {
      label: 'Active Alerts',
      value: 3,
      unit: 'alerts',
      trend: -2,
      status: 'warning' as const,
      icon: <AlertCircle className="w-6 h-6 text-orange-500" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Overview</h1>
        <p className="text-slate-600 dark:text-slate-400">Real-time system status and key metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            trend={kpi.trend}
            status={kpi.status}
            icon={kpi.icon}
          />
        ))}
      </div>

      <SimpleChart 
        title="Occupancy Trend" 
        data={[45, 52, 48, 65, 78, 82, 76, 88, 92, 85, 78, 72]}
        labels={['00h', '02h', '04h', '06h', '08h', '10h', '12h', '14h', '16h', '18h', '20h', '22h']}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Alert #{i}</span>
                </div>
                <span className="text-xs text-slate-500">{i}m ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Waiting Area', icon: '👥' },
              { label: 'Queue', icon: '📊' },
              { label: 'Footfall', icon: '👣' },
              { label: 'Chairs', icon: '🪑' },
              { label: 'Staff', icon: '👨‍💼' },
              { label: 'Alerts', icon: '⚠️' },
            ].map((item) => (
              <button key={item.label} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs font-medium text-slate-900 dark:text-white">{item.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
