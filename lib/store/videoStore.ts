import { create } from 'zustand';
import * as Types from '@/lib/types';

interface VideoStore {
  metadata: Types.VideoMetadata | null;
  detections: Types.DetectionEvent[];
  currentTime: number;
  duration: number;
  playing: boolean;
  playbackRate: number;
  showCoordinates: boolean;
  showZones: boolean;
  showObjectIds: boolean;
  zones: Types.VideoZone[];
  selectedZone: string | null;

  setMetadata: (metadata: Types.VideoMetadata) => void;
  setDetections: (detections: Types.DetectionEvent[]) => void;
  setCurrentTime: (time: number) => void;
  setPlaying: (playing: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  toggleCoordinates: () => void;
  toggleZones: () => void;
  toggleObjectIds: () => void;
  setZones: (zones: Types.VideoZone[]) => void;
  setSelectedZone: (zoneId: string | null) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  metadata: null,
  detections: [],
  currentTime: 0,
  duration: 0,
  playing: false,
  playbackRate: 1,
  showCoordinates: true,
  showZones: false,
  showObjectIds: true,
  zones: [],
  selectedZone: null,

  setMetadata: (metadata) => set({ metadata }),
  setDetections: (detections) => set({ detections }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setPlaying: (playing) => set({ playing }),
  setPlaybackRate: (playbackRate) => set({ playbackRate }),
  toggleCoordinates: () => set((state) => ({ showCoordinates: !state.showCoordinates })),
  toggleZones: () => set((state) => ({ showZones: !state.showZones })),
  toggleObjectIds: () => set((state) => ({ showObjectIds: !state.showObjectIds })),
  setZones: (zones) => set({ zones }),
  setSelectedZone: (selectedZone) => set({ selectedZone }),
}));
