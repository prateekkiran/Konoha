import { useCallback, useEffect, useRef, useState } from 'react';

type AlarmTone = 'gentleChime' | 'deepFocus' | 'brightPulse';
type AmbientMode = 'waves' | 'clouds' | 'gradient';

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

const createNoiseBuffer = (context: AudioContext) => {
  const durationSeconds = 2.5;
  const sampleRate = context.sampleRate;
  const frameCount = Math.floor(sampleRate * durationSeconds);
  const buffer = context.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }

  return buffer;
};

interface AmbientHandle {
  mode: AmbientMode;
  gain: GainNode;
  sources: (AudioBufferSourceNode | OscillatorNode | AudioNode)[];
}

export const useSoundscape = () => {
  const [selectedTone, setSelectedTone] = useState<AlarmTone>('gentleChime');
  const [isReady, setIsReady] = useState(false);
  const contextRef = useRef<UniversalAudioContext | null>(null);
  const tickIntervalRef = useRef<number | null>(null);
  const tickBufferRef = useRef<AudioBuffer | null>(null);
  const tickVolumeRef = useRef(0.35);
  const ambientRef = useRef<AmbientHandle | null>(null);

  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) {
        window.clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
      if (ambientRef.current) {
        ambientRef.current.sources.forEach((node) => {
          if ('stop' in node && typeof node.stop === 'function') {
            try {
              node.stop();
            } catch (error) {
              // no-op
            }
          }
          node.disconnect?.();
        });
        ambientRef.current.gain.disconnect();
        ambientRef.current = null;
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

  const stopAmbient = useCallback(() => {
    if (!ambientRef.current) return;
    ambientRef.current.sources.forEach((node) => {
      if ('stop' in node && typeof node.stop === 'function') {
        try {
          node.stop();
        } catch (error) {
          // ignore
        }
      }
      node.disconnect?.();
    });
    ambientRef.current.gain.disconnect();
    ambientRef.current = null;
  }, []);

  const startAmbient = useCallback(
    async (mode: AmbientMode, volume: number) => {
      const ctx = await ensureContext();
      if (!ctx) return false;

      const safeVolume = Math.max(0.0001, volume);

      if (ambientRef.current?.mode === mode) {
        ambientRef.current.gain.gain.setTargetAtTime(safeVolume, ctx.currentTime, 0.4);
        return true;
      }

      stopAmbient();

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(safeVolume, ctx.currentTime);
      gain.connect(ctx.destination);
      const sources: (AudioBufferSourceNode | OscillatorNode | AudioNode)[] = [];

      const noiseBuffer = createNoiseBuffer(ctx);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      const chorus = ctx.createDelay();

      if (mode === 'waves') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(420, ctx.currentTime);
        chorus.delayTime.setValueAtTime(0.22, ctx.currentTime);
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.15;
        lfoGain.gain.value = 180;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        sources.push(lfo, lfoGain);
      } else if (mode === 'clouds') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(1.6, ctx.currentTime);
        chorus.delayTime.setValueAtTime(0.12, ctx.currentTime);
      } else {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.Q.setValueAtTime(0.7, ctx.currentTime);
        chorus.delayTime.setValueAtTime(0.18, ctx.currentTime);
        const shimmer = ctx.createOscillator();
        shimmer.type = 'sawtooth';
        shimmer.frequency.setValueAtTime(220, ctx.currentTime);
        const shimmerGain = ctx.createGain();
        shimmerGain.gain.setValueAtTime(0.08, ctx.currentTime);
        shimmer.connect(shimmerGain);
        shimmerGain.connect(gain);
        shimmer.start();
        sources.push(shimmer, shimmerGain);
      }

      const panner = ctx.createStereoPanner();
      const panLfo = ctx.createOscillator();
      panLfo.type = 'sine';
      panLfo.frequency.setValueAtTime(0.05, ctx.currentTime);
      const panGain = ctx.createGain();
      panGain.gain.setValueAtTime(0.85, ctx.currentTime);
      panLfo.connect(panGain);
      panGain.connect(panner.pan);
      panLfo.start();

      noiseSource.connect(filter);
      filter.connect(chorus);
      chorus.connect(panner);
      panner.connect(gain);

      noiseSource.start();

      sources.push(noiseSource, filter, chorus, panner, panLfo, panGain);

      ambientRef.current = {
        mode,
        gain,
        sources,
      };

      return true;
    },
    [ensureContext, stopAmbient],
  );

  const setAmbientVolume = useCallback((value: number) => {
    const ctx = contextRef.current;
    if (!ctx || !ambientRef.current) return;
    ambientRef.current.gain.gain.setTargetAtTime(Math.max(0.0001, value), ctx.currentTime, 0.3);
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
    startAmbient,
    stopAmbient,
    setAmbientVolume,
  } as const;
};

export type { AlarmTone, AmbientMode };
