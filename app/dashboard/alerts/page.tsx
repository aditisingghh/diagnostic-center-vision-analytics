'use client';

import { KPICard } from '@/components/common/KPICard';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { LiveAnalytics } from '@/components/common/LiveAnalytics';
import { SimpleChart } from '@/components/common/SimpleChart';

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Alerts</h1>
        <p className="text-slate-600 dark:text-slate-400">System alerts and notifications</p>
      </div>

      <VideoPlayer title="System Monitoring Feed" />

      <LiveAnalytics 
        title="LIVE ANALYTICS"
        data={{
          'Critical Alerts': 2,
          'High Priority': 5,
          'Medium Priority': 8,
          'Resolved': 12,
        }}
        duration="00:00:43"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard label="Critical" value={2} unit="alerts" trend={-1} status="critical" />
        <KPICard label="High" value={5} unit="alerts" trend={0} status="warning" />
        <KPICard label="Medium" value={8} unit="alerts" trend={2} status="warning" />
        <KPICard label="Resolved" value={12} unit="alerts" trend={3} status="good" />
      </div>

      <SimpleChart
        title="Alert Activity Trend"
        data={[2, 3, 5, 8, 12, 10, 8, 6, 5, 4, 3, 2]}
        labels={['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h']}
      />

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
    </div>
  );
}
