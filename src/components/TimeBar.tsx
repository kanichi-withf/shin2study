'use client';

import { useEffect, useState, useRef } from 'react';
import './TimeBar.css';

interface TimeBarProps {
  duration?: number;
  isRunning: boolean;
  onTimeUp: () => void;
}

export default function TimeBar({ duration = 10, isRunning, onTimeUp }: TimeBarProps) {
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Use a ref for onTimeUp to prevent effect from restarting when callback reference changes
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!isRunning) {
      setProgress(100);
      startTimeRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    startTimeRef.current = Date.now();

    const animate = () => {
      if (!startTimeRef.current) return;
      
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      
      setProgress(remaining);
      
      if (remaining <= 0) {
        onTimeUpRef.current();
        return;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, duration]); // Removed onTimeUp from dependencies

  const getBarClass = () => {
    if (progress > 60) return 'time-bar__fill--green';
    if (progress > 30) return 'time-bar__fill--yellow';
    return 'time-bar__fill--red';
  };

  const getRunnerEmoji = () => {
    if (progress > 60) return '🐰'; // Fast rabbit
    if (progress > 30) return '🐥'; // Hurrying chick
    return '🐢'; // Slow turtle trying hard!
  };

  return (
    <div className="time-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
      <div className="time-bar__track">
        <div
          className={`time-bar__fill ${getBarClass()}`}
          style={{ width: `${progress}%` }}
        >
          {/* Cute character runner positioned at the edge of the bar */}
          <span className="time-bar__runner">
            {getRunnerEmoji()}
          </span>
        </div>
      </div>
      <div className="time-bar__icon">
        ⏰
      </div>
    </div>
  );
}
