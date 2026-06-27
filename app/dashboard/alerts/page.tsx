'use client';

import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';

export default function AlertsPage() {
  return <AnalyticsDashboard endpoint="/api/analytics/alerts" showVideo={false} />;
}
