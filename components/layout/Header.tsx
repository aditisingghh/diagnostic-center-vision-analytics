'use client';

import { useDashboardStore } from '@/lib/store/dashboardStore';
import { Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const { settings, toggleTheme } = useDashboardStore();
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-md">
      <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-2 mb-4">
          <h1 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            UIC Diagnostic Centers
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 text-center">
            AI-Powered Operations Intelligence Platform
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {time}
          </span>
          
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
