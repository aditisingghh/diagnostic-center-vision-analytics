'use client';

import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';

export default function EmployeeAnalyticsPage() {
  return <AnalyticsDashboard endpoint="/api/analytics/employee-working-status" />;
}
