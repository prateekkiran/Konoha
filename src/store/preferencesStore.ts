import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MediaPreferencesState {
  alarmVolume: number;
  tickVolume: number;
  tickEnabled: boolean;
  setAlarmVolume: (value: number) => void;
  setTickVolume: (value: number) => void;
  setTickEnabled: (value: boolean) => void;
}

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const useMediaPreferencesStore = create<MediaPreferencesState>()(
  persist(
    (set) => ({
      alarmVolume: 0.7,
      tickVolume: 0.35,
      tickEnabled: false,
      setAlarmVolume: (value: number) => set({ alarmVolume: clampVolume(value) }),
      setTickVolume: (value: number) => set({ tickVolume: clampVolume(value) }),
      setTickEnabled: (value: boolean) => set({ tickEnabled: value }),
    }),
    {
      name: 'focusflow-media-preferences',
      partialize: (state) => ({
        alarmVolume: state.alarmVolume,
        tickVolume: state.tickVolume,
        tickEnabled: state.tickEnabled,
      }),
    },
  ),
);
