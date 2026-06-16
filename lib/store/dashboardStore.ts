import { create } from 'zustand';
import * as Types from '@/lib/types';
import { defaultDashboardSettings } from '@/lib/mockData';

interface DashboardStore {
  settings: Types.DashboardSettings;
  loading: boolean;
  error: string | null;
  updateSettings: (settings: Partial<Types.DashboardSettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleTheme: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  settings: {
    ...defaultDashboardSettings,
    theme: typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  },
  loading: false,
  error: null,

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', newTheme);
      }
      return {
        settings: { ...state.settings, theme: newTheme },
      };
    }),
}));
