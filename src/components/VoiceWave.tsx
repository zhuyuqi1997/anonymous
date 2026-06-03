import { useEffect, useRef } from 'react';

interface VoiceWaveProps {
  isSpeaking: boolean;
  color?: string;
  barCount?: number;
  className?: string;
}

export default function VoiceWave({ isSpeaking, color = '#8b5cf6', barCount = 5, className = '' }: VoiceWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const barsRef = useRef<number[]>(Array(barCount).fill(0.2));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / (barCount * 2 - 1);
      const maxHeight = height * 0.8;

      barsRef.current = barsRef.current.map((bar) => {
        const target = isSpeaking ? 0.3 + Math.random() * 0.7 : 0.15;
        return bar + (target - bar) * 0.15;
      });

      barsRef.current.forEach((bar, i) => {
        const barHeight = bar * maxHeight;
        const x = i * barWidth * 2;
        const y = (height - barHeight) / 2;

        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6 + bar * 0.4;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, barWidth / 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isSpeaking, color, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={60}
      height={40}
      className={`${className}`}
    />
  );
}
