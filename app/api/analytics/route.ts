import { NextResponse } from 'next/server';
import { listAnalyticsEndpoints } from '@/lib/analyticsData';

export async function GET() {
  return NextResponse.json({
    endpoints: listAnalyticsEndpoints(),
  });
}
