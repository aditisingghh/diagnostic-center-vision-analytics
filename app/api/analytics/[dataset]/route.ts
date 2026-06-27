import { NextResponse } from 'next/server';
import { getAnalyticsDashboardData } from '@/lib/analyticsData';

type RouteContext = {
  params: Promise<{ dataset: string }> | { dataset: string };
};

export async function GET(_request: Request, context: RouteContext) {
  const params = await Promise.resolve(context.params);
  const data = getAnalyticsDashboardData(params.dataset);

  if (!data) {
    return NextResponse.json(
      {
        error: 'Analytics dataset not found',
        dataset: params.dataset,
      },
      { status: 404 },
    );
  }

  return NextResponse.json(data);
}
