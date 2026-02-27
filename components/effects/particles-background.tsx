'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  pulsePhase: number;
}

interface DataFlow {
  particleIndex: number;
  progress: number;
  speed: number;
}

export function ParticlesBackground() {
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const dataFlowsRef = useRef<DataFlow[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Neon colors - Super Enhanced
    const colors = [
      {
        main: 'rgba(59, 130, 246, 0.9)',   // Electric Blue
        glow: 'rgba(59, 130, 246, 0.6)'
      },
      {
        main: 'rgba(168, 85, 247, 0.9)',   // Electric Purple
        glow: 'rgba(168, 85, 247, 0.6)'
      },
      {
        main: 'rgba(34, 197, 94, 0.8)',    // Neon Green
        glow: 'rgba(34, 197, 94, 0.5)'
      },
      {
        main: 'rgba(236, 72, 153, 0.8)',   // Pink Purple
        glow: 'rgba(236, 72, 153, 0.5)'
      },
      {
        main: 'rgba(6, 182, 212, 0.8)',    // Cyan
        glow: 'rgba(6, 182, 212, 0.5)'
      }
    ];

    // Create particles
    const getParticleCount = () => {
      if (window.innerWidth < 768) return 30;
      if (window.innerWidth < 1024) return 45;
      return 60;
    };

    const createParticles = () => {
      const count = getParticleCount();
      const particles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const colorSet = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 3 + 4, // 4-7px
          color: colorSet.main,
          glowColor: colorSet.glow,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }

      return particles;
    };

    particlesRef.current = createParticles();

    // Create data flows (points moving along connections)
    const createDataFlows = () => {
      const flows: DataFlow[] = [];
      const flowCount = 15;

      for (let i = 0; i < flowCount; i++) {
        flows.push({
          particleIndex: Math.floor(Math.random() * particlesRef.current.length),
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.01
        });
      }

      return flows;
    };

    dataFlowsRef.current = createDataFlows();

    // Animation loop
    const animate = (time: number) => {
      if (!ctx || !canvas) return;

      // Dark background - Updated to #0A0E17
      ctx.fillStyle = '#0A0E17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient background - Updated to #0A0E17
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0A0E17');
      gradient.addColorStop(0.3, '#0A0E17');
      gradient.addColorStop(0.7, '#0A0E17');
      gradient.addColorStop(1, '#0A0E17');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // REMOVED: center pulse, particles, connections, data flows

      animationFrameRef.current = requestAnimationFrame((t) => animate(t));
    };

    animationFrameRef.current = requestAnimationFrame((t) => animate(t));

    // Handle resize
    const handleResize = () => {
      setSize();
      particlesRef.current = createParticles();
      dataFlowsRef.current = createDataFlows();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="absolute inset-0 -z-10 bg-[#0A0E17]" />
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10 w-full h-full"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-[#0A0E17]" />
    </>
  );
}
