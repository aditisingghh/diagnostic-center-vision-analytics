'use client';

import { KPICard } from '@/components/common/KPICard';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import { LiveAnalytics } from '@/components/common/LiveAnalytics';
import { SimpleChart } from '@/components/common/SimpleChart';

export default function FootfallAnalysisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Footfall Analysis</h1>
        <p className="text-slate-600 dark:text-slate-400">Visitor traffic and occupancy analysis</p>
      </div>

      <VideoPlayer title="Entry/Exit Points Live Feed" />

      <LiveAnalytics 
        title="LIVE ANALYTICS"
        data={{
          'Total Entries': 648,
          'Total Exits': 612,
          'Current Occupancy': 45,
          'Traffic Status': 'Normal',
        }}
        duration="00:00:43"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard label="Total Entries" value={648} unit="visitors" trend={12} status="good" />
        <KPICard label="Total Exits" value={612} unit="visitors" trend={10} status="good" />
        <KPICard label="Peak Hour" value={156} unit="visitors" trend={8} status="good" />
        <KPICard label="Current Occupancy" value={45} unit="visitors" trend={5} status="good" />
        <KPICard label="Traffic Status" value="Normal" unit="Active" trend={0} status="good" />
      </div>

      <SimpleChart
        title="Hourly Footfall Traffic"
        data={[45, 58, 72, 85, 95, 102, 95, 88, 76, 65, 52, 38]}
        labels={['08h', '09h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h']}
      />

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Traffic Summary</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4">Steady foot traffic with balanced entry/exit patterns.</p>
      </div>
    </div>
  );
}
