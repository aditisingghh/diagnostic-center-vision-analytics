'use client';

import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface LiveAnalyticsProps {
  title?: string;
  data?: {
    [key: string]: string | number;
  };
  duration?: string;
}

export function LiveAnalytics({ 
  title = 'LIVE ANALYTICS',
  data = {
    'Chair 1 Status': 'Empty',
    'Chair 2 Status': 'Occupied',
  },
  duration = '00:00:43'
}: LiveAnalyticsProps) {
  const [elapsed, setElapsed] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const seconds = (prev + 1) % parseInt(duration.split(':')[2], 10);
        return seconds;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400">Connected</span>
          </div>
        </div>
      </div>

      {/* Timestamp Section */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Current Timestamp
        </p>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
            {formatTime(elapsed)} / {duration}
          </p>
        </div>
      </div>

      {/* Current Snapshot */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Current Snapshot
        </p>
        <div className="space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">{key}:</span>
              <span className="font-medium text-slate-900 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Synchronization Status */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Synchronization Status
        </p>
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">AI Feed Active</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time data sync enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}
