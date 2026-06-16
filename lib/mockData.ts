import * as Types from './types';

// Helper to generate timestamps
const generateTimestamps = (hoursBack: number): string[] => {
  const timestamps: string[] = [];
  const now = new Date();
  for (let i = hoursBack; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    timestamps.push(time.toISOString().slice(0, 16));
  }
  return timestamps;
};

// Generate time series data
export const generateTimeSeriesData = (hoursBack: number = 24, baseValue: number = 50, variance: number = 20): Types.TimeSeriesData[] => {
  const timestamps = generateTimestamps(hoursBack);
  return timestamps.map((timestamp) => ({
    timestamp,
    value: Math.max(0, baseValue + (Math.random() - 0.5) * variance),
  }));
};

// Generate KPI Metrics
export const generateKPIMetrics = (): Types.KPIMetric[] => [
  {
    label: 'Total Visitors',
    value: 1248,
    unit: 'people',
    trend: 12,
    status: 'good',
  },
  {
    label: 'Current Occupancy',
    value: 45,
    unit: '%',
    trend: -5,
    status: 'good',
  },
  {
    label: 'Avg Wait Time',
    value: 8,
    unit: 'min',
    trend: 2,
    status: 'good',
  },
  {
    label: 'Queue Length',
    value: 12,
    unit: 'people',
    trend: -8,
    status: 'good',
  },
  {
    label: 'Chair Utilization',
    value: 82,
    unit: '%',
    trend: 5,
    status: 'good',
  },
  {
    label: 'Active Employees',
    value: 24,
    unit: 'staff',
    trend: 0,
    status: 'good',
  },
  {
    label: 'System Health',
    value: 99.8,
    unit: '%',
    trend: 0.1,
    status: 'good',
  },
  {
    label: 'Alerts',
    value: 3,
    unit: 'active',
    trend: -2,
    status: 'warning',
  },
  {
    label: 'Peak Hour',
    value: 156,
    unit: 'visitors',
    trend: 8,
    status: 'good',
  },
  {
    label: 'Throughput',
    value: 285,
    unit: 'visitors/hr',
    trend: 15,
    status: 'good',
  },
  {
    label: 'AI Detections',
    value: 4892,
    unit: 'today',
    trend: 22,
    status: 'good',
  },
  {
    label: 'Processing Time',
    value: 1.2,
    unit: 'sec',
    trend: -10,
    status: 'good',
  },
];

// Generate chart data
export const generateChartData = (points: number = 12): Types.ChartData[] => {
  const data: Types.ChartData[] = [];
  for (let i = 0; i < points; i++) {
    data.push({
      name: `${i}:00`,
      value: Math.floor(Math.random() * 100 + 30),
      value2: Math.floor(Math.random() * 80 + 20),
      entries: Math.floor(Math.random() * 50 + 10),
      exits: Math.floor(Math.random() * 45 + 8),
    });
  }
  return data;
};

