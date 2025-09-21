import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useShallow } from 'zustand/react/shallow';
import TimerDisplay from './components/TimerDisplay';
import QuoteShowcase, { AnimeQuote } from './components/QuoteShowcase';
import {
  formatDuration,
  getPhaseLabel,
  progressForPhase,
  useTimerStore,
} from './store/timerStore';
import { useTimerEngine } from './hooks/useTimerEngine';
import { useNotifications } from './hooks/useNotifications';
import { AlarmTone, AmbientMode, useSoundscape } from './hooks/useSoundscape';
import { useMediaPreferencesStore } from './store/preferencesStore';

type ThemeName = 'light' | 'dark' | 'zen';
type DisplayMode = 'ring' | 'bar';
type BackgroundMode = AmbientMode;

type TimerStoreShape = ReturnType<typeof useTimerStore.getState>;

type MediaPreferencesShape = ReturnType<typeof useMediaPreferencesStore.getState>;

const selectTimerSlice = (state: TimerStoreShape) => ({
  phase: state.phase,
  status: state.status,
  remainingMs: state.remainingMs,
  completedFocusCount: state.completedFocusCount,
  config: state.config,
  presets: state.presets,
  selectedPresetId: state.selectedPresetId,
  start: state.start,
  pause: state.pause,
  resume: state.resume,
  reset: state.reset,
  skip: state.skip,
  updateConfig: state.updateConfig,
  createPreset: state.createPreset,
  loadPreset: state.loadPreset,
  updatePresetFromCurrent: state.updatePresetFromCurrent,
  deletePreset: state.deletePreset,
  clearPresetSelection: state.clearPresetSelection,
});

const selectMediaSlice = (state: MediaPreferencesShape) => ({
  alarmVolume: state.alarmVolume,
  tickVolume: state.tickVolume,
  tickEnabled: state.tickEnabled,
  ambientVolume: state.ambientVolume,
  ambientEnabled: state.ambientEnabled,
  setAlarmVolume: state.setAlarmVolume,
  setTickVolume: state.setTickVolume,
  setTickEnabled: state.setTickEnabled,
  setAmbientVolume: state.setAmbientVolume,
  setAmbientEnabled: state.setAmbientEnabled,
});

const themeStorageKey = 'focusflow:theme';
const displayStorageKey = 'focusflow:display';
const backgroundStorageKey = 'focusflow:background';
const toneStorageKey = 'focusflow:alarm-tone';
const presetNamePlaceholder = 'My Flow';

