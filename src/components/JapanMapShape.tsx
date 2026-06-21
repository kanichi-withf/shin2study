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

// Module-level cache so we only fetch the SVG once across mounts / route changes.
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

        const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
        const target = (() => {
          const norm = normalizeCode(code);
          const all = Array.from(doc.querySelectorAll<SVGGElement>('.prefecture'));
          return (
            all.find((g) => normalizeCode(g.dataset.code ?? '') === norm) ?? null
          );
        })();
        if (!target) {
          container.innerHTML =
            '<div class="japan-shape-loading">けんが みつかりません</div>';
          return;
        }

        const parentTransform =
          doc.querySelector('.svg-map')?.getAttribute('transform') ?? '';

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', 'japan-shape-svg');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('xmlns', SVG_NS);

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

        // Use getBoundingClientRect on the clone (after the parent transform has
        // been applied by the renderer) so the bounding box reflects the actual
        // on-screen geometry. Convert that into the SVG's user units by reading
        // the SVG element's own client rect as the reference. This avoids the
        // common pitfall where getBBox reports pre-transform numbers.
        requestAnimationFrame(() => {
          if (cancelled) return;
          // Initial big viewBox so the geometry is realized; we will refine.
          svg.setAttribute('viewBox', '0 0 1000 1000');

          let bbox: { x: number; y: number; width: number; height: number };
          try {
            // getBBox on the wrapper returns geometry with its own transform
            // applied? No — getBBox is local. But the wrapper has the same
            // transform as the original, so taking the BBox of the clone
            // (which is INSIDE the wrapper) gives un-transformed coords, and
            // we then multiply by the transform manually.
            const raw = (clone as SVGGElement).getBBox();
            // Apply the wrapper transform: parse its scale + translate so we
            // can map raw bbox into transformed space. parentTransform from
            // the source SVG is `matrix(a, 0, 0, d, e, f)`.
            const m = parentTransform.match(
              /matrix\(\s*([-\d.]+)[ ,]+([-\d.]+)[ ,]+([-\d.]+)[ ,]+([-\d.]+)[ ,]+([-\d.]+)[ ,]+([-\d.]+)\s*\)/,
            );
            const a = m ? parseFloat(m[1]) : 1;
            const d = m ? parseFloat(m[4]) : 1;
            const e = m ? parseFloat(m[5]) : 0;
            const f = m ? parseFloat(m[6]) : 0;
            bbox = {
              x: raw.x * a + e,
              y: raw.y * d + f,
              width: raw.width * a,
              height: raw.height * d,
            };
          } catch {
            bbox = { x: 0, y: 0, width: 1000, height: 1000 };
          }

          const pad = Math.max(bbox.width, bbox.height) * 0.08;
          const vx = bbox.x - pad;
          const vy = bbox.y - pad;
          const vw = bbox.width + pad * 2;
          const vh = bbox.height + pad * 2;
          svg.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`);
        });
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
