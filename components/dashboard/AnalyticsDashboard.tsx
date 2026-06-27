'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, Bell, Clock3, Info, SkipForward, Video } from 'lucide-react';
import { KPICard } from '@/components/common/KPICard';
import { LiveAnalytics } from '@/components/common/LiveAnalytics';
import { SimpleChart } from '@/components/common/SimpleChart';
import { VideoPlayer } from '@/components/common/VideoPlayer';
import type { AnalyticsEvent, ChartDataPayload, MetricCardData, NormalizedAnalyticsData, Severity } from '@/lib/analyticsData';

interface AnalyticsDashboardProps {
  endpoint: string;
  videoOptions?: Array<{
    label: string;
    endpoint: string;
  }>;
  showVideo?: boolean;
}

type SnapshotValue = string | number;

const severityStyles: Record<Severity, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
  high: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900',
  low: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900',
  info: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

const importantSeverities: Severity[] = ['medium', 'high', 'critical'];
const demoAlertTriggerSecond = 7;
const alertInboxStorageKey = 'diagnostic-center-demo-alerts';
const alertInboxRefreshMarkerKey = 'diagnostic-center-demo-alerts-refresh-marker';

const formatSeconds = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const titleize = (value: string) => {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const formatValue = (value: unknown): SnapshotValue => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : Number(value.toFixed(2));
  }

  if (typeof value === 'string') {
    return value || '-';
  }

  return '-';
};

const asRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
};

const getNumber = (value: unknown, fallback = 0) => {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
};

const getSecond = (record: Record<string, unknown>) => {
  if (typeof record.second === 'number') {
    return record.second;
  }

  if (typeof record.timestamp !== 'string') {
    return 0;
  }

  const parts = record.timestamp.split(':').map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return 0;
  }

  return parts[0] * 3600 + parts[1] * 60 + parts[2];
};

const getCurrentRecord = (records: Array<Record<string, unknown>>, currentSecond: number) => {
  return records.reduce<Record<string, unknown> | undefined>((current, record) => {
    return getSecond(record) <= currentSecond ? record : current;
  }, records[0]);
};

const getCurrentEvents = (events: AnalyticsEvent[], currentSecond: number) => {
  return events.filter((event) => event.second <= currentSecond);
};

const getReachedRecords = (records: Array<Record<string, unknown>>, currentSecond: number) => {
  return records.filter((record) => getSecond(record) <= currentSecond);
};

const getChairStatusRecords = (record: Record<string, unknown>) => {
  return Object.entries(record)
    .filter(([key, value]) => key.startsWith('chair_') && value && typeof value === 'object' && !Array.isArray(value))
    .map(([, value]) => asRecord(value));
};

const getChairOccupancyKeys = (record: Record<string, unknown>) => {
  return Object.keys(record).filter((key) => key.startsWith('chair_') && key.endsWith('_occupied'));
};

const countImportantEvents = (events: AnalyticsEvent[]) => {
  return events.filter((event) => importantSeverities.includes(event.severity)).length;
};

const average = (values: number[]) => {
  if (values.length === 0) {
    return 0;
  }

  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
};

const percentage = (value: number, total: number) => {
  if (total <= 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
};

const formatDuration = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`;
  }

  if (remainingSeconds === 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }

  return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`;
};

