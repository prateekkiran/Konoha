import { memo } from 'react';
import { clsx } from 'clsx';
import AnimatedBackground from './AnimatedBackground';

const RADIUS = 140;
const STROKE = 10;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type DisplayMode = 'ring' | 'bar';
type BackgroundMode = 'waves' | 'clouds' | 'gradient';

interface TimerDisplayProps {
  timeLabel: string;
  phaseLabel: string;
  hint?: string;
  progress: number;
  displayMode: DisplayMode;
  backgroundMode: BackgroundMode;
  focusCounter: {
    completed: number;
    target: number;
  };
}

const backgroundLabels: Record<BackgroundMode, string> = {
  waves: 'Gentle resonance waves',
  clouds: 'Lo-fi cloudscape drift',
  gradient: 'Chromatic aurora stream',
};

const TimerDisplay = memo(function TimerDisplay({
  timeLabel,
  phaseLabel,
  hint,
  progress,
  displayMode,
  backgroundMode,
  focusCounter,
}: TimerDisplayProps) {
  const clampedProgress = Math.min(0.999, Math.max(0, progress));
  const dashOffset = CIRCUMFERENCE * (1 - clampedProgress);

  return (
    <section className="timer-display" aria-label="Timer overview">
      <div className="background-preview">
        <AnimatedBackground mode={backgroundMode} active />
      </div>

      <div
        className="timer-main"
        aria-live="polite"
        aria-atomic="true"
        role="group"
        aria-describedby="timer-phase"
      >
        {displayMode === 'ring' ? (
          <div
            className="progress-ring"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(clampedProgress * 100)}
          >
            <svg width={(RADIUS + STROKE) * 2} height={(RADIUS + STROKE) * 2}>
              <circle
                className="progress-ring__bg"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={STROKE}
                fill="transparent"
                r={RADIUS}
                cx={RADIUS + STROKE}
                cy={RADIUS + STROKE}
              />
              <circle
                className="progress-ring__value"
                stroke="var(--accent)"
                strokeWidth={STROKE}
                strokeLinecap="round"
                fill="transparent"
                r={RADIUS}
                cx={RADIUS + STROKE}
                cy={RADIUS + STROKE}
                style={{
                  strokeDasharray: `${CIRCUMFERENCE} ${CIRCUMFERENCE}`,
                  strokeDashoffset: dashOffset,
                  transition: 'stroke-dashoffset 0.3s ease, stroke 0.4s ease',
                }}
              />
            </svg>
            <div className="timer-value">
              <span className="timer-value__label">{timeLabel}</span>
            </div>
          </div>
        ) : (
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(clampedProgress * 100)}
          >
            <div className="progress-bar__value" style={{ width: `${clampedProgress * 100}%` }} />
            <div className="timer-value">
              <span className="timer-value__label">{timeLabel}</span>
            </div>
          </div>
        )}
        <p id="timer-phase" className="timer-phase">
          {phaseLabel}
        </p>
        {hint ? (
          <p className="help-text" aria-live="polite">
            {hint}
          </p>
        ) : null}
      </div>

      <footer className="timer-meta" aria-label="Focus session progress">
        <span className="badge" aria-live="polite">
          <span aria-hidden>•</span> Focus cycle {focusCounter.completed} of {focusCounter.target}
        </span>
        <span className="muted">{backgroundLabels[backgroundMode]}</span>
      </footer>
    </section>
  );
});

export default TimerDisplay;
