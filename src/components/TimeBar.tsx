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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use a ref for onTimeUp to prevent effect from restarting when callback reference changes
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!isRunning) {
      startTimeRef.current = null;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now();

    // Update progress every 100ms (0.1s) to align with CSS transition
    const updateInterval = 100;

    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      
      setProgress(remaining);
      
      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        onTimeUpRef.current();
      }
    }, updateInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, duration]); // Removed onTimeUp from dependencies

  const displayProgress = isRunning ? progress : 100;

  const getBarClass = () => {
    if (displayProgress > 60) return 'time-bar__fill--green';
    if (displayProgress > 30) return 'time-bar__fill--yellow';
    return 'time-bar__fill--red';
  };

  const getRunnerEmoji = () => {
    if (displayProgress > 60) return '🐰'; // Fast rabbit
    if (displayProgress > 30) return '🐥'; // Hurrying chick
    return '🐢'; // Slow turtle trying hard!
  };

  return (
    <div className="time-bar" role="progressbar" aria-valuenow={Math.round(displayProgress)} aria-valuemin={0} aria-valuemax={100}>
      <div className="time-bar__track">
        <div
          className={`time-bar__fill ${getBarClass()}`}
          style={{ width: `${displayProgress}%` }}
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
