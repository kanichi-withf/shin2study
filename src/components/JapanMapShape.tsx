'use client';

import { useEffect, useRef } from 'react';
import './JapanMapShape.css';

interface JapanMapShapeProps {
  code: string | null;
}

const HIGHLIGHT_FILL = '#FFD93D';
const HIGHLIGHT_STROKE = '#FF9F43';

const normalizeCode = (c: string) => String(parseInt(c, 10));

let svgTextPromise: Promise<string> | null = null;
function loadSvgText(): Promise<string> {
  if (!svgTextPromise) {
    svgTextPromise = fetch('/japan-map.svg')
      .then((res) => {
        if (!res.ok) throw new Error(`japan-map.svg ${res.status}`);
        return res.text();
      })
      .catch((err) => {
        svgTextPromise = null;
        throw err;
      });
  }
  return svgTextPromise;
}

export default function JapanMapShape({ code }: JapanMapShapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code || !containerRef.current) return;
    const container = containerRef.current;
    let cancelled = false;

    loadSvgText()
      .then((svgText) => {
        if (cancelled || !container) return;

        // Inject the whole map via innerHTML — same proven approach as
        // <JapanMap />. Then hide every prefecture except the target so only
        // the chosen shape shows, and zoom the viewBox onto it.
        container.innerHTML = svgText;
        const svg = container.querySelector('svg');
        if (!svg) return;

        svg.setAttribute('class', 'japan-shape-svg');
        svg.removeAttribute('width');
        svg.removeAttribute('height');

        const boundary = container.querySelector('.boundary-line');
        if (boundary) boundary.remove();

        const norm = normalizeCode(code);
        let target: SVGGElement | null = null;
        const prefs = container.querySelectorAll<SVGGElement>('.prefecture');
        prefs.forEach((g) => {
          const c = g.dataset.code;
          if (!c) return;
          if (normalizeCode(c) === norm) {
            target = g;
            g.querySelectorAll<SVGElement>('path, polygon').forEach((el) => {
              el.style.fill = HIGHLIGHT_FILL;
              el.style.stroke = HIGHLIGHT_STROKE;
              el.style.strokeWidth = '2.5';
            });
          } else {
            g.style.display = 'none';
          }
        });
        if (!target) return;

        const refineViewBox = () => {
          if (cancelled || !target || !svg) return;
          let bbox: SVGRect;
          try {
            bbox = (target as SVGGElement).getBBox();
          } catch {
            return;
          }
          if (!bbox.width || !bbox.height) return;
          const ctm = (target as SVGGElement).getCTM();
          if (!ctm) return;

          // Map all four corners of the bbox through the CTM so any nested
          // ancestor transforms (the SVG has scale + translate on multiple
          // parent <g>) are accounted for.
          const pts = [
            { x: bbox.x, y: bbox.y },
            { x: bbox.x + bbox.width, y: bbox.y },
            { x: bbox.x, y: bbox.y + bbox.height },
            { x: bbox.x + bbox.width, y: bbox.y + bbox.height },
          ];
          const mapped = pts.map((p) => ({
            x: ctm.a * p.x + ctm.c * p.y + ctm.e,
            y: ctm.b * p.x + ctm.d * p.y + ctm.f,
          }));
          const xs = mapped.map((p) => p.x);
          const ys = mapped.map((p) => p.y);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);
          const w = maxX - minX;
          const h = maxY - minY;
          if (w === 0 || h === 0) return;
          const pad = Math.max(w, h) * 0.1;
          svg.setAttribute(
            'viewBox',
            `${minX - pad} ${minY - pad} ${w + pad * 2} ${h + pad * 2}`,
          );
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        };

        // Run synchronously where possible; rAF as a fallback for browsers
        // that need a layout tick before getBBox / getCTM are populated.
        refineViewBox();
        requestAnimationFrame(refineViewBox);
      })
      .catch((err) => {
        console.error('Failed to load Japan map SVG:', err);
        if (!cancelled && container) {
          container.innerHTML =
            '<div class="japan-shape-loading">よみこみエラー</div>';
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div
      className="japan-shape-container"
      ref={containerRef}
      role="img"
      aria-label="けんのかたち"
    >
      <div className="japan-shape-loading">🗾 かたちを よみこみちゅう...</div>
    </div>
  );
}
