'use client';

import { useEffect, useRef } from 'react';

export function HeroBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    };
    setSize();

    // Particles
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

    const colors = [
      { main: 'rgba(59, 130, 246, 0.9)', glow: 'rgba(59, 130, 246, 0.6)' },
      { main: 'rgba(168, 85, 247, 0.9)', glow: 'rgba(168, 85, 247, 0.6)' },
      { main: 'rgba(34, 197, 94, 0.8)', glow: 'rgba(34, 197, 94, 0.5)' },
      { main: 'rgba(236, 72, 153, 0.8)', glow: 'rgba(236, 72, 153, 0.5)' },
      { main: 'rgba(6, 182, 212, 0.8)', glow: 'rgba(6, 182, 212, 0.5)' }
    ];

    const createParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        const colorSet = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 3 + 3,
          color: colorSet.main,
          glowColor: colorSet.glow,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
      return particles;
    };

    const particles = createParticles();
    const connectionDistance = 180;

    // Animation loop
    let animationId: number;
    const animate = (time: number) => {
      if (!ctx || !canvas) return;

      // Clear and draw gradient background
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0a0a1a');
      gradient.addColorStop(0.3, '#1a1a3a');
      gradient.addColorStop(0.7, '#0f0f2a');
      gradient.addColorStop(1, '#0a0a1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw center pulse
      const pulseRadius = 100 + Math.sin(time * 0.002) * 50;
      const pulseOpacity = 0.3 + Math.sin(time * 0.002) * 0.2;

      const pulseGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
      const opacityStr = pulseOpacity.toString();
      const halfOpacityStr = (pulseOpacity * 0.5).toString();
      pulseGradient.addColorStop(0, 'rgba(59, 130, 246, ' + opacityStr + ')');
      pulseGradient.addColorStop(0.5, 'rgba(59, 130, 246, ' + halfOpacityStr + ')');
      pulseGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = pulseGradient;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
      ctx.shadowBlur = 30;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;

      // Update and draw particles with connections
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulsePhase += 0.05;

        // Wrap around
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;

        const pulseScale = 1 + Math.sin(particle.pulsePhase) * 0.3;
        const currentRadius = particle.radius * pulseScale;

        // Draw particle glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentRadius * 4
        );
        glowGradient.addColorStop(0, particle.glowColor);
        glowGradient.addColorStop(0.5, particle.glowColor.replace('0.6', '0.3'));
        glowGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentRadius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentRadius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 1;

            // Outer glow
            const outerOpacity = (opacity * 0.7).toFixed(3);
            ctx.strokeStyle = 'rgba(59, 130, 246, ' + outerOpacity + ')';
            ctx.lineWidth = 12;
            ctx.shadowColor = 'rgba(59, 130, 246, 1)';
            ctx.shadowBlur = 30;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Middle layer
            const middleOpacity = (opacity * 0.85).toFixed(3);
            ctx.strokeStyle = 'rgba(168, 85, 247, ' + middleOpacity + ')';
            ctx.lineWidth = 6;
            ctx.shadowColor = 'rgba(168, 85, 247, 1)';
            ctx.shadowBlur = 25;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Core bright line
            const coreOpacity = opacity.toFixed(3);
            ctx.strokeStyle = 'rgba(255, 255, 255, ' + coreOpacity + ')';
            ctx.lineWidth = 3;
            ctx.shadowColor = 'rgba(255, 255, 255, 1)';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Draw some data flow points
      const dataFlowCount = 10;
      for (let i = 0; i < dataFlowCount; i++) {
        const t = (time * 0.001 + i * 0.1) % 1;
        const p1Index = Math.floor(t * particles.length) % particles.length;
        const p2Index = (p1Index + 1) % particles.length;
        const p1 = particles[p1Index];
        const p2 = particles[p2Index];

        const x = p1.x + (p2.x - p1.x) * t;
        const y = p1.y + (p2.y - p1.y) * t;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowColor = 'rgba(255, 255, 255, 1)';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame((t) => animate(t));
    };

    animationId = requestAnimationFrame((t) => animate(t));

    const handleResize = () => {
      setSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
