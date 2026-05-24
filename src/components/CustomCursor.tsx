import React, { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
}

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdCounter = useRef(0);
  const lastEmitTime = useRef(0);

  useEffect(() => {
    // Check if device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Throttle particle emission for performance
      const now = Date.now();
      if (now - lastEmitTime.current > 60) {
        lastEmitTime.current = now;
        
        // Add a trail particle
        const newParticle: Particle = {
          id: particleIdCounter.current++,
          x: e.clientX,
          y: e.clientY,
          rotation: Math.random() * 360,
          size: Math.random() * 8 + 6
        };

        setParticles(prev => [...prev.slice(-15), newParticle]); // limit particles in state to max 15
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Remove particles after animation finishes (500ms)
  useEffect(() => {
    if (particles.length === 0) return;
    
    const timer = setTimeout(() => {
      setParticles(prev => prev.slice(1));
    }, 600);

    return () => clearTimeout(timer);
  }, [particles]);

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return null;

  return (
    <>
      {/* Primary custom cursor pointer */}
      <div
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] hidden lg:block rounded-full border border-primary transition-all duration-100 ease-out ${
          isHovering 
            ? 'w-10 h-10 bg-secondary/20 border-accent scale-110' 
            : 'w-6 h-6 bg-transparent border-primary/50'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      />
      <div
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[9999] hidden lg:block rounded-full bg-primary transition-transform duration-75 ${
          isHovering ? 'scale-0' : 'w-1.5 h-1.5'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      />

      {/* Leaf Trail Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-[9998] opacity-60 transition-all duration-500 ease-out"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`
          }}
        >
          {/* SVG representation of a tiny green leaf */}
          <svg
            viewBox="0 0 24 36"
            className="w-full h-full fill-secondary text-primary animate-pulse-slow"
          >
            <path d="M12 0 C20 12, 24 24, 12 36 C0 24, 4 12, 12 0 Z" />
          </svg>
        </div>
      ))}
    </>
  );
};
