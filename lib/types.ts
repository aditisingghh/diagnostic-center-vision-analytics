// KPI and Dashboard Types
export interface KPIMetric {
  label: string;
  value: number;
  unit: string;
  trend?: number; // percentage change
  status?: 'good' | 'warning' | 'critical';
  icon?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface AlertEvent {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  module: string;
  description: string;
  status: 'active' | 'resolved' | 'acknowledged';
  details?: string;
}

export interface CameraStatus {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'error';
  lastSeen?: string;
}

export interface DetectionEvent {
  id: string;
  timestamp: string;
  cameraId: string;
  type: string; // 'person', 'object', etc.
  confidence: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface WaitingAreaMetric {
  id: string;
  name: string;
  currentOccupancy: number;
  maxCapacity: number;
  averageWaitTime: number;
  peakHour: string;
  occupancyTrend: number;
  alerts: number;
}

export interface QueueData {
  id: string;
  name: string;
  currentLength: number;
  averageWaitTime: number;
  processingRate: number;
  incidents: number;
}

export interface ChairStatus {
  id: string;
  name: string;
  status: 'occupied' | 'available' | 'maintenance';
  occupancyTime?: number;
  occupant?: string;
  lastUsed?: string;
}

export interface EmployeeActivity {
  id: string;
  name: string;
  department: string;
  status: 'active' | 'idle' | 'offline';
  activityLevel: number;
  tasks?: string[];
  lastActive?: string;
}

export interface VideoMetadata {
  id: string;
  cameraId: string;
  location: string;
  recordingTime: string;
  duration: number;
  codec: string;
  resolution: string;
  fps: number;
}

export interface CoordinateDetection {
  id: string;
  timestamp: string;
  objectType: string;
  objectId: number;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  zoneId?: string;
}

export interface VideoZone {
  id: string;
  name: string;
  coordinates: number[][]; // [[x1, y1], [x2, y2], ...]
  color: string;
  active: boolean;
}

export interface DashboardSettings {
  theme: 'light' | 'dark';
  refreshInterval: number; // in seconds
  defaultTimeRange: 'today' | 'week' | 'month';
  occupancyThreshold: number;
  alertSeverityFilter: string[];
  enableNotifications: boolean;
  cameraMapping: Record<string, string>;
}

export interface HistoryRecord {
  timestamp: string;
  value: number;
  metric: string;
  details?: string;
}

export interface ExportData {
  fileName: string;
  data: any[];
  format: 'csv' | 'json';
}

export interface SystemHealth {
  aiFeedStatus: 'healthy' | 'degraded' | 'error';
  cameraCount: number;
  onlineCameras: number;
  lastUpdate: string;
  storageUsage: number;
  cpuUsage: number;
  memoryUsage: number;
}

export interface DashboardState {
  theme: 'light' | 'dark';
  filters: {
    timeRange: string;
    camera?: string;
    department?: string;
  };
  loading: boolean;
  error?: string;
}
