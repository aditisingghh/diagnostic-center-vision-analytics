'use client';

import { KPICard } from '@/components/common/KPICard';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { LiveAnalytics } from '@/components/common/LiveAnalytics';
import { SimpleChart } from '@/components/common/SimpleChart';

export default function ChairOccupancyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Chair Occupancy</h1>
        <p className="text-slate-600 dark:text-slate-400">Real-time chair status and utilization metrics</p>
      </div>

      <VideoPlayer title="Chair Area Live Feed" />

      <LiveAnalytics 
        title="LIVE ANALYTICS"
        data={{
          'Chair 1 Status': 'Empty',
          'Chair 2 Status': 'Occupied',
          'Occupancy Rate': '82%',
          'Total Chairs': '30',
        }}
        duration="00:00:43"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard label="Total Chairs" value={30} unit="chairs" trend={0} status="good" />
        <KPICard label="Occupied" value={25} unit="chairs" trend={5} status="good" />
        <KPICard label="Empty" value={5} unit="chairs" trend={-5} status="good" />
        <KPICard label="Occupancy Rate" value={82} unit="%" trend={5} status="good" />
        <KPICard label="Vacant Rate" value={18} unit="%" trend={-5} status="good" />
      </div>

      <SimpleChart
        title="Chair Occupancy Rates"
        data={[28, 35, 42, 55, 68, 82, 78, 85, 72, 58, 45, 38]}
        labels={['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h']}
      />

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Chair Status Summary</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4">High occupancy with good distribution across all chairs.</p>
      </div>
    </div>
  );
}