const animeQuotes: AnimeQuote[] = [
  {
    text: "I'm never going to run away or go back on my word. That's my nindo: my ninja way!",
    source: 'Naruto Uzumaki',
    image: '/anime/naruto.svg',
    accent: '#f97316',
    background: 'linear-gradient(135deg, rgba(249,115,22,0.78), rgba(250,204,21,0.72))',
  },
  {
    text: "No matter how many people you may lose, you have no choice but to go on living.",
    source: 'Tanjiro Kamado',
    image: '/anime/demonslayer.svg',
    accent: '#ef4444',
    background: 'linear-gradient(135deg, rgba(15,118,110,0.78), rgba(239,68,68,0.7))',
  },
  {
    text: 'Throughout heaven and earth, I alone am the honored one.',
    source: 'Satoru Gojo',
    image: '/anime/jujutsu.svg',
    accent: '#38bdf8',
    background: 'linear-gradient(135deg, rgba(14,165,233,0.76), rgba(23,37,84,0.72))',
  },
  {
    text: 'You must go on living... even if it hurts.',
    source: 'Osamu Dazai',
    image: '/anime/bungou.svg',
    accent: '#a855f7',
    background: 'linear-gradient(135deg, rgba(109,40,217,0.8), rgba(168,85,247,0.7))',
  },
  {
    text: 'Power comes in response to a need, not a desire.',
    source: 'Son Goku',
    image: '/anime/dragonball.svg',
    accent: '#f97316',
    background: 'radial-gradient(circle at 50% 35%, rgba(250,204,21,0.85), rgba(239,68,68,0.7))',
  },
  {
    text: "I'm going to be King of the Pirates!",
    source: 'Monkey D. Luffy',
    image: '/anime/onepiece.svg',
    accent: '#0ea5e9',
    background: 'linear-gradient(135deg, rgba(14,165,233,0.78), rgba(16,185,129,0.72))',
  },
  {
    text: 'This world is cruel. But it is also very beautiful.',
    source: 'Mikasa Ackerman',
    image: '/anime/aot.svg',
    accent: '#16a34a',
    background: 'linear-gradient(135deg, rgba(31,41,55,0.85), rgba(22,163,74,0.6))',
  },
  {
    text: "Even if tomorrow repeats, I'll still fight to protect them.",
    source: 'Shinpei Ajiro',
    image: '/anime/summertime.svg',
    accent: '#38bdf8',
    background: 'linear-gradient(135deg, rgba(99,102,241,0.75), rgba(56,189,248,0.72))',
  },
  {
    text: "If you're always worried about crushing the ants beneath you, you won't be able to walk.",
    source: 'Guts',
    image: '/anime/berserk.svg',
    accent: '#dc2626',
    background: 'linear-gradient(135deg, rgba(17,24,39,0.8), rgba(220,38,38,0.7))',
  },
  {
    text: 'The only thing that can change your life is yourself.',
    source: 'Shinya Kogami',
    image: '/anime/psychopass.svg',
    accent: '#0d9488',
    background: 'linear-gradient(135deg, rgba(2,132,199,0.8), rgba(15,23,42,0.7))',
  },
  {
    text: "You can't ever win if you're always on the defensive.",
    source: 'L Lawliet',
    image: '/anime/deathnote.svg',
    accent: '#f8fafc',
    background: 'linear-gradient(135deg, rgba(15,23,42,0.85), rgba(75,85,99,0.65))',
  },
  {
    text: 'You have no enemies. No one in this world is your enemy.',
    source: 'Thors',
    image: '/anime/vinland.svg',
    accent: '#22c55e',
    background: 'linear-gradient(135deg, rgba(20,83,45,0.82), rgba(74,222,128,0.68))',
  },
  {
    text: "I’ll become the person who can stand beside him.",
    source: 'Kafka Hibino',
    image: '/anime/kaiju8.svg',
    accent: '#0ea5e9',
    background: 'linear-gradient(135deg, rgba(30,41,59,0.85), rgba(14,165,233,0.7))',
  },
  {
    text: 'A peaceful life is worth fighting for.',
    source: 'Taro Sakamoto',
    image: '/anime/sakamoto.svg',
    accent: '#fb7185',
    background: 'linear-gradient(135deg, rgba(251,113,133,0.8), rgba(252,211,77,0.7))',
  },
  {
    text: "Believe in the things you can't see if you feel them.",
    source: 'Momo Ayase',
    image: '/anime/dandadan.svg',
    accent: '#ec4899',
    background: 'linear-gradient(135deg, rgba(147,51,234,0.82), rgba(236,72,153,0.7))',
  },
  {
    text: 'I alone am the Monarch.',
    source: 'Sung Jinwoo',
    image: '/anime/sololeveling.svg',
    accent: '#38bdf8',
    background: 'linear-gradient(135deg, rgba(17,24,39,0.88), rgba(56,189,248,0.68))',
  },
  {
    text: "I'll keep moving forward until I catch you!",
    source: 'Gon Freecss',
    image: '/anime/hunterxhunter.svg',
    accent: '#22c55e',
    background: 'linear-gradient(135deg, rgba(34,197,94,0.78), rgba(239,68,68,0.65))',
  },
  {
    text: 'My magic is never giving up!',
    source: 'Asta',
    image: '/anime/blackclover.svg',
    accent: '#22c55e',
    background: 'linear-gradient(135deg, rgba(31,41,55,0.82), rgba(34,197,94,0.7))',
  },
];


