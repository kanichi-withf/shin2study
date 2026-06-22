'use client';

import { useEffect, useRef } from 'react';
import { PREFECTURES } from '@/data/japan-map-data';
import './JapanMapShape.css';

interface JapanMapShapeProps {
  code: string | null;
}

const HIGHLIGHT_FILL = '#FFD93D';
const HIGHLIGHT_STROKE = '#FF9F43';
const HIGHLIGHT_STROKE_WIDTH = '2.5';

// PA4KEV's SVG labels prefectures by inkscape:label using lowercase romaji,
// matching PREFECTURES.romaji except for Niigata which is spelled 'nigata'.
const LABEL_OVERRIDES: Record<string, string> = {
  Niigata: 'nigata',
};

function romajiToLabel(romaji: string): string {
  return (LABEL_OVERRIDES[romaji] ?? romaji).toLowerCase();
}

const normalizeCode = (c: string) => String(parseInt(c, 10));

let svgTextPromise: Promise<string> | null = null;
function loadSvgText(): Promise<string> {
  if (!svgTextPromise) {
    svgTextPromise = fetch('/japan-prefectures-detailed.svg')
      .then((res) => {
        if (!res.ok) throw new Error(`japan-prefectures-detailed.svg ${res.status}`);
        return res.text();
      })
      .catch((err) => {
        svgTextPromise = null;
        throw err;
      });
  }
  return svgTextPromise;
}

function findTargetGroup(svg: SVGSVGElement, label: string): SVGGElement | null {
  // Inkscape uses an XML namespace attribute that querySelector can't match
  // directly. Iterate <g> elements and check the namespaced attribute.
  const groups = svg.querySelectorAll('g');
  for (const g of Array.from(groups)) {
    const attr =
      g.getAttribute('inkscape:label') ?? g.getAttributeNS(null, 'inkscape:label');
    if (!attr) continue;
    if (attr.toLowerCase() === label) return g as SVGGElement;
  }
  return null;
}

/**
 * Hide every element in the SVG that is not on the path from the SVG root to
 * the target (i.e. not an ancestor of the target) and not a descendant of the
 * target. This isolates the target's shape without depending on knowledge of
 * the SVG's specific grouping (regions, layers, islands, etc.).
 */
function showOnlyTarget(svg: SVGSVGElement, target: SVGGElement) {
  const chain = new Set<Element>();
  let cur: Element | null = target;
  while (cur && cur !== svg) {
    chain.add(cur);
    cur = cur.parentElement;
  }
  chain.add(svg);
  for (const ancestor of chain) {
    if (ancestor === target) continue;
    for (const child of Array.from(ancestor.children)) {
      if (!chain.has(child)) {
        (child as HTMLElement).style.display = 'none';
      }
    }
  }
}

function styleHighlight(target: SVGGElement) {
  target.querySelectorAll<SVGElement>('path, polygon, polyline').forEach((el) => {
    el.style.fill = HIGHLIGHT_FILL;
    el.style.stroke = HIGHLIGHT_STROKE;
    el.style.strokeWidth = HIGHLIGHT_STROKE_WIDTH;
    // Original SVG uses fill:none on top-level paths; force the fill to win.
    el.removeAttribute('fill');
  });
}

/**
 * Compute the target's bounding box in the SVG's user coordinate space using
 * getBoundingClientRect. This avoids all the cross-browser quirks of getBBox
 * and getCTM on heavily-nested transformed groups — the client rect is just
 * pixel geometry, and we convert via the SVG's own viewBox-to-pixel ratio.
 *
 * Returns null if either rect has zero size (e.g. SVG not yet laid out).
 */
function computeViewportBBox(
  svg: SVGSVGElement,
  target: SVGGElement,
): { x: number; y: number; w: number; h: number } | null {
  const svgRect = svg.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();
  if (!svgRect.width || !svgRect.height || !tRect.width || !tRect.height) return null;

  const vb = svg.getAttribute('viewBox')?.split(/[\s,]+/).map(Number);
  if (!vb || vb.length < 4 || vb.some((n) => !Number.isFinite(n))) return null;
  const [vx, vy, vw, vh] = vb;
  const scaleX = svgRect.width / vw;
  const scaleY = svgRect.height / vh;
  if (!scaleX || !scaleY) return null;

  return {
    x: vx + (tRect.left - svgRect.left) / scaleX,
    y: vy + (tRect.top - svgRect.top) / scaleY,
    w: tRect.width / scaleX,
    h: tRect.height / scaleY,
  };
}

export default function JapanMapShape({ code }: JapanMapShapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code || !containerRef.current) return;
    const container = containerRef.current;
    let cancelled = false;

    const pref = PREFECTURES.find(
      (p) => normalizeCode(p.code) === normalizeCode(code),
    );
    if (!pref) return;
    const label = romajiToLabel(pref.romaji);

    loadSvgText()
      .then((svgText) => {
        if (cancelled || !container) return;

        container.innerHTML = svgText;
        const svg = container.querySelector('svg');
        if (!svg) return;

        svg.setAttribute('class', 'japan-shape-svg');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        const target = findTargetGroup(svg, label);
        if (!target) {
          container.innerHTML =
            '<div class="japan-shape-loading">けんが みつかりません</div>';
          return;
        }

        styleHighlight(target);
        showOnlyTarget(svg, target);

        const refine = () => {
          if (cancelled) return;
          const bb = computeViewportBBox(svg, target);
          if (!bb) return;
          const pad = Math.max(bb.w, bb.h) * 0.08;
          svg.setAttribute(
            'viewBox',
            `${bb.x - pad} ${bb.y - pad} ${bb.w + pad * 2} ${bb.h + pad * 2}`,
          );
        };

        // getBoundingClientRect needs layout. Run on the next frame, and once
        // more on the frame after that for browsers that haven't realized the
        // SVG's measurements yet (older WebKit).
        requestAnimationFrame(() => {
          refine();
          requestAnimationFrame(refine);
        });
      })
      .catch((err) => {
        console.error('Failed to load Japan prefectures SVG:', err);
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
