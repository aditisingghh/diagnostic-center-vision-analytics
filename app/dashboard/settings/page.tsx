'use client';

import { useDashboardStore } from '@/lib/store/dashboardStore';

export default function SettingsPage() {
  const { settings, toggleTheme } = useDashboardStore();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Configure dashboard preferences and options</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Theme</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Toggle between light and dark mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Current: {settings.theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Display Options</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-slate-700 dark:text-slate-300">Show notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-slate-700 dark:text-slate-300">Auto-refresh data</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span className="text-slate-700 dark:text-slate-300">Enable animations</span>
            </label>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Data Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-700 dark:text-slate-300">Refresh Interval (seconds)</label>
              <input type="number" defaultValue={30} min={5} className="mt-1 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-sm text-slate-700 dark:text-slate-300">Data Retention Days</label>
              <input type="number" defaultValue={30} min={7} className="mt-1 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
