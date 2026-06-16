'use client';

import { KPICard } from '@/components/common/KPICard';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { LiveAnalytics } from '@/components/common/LiveAnalytics';
import { SimpleChart } from '@/components/common/SimpleChart';

export default function EmployeeAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Employee Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400">Staff activity and presence monitoring</p>
      </div>

      <VideoPlayer title="Staff Area Live Feed" />

      <LiveAnalytics 
        title="LIVE ANALYTICS"
        data={{
          'Active Staff': 24,
          'Active Duration': '6.5 hours',
          'Utilization Rate': '88%',
          'Presence Status': 'On Duty',
        }}
        duration="00:00:43"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard label="Active Staff" value={24} unit="staff" trend={0} status="good" />
        <KPICard label="Active Duration" value={6.5} unit="hours" trend={2} status="good" />
        <KPICard label="Idle Duration" value={0.5} unit="hours" trend={-1} status="good" />
        <KPICard label="Utilization Rate" value={88} unit="%" trend={5} status="good" />
        <KPICard label="Presence Status" value="On Duty" unit="Active" trend={0} status="good" />
      </div>

      <SimpleChart
        title="Staff Presence Throughout the Day"
        data={[8, 12, 18, 22, 24, 24, 23, 21, 18, 14, 10, 6]}
        labels={['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h']}
      />

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Staff Activity Summary</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4">All staff members are actively engaged with high productivity.</p>
      </div>
    </div>
  );
}
