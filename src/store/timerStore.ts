import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TimerPhase = 'focus' | 'shortBreak' | 'longBreak';
type TimerStatus = 'idle' | 'running' | 'paused';

type TimerPresetId = string;

const MINUTE = 60_000;

export interface TimerConfig {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  autoStart: boolean;
}

export interface TimerPreset extends TimerConfig {
  id: TimerPresetId;
  name: string;
}

interface TimerState {
  phase: TimerPhase;
  status: TimerStatus;
  remainingMs: number;
  targetEnd: number | null;
  completedFocusCount: number;
  config: TimerConfig;
  presets: TimerPreset[];
  selectedPresetId: TimerPresetId | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
  setRemaining: (remainingMs: number) => void;
  completePhase: () => void;
  updateConfig: (partial: Partial<TimerConfig>) => void;
  createPreset: (name: string) => void;
  loadPreset: (id: TimerPresetId) => void;
  updatePresetFromCurrent: (id: TimerPresetId, nextName?: string) => void;
  deletePreset: (id: TimerPresetId) => void;
  clearPresetSelection: () => void;
}

const initialConfig: TimerConfig = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  autoStart: false,
};

const generatePresetId = () => `preset-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;

const durationForPhase = (phase: TimerPhase, config: TimerConfig) => {
  switch (phase) {
    case 'focus':
      return config.focusMinutes * MINUTE;
    case 'shortBreak':
      return config.shortBreakMinutes * MINUTE;
    case 'longBreak':
      return config.longBreakMinutes * MINUTE;
    default:
      return config.focusMinutes * MINUTE;
  }
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      phase: 'focus',
      status: 'idle',
      remainingMs: durationForPhase('focus', initialConfig),
      targetEnd: null,
      completedFocusCount: 0,
      config: initialConfig,
      presets: [],
      selectedPresetId: null,
      start: () => {
        const { config } = get();
        const remainingMs = durationForPhase('focus', config);
        set({
          phase: 'focus',
          status: 'running',
          remainingMs,
          targetEnd: Date.now() + remainingMs,
          completedFocusCount: 0,
        });
      },
      pause: () => {
        if (get().status !== 'running') return;
        set({ status: 'paused', targetEnd: null });
      },
      resume: () => {
        const { status, remainingMs } = get();
        if (status !== 'paused' && status !== 'idle') return;
        set({
          status: 'running',
          targetEnd: Date.now() + remainingMs,
        });
      },
      reset: () => {
        const { config } = get();
        set({
          phase: 'focus',
          status: 'idle',
          remainingMs: durationForPhase('focus', config),
          targetEnd: null,
          completedFocusCount: 0,
        });
      },
      skip: () => {
        get().completePhase();
      },
      setRemaining: (remainingMs: number) => {
        const { status } = get();
        if (status !== 'running') return;
        set({ remainingMs });
      },
      completePhase: () => {
        const state = get();
        const { phase, config, completedFocusCount } = state;
        let nextPhase: TimerPhase = 'focus';
        let nextFocusCount = completedFocusCount;

        if (phase === 'focus') {
          const achieved = completedFocusCount + 1;
          if (achieved >= config.sessionsBeforeLongBreak) {
            nextPhase = 'longBreak';
            nextFocusCount = 0;
          } else {
            nextPhase = 'shortBreak';
            nextFocusCount = achieved;
          }
        } else {
          nextPhase = 'focus';
          if (phase === 'longBreak') {
            nextFocusCount = 0;
          }
        }

        const nextDuration = durationForPhase(nextPhase, config);
        const shouldAutoStart = config.autoStart;

        set({
          phase: nextPhase,
          status: shouldAutoStart ? 'running' : 'idle',
          remainingMs: nextDuration,
          targetEnd: shouldAutoStart ? Date.now() + nextDuration : null,
          completedFocusCount: nextFocusCount,
        });
      },
      updateConfig: (partial: Partial<TimerConfig>) => {
        set((state) => {
          const config = { ...state.config, ...partial };
          const remainingMs = durationForPhase(state.phase, config);

          return {
            config,
            ...(state.status === 'idle'
              ? { remainingMs }
              : {}),
          };
        });
      },
      createPreset: (name: string) => {
        const { config } = get();
        const trimmed = name.trim();
        if (!trimmed) return;
        const preset: TimerPreset = {
          id: generatePresetId(),
          name: trimmed,
          ...config,
        };
        set((state) => ({
          presets: [...state.presets, preset],
          selectedPresetId: preset.id,
        }));
      },
      loadPreset: (id: TimerPresetId) => {
        const preset = get().presets.find((item) => item.id === id);
        if (!preset) return;
        set({
          config: {
            focusMinutes: preset.focusMinutes,
            shortBreakMinutes: preset.shortBreakMinutes,
            longBreakMinutes: preset.longBreakMinutes,
            sessionsBeforeLongBreak: preset.sessionsBeforeLongBreak,
            autoStart: preset.autoStart,
          },
          phase: 'focus',
          status: 'idle',
          remainingMs: durationForPhase('focus', preset),
          targetEnd: null,
          completedFocusCount: 0,
          selectedPresetId: preset.id,
        });
      },
      updatePresetFromCurrent: (id: TimerPresetId, nextName?: string) => {
        const { config } = get();
        set((state) => ({
          presets: state.presets.map((preset) =>
            preset.id === id
              ? {
                  ...preset,
                  ...config,
                  name: nextName?.trim() ? nextName.trim() : preset.name,
                }
              : preset,
          ),
          selectedPresetId: id,
        }));
      },
      deletePreset: (id: TimerPresetId) => {
        set((state) => {
          const filtered = state.presets.filter((preset) => preset.id !== id);
          const selectedPresetId = state.selectedPresetId === id ? null : state.selectedPresetId;
          return {
            presets: filtered,
            selectedPresetId,
          };
        });
      },
      clearPresetSelection: () => set({ selectedPresetId: null }),
    }),
    {
      name: 'focusflow-timer',
      version: 2,
      partialize: (state) => ({
        config: state.config,
        presets: state.presets,
        selectedPresetId: state.selectedPresetId,
      }),
      migrate: (persistedState: unknown, version) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return {
            config: initialConfig,
            presets: [],
            selectedPresetId: null,
          };
        }

        const state = persistedState as Partial<TimerState> & {
          savedPreset?: TimerPreset | null;
        };

        if (version >= 2) {
          return {
            config: state.config ?? initialConfig,
            presets: state.presets ?? [],
            selectedPresetId: state.selectedPresetId ?? null,
          };
        }

        const legacyPreset = state.savedPreset;
        const legacyConfig = state.config ?? initialConfig;
        const migratedPreset = legacyPreset
          ? [{
              id: generatePresetId(),
              name: legacyPreset.name,
              focusMinutes: legacyPreset.focusMinutes,
              shortBreakMinutes: legacyPreset.shortBreakMinutes,
              longBreakMinutes: legacyPreset.longBreakMinutes,
              sessionsBeforeLongBreak: legacyPreset.sessionsBeforeLongBreak,
              autoStart: legacyPreset.autoStart,
            }]
          : [];

        return {
          config: legacyConfig,
          presets: migratedPreset,
          selectedPresetId: migratedPreset.length ? migratedPreset[0].id : null,
        };
      },
    },
  ),
);

export const formatDuration = (ms: number) => {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const progressForPhase = (
  remaining: number,
  phase: TimerPhase,
  config: TimerConfig,
) => {
  const total = durationForPhase(phase, config);
  return Math.min(1, Math.max(0, 1 - remaining / total));
};

export const getPhaseLabel = (phase: TimerPhase) => {
  switch (phase) {
    case 'focus':
      return 'Focus';
    case 'shortBreak':
      return 'Short Break';
    case 'longBreak':
      return 'Long Break';
    default:
      return 'Focus';
  }
};
