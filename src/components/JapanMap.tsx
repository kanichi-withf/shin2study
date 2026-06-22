'use client';

import { useCallback, useEffect, useRef } from 'react';
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

// Module-scope cache so re-mounts (back/next navigation) hit the in-memory
// copy instead of re-parsing 30 KB of SVG markup every time.
// Reset on failure so a retry can succeed.
let svgTextPromise: Promise<string> | null = null;
function loadSvgText(): Promise<string> {
  if (!svgTextPromise) {
    svgTextPromise = fetch('/japan-map.svg')
      .then(res => {
        if (!res.ok) throw new Error(`japan-map.svg ${res.status}`);
        return res.text();
      })
      .catch(err => {
        svgTextPromise = null; // allow a fresh attempt next mount
        throw err;
      });
  }
  return svgTextPromise;
}

export default function JapanMap({ highlightedCode, answeredCodes = [] }: JapanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgLoadedRef = useRef(false);

  const applyStyles = useCallback(() => {
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
          el.classList.add('prefecture-highlighted');
        } else if (isAnswered) {
          el.style.fill = ANSWERED_COLOR;
          el.style.stroke = '#FFF';
          el.style.strokeWidth = '1.5';
          el.style.opacity = '1';
          el.classList.remove('prefecture-highlighted');
        } else {
          el.style.fill = DEFAULT_FILL;
          el.style.stroke = DEFAULT_STROKE;
          el.style.strokeWidth = '1.5';
          el.style.opacity = '1';
          el.classList.remove('prefecture-highlighted');
        }
      });
    });
  }, [highlightedCode, answeredCodes]);

  // applyStyles changes on every prop tick, but the mount effect only wants
  // the latest function — keep it behind a ref so the mount effect can stay
  // dependency-free.
  const applyStylesRef = useRef(applyStyles);
  useEffect(() => {
    applyStylesRef.current = applyStyles;
  }, [applyStyles]);

  // Load SVG on mount
  useEffect(() => {
    if (svgLoadedRef.current || !containerRef.current) return;

    loadSvgText()
      .then(svgText => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = svgText;
        svgLoadedRef.current = true;

        const svg = containerRef.current.querySelector('svg');
        if (svg) {
          svg.setAttribute('class', 'japan-map-svg');
          svg.removeAttribute('width');
          svg.removeAttribute('height');
        }

        const boundaryGroup = containerRef.current.querySelector('.boundary-line');
        if (boundaryGroup) {
          boundaryGroup.remove();
        }

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

        applyStylesRef.current();
      })
      .catch(err => console.error('Failed to load Japan map SVG:', err));
  }, []);

  // Update styles when highlighted or answered changes
  useEffect(() => {
    applyStyles();
  }, [applyStyles]);

  return (
    <div className="japan-map-container" ref={containerRef} role="img" aria-label="日本地図">
      {/* SVG will be injected here */}
      <div className="japan-map-loading">🗾 ちずを よみこみちゅう...</div>
    </div>
  );
}