// Generate alerts
export const generateAlerts = (count: number = 15): Types.AlertEvent[] => {
  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  const modules = ['Queue', 'Occupancy', 'AI Feed', 'Camera 1', 'Camera 2', 'Storage', 'Processing'];
  const descriptions = [
    'High occupancy detected',
    'Queue exceeding threshold',
    'AI processing delay',
    'Camera offline',
    'Storage usage critical',
    'Unusual crowd pattern',
    'Chair malfunction detected',
    'Prolonged idle detected',
  ];

  const alerts: Types.AlertEvent[] = [];
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
    alerts.push({
      id: `alert-${i}`,
      timestamp: timestamp.toISOString(),
      severity: severities[Math.floor(Math.random() * severities.length)],
      module: modules[Math.floor(Math.random() * modules.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      status: Math.random() > 0.4 ? 'resolved' : 'active',
      details: `Alert ID: ${i}`,
    });
  }

  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate camera statuses
export const generateCameraStatuses = (): Types.CameraStatus[] => [
  { id: 'cam-1', name: 'Entrance', location: 'Main Entrance', status: 'online', lastSeen: new Date().toISOString() },
  { id: 'cam-2', name: 'Queue Area', location: 'Waiting Area', status: 'online', lastSeen: new Date().toISOString() },
  { id: 'cam-3', name: 'Processing Area', location: 'Main Hall', status: 'online', lastSeen: new Date().toISOString() },
  { id: 'cam-4', name: 'Exit', location: 'Main Exit', status: 'online', lastSeen: new Date().toISOString() },
  { id: 'cam-5', name: 'Wide Angle', location: 'Overhead', status: 'online', lastSeen: new Date().toISOString() },
];

// Generate waiting area metrics
export const generateWaitingAreaMetrics = (): Types.WaitingAreaMetric[] => [
  {
    id: 'area-1',
    name: 'Main Waiting Area',
    currentOccupancy: 45,
    maxCapacity: 100,
    averageWaitTime: 8,
    peakHour: '14:00-15:00',
    occupancyTrend: 5,
    alerts: 0,
  },
  {
    id: 'area-2',
    name: 'VIP Lounge',
    currentOccupancy: 12,
    maxCapacity: 30,
    averageWaitTime: 3,
    peakHour: '13:00-14:00',
    occupancyTrend: -2,
    alerts: 0,
  },
  {
    id: 'area-3',
    name: 'Priority Queue',
    currentOccupancy: 8,
    maxCapacity: 20,
    averageWaitTime: 5,
    peakHour: '15:00-16:00',
    occupancyTrend: 0,
    alerts: 1,
  },
];

// Generate queue data
export const generateQueueData = (): Types.QueueData[] => [
  { id: 'queue-1', name: 'General Queue', currentLength: 12, averageWaitTime: 8, processingRate: 285, incidents: 0 },
  { id: 'queue-2', name: 'Express Queue', currentLength: 3, averageWaitTime: 2, processingRate: 120, incidents: 0 },
  { id: 'queue-3', name: 'VIP Queue', currentLength: 2, averageWaitTime: 1, processingRate: 85, incidents: 1 },
];

// Generate chair statuses
export const generateChairStatuses = (): Types.ChairStatus[] => {
  const chairs: Types.ChairStatus[] = [];
  for (let i = 1; i <= 15; i++) {
    const statuses: Array<'occupied' | 'available' | 'maintenance'> = ['occupied', 'available', 'maintenance'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    chairs.push({
      id: `chair-${i}`,
      name: `Chair ${i}`,
      status,
      occupancyTime: status === 'occupied' ? Math.floor(Math.random() * 45 + 5) : undefined,
      occupant: status === 'occupied' ? `Patient ${Math.floor(Math.random() * 100 + 1)}` : undefined,
      lastUsed: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
    });
  }
  return chairs;
};

// Generate employee activities
export const generateEmployeeActivities = (): Types.EmployeeActivity[] => [
  { id: 'emp-1', name: 'Dr. Johnson', department: 'Diagnostics', status: 'active', activityLevel: 92, lastActive: new Date().toISOString() },
  { id: 'emp-2', name: 'Nurse Smith', department: 'Nursing', status: 'active', activityLevel: 88, lastActive: new Date().toISOString() },
  { id: 'emp-3', name: 'Technician Lee', department: 'Lab', status: 'active', activityLevel: 75, lastActive: new Date().toISOString() },
  { id: 'emp-4', name: 'Admin Brown', department: 'Reception', status: 'idle', activityLevel: 45, lastActive: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  { id: 'emp-5', name: 'Dr. White', department: 'Diagnostics', status: 'active', activityLevel: 85, lastActive: new Date().toISOString() },
  { id: 'emp-6', name: 'Technician Davis', department: 'Imaging', status: 'idle', activityLevel: 30, lastActive: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
];

// Generate detection events
export const generateDetectionEvents = (count: number = 20): Types.DetectionEvent[] => {
  const events: Types.DetectionEvent[] = [];
  for (let i = 0; i < count; i++) {
    events.push({
      id: `det-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
      cameraId: `cam-${Math.floor(Math.random() * 5 + 1)}`,
      type: ['person', 'object', 'group'][Math.floor(Math.random() * 3)],
      confidence: Math.random() * 0.4 + 0.6,
      coordinates: {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        width: Math.random() * 20 + 10,
        height: Math.random() * 25 + 10,
      },
    });
  }
  return events;
};

// Generate video metadata
export const generateVideoMetadata = (): Types.VideoMetadata => ({
  id: 'video-1',
  cameraId: 'cam-1',
  location: 'Main Entrance',
  recordingTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  duration: 7200, // 2 hours
  codec: 'H.264',
  resolution: '1920x1080',
  fps: 30,
});

// Generate coordinate detections for video overlay
export const generateCoordinateDetections = (duration: number = 300): Types.CoordinateDetection[] => {
  const detections: Types.CoordinateDetection[] = [];
  for (let i = 0; i < duration; i += 5) {
    for (let j = 0; j < Math.floor(Math.random() * 3 + 1); j++) {
      detections.push({
        id: `coord-${i}-${j}`,
        timestamp: new Date(Date.now() - (duration - i) * 1000).toISOString(),
        objectType: ['person', 'object'][Math.floor(Math.random() * 2)],
        objectId: j,
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        width: 50 + Math.random() * 100,
        height: 60 + Math.random() * 120,
        confidence: 0.7 + Math.random() * 0.3,
        zoneId: Math.random() > 0.5 ? 'zone-1' : undefined,
      });
    }
  }
  return detections;
};

// Generate video zones
export const generateVideoZones = (): Types.VideoZone[] => [
  {
    id: 'zone-1',
    name: 'Entrance Zone',
    coordinates: [[100, 100], [400, 100], [400, 300], [100, 300]],
    color: '#3b82f6',
    active: true,
  },
  {
    id: 'zone-2',
    name: 'Waiting Area',
    coordinates: [[500, 200], [900, 200], [900, 600], [500, 600]],
    color: '#10b981',
    active: true,
  },
  {
    id: 'zone-3',
    name: 'Processing Area',
    coordinates: [[1000, 300], [1600, 300], [1600, 700], [1000, 700]],
    color: '#f59e0b',
    active: false,
  },
];

// Generate system health
export const generateSystemHealth = (): Types.SystemHealth => ({
  aiFeedStatus: Math.random() > 0.2 ? 'healthy' : 'degraded',
  cameraCount: 5,
  onlineCameras: 5,
  lastUpdate: new Date().toISOString(),
  storageUsage: Math.floor(Math.random() * 60 + 20),
  cpuUsage: Math.floor(Math.random() * 40 + 10),
  memoryUsage: Math.floor(Math.random() * 50 + 20),
});

// Generate history records
export const generateHistoryRecords = (count: number = 30): Types.HistoryRecord[] => {
  const records: Types.HistoryRecord[] = [];
  for (let i = 0; i < count; i++) {
    records.push({
      timestamp: new Date(Date.now() - i * 2 * 60 * 60 * 1000).toISOString(),
      value: Math.floor(Math.random() * 100 + 20),
      metric: ['occupancy', 'throughput', 'wait_time'][Math.floor(Math.random() * 3)],
      details: `Sample record ${i}`,
    });
  }
  return records;
};

// Default dashboard settings
export const defaultDashboardSettings: Types.DashboardSettings = {
  theme: 'light',
  refreshInterval: 30,
  defaultTimeRange: 'today',
  occupancyThreshold: 80,
  alertSeverityFilter: ['high', 'critical'],
  enableNotifications: true,
  cameraMapping: {
    'cam-1': 'Main Entrance',
    'cam-2': 'Waiting Area',
    'cam-3': 'Processing Area',
  },
};
