import { useEffect, useRef } from 'react';

type BackgroundMode = 'waves' | 'clouds' | 'gradient';

interface AnimatedBackgroundProps {
  mode: BackgroundMode;
  active: boolean;
}

const TWO_PI = Math.PI * 2;

const createGradient = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(91, 99, 255, 0.45)');
  gradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.45)');
  gradient.addColorStop(1, 'rgba(234, 179, 8, 0.5)');
  return gradient;
};

const AnimatedBackground = ({ mode, active }: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return () => undefined;

    let animationFrame = 0;
    let frameCount = 0;
    let resizeObserver: ResizeObserver | null = null;

    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    const drawWaves = (time: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const layers = 4;
      const baseAmplitude = height * 0.08;

      for (let layer = 0; layer < layers; layer += 1) {
        const progress = layer / layers;
        const amplitude = baseAmplitude * (1 - progress * 0.35);
        const frequency = 0.8 + layer * 0.35;
        const offset = progress * 120;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);

        for (let x = 0; x <= width; x += 8) {
          const angle = (x / width) * TWO_PI * frequency + time * 0.0012 + offset;
          const y = height / 2 + Math.sin(angle) * amplitude;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(91, 99, 255, ${0.28 - progress * 0.05})`;
        ctx.fill();
      }
    };

    const drawClouds = (time: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const clouds = 6;
      for (let i = 0; i < clouds; i += 1) {
        const base = i / clouds;
        const radius = height * (0.18 + base * 0.12);
        const drift = Math.sin(time * 0.00012 + i) * width * 0.2;
        const x = (width * (base + (time * 0.00005) % 1) + drift) % width;
        const y = height * (0.25 + base * 0.5 + Math.sin(time * 0.0001 + i) * 0.05);

        const radial = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius);
        radial.addColorStop(0, `rgba(255, 255, 255, ${0.18 - base * 0.05})`);
        radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TWO_PI);
        ctx.fill();
      }
    };

    const drawAurora = (time: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const bars = 7;
      const gradient = createGradient(ctx, width, height);

      for (let i = 0; i < bars; i += 1) {
        const progress = i / bars;
        const x = width * progress + Math.sin(time * 0.0004 + progress * 8) * 120;
        const barWidth = width * 0.12 + Math.sin(time * 0.0006 + i) * 20;
        const alpha = 0.38 + Math.sin(time * 0.001 + i) * 0.1;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(width / 2, height / 2);
        ctx.rotate(Math.sin(time * 0.00008 + progress * 5) * 0.1);
        ctx.translate(-width / 2, -height / 2);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height * 0.1, barWidth, height * 0.8);
        ctx.restore();
      }
    };

    const render = (time: number) => {
      if (!active) return;
      frameCount += 1;
      if (mode === 'waves') {
        drawWaves(time + frameCount * 3);
      } else if (mode === 'clouds') {
        drawClouds(time + frameCount * 5);
      } else {
        drawAurora(time + frameCount * 4);
      }
      animationFrame = requestAnimationFrame(render);
      frameRef.current = animationFrame;
    };

    if (active) {
      animationFrame = requestAnimationFrame(render);
      frameRef.current = animationFrame;
    }

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      resizeObserver?.disconnect();
    };
  }, [mode, active]);

  return <canvas ref={canvasRef} className="animated-background" aria-hidden="true" />;
};

export default AnimatedBackground;