const getDemoAlert = (data: NormalizedAnalyticsData): AnalyticsEvent | null => {
  const productivityTarget = 70;
  const baseAlert = {
    timestamp: formatSeconds(demoAlertTriggerSecond),
    second: demoAlertTriggerSecond,
    type: 'dashboard_alert',
    source: data.title,
    sourceId: data.id,
  };

  if (data.id === 'employee-working-status' || data.id === 'employee-analytics') {
    const chairKeys = ['chair_1', 'chair_2'];
    const totalSeatChecks = data.events.length * chairKeys.length;
    const workingSeatChecks = data.events.reduce((sum, event) => {
      return sum + chairKeys.filter((key) => Boolean(asRecord(event[key]).working)).length;
    }, 0);
    const workRate = percentage(workingSeatChecks, totalSeatChecks);

    if (workRate < productivityTarget) {
      return {
        ...baseAlert,
        id: `${data.id}-demo-productivity-alert`,
        severity: 'high',
        summary: `Employee productivity reduced below ${productivityTarget}%. Current productivity is ${workRate}%, so staff performance needs attention.`,
        productivity_rate: workRate,
        target_rate: productivityTarget,
      };
    }
  }

  if (data.id === 'chair-occupancy') {
    const chair1 = asRecord(data.analytics.chair_1);
    const emptySeconds = getNumber(chair1.empty_duration_seconds);

    if (emptySeconds > 0) {
      return {
        ...baseAlert,
        id: `${data.id}-demo-chair-empty-alert`,
        severity: 'medium',
        summary: `No person detected on Chair 1. Chair 1 is empty and has been unused for ${formatDuration(emptySeconds)}.`,
        chair_id: 'chair_1',
        empty_duration_seconds: emptySeconds,
      };
    }
  }

  if (data.id === 'waiting-area') {
    const peakCount = getNumber(data.analytics.max_people_at_once);
    const threshold = getNumber(data.analytics.overcrowding_threshold);

    if (peakCount > threshold) {
      return {
        ...baseAlert,
        id: `${data.id}-demo-overcrowded-alert`,
        severity: 'high',
        summary: `Overcrowd detected in Waiting Area. ${peakCount} people were detected against the ${threshold}-person threshold.`,
        peak_count: peakCount,
        threshold,
      };
    }
  }

  return null;
};

const isBusinessAlert = (event: AnalyticsEvent) => {
  return event.type === 'dashboard_alert';
};

const loadAlertInbox = (): AnalyticsEvent[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedAlerts = window.localStorage.getItem(alertInboxStorageKey);
    const parsedAlerts = storedAlerts ? JSON.parse(storedAlerts) : [];
    return Array.isArray(parsedAlerts) ? parsedAlerts as AnalyticsEvent[] : [];
  } catch {
    return [];
  }
};

const clearAlertInboxOnRefresh = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const navigationEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const pageLoadId = String(window.performance.timeOrigin);

  if (navigationEntry?.type === 'reload' && window.sessionStorage.getItem(alertInboxRefreshMarkerKey) !== pageLoadId) {
    window.localStorage.removeItem(alertInboxStorageKey);
    window.sessionStorage.setItem(alertInboxRefreshMarkerKey, pageLoadId);
    window.dispatchEvent(new Event('diagnostic-center-demo-alerts-updated'));
  }
};

