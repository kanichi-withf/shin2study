'use client';

import { useEffect, useRef } from 'react';
import './WorldCountryShape.css';

interface WorldCountryShapeProps {
  code: string | null;
}

const HIGHLIGHT_FILL = '#FFD93D';
const HIGHLIGHT_STROKE = '#FF9F43';
// Vector-effect: non-scaling-stroke locks the stroke to screen pixels so it
// stays the same width regardless of how far we zoom into a small country.
// 1.2px reads cleanly on both phone and iPad without overwhelming the shape.
const HIGHLIGHT_STROKE_WIDTH = '1.2';

let svgTextPromise: Promise<string> | null = null;
function loadSvgText(): Promise<string> {
  if (!svgTextPromise) {
    svgTextPromise = fetch('/world-map.svg')
      .then((res) => {
        if (!res.ok) throw new Error(`world-map.svg ${res.status}`);
        return res.text();
      })
      .catch((err) => {
        svgTextPromise = null;
        throw err;
      });
  }
  return svgTextPromise;
}

function findCountryElement(svg: SVGSVGElement, code: string): SVGGraphicsElement | null {
  // The current SVG uses uppercase ISO codes (e.g. JP), but tolerate either
  // case so swapping the source SVG later doesn't break country lookup.
  const candidates = [code, code.toUpperCase(), code.toLowerCase()];
  for (const c of candidates) {
    const found =
      svg.querySelector(`g[id="${c}"]`) || svg.querySelector(`path[id="${c}"]`);
    if (found) return found as SVGGraphicsElement;
  }
  return null;
}

/**
 * Hide every element in the SVG that isn't on the path from the root to the
 * target, and isn't a descendant of the target. Mirrors the approach used in
 * JapanMapShape so only the chosen country renders.
 */
function showOnlyTarget(svg: SVGSVGElement, target: SVGGraphicsElement) {
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
      if (!chain.has(child)) (child as HTMLElement).style.display = 'none';
    }
  }
}

function styleHighlight(target: SVGGraphicsElement) {
  const paths =
    target.tagName.toLowerCase() === 'g'
      ? target.querySelectorAll<SVGElement>('path, polygon')
      : ([target] as unknown as NodeListOf<SVGElement>);
  paths.forEach((p) => {
    p.style.fill = HIGHLIGHT_FILL;
    p.style.stroke = HIGHLIGHT_STROKE;
    p.style.strokeWidth = HIGHLIGHT_STROKE_WIDTH;
    p.setAttribute('vector-effect', 'non-scaling-stroke');
  });
}

function computeViewportBBox(
  svg: SVGSVGElement,
  target: SVGGraphicsElement,
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

export default function WorldCountryShape({ code }: WorldCountryShapeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code || !containerRef.current) return;
    const container = containerRef.current;
    let cancelled = false;

    loadSvgText()
      .then((svgText) => {
        if (cancelled || !container) return;

        container.innerHTML = svgText;
        const svg = container.querySelector('svg');
        if (!svg) return;

        svg.setAttribute('class', 'world-country-shape-svg');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        const target = findCountryElement(svg, code);
        if (!target) {
          container.innerHTML =
            '<div class="world-country-shape-loading">くにが みつかりません</div>';
          return;
        }

        styleHighlight(target);
        showOnlyTarget(svg, target);

        const refine = () => {
          if (cancelled) return;
          const bb = computeViewportBBox(svg, target);
          if (!bb) return;
          // Slightly larger padding than the prefecture shape — small island
          // countries look cramped without room to breathe.
          const pad = Math.max(bb.w, bb.h) * 0.15;
          svg.setAttribute(
            'viewBox',
            `${bb.x - pad} ${bb.y - pad} ${bb.w + pad * 2} ${bb.h + pad * 2}`,
          );
        };

        requestAnimationFrame(() => {
          refine();
          requestAnimationFrame(refine);
        });
      })
      .catch((err) => {
        console.error('Failed to load world-map.svg:', err);
        if (!cancelled && container) {
          container.innerHTML =
            '<div class="world-country-shape-loading">よみこみエラー</div>';
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div
      className="world-country-shape-container"
      ref={containerRef}
      role="img"
      aria-label="くにのかたち"
    >
      <div className="world-country-shape-loading">🌍 かたちを よみこみちゅう...</div>
    </div>
  );
}
