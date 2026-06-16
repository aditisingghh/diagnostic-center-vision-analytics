'use client';

import { KPICard } from '@/components/common/KPICard';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { LiveAnalytics } from '@/components/common/LiveAnalytics';
import { SimpleChart } from '@/components/common/SimpleChart';
import { Users } from 'lucide-react';

export default function WaitingAreaPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Waiting Area</h1>
        <p className="text-slate-600 dark:text-slate-400">Monitor real-time waiting area occupancy and metrics</p>
      </div>

      <VideoPlayer title="Waiting Area Live Feed" />

      <LiveAnalytics 
        title="LIVE ANALYTICS"
        data={{
          'Visitor Count': 45,
          'Area Status': 'Operational',
          'Congestion Level': 'Medium',
          'Last Update': new Date().toLocaleTimeString(),
        }}
        duration="00:00:43"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard label="Current Count" value={45} unit="visitors" trend={12} status="good" icon={<Users className="w-6 h-6 text-blue-600" />} />
        <KPICard label="Peak Count" value={68} unit="visitors" trend={5} status="good" />
        <KPICard label="Average Count" value={52} unit="visitors" trend={8} status="good" />
        <KPICard label="Congestion Level" value={62} unit="%" trend={3} status="warning" />
        <KPICard label="Overcrowding Events" value={2} unit="events" trend={-1} status="good" />
      </div>

      <SimpleChart
        title="Waiting Area Occupancy Throughout the Day"
        data={[12, 25, 35, 48, 62, 75, 68, 82, 78, 65, 45, 32]}
        labels={['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h']}
      />

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Live Status</h2>
        <div className="space-y-3 text-slate-600 dark:text-slate-400">
          <p>Timestamp: {new Date().toLocaleTimeString()}</p>
          <p>Status: Active</p>
        </div>
      </div>
    </div>
  );
}
