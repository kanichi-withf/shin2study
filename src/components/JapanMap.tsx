'use client';

import { useEffect, useRef } from 'react';
import './JapanMap.css';

interface JapanMapProps {
  highlightedCode: string | null;
  answeredCodes?: string[];
}



const HIGHLIGHT_COLOR = '#FFD93D'; // Sunny yellow
const ANSWERED_COLOR = '#E2E8F0';  // Soft light gray for answered prefectures
const DEFAULT_FILL = '#FFFFFF';    // White base for cleanliness
const DEFAULT_STROKE = '#C5B5A5';  // Soft warm brown outline
const HIGHLIGHT_STROKE = '#FF9F43';

// Normalize code (remove leading zeros for comparison)
const normalizeCode = (code: string) => String(parseInt(code, 10));

export default function JapanMap({ highlightedCode, answeredCodes = [] }: JapanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgLoadedRef = useRef(false);

  const applyStyles = () => {
    if (!containerRef.current || !svgLoadedRef.current) return;

    const prefectures = containerRef.current.querySelectorAll('.prefecture');
    prefectures.forEach(pref => {
      const code = (pref as HTMLElement).dataset.code;
      if (!code) return;

      const normCode = normalizeCode(code);
      const isHighlighted = highlightedCode && normalizeCode(highlightedCode) === normCode;
      const isAnswered = answeredCodes.some(c => normalizeCode(c) === normCode);

      const shapes = pref.querySelectorAll('path, polygon');
      shapes.forEach(shape => {
        const el = shape as SVGElement;
        if (isHighlighted) {
          el.style.fill = HIGHLIGHT_COLOR;
          el.style.stroke = HIGHLIGHT_STROKE;
          el.style.strokeWidth = '3.5';
          el.style.filter = 'drop-shadow(0 0 8px rgba(255, 159, 67, 0.5))';
          el.classList.add('prefecture-highlighted');
        } else if (isAnswered) {
          el.style.fill = ANSWERED_COLOR;
          el.style.stroke = '#FFF';
          el.style.strokeWidth = '1.5';
          el.style.filter = 'none';
          el.style.opacity = '1';
          el.classList.remove('prefecture-highlighted');
        } else {
          el.style.fill = DEFAULT_FILL;
          el.style.stroke = DEFAULT_STROKE;
          el.style.strokeWidth = '1.5';
          el.style.filter = 'none';
          el.style.opacity = '1';
          el.classList.remove('prefecture-highlighted');
        }
      });
    });
  };

  // Load SVG on mount
  useEffect(() => {
    if (svgLoadedRef.current || !containerRef.current) return;

    fetch('/japan-map.svg')
      .then(res => res.text())
      .then(svgText => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = svgText;
        svgLoadedRef.current = true;

        // Apply theme base styles to the SVG
        const svg = containerRef.current.querySelector('svg');
        if (svg) {
          svg.setAttribute('class', 'japan-map-svg');
          svg.removeAttribute('width');
          svg.removeAttribute('height');
        }

        // Remove boundary lines for cleaner look
        const boundaryGroup = containerRef.current.querySelector('.boundary-line');
        if (boundaryGroup) {
          boundaryGroup.remove();
        }

        // Style all prefecture groups
        const prefectures = containerRef.current.querySelectorAll('.prefecture');
        prefectures.forEach(pref => {
          const shapes = pref.querySelectorAll('path, polygon');
          shapes.forEach(shape => {
            (shape as SVGElement).style.fill = DEFAULT_FILL;
            (shape as SVGElement).style.stroke = DEFAULT_STROKE;
            (shape as SVGElement).style.strokeWidth = '1.5';
            (shape as SVGElement).style.transition = 'fill 0.3s ease, stroke 0.3s ease';
          });
        });

        // Apply highlighting
        applyStyles();
      })
      .catch(err => console.error('Failed to load Japan map SVG:', err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update styles when highlighted or answered changes
  useEffect(() => {
    applyStyles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedCode, answeredCodes]);

  return (
    <div className="japan-map-container" ref={containerRef} role="img" aria-label="日本地図">
      {/* SVG will be injected here */}
      <div className="japan-map-loading">🗾 ちずを よみこみちゅう...</div>
    </div>
  );
}
