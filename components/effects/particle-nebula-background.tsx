'use client';

import { useEffect, useState } from 'react';

export function ParticleNebulaBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate deterministic random values based on index
  const getPseudoRandom = (index: number) => {
    const x = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };

  const particles = [...Array(60)].map((_, i) => ({
    id: i,
    left: getPseudoRandom(i) * 100,
    top: getPseudoRandom(i + 100) * 100,
    width: 2 + getPseudoRandom(i + 200) * 4,
    height: 2 + getPseudoRandom(i + 300) * 4,
    animationDelay: getPseudoRandom(i + 400) * 5,
    animationDuration: 3 + getPseudoRandom(i + 500) * 4,
  }));

  // Don't render particles on server - only render gradient background
  if (!isClient) {
    return (
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-white"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-white"></div>
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle-blue"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.width}px`,
              height: `${p.height}px`,
              animationDelay: `${p.animationDelay}s`,
              animationDuration: `${p.animationDuration}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        .particle-blue {
          position: absolute;
          background: rgb(59, 130, 246);
          border-radius: 50%;
          animation: particle-float-blue 4s ease-in-out infinite;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5),
                      0 0 20px rgba(59, 130, 246, 0.3);
        }
        @keyframes particle-float-blue {
          0%, 100% {
            opacity: 0.3;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
