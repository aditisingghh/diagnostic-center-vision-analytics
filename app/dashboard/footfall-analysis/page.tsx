'use client';

import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';

export default function FootfallAnalysisPage() {
  return (
    <AnalyticsDashboard
      endpoint="/api/analytics/footfall-analysis"
      videoOptions={[
        { label: 'Person Entered', endpoint: '/api/analytics/footfall-analysis' },
        { label: 'Simple Person Entry', endpoint: '/api/analytics/simple-person-entry' },
      ]}
    />
  );
}
