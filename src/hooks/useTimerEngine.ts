import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';

interface TimerEngineOptions {
  onPhaseComplete?: (phase: 'focus' | 'shortBreak' | 'longBreak') => void;
}

const getTickInterval = (remaining: number) => {
  if (remaining > 5 * 60_000) return 1_000;
  if (remaining > 60_000) return 500;
  if (remaining > 10_000) return 250;
  return 100;
};

export const useTimerEngine = (options: TimerEngineOptions = {}) => {
  const status = useTimerStore((state) => state.status);
  const targetEnd = useTimerStore((state) => state.targetEnd);
  const phase = useTimerStore((state) => state.phase);
  const remainingMs = useTimerStore((state) => state.remainingMs);
  const setRemaining = useTimerStore((state) => state.setRemaining);
  const completePhase = useTimerStore((state) => state.completePhase);

  const { onPhaseComplete } = options;
  const completionHandled = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (status !== 'running' || !targetEnd) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    completionHandled.current = false;

    const step = () => {
      const remaining = targetEnd - Date.now();

      if (remaining <= 0) {
        if (!completionHandled.current) {
          completionHandled.current = true;
          setRemaining(0);
          onPhaseComplete?.(phase);
          completePhase();
        }
        return;
      }

      setRemaining(remaining);
      const interval = getTickInterval(remaining);
      timeoutRef.current = window.setTimeout(step, interval);
    };

    step();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [status, targetEnd, phase, completePhase, setRemaining, onPhaseComplete]);

  return { remainingMs, phase };
};
