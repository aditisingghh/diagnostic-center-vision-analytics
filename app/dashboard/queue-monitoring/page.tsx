'use client';

import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';

export default function QueueMonitoringPage() {
  return (
    <AnalyticsDashboard
      endpoint="/api/analytics/queue-monitoring"
      videoOptions={[
        { label: 'Queue Status 1', endpoint: '/api/analytics/queue-monitoring' },
        { label: 'Queue Status 2', endpoint: '/api/analytics/queue-monitoring-extended' },
      ]}
    />
  );
}
