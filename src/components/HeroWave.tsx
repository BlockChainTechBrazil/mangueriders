// Componente para o efeito de onda no Hero
import React, { useRef, useEffect } from 'react';

const HeroWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = 300;
    canvas.width = width;
    canvas.height = height;
    let mouseX = width / 2;
    let animationId: number;

    const drawWave = () => {
      ctx!.clearRect(0, 0, width, height);
      ctx!.beginPath();
      for (let x = 0; x < width; x += 2) {
        const y = 60 * Math.sin((x + mouseX) * 0.01) + 120 + 10 * Math.sin((x + mouseX) * 0.05);
        ctx!.lineTo(x, y);
      }
      ctx!.strokeStyle = 'rgba(0,255,255,0.3)';
      ctx!.lineWidth = 3;
      ctx!.stroke();
    };

    const animate = () => {
      drawWave();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute left-0 top-0 w-full h-[300px] pointer-events-none z-0" />
  );
};

export default HeroWave;
