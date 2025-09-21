import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MediaPreferencesState {
  alarmVolume: number;
  tickVolume: number;
  tickEnabled: boolean;
  ambientVolume: number;
  ambientEnabled: boolean;
  setAlarmVolume: (value: number) => void;
  setTickVolume: (value: number) => void;
  setTickEnabled: (value: boolean) => void;
  setAmbientVolume: (value: number) => void;
  setAmbientEnabled: (value: boolean) => void;
}

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const useMediaPreferencesStore = create<MediaPreferencesState>()(
  persist(
    (set) => ({
      alarmVolume: 0.7,
      tickVolume: 0.35,
      tickEnabled: false,
      ambientVolume: 0.4,
      ambientEnabled: true,
      setAlarmVolume: (value: number) => set({ alarmVolume: clampVolume(value) }),
      setTickVolume: (value: number) => set({ tickVolume: clampVolume(value) }),
      setTickEnabled: (value: boolean) => set({ tickEnabled: value }),
      setAmbientVolume: (value: number) => set({ ambientVolume: clampVolume(value) }),
      setAmbientEnabled: (value: boolean) => set({ ambientEnabled: value }),
    }),
    {
      name: 'focusflow-media-preferences',
      partialize: (state) => ({
        alarmVolume: state.alarmVolume,
        tickVolume: state.tickVolume,
        tickEnabled: state.tickEnabled,
        ambientVolume: state.ambientVolume,
        ambientEnabled: state.ambientEnabled,
      }),
    },
  ),
);
