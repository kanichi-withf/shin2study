'use client';

import { useEffect, useRef } from 'react';
import './JapanMapShape.css';

interface JapanMapShapeProps {
  code: string | null;
}

const HIGHLIGHT_FILL = '#FFD93D';
const HIGHLIGHT_STROKE = '#FF9F43';
const SVG_NS = 'http://www.w3.org/2000/svg';

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

function parseMatrix(transform: string): {
  a: number; d: number; e: number; f: number;
} {
  const m = transform.match(
    /matrix\(\s*([-\d.]+)[ ,]+([-\d.]+)[ ,]+([-\d.]+)[ ,]+([-\d.]+)[ ,]+([-\d.]+)[ ,]+([-\d.]+)\s*\)/,
  );
  if (!m) return { a: 1, d: 1, e: 0, f: 0 };
  return {
    a: parseFloat(m[1]),
    d: parseFloat(m[4]),
    e: parseFloat(m[5]),
    f: parseFloat(m[6]),
  };
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

        const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
        const norm = normalizeCode(code);
        const target = Array.from(
          doc.querySelectorAll<SVGGElement>('.prefecture'),
        ).find((g) => normalizeCode(g.dataset.code ?? '') === norm);

        if (!target) {
          container.innerHTML =
            '<div class="japan-shape-loading">けんが みつかりません</div>';
          return;
        }

        const parentTransform =
          doc.querySelector('.svg-map')?.getAttribute('transform') ?? '';
        const { a, d, e, f } = parseMatrix(parentTransform);

        // Build new isolated SVG. Set a placeholder viewBox immediately so the
        // SVG has dimensions on first paint. We refine the viewBox after we
        // can measure the cloned geometry.
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('xmlns', SVG_NS);
        svg.setAttribute('class', 'japan-shape-svg');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('viewBox', '0 0 1000 1000');

        const wrapper = document.createElementNS(SVG_NS, 'g');
        if (parentTransform) wrapper.setAttribute('transform', parentTransform);

        const clone = target.cloneNode(true) as SVGGElement;
        clone.querySelectorAll('path, polygon').forEach((shape) => {
          const el = shape as SVGElement;
          el.style.fill = HIGHLIGHT_FILL;
          el.style.stroke = HIGHLIGHT_STROKE;
          el.style.strokeWidth = '2.5';
        });
        wrapper.appendChild(clone);
        svg.appendChild(wrapper);

        container.innerHTML = '';
        container.appendChild(svg);

        const refineViewBox = () => {
          if (cancelled) return;
          let raw: DOMRect | { x: number; y: number; width: number; height: number };
          try {
            raw = clone.getBBox();
          } catch {
            return;
          }
          if (!raw || !raw.width || !raw.height) return;

          // bbox in path-space → multiply by parent matrix to get SVG-space
          const bx = raw.x * a + e;
          const by = raw.y * d + f;
          const bw = raw.width * a;
          const bh = raw.height * d;
          const pad = Math.max(bw, bh) * 0.08;
          svg.setAttribute(
            'viewBox',
            `${bx - pad} ${by - pad} ${bw + pad * 2} ${bh + pad * 2}`,
          );
        };

        // Try synchronously first (works in most modern browsers). Then also
        // re-try on the next frame in case the synchronous getBBox returned 0
        // because layout hadn't run yet (some older iOS Safari builds).
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
