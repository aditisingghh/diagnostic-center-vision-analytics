'use client';

import { useDashboardStore } from '@/lib/store/dashboardStore';
import { useEffect, useState } from 'react';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const { settings } = useDashboardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={settings.theme === 'dark' ? 'dark' : ''}>
      {children}
    </div>
  );
}
