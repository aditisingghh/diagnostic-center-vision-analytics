'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Users, Footprints, Armchair, User2, AlertCircle, Settings, Menu, X, LayoutDashboard, ScanFace } from 'lucide-react';
import { useEffect, useState } from 'react';

const navigationItems = [
  { id: 'overview', label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { id: 'waiting-area', label: 'Waiting Area', href: '/dashboard/waiting-area', icon: BarChart3 },
  { id: 'queue', label: 'Queue Monitoring', href: '/dashboard/queue-monitoring', icon: Users },
  { id: 'footfall', label: 'Footfall Analysis', href: '/dashboard/footfall-analysis', icon: Footprints },
  { id: 'chair', label: 'Chair Occupancy', href: '/dashboard/chair-occupancy', icon: Armchair },
  { id: 'employee', label: 'Employee Analytics', href: '/dashboard/employee-analytics', icon: User2 },
  { id: 'facial', label: 'Facial Analytics', href: '/dashboard/facial-analytics', icon: ScanFace },
  { id: 'alerts', label: 'Alerts', href: '/dashboard/alerts', icon: AlertCircle },
  { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const alertInboxStorageKey = 'diagnostic-center-demo-alerts';
const alertInboxRefreshMarkerKey = 'diagnostic-center-demo-alerts-refresh-marker';

const getStoredAlertCount = () => {
  try {
    const storedAlerts = window.localStorage.getItem(alertInboxStorageKey);
    const parsedAlerts = storedAlerts ? JSON.parse(storedAlerts) : [];
    return Array.isArray(parsedAlerts) ? parsedAlerts.length : 0;
  } catch {
    return 0;
  }
};

const clearAlertsOnRefresh = () => {
  const navigationEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const pageLoadId = String(window.performance.timeOrigin);

  if (navigationEntry?.type === 'reload' && window.sessionStorage.getItem(alertInboxRefreshMarkerKey) !== pageLoadId) {
    window.localStorage.removeItem(alertInboxStorageKey);
    window.sessionStorage.setItem(alertInboxRefreshMarkerKey, pageLoadId);
    window.dispatchEvent(new Event('diagnostic-center-demo-alerts-updated'));
  }
};

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    const syncAlertCount = () => setAlertCount(getStoredAlertCount());

    clearAlertsOnRefresh();
    syncAlertCount();
    window.addEventListener('storage', syncAlertCount);
    window.addEventListener('diagnostic-center-demo-alerts-updated', syncAlertCount);

    return () => {
      window.removeEventListener('storage', syncAlertCount);
      window.removeEventListener('diagnostic-center-demo-alerts-updated', syncAlertCount);
    };
  }, []);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 lg:hidden p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 pt-6 transition-transform duration-300 z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-6 mb-8">
          <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider whitespace-normal break-words">
            UIC Diagnostic Centers
          </h1>
        </div>

        <nav className="space-y-2 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors no-blur ${
                  isActive
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
                {item.id === 'alerts' && alertCount > 0 && (
                  <span
                    className={`ml-auto flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold ${
                      isActive
                        ? 'bg-white text-blue-700'
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300'
                    }`}
                  >
                    {alertCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
