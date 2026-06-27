import chairOccupancyRaw from '@/public/data/chair occupancy.json';
import employeeWorkingRaw from '@/public/data/employee_working.json';
import footfallRaw from '@/public/data/foot fall.json';
import queueMonitoringRaw from '@/public/data/queue monitoring.json';
import waitingAreaRaw from '@/public/data/waiting area.json';

export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type CardStatus = 'good' | 'warning' | 'critical';

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  second: number;
  type: string;
  severity: Severity;
  source?: string;
  sourceId?: string;
  summary?: string;
  [key: string]: unknown;
}

export interface AnalyticsDataset {
  testcase?: string;
  video_name?: string;
  duration_seconds?: number;
  processed_video_url?: string;
  analytics?: Record<string, unknown>;
  time_series?: Array<Record<string, unknown>>;
  events?: Array<Record<string, unknown>>;
}

export interface MetricCardData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  status?: CardStatus;
}

export interface ChartDataPayload {
  title: string;
  data: number[];
  labels: string[];
}

export interface DashboardVideoData {
  title: string;
  localUrl?: string;
  driveUrl?: string;
  dropFileName?: string;
  processedVideoUrl?: string;
}

export interface NormalizedAnalyticsData {
  id: string;
  endpoint: string;
  title: string;
  subtitle: string;
  testcase?: string;
  videoName?: string;
  durationSeconds: number;
  video: DashboardVideoData;
  analytics: Record<string, unknown>;
  timeSeries: Array<Record<string, unknown>>;
  events: AnalyticsEvent[];
  cards: MetricCardData[];
  chart: ChartDataPayload;
  summary: string;
}

type DatasetBuilder = () => NormalizedAnalyticsData;

const googleDriveVideos = {
  chairOccupancy: 'https://drive.google.com/file/d/1wVnv_dYZKyo3Ybu9vF2A7WL9-MmTSlSt/view?usp=share_link',
  employeeWorking: 'https://drive.google.com/file/d/19BGzRH03bjIgSFVMMF1hEM-BtObk82zG/view?usp=share_link',
  personEntered: 'https://drive.google.com/file/d/1h203XIU-2Tft4a0BY36V8VYaIpHAUPxZ/view?usp=share_link',
  simplePersonEntry: 'https://drive.google.com/file/d/1h203XIU-2Tft4a0BY36V8VYaIpHAUPxZ/view?usp=share_link',
};

const getRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
};

