'use client';

import { KPICard } from '@/components/common/KPICard';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { LiveAnalytics } from '@/components/common/LiveAnalytics';
import { SimpleChart } from '@/components/common/SimpleChart';

export default function QueueMonitoringPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Queue Monitoring</h1>
        <p className="text-slate-600 dark:text-slate-400">Real-time queue status and processing metrics</p>
      </div>

      <VideoPlayer title="Queue Area Live Feed" />

      <LiveAnalytics 
        title="LIVE ANALYTICS"
        data={{
          'Queue Length': 12,
          'Processing Status': 'Active',
          'Avg Wait Time': '8 min',
          'Processing Rate': '285/hour',
        }}
        duration="00:00:43"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard label="Queue Length" value={12} unit="people" trend={-8} status="good" />
        <KPICard label="Avg Wait Time" value={8} unit="min" trend={2} status="good" />
        <KPICard label="Processing Rate" value={285} unit="/hour" trend={15} status="good" />
        <KPICard label="Queue Build-up" value={3} unit="events" trend={-1} status="good" />
        <KPICard label="Queue Status" value="Normal" unit="Active" trend={0} status="good" />
      </div>

      <SimpleChart
        title="Queue Length Trends"
        data={[5, 8, 12, 18, 22, 16, 12, 8, 6, 10, 15, 12]}
        labels={['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h']}
      />

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Live Queue Status</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4">Queue is operating normally with optimal flow rates.</p>
      </div>
    </div>
  );
}
