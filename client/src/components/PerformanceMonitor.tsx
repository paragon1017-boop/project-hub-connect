import React, { useState, useEffect, useRef } from 'react';

interface PerformanceStats {
  fps: number;
  memoryUsage?: number;
  renderTime: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function PerformanceMonitor({ enabled = process.env.NODE_ENV === 'development', position = 'top-left' }: PerformanceMonitorProps) {
  const [stats, setStats] = useState<PerformanceStats>({ fps: 0, renderTime: 0 });
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const renderStartTime = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    const measurePerformance = () => {
      const now = performance.now();
      const frameRenderTime = now - renderStartTime.current;
      
      frameCount.current++;
      
      // Update FPS every 500ms for more responsive display
      if (now - lastTime.current >= 500) {
        const fps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
        
        // Get memory usage if available
        let memoryUsage = undefined;
        if ('memory' in performance) {
          memoryUsage = Math.round((performance as any).memory.usedJSHeapSize / 1048576); // MB
        }
        
        setStats({ 
          fps, 
          memoryUsage,
          renderTime: Math.round(frameRenderTime * 100) / 100 
        });
        
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      renderStartTime.current = now;
      requestAnimationFrame(measurePerformance);
    };

    const animationId = requestAnimationFrame(measurePerformance);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [enabled]);

  if (!enabled) return null;

  const positionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2', 
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2'
  };

  // Color coding for performance
  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-400';
    if (fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRenderTimeColor = (time: number) => {
    if (time <= 16) return 'text-green-400'; // 16ms = 60fps
    if (time <= 33) return 'text-yellow-400'; // 33ms = 30fps
    return 'text-red-400';
  };

  return (
    <div className={`fixed z-50 font-mono text-xs bg-black/80 text-white p-2 rounded ${positionClasses[position]}`}>
      <div className={getFPSColor(stats.fps)}>
        FPS: {stats.fps}
      </div>
      <div className={getRenderTimeColor(stats.renderTime)}>
        Render: {stats.renderTime}ms
      </div>
      {stats.memoryUsage && (
        <div className="text-blue-400">
          Memory: {stats.memoryUsage}MB
        </div>
      )}
    </div>
  );
}

export default PerformanceMonitor;