'use client';

import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';

export default function WaitingAreaPage() {
  return <AnalyticsDashboard endpoint="/api/analytics/waiting-area" />;
}
