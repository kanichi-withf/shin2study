'use client';

import { useEffect, useRef, useCallback } from 'react';
import './JapanMap.css';

interface JapanMapProps {
  highlightedCode: string | null;
  answeredCodes?: string[];
}

// Map data-code to region for coloring answered prefectures
const CODE_TO_REGION: Record<string, string> = {
  '1': 'hokkaido', '2': 'tohoku', '3': 'tohoku', '4': 'tohoku',
  '5': 'tohoku', '6': 'tohoku', '7': 'tohoku',
  '8': 'kanto', '9': 'kanto', '10': 'kanto', '11': 'kanto',
  '12': 'kanto', '13': 'kanto', '14': 'kanto',
  '15': 'chubu', '16': 'chubu', '17': 'chubu', '18': 'chubu',
  '19': 'chubu', '20': 'chubu', '21': 'chubu', '22': 'chubu', '23': 'chubu',
  '24': 'kinki', '25': 'kinki', '26': 'kinki', '27': 'kinki',
  '28': 'kinki', '29': 'kinki', '30': 'kinki',
  '31': 'chugoku', '32': 'chugoku', '33': 'chugoku', '34': 'chugoku', '35': 'chugoku',
  '36': 'shikoku', '37': 'shikoku', '38': 'shikoku', '39': 'shikoku',
  '40': 'kyushu', '41': 'kyushu', '42': 'kyushu', '43': 'kyushu',
  '44': 'kyushu', '45': 'kyushu', '46': 'kyushu', '47': 'kyushu',
};

const REGION_COLORS: Record<string, string> = {
  hokkaido: '#85B5FF', // Sky blue
  tohoku: '#A59BFF',   // Lavender
  kanto: '#6BCB77',    // Apple green
  chubu: '#FFEAA7',    // Banana yellow
  kinki: '#FF85A1',    // Bubblegum pink
  chugoku: '#FF9F43',  // Peach orange
  shikoku: '#81ECEC',  // Mint/Aqua
  kyushu: '#FAB1A0',   // Soft coral
};

const HIGHLIGHT_COLOR = '#FFD93D'; // Sunny yellow
const DEFAULT_FILL = '#FFFFFF';    // White base for cleanliness
const DEFAULT_STROKE = '#C5B5A5';  // Soft warm brown outline
const HIGHLIGHT_STROKE = '#FF9F43';

export default function JapanMap({ highlightedCode, answeredCodes = [] }: JapanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgLoadedRef = useRef(false);

  // Normalize code (remove leading zeros for comparison)
  const normalizeCode = useCallback((code: string) => String(parseInt(code, 10)), []);

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
          el.style.filter = 'drop-shadow(0 0 8px rgba(255, 159, 67, 0.5))';
          el.classList.add('prefecture-highlighted');
        } else if (isAnswered) {
          const region = CODE_TO_REGION[normCode] || 'kanto';
          el.style.fill = REGION_COLORS[region];
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
  }, [highlightedCode, answeredCodes, normalizeCode]);

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
