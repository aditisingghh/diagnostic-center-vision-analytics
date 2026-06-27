'use client';

import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';

export default function ChairOccupancyPage() {
  return <AnalyticsDashboard endpoint="/api/analytics/chair-occupancy" />;
}