const getStoredValue = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn('Failed to parse stored value for', key, error);
    return fallback;
  }
};

const setStoredValue = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const App = () => {
  const {
    phase,
    status,
    remainingMs,
    completedFocusCount,
    config,
    presets,
    selectedPresetId,
    start,
    pause,
    resume,
    reset,
    skip,
    updateConfig,
    createPreset,
    loadPreset,
    updatePresetFromCurrent,
    deletePreset,
    clearPresetSelection,
  } = useTimerStore(useShallow(selectTimerSlice));

  const {
    alarmVolume,
    tickVolume,
    tickEnabled,
    ambientVolume,
    ambientEnabled,
    setAlarmVolume,
    setTickVolume,
    setTickEnabled,
    setAmbientVolume,
    setAmbientEnabled,
  } = useMediaPreferencesStore(useShallow(selectMediaSlice));

  const workspaceRef = useRef<HTMLElement | null>(null);
  const [theme, setTheme] = useState<ThemeName>(() => getStoredValue(themeStorageKey, 'dark'));
  const [displayMode, setDisplayMode] = useState<DisplayMode>(() =>
    getStoredValue(displayStorageKey, 'ring'),
  );
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>(() =>
    getStoredValue(backgroundStorageKey, 'gradient'),
  );
  const [presetName, setPresetName] = useState('');
  const [tonePreference] = useState<AlarmTone>(() =>
    getStoredValue<AlarmTone>(toneStorageKey, 'gentleChime'),
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * animeQuotes.length));

  const { permission, requestPermission, sendNotification, isSupported: notificationsSupported } =
    useNotifications();

  const {
    playAlarm,
    selectedTone,
    setSelectedTone,
    prime,
    startTicking,
    stopTicking,
    setTickLoopVolume,
    startAmbient,
    stopAmbient,
    setAmbientVolume: setAmbientGain,
    isSupported: audioSupported,
  } = useSoundscape();

  useEffect(() => {
    const selectedPreset = presets.find((preset) => preset.id === selectedPresetId);
    setPresetName(selectedPreset?.name ?? '');
  }, [presets, selectedPresetId]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    setStoredValue(themeStorageKey, theme);
    return () => {
      document.body.removeAttribute('data-theme');
    };
  }, [theme]);

  useEffect(() => {
    setStoredValue(displayStorageKey, displayMode);
  }, [displayMode]);

  useEffect(() => {
    setStoredValue(backgroundStorageKey, backgroundMode);
  }, [backgroundMode]);

  useEffect(() => {
    document.title = `${formatDuration(remainingMs)} • ${getPhaseLabel(phase)} – FocusFlow`;
    return () => {
      document.title = 'FocusFlow';
    };
  }, [phase, remainingMs]);

  useEffect(() => {
    setSelectedTone(tonePreference);
  }, [setSelectedTone, tonePreference]);

  useEffect(() => {
    setTickLoopVolume(tickVolume);
  }, [setTickLoopVolume, tickVolume]);

  useEffect(() => {
    setAmbientGain(ambientVolume);
  }, [ambientVolume, setAmbientGain]);

  useEffect(() => {
    const shouldTick = tickEnabled && status === 'running' && phase === 'focus';
    if (shouldTick) {
      startTicking(tickVolume).catch(() => undefined);
      return () => {
        stopTicking();
      };
    }

    stopTicking();
    return undefined;
  }, [tickEnabled, phase, status, tickVolume, startTicking, stopTicking]);

  useEffect(() => {
    let cancelled = false;
    if (ambientEnabled && audioSupported) {
      prime()
        .then(() => {
          if (!cancelled) {
            startAmbient(backgroundMode, ambientVolume).catch(() => undefined);
          }
        })
        .catch(() => undefined);
      return () => {
        cancelled = true;
        stopAmbient();
      };
    }

    stopAmbient();
    return undefined;
  }, [ambientEnabled, backgroundMode, ambientVolume, startAmbient, stopAmbient, prime, audioSupported]);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler as EventListener);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler as EventListener);
    };
  }, []);

  useEffect(() => {
    const element = workspaceRef.current;
    if (!element) return;
    if (isFullscreen) {
      element.classList.add('fullscreen-active');
    } else {
      element.classList.remove('fullscreen-active');
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.dataset.focusflowFullscreen = 'true';
    } else {
      delete document.body.dataset.focusflowFullscreen;
    }

    return () => {
      delete document.body.dataset.focusflowFullscreen;
    };
  }, [isFullscreen]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuoteIndex((index) => (index + 1) % animeQuotes.length);
    }, 45000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    setQuoteIndex((index) => (index + 1) % animeQuotes.length);
  }, [phase, backgroundMode]);

  const activeQuote = useMemo(() => animeQuotes[quoteIndex] ?? null, [quoteIndex]);

  const handlePhaseComplete = useCallback(
    (completedPhase: 'focus' | 'shortBreak' | 'longBreak') => {
      playAlarm(undefined, alarmVolume);

      if (notificationsSupported && permission === 'granted') {
        const nextPhase = completedPhase === 'focus' ? 'Break' : 'Focus';
        const message =
          completedPhase === 'focus'
            ? `Focus block complete. Time to recharge. Next: ${nextPhase}.`
            : `Break finished. Ready for your next deep work sprint? Next: ${nextPhase}.`;

        sendNotification('FocusFlow', {
          body: message,
          icon: '/focusflow-icon.svg',
          silent: false,
        });
      }
    },
    [alarmVolume, permission, playAlarm, sendNotification, notificationsSupported],
  );

  useTimerEngine({ onPhaseComplete: handlePhaseComplete });

  const primaryLabel = useMemo(() => {
    if (status === 'running') return 'Pause';
    if (status === 'paused') return 'Resume';
    return 'Start Focus';
  }, [status]);

  const focusCyclePosition = useMemo(() => {
    if (phase === 'focus') {
      return Math.min(config.sessionsBeforeLongBreak, completedFocusCount + 1);
    }
    if (phase === 'longBreak') {
      return config.sessionsBeforeLongBreak;
    }
    return Math.min(config.sessionsBeforeLongBreak, completedFocusCount);
  }, [phase, completedFocusCount, config.sessionsBeforeLongBreak]);

  const progress = useMemo(
    () => progressForPhase(remainingMs, phase, config),
    [remainingMs, phase, config],
  );

  const hintMessage = useMemo(() => {
    if (status === 'idle' && phase === 'focus') {
      return 'Press start to begin a deep work block.';
    }
    if (config.autoStart) {
      return 'Next interval will launch automatically.';
    }
    return undefined;
  }, [status, phase, config.autoStart]);

  const handlePrimaryAction = useCallback(async () => {
    await prime();
    if (status === 'running') {
      pause();
      return;
    }
    if (status === 'paused') {
      resume();
      return;
    }
    start();
  }, [status, pause, resume, start, prime]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  const handleSkip = useCallback(() => {
    skip();
  }, [skip]);

  const handleDurationChange = useCallback(
    (key: 'focusMinutes' | 'shortBreakMinutes' | 'longBreakMinutes') =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const rawValue = Number(event.target.value);
        if (Number.isNaN(rawValue)) return;
        const limits = {
          focusMinutes: 180,
          shortBreakMinutes: 60,
          longBreakMinutes: 90,
        } as const;
        const value = Math.max(1, Math.min(limits[key], rawValue));
        updateConfig({ [key]: value });
      },
    [updateConfig],
  );

  const handleSessionsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = Number(event.target.value);
      if (Number.isNaN(rawValue)) return;
      const value = Math.max(1, Math.min(12, rawValue));
      updateConfig({ sessionsBeforeLongBreak: value });
    },
    [updateConfig],
  );

  const handleAutoStartToggle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateConfig({ autoStart: event.target.checked });
    },
    [updateConfig],
  );

  const handleCreatePreset = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!presetName.trim()) return;
      createPreset(presetName.trim());
    },
    [createPreset, presetName],
  );

  const handleUpdatePreset = useCallback(() => {
    if (!selectedPresetId) return;
    updatePresetFromCurrent(selectedPresetId, presetName.trim() ? presetName.trim() : undefined);
  }, [presetName, selectedPresetId, updatePresetFromCurrent]);

  const handleLoadPreset = useCallback(
    (presetId: string) => {
      loadPreset(presetId);
    },
    [loadPreset],
  );

  const handleDeletePreset = useCallback(
    (presetId: string) => {
      deletePreset(presetId);
    },
    [deletePreset],
  );

  const handleAlarmVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (Number.isNaN(value)) return;
      setAlarmVolume(value / 100);
    },
    [setAlarmVolume],
  );

  const handleTickVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (Number.isNaN(value)) return;
      setTickVolume(value / 100);
    },
    [setTickVolume],
  );

  const handleAmbientVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (Number.isNaN(value)) return;
      setAmbientVolume(value / 100);
    },
    [setAmbientVolume],
  );

  const handleTickToggle = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const enabled = event.target.checked;
      if (enabled) {
        await prime();
      } else {
        stopTicking();
      }
      setTickEnabled(enabled);
    },
    [prime, setTickEnabled, stopTicking],
  );

  const handleAmbientToggle = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const enabled = event.target.checked;
      if (enabled) {
        await prime();
      } else {
        stopAmbient();
      }
      setAmbientEnabled(enabled);
    },
    [prime, setAmbientEnabled, stopAmbient],
  );

  const requestFullscreen = useCallback(async () => {
    const element = workspaceRef.current;
    if (!element) return;

    if (element.requestFullscreen) {
      await element.requestFullscreen();
      return;
    }

    const webkitRequest = (element as unknown as {
      webkitRequestFullscreen?: () => void;
      webkitEnterFullScreen?: () => void;
    }).webkitRequestFullscreen;

    if (webkitRequest) {
      webkitRequest.call(element);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    const webkitExit = (document as unknown as {
      webkitExitFullscreen?: () => void;
      webkitCancelFullScreen?: () => void;
    }).webkitExitFullscreen;

    if (webkitExit) {
      webkitExit.call(document);
    }
  }, []);

  const handleFullscreenToggle = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await requestFullscreen();
    }
  }, [exitFullscreen, isFullscreen, requestFullscreen]);

  const isInitialState = status === 'idle' && progress === 0 && phase === 'focus';

  return (
    <main>
      <header className="app-header" role="banner">
        <div>
          <p className="badge">FocusFlow</p>
          <h1>Design your perfect focus ritual.</h1>
        </div>
        <div className="header-controls" role="group" aria-label="Appearance options">
          <div className="theme-options" role="group" aria-label="Theme">
            {(['light', 'dark', 'zen'] as ThemeName[]).map((option) => (
              <button
                key={option}
                type="button"
                className="chip"
                aria-pressed={theme === option}
                onClick={() => setTheme(option)}
              >
                {option === 'zen' ? 'Zen' : option === 'dark' ? 'Dark' : 'Light'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="app-shell">
        <article
          ref={workspaceRef}
          className="panel immersive-background"
          aria-label="Timer workspace"
        >
          <div className="timer-header">
            <div>
              <h2>Session</h2>
              <span className="muted">Crafted for sustained deep work</span>
            </div>
            <div className="display-options" role="group" aria-label="Timer style">
              {(['ring', 'bar'] as DisplayMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className="chip"
                  aria-pressed={displayMode === mode}
                  onClick={() => setDisplayMode(mode)}
                >
                  {mode === 'ring' ? 'Circular' : 'Linear'}
                </button>
              ))}
            </div>
          </div>

          <TimerDisplay
            timeLabel={formatDuration(remainingMs)}
            phaseLabel={getPhaseLabel(phase)}
            hint={hintMessage}
            progress={progress}
            displayMode={displayMode}
            backgroundMode={backgroundMode}
            focusCounter={{
              completed: focusCyclePosition,
              target: config.sessionsBeforeLongBreak,
            }}
          />

          <div className="background-selector" role="group" aria-label="Focus mode background">
            {(['waves', 'clouds', 'gradient'] as BackgroundMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                className="chip"
                aria-pressed={backgroundMode === mode}
                onClick={() => setBackgroundMode(mode)}
              >
                {mode === 'waves' ? 'Waves' : mode === 'clouds' ? 'Clouds' : 'Aurora'}
              </button>
            ))}
          </div>

          <div className="timer-actions">
            <button className="primary" type="button" onClick={handlePrimaryAction}>
              {primaryLabel}
            </button>
            <button type="button" onClick={handleReset} disabled={isInitialState}>
              Reset
            </button>
            <button type="button" onClick={handleSkip}>
              Skip
            </button>
            <button
              type="button"
              onClick={handleFullscreenToggle}
              aria-pressed={isFullscreen}
            >
              {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            </button>
          </div>

          <QuoteShowcase quote={activeQuote} />
        </article>

        <aside className="panel" aria-label="Session controls">
          <section className="stack" aria-labelledby="timing-config">
            <div className="timer-header">
              <div>
                <h2 id="timing-config">Timing</h2>
                <span className="muted">Dial in the perfect cadence</span>
              </div>
            </div>
            <div className="settings-grid" role="group" aria-label="Timer durations">
              <label className="field-group" htmlFor="focus-duration">
                Focus duration (minutes)
                <input
                  id="focus-duration"
                  type="number"
                  min={1}
                  max={180}
                  value={config.focusMinutes}
                  onChange={handleDurationChange('focusMinutes')}
                />
              </label>
              <label className="field-group" htmlFor="short-break">
                Short break (minutes)
                <input
                  id="short-break"
                  type="number"
                  min={1}
                  max={60}
                  value={config.shortBreakMinutes}
                  onChange={handleDurationChange('shortBreakMinutes')}
                />
              </label>
              <label className="field-group" htmlFor="long-break">
                Long break (minutes)
                <input
                  id="long-break"
                  type="number"
                  min={1}
                  max={90}
                  value={config.longBreakMinutes}
                  onChange={handleDurationChange('longBreakMinutes')}
                />
              </label>
              <label className="field-group" htmlFor="sessions-before-long">
                Focus sessions before long break
                <input
                  id="sessions-before-long"
                  type="number"
                  min={1}
                  max={12}
                  value={config.sessionsBeforeLongBreak}
                  onChange={handleSessionsChange}
                />
              </label>
            </div>
            <label className="switch" htmlFor="auto-start">
              <span>Auto-start next interval</span>
              <input
                id="auto-start"
                type="checkbox"
                checked={config.autoStart}
                onChange={handleAutoStartToggle}
              />
            </label>
          </section>

          <section className="stack" aria-labelledby="preset-manager">
            <div className="timer-header">
              <div>
                <h2 id="preset-manager">Presets</h2>
                <span className="muted">Save the rhythms you love</span>
              </div>
            </div>
            <form className="preset-card" onSubmit={handleCreatePreset}>
              <label className="field-group" htmlFor="preset-name">
                Preset name
                <input
                  id="preset-name"
                  type="text"
                  placeholder={presetNamePlaceholder}
                  value={presetName}
                  onChange={(event) => setPresetName(event.target.value)}
                  maxLength={32}
                />
              </label>
              <footer>
                <button type="submit">Save as new</button>
                <button
                  type="button"
                  onClick={handleUpdatePreset}
                  disabled={!selectedPresetId}
                >
                  Update selected
                </button>
                <button
                  type="button"
                  onClick={clearPresetSelection}
                  disabled={!selectedPresetId}
                >
                  Clear selection
                </button>
              </footer>
            </form>

            <div className="preset-list" role="list">
              {presets.length === 0 ? (
                <p className="help-text">No presets yet. Save one to get started.</p>
              ) : (
                presets.map((preset) => {
                  const isSelected = preset.id === selectedPresetId;
                  return (
                    <article
                      key={preset.id}
                      role="listitem"
                      className={`preset-item${isSelected ? ' selected' : ''}`}
                    >
                      <header>
                        <h3>{preset.name}</h3>
                        <span className="muted">
                          {preset.focusMinutes} • {preset.shortBreakMinutes} • {preset.longBreakMinutes} · every {preset.sessionsBeforeLongBreak}
                        </span>
                      </header>
                      <div className="preset-actions">
                        <button type="button" onClick={() => handleLoadPreset(preset.id)}>
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePreset(preset.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <section className="stack" aria-labelledby="notification-audio">
            <div className="timer-header">
              <div>
                <h2 id="notification-audio">Notifications & Audio</h2>
                <span className="muted">Stay in flow wherever you are</span>
              </div>
            </div>
            <div className="radio-group" role="radiogroup" aria-label="Alarm tone">
              {(['gentleChime', 'deepFocus', 'brightPulse'] as AlarmTone[]).map((tone) => (
                <div key={tone} className="radio-option">
                  <label htmlFor={`tone-${tone}`}>
                    <input
                      id={`tone-${tone}`}
                      type="radio"
                      name="alarm-tone"
                      checked={selectedTone === tone}
                      onChange={() => {
                        setSelectedTone(tone);
                        setStoredValue(toneStorageKey, tone);
                      }}
                    />
                    {tone === 'gentleChime' && 'Gentle chime'}
                    {tone === 'deepFocus' && 'Deep focus bell'}
                    {tone === 'brightPulse' && 'Bright pulse'}
                  </label>
                  <button type="button" onClick={() => playAlarm(tone, alarmVolume)} disabled={!audioSupported}>
                    Preview
                  </button>
                </div>
              ))}
            </div>

            <div className="slider-group">
              <label htmlFor="alarm-volume">
                Alarm volume
                <input
                  id="alarm-volume"
                  className="range-input"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(alarmVolume * 100)}
                  onChange={handleAlarmVolumeChange}
                />
              </label>
              <label htmlFor="tick-volume">
                Ticking volume
                <input
                  id="tick-volume"
                  className="range-input"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(tickVolume * 100)}
                  onChange={handleTickVolumeChange}
                />
              </label>
              <label htmlFor="ambient-volume">
                Ambient sound volume
                <input
                  id="ambient-volume"
                  className="range-input"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(ambientVolume * 100)}
                  onChange={handleAmbientVolumeChange}
                  disabled={!audioSupported}
                />
              </label>
            </div>

            <label className="switch" htmlFor="tick-enabled">
              <span>Enable ticking during focus</span>
              <input
                id="tick-enabled"
                type="checkbox"
                checked={tickEnabled}
                onChange={handleTickToggle}
                disabled={!audioSupported}
              />
            </label>
            <label className="switch" htmlFor="ambient-enabled">
              <span>Enable ambient sound</span>
              <input
                id="ambient-enabled"
                type="checkbox"
                checked={ambientEnabled}
                onChange={handleAmbientToggle}
                disabled={!audioSupported}
              />
            </label>

            <div className="notifications-block">
              <p className="muted">
                Status: {!notificationsSupported
                  ? 'Browser notifications unavailable'
                  : permission === 'granted'
                  ? 'Notifications enabled'
                  : permission === 'denied'
                  ? 'Notifications blocked in browser settings'
                  : 'Permission not requested'}
              </p>
              <button
                type="button"
                onClick={requestPermission}
                disabled={!notificationsSupported || permission !== 'default'}
              >
                Enable notifications
              </button>
            </div>
            {!audioSupported ? (
              <p className="help-text">Your browser does not support Web Audio alarms.</p>
            ) : null}
          </section>
        </aside>
      </div>
    </main>
  );
};

export default App;
