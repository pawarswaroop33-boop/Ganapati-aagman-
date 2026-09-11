import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  shape: 'marigold' | 'rose' | 'sparkle';
}

interface PetalCanvasProps {
  burstTrigger?: number; // whenever this changes, produce a shower burst!
}

export const PetalCanvas: React.FC<PetalCanvasProps> = ({ burstTrigger }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const colors = {
    marigold: ['#f59e0b', '#fbbf24', '#d97706', '#fef08a'],
    rose: ['#dc2626', '#e11d48', '#b91c1c', '#f43f5e'],
    sparkle: ['#fbbf24', '#fef08a', '#ffffff'],
  };

  const createPetal = (width: number, height: number, isBurst = false): Petal => {
    const types: Array<'marigold' | 'rose' | 'sparkle'> = ['marigold', 'rose', 'rose', 'marigold', 'sparkle'];
    const shape = types[Math.floor(Math.random() * types.length)];
    const colorPalette = colors[shape];
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

    return {
      x: Math.random() * width,
      y: isBurst ? height * 0.5 + (Math.random() - 0.5) * 150 : -20 - Math.random() * 50,
      size: shape === 'sparkle' ? Math.random() * 4 + 2 : Math.random() * 10 + 8,
      speedX: (Math.random() - 0.5) * (isBurst ? 5 : 1.5),
      speedY: isBurst ? (Math.random() - 0.8) * 6 : Math.random() * 1.5 + 0.8,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      color,
      opacity: Math.random() * 0.6 + 0.3,
      shape,
    };
  };

  const triggerBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    // Add 45 burst petals
    for (let i = 0; i < 45; i++) {
      petalsRef.current.push(createPetal(width, height, true));
    }
  };

  useEffect(() => {
    if (burstTrigger && burstTrigger > 0) {
      triggerBurst();
    }
  }, [burstTrigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial ambient petals
    const initialCount = window.innerWidth < 640 ? 20 : 35;
    petalsRef.current = [];
    for (let i = 0; i < initialCount; i++) {
      const p = createPetal(canvas.width, canvas.height);
      p.y = Math.random() * canvas.height;
      petalsRef.current.push(p);
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const petals = petalsRef.current;
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'sparkle') {
          // 4-point star sparkle
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Petal oval shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Reset or remove
        if (p.y > canvas.height + 30) {
          if (petals.length > 35) {
            petals.splice(i, 1);
          } else {
            p.y = -20;
            p.x = Math.random() * canvas.width;
            p.speedY = Math.random() * 1.5 + 0.8;
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
