import React, { useEffect, useRef } from 'react';

interface FlowerPetal {
  baseX: number;
  y: number;
  size: number;
  speedY: number;
  swayPhase: number;
  swaySpeed: number;
  swayAmp: number;
  rotation: number;
  rotationSpeed: number;
  tiltPhase: number;
  tiltSpeed: number;
  color: string;
  veinColor: string;
  opacity: number;
  isShower: boolean;
  type: 'marigold' | 'rose' | 'jasmine';
}

interface PetalCanvasProps {
  burstTrigger?: number;
}

export const PetalCanvas: React.FC<PetalCanvasProps> = ({ burstTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<FlowerPetal[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Authentic floral palette: Marigold (झेंडू), Rose (गुलाब), and Saffron/Jasmine (शेवंती)
  const petalPalettes = [
    { color: '#f97316', veinColor: 'rgba(234, 88, 12, 0.4)', type: 'marigold' as const }, // Saffron Marigold
    { color: '#fbbf24', veinColor: 'rgba(217, 119, 6, 0.35)', type: 'marigold' as const }, // Golden Marigold
    { color: '#dc2626', veinColor: 'rgba(185, 28, 28, 0.4)', type: 'rose' as const },     // Auspicious Red Rose
    { color: '#e11d48', veinColor: 'rgba(159, 18, 57, 0.35)', type: 'rose' as const },     // Deep Pink Gulab
    { color: '#fef08a', veinColor: 'rgba(202, 138, 4, 0.3)', type: 'jasmine' as const },   // Shevanti Cream
  ];

  const createPetal = (
    width: number,
    height: number,
    isShower = false,
    staggerIndex = 0
  ): FlowerPetal => {
    const palette = petalPalettes[Math.floor(Math.random() * petalPalettes.length)];
    const size = isShower
      ? Math.random() * 5 + 7   // 7px to 12px for shower petals
      : Math.random() * 4 + 6;  // 6px to 10px for ambient petals

    // Shower petals enter from above the viewport in a staggered cascade
    const y = isShower
      ? -20 - (staggerIndex * 14) - Math.random() * 40
      : Math.random() * height;

    const baseX = Math.random() * width;

    return {
      baseX,
      y,
      size,
      speedY: isShower ? Math.random() * 0.9 + 1.6 : Math.random() * 0.8 + 0.9,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.03 + 0.02,
      swayAmp: Math.random() * 22 + 14,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.8,
      tiltPhase: Math.random() * Math.PI * 2,
      tiltSpeed: Math.random() * 0.04 + 0.025,
      color: palette.color,
      veinColor: palette.veinColor,
      opacity: Math.random() * 0.25 + 0.7,
      isShower,
      type: palette.type,
    };
  };

  // Triggers a delicate, non-glitchy, super smooth shower of flower petals
  const triggerFlowerShower = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 28-32 petals provide a rich yet elegant auspicious flower rain
    const count = width < 640 ? 24 : 32;
    for (let i = 0; i < count; i++) {
      petalsRef.current.push(createPetal(width, height, true, i));
    }
  };

  useEffect(() => {
    if (burstTrigger && burstTrigger > 0) {
      triggerFlowerShower();
    }
  }, [burstTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setupCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setupCanvas();
    window.addEventListener('resize', setupCanvas, { passive: true });

    // Calm, serene ambient flower petals (10 on mobile, 16 on desktop)
    const ambientCount = width < 640 ? 10 : 16;
    petalsRef.current = [];
    for (let i = 0; i < ambientCount; i++) {
      petalsRef.current.push(createPetal(width, height, false));
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      // Delta time limiter to ensure 60fps / 120fps buttery smoothness without jumps
      const dt = Math.min((time - lastTime) / 16.66, 1.8);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const petals = petalsRef.current;
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];

        // Update aerodynamic position
        p.swayPhase += p.swaySpeed * dt;
        p.tiltPhase += p.tiltSpeed * dt;
        p.rotation += p.rotationSpeed * dt;
        p.y += p.speedY * dt;
        // Mild subtle horizontal breeze drift
        p.baseX += 0.15 * dt;

        // Calculate smooth non-jittering screen X with natural aerodynamic oscillation
        const curX = p.baseX + Math.sin(p.swayPhase) * p.swayAmp;
        const curTilt = Math.cos(p.tiltPhase); // 3D tumbling flip simulation

        // Skip drawing if completely off-screen above
        if (p.y > -20) {
          ctx.save();
          ctx.translate(curX, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          // Scale Y to simulate 3D petal flipping and rotating in air
          ctx.scale(1, Math.abs(curTilt) > 0.1 ? curTilt : 0.1);
          ctx.globalAlpha = p.opacity;

          // Draw organic curved flower petal silhouette
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.5, p.size * 0.8, p.size * 0.6, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.6, -p.size * 0.75, -p.size * 0.5, 0, -p.size);
          ctx.fill();

          // Subtle organic vein/fold for realistic botanical texture
          ctx.strokeStyle = p.veinColor;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.65);
          ctx.lineTo(0, p.size * 0.7);
          ctx.stroke();

          ctx.restore();
        }

        // Clean recycling / exit logic
        if (p.y > height + 35) {
          if (p.isShower) {
            // Once a shower petal finishes its majestic fall, gracefully remove it
            petals.splice(i, 1);
          } else {
            // Ambient petals recycle from top smoothly
            p.y = -20;
            p.baseX = Math.random() * width;
            p.speedY = Math.random() * 0.8 + 0.9;
            p.swayPhase = Math.random() * Math.PI * 2;
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', setupCanvas);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 will-change-transform select-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
