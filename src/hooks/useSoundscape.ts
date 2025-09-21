import { useCallback, useEffect, useRef, useState } from 'react';

type AlarmTone = 'gentleChime' | 'deepFocus' | 'brightPulse';

type UniversalAudioContext = AudioContext & {
  resume: () => Promise<void>;
};

type OscillatorShape = OscillatorType;

const isAudioSupported = () =>
  typeof window !== 'undefined' &&
  (!!window.AudioContext || !!(window as unknown as Record<string, unknown>).webkitAudioContext);

const getContext = (): UniversalAudioContext | null => {
  if (!isAudioSupported()) return null;
  if (window.AudioContext) return new window.AudioContext();
  const webkit = (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return webkit ? new webkit() : null;
};

const scheduleTone = (
  context: AudioContext,
  destination: GainNode,
  {
    frequency,
    startOffset,
    duration,
    type,
    attack = 0.02,
    decay = 0.25,
    detune = 0,
  }: {
    frequency: number;
    startOffset: number;
    duration: number;
    type: OscillatorShape;
    attack?: number;
    decay?: number;
    detune?: number;
  },
) => {
  const osc = context.createOscillator();
  const gain = context.createGain();
  const startTime = context.currentTime + startOffset;
  const stopTime = startTime + duration + decay;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);
  if (detune) {
    osc.detune.setValueAtTime(detune, startTime);
  }

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(1, startTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + decay);

  osc.connect(gain);
  gain.connect(destination);

  osc.start(startTime);
  osc.stop(stopTime);
};

const tonePresets: Record<AlarmTone, (context: AudioContext, master: GainNode) => void> = {
  gentleChime: (ctx, master) => {
    scheduleTone(ctx, master, {
      frequency: 784,
      startOffset: 0.0,
      duration: 0.45,
      type: 'sine',
      attack: 0.04,
      decay: 0.4,
    });
    scheduleTone(ctx, master, {
      frequency: 987,
      startOffset: 0.15,
      duration: 0.5,
      type: 'sine',
      attack: 0.05,
      decay: 0.45,
    });
    scheduleTone(ctx, master, {
      frequency: 523,
      startOffset: 0.4,
      duration: 0.6,
      type: 'triangle',
      attack: 0.03,
      decay: 0.55,
    });
  },
  deepFocus: (ctx, master) => {
    scheduleTone(ctx, master, {
      frequency: 220,
      startOffset: 0,
      duration: 0.6,
      type: 'sawtooth',
      attack: 0.03,
      decay: 0.4,
    });
    scheduleTone(ctx, master, {
      frequency: 440,
      startOffset: 0.3,
      duration: 0.5,
      type: 'triangle',
      attack: 0.02,
      decay: 0.35,
    });
    scheduleTone(ctx, master, {
      frequency: 660,
      startOffset: 0.55,
      duration: 0.45,
      type: 'triangle',
      attack: 0.02,
      decay: 0.4,
    });
  },
  brightPulse: (ctx, master) => {
    scheduleTone(ctx, master, {
      frequency: 880,
      startOffset: 0,
      duration: 0.25,
      type: 'square',
      attack: 0.01,
      decay: 0.25,
    });
    scheduleTone(ctx, master, {
      frequency: 1046,
      startOffset: 0.2,
      duration: 0.3,
      type: 'square',
      attack: 0.01,
      decay: 0.3,
    });
    scheduleTone(ctx, master, {
      frequency: 1318,
      startOffset: 0.35,
      duration: 0.35,
      type: 'sawtooth',
      attack: 0.015,
      decay: 0.4,
    });
  },
};

const createTickBuffer = (context: AudioContext) => {
  const durationSeconds = 0.12;
  const sampleRate = context.sampleRate;
  const frameCount = Math.floor(sampleRate * durationSeconds);
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i += 1) {
    const t = i / frameCount;
    const envelope = Math.pow(1 - t, 2);
    const click = Math.sin(2 * Math.PI * 800 * (i / sampleRate));
    data[i] = click * envelope;
  }

  return buffer;
};

export const useSoundscape = () => {
  const [selectedTone, setSelectedTone] = useState<AlarmTone>('gentleChime');
  const [isReady, setIsReady] = useState(false);
  const contextRef = useRef<UniversalAudioContext | null>(null);
  const tickIntervalRef = useRef<number | null>(null);
  const tickBufferRef = useRef<AudioBuffer | null>(null);
  const tickVolumeRef = useRef(0.35);

  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) {
        window.clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      if (contextRef.current) {
        contextRef.current.close().catch(() => undefined);
        contextRef.current = null;
      }
    };
  }, []);

  const ensureContext = useCallback(async () => {
    if (contextRef.current) {
      if (contextRef.current.state === 'suspended') {
        await contextRef.current.resume();
      }
      setIsReady(true);
      return contextRef.current;
    }

    const context = getContext();
    if (!context) return null;
    contextRef.current = context as UniversalAudioContext;

    if (context.state === 'suspended') {
      await context.resume();
    }

    setIsReady(true);
    return contextRef.current;
  }, []);

  const prime = useCallback(async () => {
    const ctx = await ensureContext();
    return Boolean(ctx);
  }, [ensureContext]);

  const playAlarm = useCallback(
    async (tone?: AlarmTone, volume = 0.7) => {
      const ctx = await ensureContext();
      if (!ctx) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(Math.max(0.0001, volume), ctx.currentTime);
      masterGain.connect(ctx.destination);

      const preset = tonePresets[tone ?? selectedTone];
      preset?.(ctx, masterGain);

      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3);
      window.setTimeout(() => {
        masterGain.disconnect();
      }, 3500);
    },
    [ensureContext, selectedTone],
  );

  const playTickPulse = useCallback(
    async (volume: number) => {
      const ctx = await ensureContext();
      if (!ctx) return;

      if (!tickBufferRef.current) {
        tickBufferRef.current = createTickBuffer(ctx);
      }

      const source = ctx.createBufferSource();
      source.buffer = tickBufferRef.current;
      const gain = ctx.createGain();
      const startTime = ctx.currentTime;

      gain.gain.setValueAtTime(Math.max(0.0001, volume), startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);

      source.connect(gain);
      gain.connect(ctx.destination);

      source.start(startTime);
      source.stop(startTime + 0.3);

      window.setTimeout(() => {
        gain.disconnect();
      }, 400);
    },
    [ensureContext],
  );

  const startTicking = useCallback(
    async (volume: number) => {
      tickVolumeRef.current = volume;
      const ctx = await ensureContext();
      if (!ctx) return false;

      if (tickIntervalRef.current !== null) {
        return true;
      }

      playTickPulse(volume).catch(() => undefined);
      tickIntervalRef.current = window.setInterval(() => {
        const currentVolume = tickVolumeRef.current;
        playTickPulse(currentVolume).catch(() => undefined);
      }, 1000);

      return true;
    },
    [ensureContext, playTickPulse],
  );

  const stopTicking = useCallback(() => {
    if (tickIntervalRef.current !== null) {
      window.clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }
  }, []);

  const setTickLoopVolume = useCallback((value: number) => {
    tickVolumeRef.current = value;
  }, []);

  return {
    isSupported: isAudioSupported(),
    isReady,
    selectedTone,
    setSelectedTone,
    playAlarm,
    prime,
    startTicking,
    stopTicking,
    setTickLoopVolume,
  } as const;
};

export type { AlarmTone };