const saveAlertInbox = (alerts: AnalyticsEvent[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(alertInboxStorageKey, JSON.stringify(alerts));
  window.dispatchEvent(new Event('diagnostic-center-demo-alerts-updated'));
};

const upsertAlert = (alerts: AnalyticsEvent[], alert: AnalyticsEvent) => {
  if (alerts.some((storedAlert) => storedAlert.id === alert.id)) {
    return alerts;
  }

  return [...alerts, { ...alert, created_at: new Date().toISOString() }];
};

const sampleReachedRecords = (
  records: Array<Record<string, unknown>>,
  valueGetter: (record: Record<string, unknown>) => number,
  maxPoints = 12,
) => {
  if (records.length === 0) {
    return {
      data: [0],
      labels: ['00:00'],
    };
  }

  const step = Math.max(1, Math.ceil(records.length / maxPoints));
  let sampled = records.filter((_, index) => index % step === 0);
  const lastRecord = records[records.length - 1];

  if (sampled[sampled.length - 1] !== lastRecord) {
    sampled = [...sampled.slice(0, maxPoints - 1), lastRecord];
  }

  return {
    data: sampled.map(valueGetter),
    labels: sampled.map((record) => String(record.timestamp ?? formatSeconds(getSecond(record))).replace('00:', '')),
  };
};

const getSnapshot = (data: NormalizedAnalyticsData, currentSecond: number): Record<string, SnapshotValue> => {
  const record = getCurrentRecord(data.timeSeries, currentSecond);
  const currentEvent = getCurrentEvents(data.events, currentSecond).at(-1);

  if (data.id === 'chair-occupancy' && record) {
    return {
      'Chair 1': record.chair_1_occupied ? 'Occupied' : 'Empty',
      'Chair 2': record.chair_2_occupied ? 'Occupied' : 'Empty',
      'Occupied Count': Number(Boolean(record.chair_1_occupied)) + Number(Boolean(record.chair_2_occupied)),
      Timestamp: formatValue(record.timestamp),
    };
  }

  if ((data.id === 'employee-working-status' || data.id === 'employee-analytics') && currentEvent) {
    const chair1 = asRecord(currentEvent.chair_1);
    const chair2 = asRecord(currentEvent.chair_2);

    return {
      'Chair 1': formatValue(chair1.status),
      'Chair 1 Reason': formatValue(chair1.reason),
      'Chair 2': formatValue(chair2.status),
      'Chair 2 Reason': formatValue(chair2.reason),
    };
  }

  if (data.id.includes('footfall') || data.id.includes('person-entry') || data.id.includes('person-entered')) {
    return {
      'Person Detected': formatValue(record?.person_detected),
      'People Count': formatValue(record?.people_count),
      Entries: formatValue(record?.entries),
      'Inside Count': formatValue(record?.inside_count),
    };
  }

  if (data.id.includes('queue')) {
    return {
      'Queue Detected': formatValue(record?.queue_detected),
      'Queue Length': formatValue(record?.queue_length),
      'Traffic Status': formatValue(data.analytics.traffic_status),
      Timestamp: formatValue(record?.timestamp),
    };
  }

  if (data.id === 'waiting-area') {
    return {
      'People Count': formatValue(record?.waiting_area_count),
      Overcrowded: formatValue(record?.overcrowded),
      Threshold: formatValue(data.analytics.overcrowding_threshold),
      Timestamp: formatValue(record?.timestamp),
    };
  }

  return {
    'Total Events': data.events.length,
    'Alert Events': data.events.filter((event) => importantSeverities.includes(event.severity)).length,
    Duration: formatSeconds(data.durationSeconds),
  };
};

const getDynamicCards = (data: NormalizedAnalyticsData, currentSecond: number): MetricCardData[] => {
  const playbackSecond = Math.floor(currentSecond);
  const reachedEvents = getCurrentEvents(data.events, playbackSecond);
  const currentRecord = getCurrentRecord(data.timeSeries, playbackSecond);
  const currentEvent = reachedEvents.at(-1);

  if (data.id === 'chair-occupancy' && currentRecord) {
    const chairKeys = getChairOccupancyKeys(currentRecord);
    const totalChairs = getNumber(data.analytics.total_chairs, chairKeys.length);
    const occupied = chairKeys.filter((key) => Boolean(currentRecord[key])).length;
    const empty = Math.max(0, totalChairs - occupied);
    const occupancyRate = totalChairs > 0 ? Math.round((occupied / totalChairs) * 100) : 0;

    return [
      { label: 'Total Chairs', value: totalChairs, unit: 'chairs', status: 'good' },
      { label: 'Occupied Now', value: occupied, unit: 'chairs', status: occupied === totalChairs ? 'warning' : 'good' },
      { label: 'Empty Now', value: empty, unit: 'chairs', status: empty === 0 ? 'warning' : 'good' },
      { label: 'Occupancy Rate', value: occupancyRate, unit: '%', status: occupancyRate > 90 ? 'warning' : 'good' },
      { label: 'Events Reached', value: reachedEvents.length, unit: 'events', status: 'good' },
    ];
  }

  if ((data.id === 'employee-working-status' || data.id === 'employee-analytics') && currentEvent) {
    const chairs = getChairStatusRecords(currentEvent);
    const monitoredSeats = chairs.length || getNumber(data.analytics.monitored_chairs, 0);
    const occupied = chairs.filter((chair) => Boolean(chair.occupied)).length;
    const working = chairs.filter((chair) => Boolean(chair.working)).length;
    const notWorking = chairs.filter((chair) => Boolean(chair.not_working)).length;
    const alertEvents = countImportantEvents(reachedEvents);

    return [
      { label: 'Monitored Seats', value: monitoredSeats, unit: 'chairs', status: 'good' },
      { label: 'Occupied Now', value: occupied, unit: 'chairs', status: 'good' },
      { label: 'Working Now', value: working, unit: 'chairs', status: working === 0 && occupied > 0 ? 'critical' : 'good' },
      { label: 'Not Working Now', value: notWorking, unit: 'chairs', status: notWorking > 0 ? 'warning' : 'good' },
      { label: 'Alerts Reached', value: alertEvents, unit: 'events', status: alertEvents > 0 ? 'warning' : 'good' },
    ];
  }

  if (data.id.includes('footfall') || data.id.includes('person-entry') || data.id.includes('person-entered')) {
    const reachedRecords = getReachedRecords(data.timeSeries, playbackSecond);
    const totalEntries = reachedRecords.reduce((sum, record) => sum + getNumber(record.entries), 0);
    const totalExits = reachedRecords.reduce((sum, record) => sum + getNumber(record.exits), 0);
    const insideCount = getNumber(currentRecord?.inside_count);
    const detectedPeople = Math.max(...reachedRecords.map((record) => getNumber(record.people_count)), 0);

    return [
      { label: 'Total Entries', value: totalEntries, unit: 'people', status: 'good' },
      { label: 'Total Exits', value: totalExits, unit: 'people', status: 'good' },
      { label: 'Inside Now', value: insideCount, unit: 'people', status: 'good' },
      { label: 'Detected So Far', value: detectedPeople, unit: 'people', status: 'good' },
      { label: 'Events Reached', value: reachedEvents.length, unit: 'events', status: 'good' },
    ];
  }

  if (data.id.includes('queue')) {
    const reachedRecords = getReachedRecords(data.timeSeries, playbackSecond);
    const queueLengths = reachedRecords.map((record) => getNumber(record.queue_length));
    const currentQueue = getNumber(currentRecord?.queue_length);
    const maxQueue = Math.max(...queueLengths, 0);
    const buildUps = reachedEvents.filter((event) => event.type === 'queue_length_changed' && getNumber(event.queue_length) > currentQueue).length;

    return [
      { label: 'Current Queue', value: currentQueue, unit: 'people', status: currentQueue > 3 ? 'warning' : 'good' },
      { label: 'Max Reached', value: maxQueue, unit: 'people', status: maxQueue > 3 ? 'warning' : 'good' },
      { label: 'Average So Far', value: average(queueLengths), unit: 'people', status: 'good' },
      { label: 'Build-up Events', value: buildUps, unit: 'events', status: buildUps > 0 ? 'warning' : 'good' },
      { label: 'Events Reached', value: reachedEvents.length, unit: 'events', status: 'good' },
    ];
  }

  if (data.id === 'waiting-area') {
    const reachedRecords = getReachedRecords(data.timeSeries, playbackSecond);
    const counts = reachedRecords.map((record) => getNumber(record.waiting_area_count));
    const currentCount = getNumber(currentRecord?.waiting_area_count);
    const threshold = getNumber(data.analytics.overcrowding_threshold);
    const overcrowdingEvents = reachedEvents.filter((event) => event.type === 'overcrowding_started' || event.severity === 'high').length;

    return [
      { label: 'Current Count', value: currentCount, unit: 'people', status: currentCount >= threshold ? 'warning' : 'good' },
      { label: 'Peak Reached', value: Math.max(...counts, 0), unit: 'people', status: Math.max(...counts, 0) >= threshold ? 'critical' : 'good' },
      { label: 'Average So Far', value: average(counts), unit: 'people', status: average(counts) >= threshold ? 'warning' : 'good' },
      { label: 'Threshold', value: threshold, unit: 'people', status: 'good' },
      { label: 'Overcrowding Reached', value: overcrowdingEvents, unit: 'events', status: overcrowdingEvents > 0 ? 'critical' : 'good' },
    ];
  }

  if (data.id === 'alerts') {
    const severityCounts = reachedEvents.reduce<Record<Severity, number>>((counts, event) => {
      counts[event.severity] += 1;
      return counts;
    }, { info: 0, low: 0, medium: 0, high: 0, critical: 0 });

    return [
      { label: 'Critical Reached', value: severityCounts.critical, unit: 'alerts', status: 'critical' },
      { label: 'High Reached', value: severityCounts.high, unit: 'alerts', status: 'critical' },
      { label: 'Medium Reached', value: severityCounts.medium, unit: 'alerts', status: 'warning' },
      { label: 'Low Reached', value: severityCounts.low, unit: 'events', status: 'good' },
      { label: 'Info Reached', value: severityCounts.info, unit: 'events', status: 'good' },
    ];
  }

  return data.cards;
};

const getDynamicChart = (data: NormalizedAnalyticsData, currentSecond: number): ChartDataPayload => {
  const playbackSecond = Math.floor(currentSecond);
  const reachedRecords = getReachedRecords(data.timeSeries, playbackSecond);

  if (data.id === 'chair-occupancy') {
    const sampled = sampleReachedRecords(reachedRecords, (record) => {
      return getChairOccupancyKeys(record).filter((key) => Boolean(record[key])).length;
    });

    return {
      title: 'Occupied Chairs Reached Over Time',
      ...sampled,
    };
  }

  if (data.id === 'employee-working-status' || data.id === 'employee-analytics') {
    const reachedEvents = getCurrentEvents(data.events, playbackSecond);
    const sampled = sampleReachedRecords(reachedEvents, (event) => {
      return getChairStatusRecords(event).filter((chair) => Boolean(chair.not_working)).length;
    });

    return {
      title: 'Not Working Seats Reached Over Time',
      ...sampled,
    };
  }

  if (data.id.includes('footfall') || data.id.includes('person-entry') || data.id.includes('person-entered')) {
    const sampled = sampleReachedRecords(reachedRecords, (record) => getNumber(record.inside_count));

    return {
      title: 'Inside Count Reached Over Time',
      ...sampled,
    };
  }

  if (data.id.includes('queue')) {
    const sampled = sampleReachedRecords(reachedRecords, (record) => getNumber(record.queue_length));

    return {
      title: 'Queue Length Reached Over Time',
      ...sampled,
    };
  }

  if (data.id === 'waiting-area') {
    const sampled = sampleReachedRecords(reachedRecords, (record) => getNumber(record.waiting_area_count));

    return {
      title: 'Waiting Area Count Reached Over Time',
      ...sampled,
    };
  }

  return data.chart;
};

const describeEvent = (event: AnalyticsEvent) => {
  if (typeof event.summary === 'string' && event.summary.length > 0) {
    return event.summary;
  }

  if (event.type === 'status_snapshot') {
    const chair1 = asRecord(event.chair_1);
    const chair2 = asRecord(event.chair_2);
    const chair1Reason = typeof chair1.reason === 'string' && chair1.reason ? ` (${chair1.reason})` : '';
    const chair2Reason = typeof chair2.reason === 'string' && chair2.reason ? ` (${chair2.reason})` : '';
    return `Chair 1: ${formatValue(chair1.status)}${chair1Reason}; Chair 2: ${formatValue(chair2.status)}${chair2Reason}.`;
  }

  if (event.type === 'waiting_area_count_changed') {
    return `Waiting count changed from ${formatValue(event.previous_count)} to ${formatValue(event.current_count)}.`;
  }

  if (event.type === 'overcrowding_started') {
    return `Overcrowding started at ${formatValue(event.count)} people against threshold ${formatValue(event.threshold)}.`;
  }

  if (event.type === 'person_entered') {
    return `Person entered; tracked count is ${formatValue(event.count)}.`;
  }

  if (event.type === 'chair_empty' || event.type === 'chair_occupied') {
    return `${titleize(String(event.chair_id ?? 'Chair'))} is ${formatValue(event.status)}.`;
  }

  if (typeof event.queue_length === 'number') {
    return `Queue length is ${event.queue_length} ${event.queue_length === 1 ? 'person' : 'people'}.`;
  }

  return titleize(event.type);
};

function EventRow({ event, currentSecond }: { event: AnalyticsEvent; currentSecond: number }) {
  const isPast = event.second <= currentSecond;
  const isCurrent = Math.floor(event.second) === Math.floor(currentSecond);

  return (
    <div
      className={`rounded-lg border p-4 transition-colors ${
        isCurrent
          ? 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30'
          : isPast
            ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
            : 'border-slate-200 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-950'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-slate-500" />
          <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">{event.timestamp}</span>
          {event.source && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{event.source}</span>
          )}
        </div>
        <span className={`rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${severityStyles[event.severity]}`}>
          {event.severity}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{titleize(event.type)}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{describeEvent(event)}</p>
    </div>
  );
}

function EventsPanel({ data, currentSecond }: { data: NormalizedAnalyticsData; currentSecond: number }) {
  const playbackSecond = Math.floor(currentSecond);
  const currentEvents = data.events.filter((event) => event.second === playbackSecond);
  const activeImportantEvents = data.events
    .filter((event) => event.second <= playbackSecond && isBusinessAlert(event))
    .slice(-6)
    .reverse();
  const triggeredEvents = data.events.filter((event) => event.second <= playbackSecond);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Current Timestamp Events</h2>
          </div>
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-300">
            {formatSeconds(playbackSecond)}
          </span>
        </div>
        <div className="space-y-3">
          {currentEvents.length > 0 ? (
            currentEvents.map((event) => (
              <EventRow key={event.id} event={event} currentSecond={playbackSecond} />
            ))
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              No event exactly at {formatSeconds(playbackSecond)}. The live snapshot above is still following the current video frame.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Alerts Created</h2>
          </div>
          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
            {activeImportantEvents.length}
          </span>
        </div>
        <div className="space-y-3">
          {activeImportantEvents.length > 0 ? (
            activeImportantEvents.map((event) => (
              <EventRow key={event.id} event={event} currentSecond={currentSecond} />
            ))
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              No alerts have been created by {formatSeconds(playbackSecond)}.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Triggered Events</h2>
          </div>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            {triggeredEvents.length} / {data.events.length}
          </span>
        </div>
        <div className="max-h-[34rem] space-y-3 overflow-y-auto pr-1">
          {triggeredEvents.length > 0 ? (
            triggeredEvents.map((event) => (
              <EventRow key={event.id} event={event} currentSecond={playbackSecond} />
            ))
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              Play the video to reveal events as their timestamps are reached.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function AlertInboxView({ alerts }: { alerts: AnalyticsEvent[] }) {
  const severityCounts = alerts.reduce<Record<Severity, number>>((counts, alert) => {
    counts[alert.severity] += 1;
    return counts;
  }, { info: 0, low: 0, medium: 0, high: 0, critical: 0 });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Alerts</h1>
          <p className="text-slate-600 dark:text-slate-400">Simple alert inbox for generated dashboard alerts.</p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Bell className="h-4 w-4 text-blue-600" />
          {alerts.length} {alerts.length === 1 ? 'alert' : 'alerts'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <KPICard label="Total Alerts" value={alerts.length} unit="created" status={alerts.length > 0 ? 'warning' : 'good'} />
        <KPICard label="High Priority" value={severityCounts.high + severityCounts.critical} unit="alerts" status={severityCounts.high + severityCounts.critical > 0 ? 'critical' : 'good'} />
        <KPICard label="Medium Priority" value={severityCounts.medium} unit="alerts" status={severityCounts.medium > 0 ? 'warning' : 'good'} />
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Created Alerts</h2>
          </div>
          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
            {alerts.length}
          </span>
        </div>

        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={alert.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{alert.source}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        Created at {alert.timestamp}
                      </div>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-bold uppercase tracking-wide ${severityStyles[alert.severity]}`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{describeEvent(alert)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
            No alerts yet.
          </div>
        )}
      </section>
    </div>
  );
}

export function AnalyticsDashboard({ endpoint, videoOptions, showVideo = true }: AnalyticsDashboardProps) {
  const [data, setData] = useState<NormalizedAnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentSecond, setCurrentSecond] = useState(0);
  const [alertInbox, setAlertInbox] = useState<AnalyticsEvent[]>([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const activeVideoOptions = videoOptions?.length ? videoOptions : [{ label: 'Video 1', endpoint }];
  const activeVideo = activeVideoOptions[selectedVideoIndex] ?? activeVideoOptions[0];
  const activeEndpoint = activeVideo.endpoint;

  useEffect(() => {
    const syncAlerts = () => setAlertInbox(loadAlertInbox());

    clearAlertInboxOnRefresh();
    syncAlerts();
    window.addEventListener('storage', syncAlerts);
    window.addEventListener('diagnostic-center-demo-alerts-updated', syncAlerts);

    return () => {
      window.removeEventListener('storage', syncAlerts);
      window.removeEventListener('diagnostic-center-demo-alerts-updated', syncAlerts);
    };
  }, []);

  useEffect(() => {
    setSelectedVideoIndex(0);
  }, [endpoint]);

  useEffect(() => {
    let isMounted = true;
    setError(null);

    fetch(activeEndpoint, { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${activeEndpoint}`);
        }

        return response.json() as Promise<NormalizedAnalyticsData>;
      })
      .then((nextData) => {
        if (!isMounted) {
          return;
        }

        setData(nextData);
        setCurrentSecond(nextData.id === 'alerts' ? nextData.durationSeconds : 0);
      })
      .catch((nextError: Error) => {
        if (isMounted) {
          setError(nextError.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeEndpoint]);

  useEffect(() => {
    if (!data || data.id === 'alerts' || Math.floor(currentSecond) < demoAlertTriggerSecond) {
      return;
    }

    const alert = getDemoAlert(data);

    if (!alert) {
      return;
    }

    const currentAlerts = loadAlertInbox();
    const nextAlerts = upsertAlert(currentAlerts, alert);

    if (nextAlerts === currentAlerts) {
      return;
    }

    saveAlertInbox(nextAlerts);
    setAlertInbox(nextAlerts);
  }, [data, currentSecond]);

  const snapshot = useMemo(() => {
    return data ? getSnapshot(data, currentSecond) : {};
  }, [data, currentSecond]);
  const dynamicCards = useMemo(() => {
    return data ? getDynamicCards(data, currentSecond) : [];
  }, [data, currentSecond]);
  const dynamicChart = useMemo(() => {
    return data ? getDynamicChart(data, currentSecond) : { title: '', data: [0], labels: ['00:00'] };
  }, [data, currentSecond]);
  const isSummaryReady = !showVideo || (data ? currentSecond >= data.durationSeconds : false);
  const displayData = useMemo(() => {
    if (!data) {
      return data;
    }

    if (data.id === 'alerts') {
      return {
        ...data,
        events: alertInbox,
      };
    }

    if (Math.floor(currentSecond) < demoAlertTriggerSecond) {
      return data;
    }

    const demoAlert = getDemoAlert(data);

    if (!demoAlert) {
      return data;
    }

    return {
      ...data,
      events: [...data.events, demoAlert],
    };
  }, [data, currentSecond, alertInbox]);
  const reachedEventCount = useMemo(() => {
    return displayData ? getCurrentEvents(displayData.events, Math.floor(currentSecond)).length : 0;
  }, [displayData, currentSecond]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800"></div>
        <div className="aspect-video animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800"></div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800"></div>
          ))}
        </div>
      </div>
    );
  }

  const eventData = displayData ?? data;

  if (data.id === 'alerts') {
    return <AlertInboxView alerts={alertInbox} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{data.title}</h1>
          <p className="text-slate-600 dark:text-slate-400">{data.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {activeVideoOptions.length > 1 && (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <Video className="h-4 w-4 text-blue-600" />
              <span>{activeVideo.label}</span>
              <span className="text-slate-300 dark:text-slate-700">
                {selectedVideoIndex + 1} / {activeVideoOptions.length}
              </span>
              <button
                type="button"
                onClick={() => setSelectedVideoIndex((index) => (index + 1) % activeVideoOptions.length)}
                className="ml-1 inline-flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <SkipForward className="h-3.5 w-3.5" />
                Show next video
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Activity className="h-4 w-4 text-green-500" />
            <span>{reachedEventCount} / {eventData.events.length} events</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span>{formatSeconds(data.durationSeconds)}</span>
          </div>
        </div>
      </div>

      {showVideo && (
        <VideoPlayer
          title={data.video.title}
          videoUrl={data.video.localUrl}
          driveUrl={data.video.driveUrl}
          dropFileName={data.video.dropFileName}
          durationSeconds={data.durationSeconds}
          onTimeUpdate={setCurrentSecond}
        />
      )}

      <LiveAnalytics
        title="LIVE ANALYTICS"
        data={snapshot}
        durationSeconds={data.durationSeconds}
        currentSecond={currentSecond}
        statusLabel={showVideo ? 'Video Sync Active' : 'Aggregate Event View'}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dynamicCards.map((card) => (
          <KPICard
            key={card.label}
            label={card.label}
            value={card.value}
            unit={card.unit}
            trend={card.trend}
            status={card.status}
          />
        ))}
      </div>

      <SimpleChart title={dynamicChart.title} data={dynamicChart.data} labels={dynamicChart.labels} />

      <EventsPanel data={eventData} currentSecond={currentSecond} />

      <section className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isSummaryReady ? 'Summary' : 'Summary Pending'}
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          {isSummaryReady
            ? data.summary
            : `The summary will be generated after playback reaches ${formatSeconds(data.durationSeconds)}.`}
        </p>
      </section>
    </div>
  );
}