const getNumber = (value: unknown, fallback = 0): number => {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const getString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

const getArray = <T>(value: unknown): T[] => {
  return Array.isArray(value) ? value as T[] : [];
};

const formatLabel = (value: string): string => {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const formatSeconds = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const timestampToSeconds = (timestamp: unknown): number => {
  if (typeof timestamp !== 'string') {
    return 0;
  }

  const parts = timestamp.split(':').map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return 0;
  }

  const [hours, minutes, seconds] = parts;
  return hours * 3600 + minutes * 60 + seconds;
};

const normalizeSeverity = (severity: unknown): Severity => {
  if (severity === 'low' || severity === 'medium' || severity === 'high' || severity === 'critical' || severity === 'info') {
    return severity;
  }

  return 'info';
};

const normalizeEvents = (events: Array<Record<string, unknown>>, sourceId: string, source: string): AnalyticsEvent[] => {
  return events.map((event, index) => {
    const timestamp = getString(event.timestamp, formatSeconds(getNumber(event.second)));
    const second = getNumber(event.second, timestampToSeconds(timestamp));
    const type = getString(event.type, 'event');

    return {
      ...event,
      id: `${sourceId}-${index}`,
      timestamp,
      second,
      type,
      severity: normalizeSeverity(event.severity),
      sourceId,
      source,
    };
  });
};

const maxSecondFromEvents = (events: AnalyticsEvent[]): number => {
  return events.reduce((max, event) => Math.max(max, event.second), 0);
};

const sampleSeries = (
  series: Array<Record<string, unknown>>,
  valueKey: string,
  fallbackValue = 0,
  maxPoints = 12,
): ChartDataPayload['data'] => {
  if (series.length === 0) {
    return [fallbackValue];
  }

  const step = Math.max(1, Math.ceil(series.length / maxPoints));
  return series
    .filter((_, index) => index % step === 0)
    .slice(0, maxPoints)
    .map((point) => getNumber(point[valueKey], fallbackValue));
};

const sampleLabels = (series: Array<Record<string, unknown>>, maxPoints = 12): string[] => {
  if (series.length === 0) {
    return ['00:00'];
  }

  const step = Math.max(1, Math.ceil(series.length / maxPoints));
  return series
    .filter((_, index) => index % step === 0)
    .slice(0, maxPoints)
    .map((point) => getString(point.timestamp, formatSeconds(getNumber(point.second))).replace('00:', ''));
};

const alertCount = (events: AnalyticsEvent[]): number => {
  return events.filter((event) => event.severity === 'medium' || event.severity === 'high' || event.severity === 'critical').length;
};

const severityStatus = (severity: Severity): CardStatus => {
  if (severity === 'critical' || severity === 'high') {
    return 'critical';
  }

  if (severity === 'medium') {
    return 'warning';
  }

  return 'good';
};

const buildChairOccupancy = (): NormalizedAnalyticsData => {
  const raw = chairOccupancyRaw as AnalyticsDataset;
  const analytics = getRecord(raw.analytics);
  const timeSeries = getArray<Record<string, unknown>>(raw.time_series);
  const events = normalizeEvents(getArray(raw.events), 'chair-occupancy', 'Chair Occupancy');
  const chairKeys = Object.keys(analytics).filter((key) => key.startsWith('chair_'));
  const chairs = chairKeys.map((key) => getRecord(analytics[key]));
  const totalChairs = getNumber(analytics.total_chairs, chairs.length);
  const occupiedChairs = chairs.filter((chair) => getString(chair.status).toLowerCase() === 'occupied').length;
  const emptyChairs = Math.max(0, totalChairs - occupiedChairs);
  const occupancyRate = totalChairs > 0 ? Math.round((occupiedChairs / totalChairs) * 100) : 0;

  return {
    id: 'chair-occupancy',
    endpoint: '/api/analytics/chair-occupancy',
    title: 'Chair Occupancy',
    subtitle: 'Real-time chair status and utilization metrics',
    testcase: raw.testcase,
    videoName: raw.video_name,
    durationSeconds: getNumber(raw.duration_seconds, maxSecondFromEvents(events)),
    video: {
      title: 'Chair Area Feed',
      localUrl: '/videos/output_chair_occupancy.mp4',
      driveUrl: googleDriveVideos.chairOccupancy,
      dropFileName: 'output_chair_occupancy.mp4',
      processedVideoUrl: raw.processed_video_url,
    },
    analytics,
    timeSeries,
    events,
    cards: [
      { label: 'Total Chairs', value: totalChairs, unit: 'chairs', status: 'good' },
      { label: 'Occupied', value: occupiedChairs, unit: 'chairs', status: occupiedChairs === totalChairs ? 'warning' : 'good' },
      { label: 'Empty', value: emptyChairs, unit: 'chairs', status: emptyChairs === 0 ? 'warning' : 'good' },
      { label: 'Occupancy Rate', value: occupancyRate, unit: '%', status: occupancyRate > 90 ? 'warning' : 'good' },
      { label: 'Events', value: events.length, unit: 'logged', status: 'good' },
    ],
    chart: {
      title: 'Occupied Chairs Over Time',
      data: sampleSeries(timeSeries.map((point) => ({
        ...point,
        occupied_count: Number(Boolean(point.chair_1_occupied)) + Number(Boolean(point.chair_2_occupied)),
      })), 'occupied_count'),
      labels: sampleLabels(timeSeries),
    },
    summary: `Chair 1 stayed empty while Chair 2 stayed occupied for ${getNumber(raw.duration_seconds)} seconds.`,
  };
};

const buildEmployeeWorking = (): NormalizedAnalyticsData => {
  const raw = employeeWorkingRaw as { events?: Array<Record<string, unknown>> };
  const events = normalizeEvents(getArray(raw.events), 'employee-working-status', 'Employee Working Status');
  const latest = (events[events.length - 1] ?? {}) as Record<string, unknown>;
  const chairKeys = ['chair_1', 'chair_2'];
  const latestChairs = chairKeys.map((key) => getRecord(latest[key]));
  const occupiedNow = latestChairs.filter((chair) => Boolean(chair.occupied)).length;
  const workingNow = latestChairs.filter((chair) => Boolean(chair.working)).length;
  const notWorkingNow = latestChairs.filter((chair) => Boolean(chair.not_working)).length;
  const durationSeconds = maxSecondFromEvents(events);
  const chartSeries = events.map((event) => ({
    timestamp: event.timestamp,
    second: event.second,
    not_working_count: chairKeys.filter((key) => Boolean(getRecord(event[key]).not_working)).length,
  }));

  return {
    id: 'employee-working-status',
    endpoint: '/api/analytics/employee-working-status',
    title: 'Employee Analytics',
    subtitle: 'Staff working and not-working status monitoring',
    testcase: 'EmployeeWorkingOrnot',
    videoName: 'employee_working_status_demo.mp4',
    durationSeconds,
    video: {
      title: 'Staff Area Feed',
      localUrl: '/videos/output_employee_working_status_h264.mp4',
      driveUrl: googleDriveVideos.employeeWorking,
      dropFileName: 'output_employee_working_status_h264.mp4',
    },
    analytics: {
      monitored_chairs: chairKeys.length,
      occupied_now: occupiedNow,
      working_now: workingNow,
      not_working_now: notWorkingNow,
      alert_events: alertCount(events),
    },
    timeSeries: events,
    events,
    cards: [
      { label: 'Monitored Seats', value: chairKeys.length, unit: 'chairs', status: 'good' },
      { label: 'Occupied Now', value: occupiedNow, unit: 'chairs', status: 'good' },
      { label: 'Working Now', value: workingNow, unit: 'chairs', status: workingNow === 0 ? 'critical' : 'good' },
      { label: 'Not Working Now', value: notWorkingNow, unit: 'chairs', status: notWorkingNow > 0 ? 'warning' : 'good' },
      { label: 'Alerts', value: alertCount(events), unit: 'events', status: alertCount(events) > 0 ? 'warning' : 'good' },
    ],
    chart: {
      title: 'Not Working Seats Over Time',
      data: sampleSeries(chartSeries, 'not_working_count'),
      labels: sampleLabels(chartSeries),
    },
    summary: `${alertCount(events)} not-working status snapshots were detected across ${durationSeconds} seconds.`,
  };
};

const buildFootfall = (
  id: string,
  source: string,
  testcaseKey: 'Testcase1' | 'Testcase2',
  localUrl: string,
  dropFileName: string,
  driveUrl: string,
): NormalizedAnalyticsData => {
  const rawCases = footfallRaw as Record<string, AnalyticsDataset>;
  const raw = rawCases[testcaseKey];
  const analytics = getRecord(raw.analytics);
  const timeSeries = getArray<Record<string, unknown>>(raw.time_series);
  const events = normalizeEvents(getArray(raw.events), id, source);

  return {
    id,
    endpoint: `/api/analytics/${id}`,
    title: source,
    subtitle: 'Visitor entry, exit, and inside-count analysis',
    testcase: `${raw.testcase} ${testcaseKey}`,
    videoName: raw.video_name,
    durationSeconds: getNumber(raw.duration_seconds, maxSecondFromEvents(events)),
    video: {
      title: 'Entry Point Feed',
      localUrl,
      driveUrl,
      dropFileName,
      processedVideoUrl: raw.processed_video_url,
    },
    analytics,
    timeSeries,
    events,
    cards: [
      { label: 'Total Entries', value: getNumber(analytics.total_entries), unit: 'people', status: 'good' },
      { label: 'Total Exits', value: getNumber(analytics.total_exits), unit: 'people', status: 'good' },
      { label: 'Inside Count', value: getNumber(analytics.current_inside_count), unit: 'people', status: 'good' },
      { label: 'Unique People', value: getNumber(analytics.unique_people_detected), unit: 'tracked', status: 'good' },
      { label: 'Traffic Status', value: formatLabel(getString(analytics.traffic_status, 'low')), status: 'good' },
    ],
    chart: {
      title: 'Inside Count Over Time',
      data: sampleSeries(timeSeries, 'inside_count'),
      labels: sampleLabels(timeSeries),
    },
    summary: `First entry detected at ${getString(analytics.first_entry_timestamp, '00:00:00')}; current inside count is ${getNumber(analytics.current_inside_count)}.`,
  };
};

const buildQueueMonitoring = (testcaseKey: 'Testcase1' | 'Testcase2' = 'Testcase1'): NormalizedAnalyticsData => {
  const id = testcaseKey === 'Testcase1' ? 'queue-monitoring' : 'queue-monitoring-extended';
  const videoFileName = testcaseKey === 'Testcase1' ? 'output_queue_status_h264.mp4' : 'output_queue_status2_h264.mp4';
  const rawCases = queueMonitoringRaw as Record<string, AnalyticsDataset>;
  const raw = rawCases[testcaseKey];
  const analytics = getRecord(raw.analytics);
  const timeSeries = getArray<Record<string, unknown>>(raw.time_series);
  const events = normalizeEvents(getArray(raw.events), id, 'Queue Monitoring');

  return {
    id,
    endpoint: `/api/analytics/${id}`,
    title: 'Queue Monitoring',
    subtitle: 'Real-time queue status and processing metrics',
    testcase: `${raw.testcase} ${testcaseKey}`,
    videoName: raw.video_name,
    durationSeconds: getNumber(raw.duration_seconds, maxSecondFromEvents(events)),
    video: {
      title: 'Queue Area Feed',
      localUrl: `/videos/${videoFileName}`,
      dropFileName: videoFileName,
      processedVideoUrl: raw.processed_video_url,
    },
    analytics,
    timeSeries,
    events,
    cards: [
      { label: 'Current Queue', value: getNumber(analytics.current_queue_length), unit: 'people', status: 'good' },
      { label: 'Max Queue', value: getNumber(analytics.max_queue_length), unit: 'people', status: 'good' },
      { label: 'Average Queue', value: getNumber(analytics.average_queue_length), unit: 'people', status: 'good' },
      { label: 'Build-up Events', value: getNumber(analytics.queue_build_up_events), unit: 'events', status: getNumber(analytics.queue_build_up_events) > 0 ? 'warning' : 'good' },
      { label: 'Traffic Status', value: formatLabel(getString(analytics.traffic_status, 'low')), status: 'good' },
    ],
    chart: {
      title: 'Queue Length Over Time',
      data: sampleSeries(timeSeries, 'queue_length'),
      labels: sampleLabels(timeSeries),
    },
    summary: `Queue length ranged from ${getNumber(analytics.min_queue_length)} to ${getNumber(analytics.max_queue_length)} people.`,
  };
};

const buildWaitingArea = (): NormalizedAnalyticsData => {
  const raw = waitingAreaRaw as AnalyticsDataset;
  const analytics = getRecord(raw.analytics);
  const timeSeries = getArray<Record<string, unknown>>(raw.time_series);
  const events = normalizeEvents(getArray(raw.events), 'waiting-area', 'Waiting Area');

  return {
    id: 'waiting-area',
    endpoint: '/api/analytics/waiting-area',
    title: 'Waiting Area',
    subtitle: 'Monitor waiting area occupancy and overcrowding events',
    testcase: raw.testcase,
    videoName: raw.video_name,
    durationSeconds: getNumber(raw.duration_seconds, maxSecondFromEvents(events)),
    video: {
      title: 'Waiting Area Feed',
      localUrl: '/videos/output_waiting_count1_h264.mp4',
      dropFileName: 'output_waiting_count1_h264.mp4',
      processedVideoUrl: raw.processed_video_url,
    },
    analytics,
    timeSeries,
    events,
    cards: [
      { label: 'Current Count', value: getNumber(analytics.current_people_count), unit: 'people', status: 'warning' },
      { label: 'Peak Count', value: getNumber(analytics.max_people_at_once), unit: 'people', status: 'critical' },
      { label: 'Average Count', value: getNumber(analytics.average_people_count), unit: 'people', status: 'warning' },
      { label: 'Threshold', value: getNumber(analytics.overcrowding_threshold), unit: 'people', status: 'good' },
      { label: 'Overcrowding', value: getNumber(analytics.overcrowding_events), unit: 'events', status: 'critical' },
    ],
    chart: {
      title: 'Waiting Area Count Over Time',
      data: sampleSeries(timeSeries, 'waiting_area_count'),
      labels: sampleLabels(timeSeries),
    },
    summary: `Overcrowding started at 00:00:01 and peaked at ${getNumber(analytics.max_people_at_once)} people.`,
  };
};

const buildAlerts = (): NormalizedAnalyticsData => {
  const datasets = [
    buildChairOccupancy(),
    buildEmployeeWorking(),
    buildFootfall('footfall-analysis', 'Footfall Analysis', 'Testcase1', '/videos/output_person_entered_h264.mp4', 'output_person_entered_h264.mp4', googleDriveVideos.personEntered),
    buildFootfall('simple-person-entry', 'Simple Person Entry', 'Testcase2', '/videos/output_simple_person_entry_h264.mp4', 'output_simple_person_entry_h264.mp4', googleDriveVideos.simplePersonEntry),
    buildQueueMonitoring(),
    buildWaitingArea(),
  ];
  const events = datasets
    .flatMap((dataset) => dataset.events.map((event) => ({
      ...event,
      source: dataset.title,
      sourceId: dataset.id,
    })))
    .sort((a, b) => {
      const severityOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
      return severityOrder[a.severity] - severityOrder[b.severity] || getString(a.source).localeCompare(getString(b.source)) || a.second - b.second;
    });
  const severityCounts = events.reduce<Record<Severity, number>>((counts, event) => {
    counts[event.severity] += 1;
    return counts;
  }, { info: 0, low: 0, medium: 0, high: 0, critical: 0 });

  return {
    id: 'alerts',
    endpoint: '/api/analytics/alerts',
    title: 'Alerts',
    subtitle: 'System alerts and anomaly events from all analytics modules',
    testcase: 'all_dashboards',
    durationSeconds: Math.max(...datasets.map((dataset) => dataset.durationSeconds)),
    video: {
      title: 'System Monitoring Feed',
    },
    analytics: severityCounts,
    timeSeries: [],
    events,
    cards: [
      { label: 'Critical', value: severityCounts.critical, unit: 'alerts', status: 'critical' },
      { label: 'High', value: severityCounts.high, unit: 'alerts', status: 'critical' },
      { label: 'Medium', value: severityCounts.medium, unit: 'alerts', status: 'warning' },
      { label: 'Low', value: severityCounts.low, unit: 'events', status: 'good' },
      { label: 'Info', value: severityCounts.info, unit: 'events', status: 'good' },
    ],
    chart: {
      title: 'Events by Severity',
      data: [severityCounts.critical, severityCounts.high, severityCounts.medium, severityCounts.low, severityCounts.info],
      labels: ['Critical', 'High', 'Medium', 'Low', 'Info'],
    },
    summary: `${events.length} events are available across ${datasets.length} analytics modules.`,
  };
};

const datasetBuilders: Record<string, DatasetBuilder> = {
  'chair-occupancy': buildChairOccupancy,
  'employee-working-status': buildEmployeeWorking,
  'employee-analytics': buildEmployeeWorking,
  'footfall-analysis': () => buildFootfall('footfall-analysis', 'Footfall Analysis', 'Testcase1', '/videos/output_person_entered_h264.mp4', 'output_person_entered_h264.mp4', googleDriveVideos.personEntered),
  'person-entered': () => buildFootfall('person-entered', 'Person Entered', 'Testcase1', '/videos/output_person_entered_h264.mp4', 'output_person_entered_h264.mp4', googleDriveVideos.personEntered),
  'simple-person-entry': () => buildFootfall('simple-person-entry', 'Simple Person Entry', 'Testcase2', '/videos/output_simple_person_entry_h264.mp4', 'output_simple_person_entry_h264.mp4', googleDriveVideos.simplePersonEntry),
  'queue-monitoring': () => buildQueueMonitoring('Testcase1'),
  'queue-monitoring-extended': () => buildQueueMonitoring('Testcase2'),
  'waiting-area': buildWaitingArea,
  alerts: buildAlerts,
};

export const analyticsEndpointIds = Object.keys(datasetBuilders);

export const getAnalyticsDashboardData = (id: string): NormalizedAnalyticsData | undefined => {
  return datasetBuilders[id]?.();
};

export const listAnalyticsEndpoints = () => {
  return analyticsEndpointIds.map((id) => {
    const data = getAnalyticsDashboardData(id);

    return {
      id,
      endpoint: `/api/analytics/${id}`,
      title: data?.title ?? formatLabel(id),
      durationSeconds: data?.durationSeconds ?? 0,
      eventCount: data?.events.length ?? 0,
      videoDropFileName: data?.video.dropFileName,
    };
  });
};
