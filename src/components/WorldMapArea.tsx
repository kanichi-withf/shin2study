'use client';

import { useCallback, useEffect, useRef } from 'react';
import { COUNTRIES, getCountriesInArea, type AreaId } from '@/data/world-map-data';
import './WorldMapArea.css';

interface WorldMapAreaProps {
  area: AreaId;
  highlightedCode: string | null;
  answeredCodes?: string[];
}

const HIGHLIGHT_FILL = '#FFD93D';
const HIGHLIGHT_STROKE = '#FF9F43';
const ANSWERED_FILL = '#D8DEE9';
const DEFAULT_FILL = '#F5F0E6';
const DEFAULT_STROKE = '#C5B5A5';
const NON_AREA_FILL = '#EFEBE2';

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

/**
 * Look up the SVG country element for a given ISO 3166-1 alpha-2 code. The
 * source SVG uses either `<g id="xx">` for multi-path countries or
 * `<path id="xx">` for single-path ones, so we accept both.
 */
function findCountryElement(svg: SVGSVGElement, code: string): SVGGraphicsElement | null {
  // The current SVG uses uppercase ISO codes, but accept either case so the
  // map source can be swapped without a rewrite of the lookup logic.
  const candidates = [code, code.toUpperCase(), code.toLowerCase()];
  for (const c of candidates) {
    const found =
      svg.querySelector(`g[id="${c}"]`) || svg.querySelector(`path[id="${c}"]`);
    if (found) return found as SVGGraphicsElement;
  }
  return null;
}

interface Rect { x: number; y: number; w: number; h: number }

/**
 * Compute the union bounding box of the area's countries, in SVG user
 * coordinates, using getBoundingClientRect → viewBox conversion. This avoids
 * the cross-browser quirks of getBBox/getCTM seen on heavily-transformed maps.
 */
function computeAreaBBox(svg: SVGSVGElement, area: AreaId): Rect | null {
  const svgRect = svg.getBoundingClientRect();
  if (!svgRect.width || !svgRect.height) return null;
  const vb = svg.getAttribute('viewBox')?.split(/[\s,]+/).map(Number);
  if (!vb || vb.length < 4) return null;
  const [vx, vy, vw, vh] = vb;
  const scaleX = svgRect.width / vw;
  const scaleY = svgRect.height / vh;
  if (!scaleX || !scaleY) return null;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let found = false;

  for (const country of getCountriesInArea(area)) {
    const el = findCountryElement(svg, country.code);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    found = true;
    const x = vx + (r.left - svgRect.left) / scaleX;
    const y = vy + (r.top - svgRect.top) / scaleY;
    const w = r.width / scaleX;
    const h = r.height / scaleY;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + w > maxX) maxX = x + w;
    if (y + h > maxY) maxY = y + h;
  }

  if (!found) return null;
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

export default function WorldMapArea({
  area,
  highlightedCode,
  answeredCodes = [],
}: WorldMapAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgLoadedRef = useRef(false);

  const applyStyles = useCallback(() => {
    const container = containerRef.current;
    if (!container || !svgLoadedRef.current) return;
    const svg = container.querySelector('svg');
    if (!svg) return;

    const areaCodes = new Set(getCountriesInArea(area).map((c) => c.code));
    const answeredSet = new Set(answeredCodes);

    for (const country of COUNTRIES) {
      const el = findCountryElement(svg as SVGSVGElement, country.code);
      if (!el) continue;
      const paths =
        el.tagName.toLowerCase() === 'g'
          ? el.querySelectorAll<SVGElement>('path, polygon')
          : ([el] as unknown as NodeListOf<SVGElement>);
      const inArea = areaCodes.has(country.code);
      const isHighlight = inArea && country.code === highlightedCode;
      const isAnswered = inArea && answeredSet.has(country.code);

      let fill = NON_AREA_FILL;
      let stroke = DEFAULT_STROKE;
      let strokeWidth = '0.5';
      if (isHighlight) {
        fill = HIGHLIGHT_FILL;
        stroke = HIGHLIGHT_STROKE;
        strokeWidth = '1.2';
      } else if (isAnswered) {
        fill = ANSWERED_FILL;
      } else if (inArea) {
        fill = DEFAULT_FILL;
      }
      paths.forEach((p) => {
        p.style.fill = fill;
        p.style.stroke = stroke;
        p.style.strokeWidth = strokeWidth;
        // Keep stroke at a constant screen px even when the viewBox is
        // zoomed in onto a smaller continent / country.
        p.setAttribute('vector-effect', 'non-scaling-stroke');
      });
    }
  }, [area, highlightedCode, answeredCodes]);

  // Hold the latest applyStyles behind a ref so the mount effect can call it
  // without re-running every time the prop closure changes.
  const applyStylesRef = useRef(applyStyles);
  useEffect(() => {
    applyStylesRef.current = applyStyles;
  }, [applyStyles]);

  const computeAreaBBoxRef = useRef<(area: AreaId) => Rect | null>(() => null);
  useEffect(() => {
    computeAreaBBoxRef.current = (a: AreaId) => {
      const svgEl =
        containerRef.current?.querySelector('svg') as SVGSVGElement | null;
      return svgEl ? computeAreaBBox(svgEl, a) : null;
    };
  });

  // Inject SVG on mount.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || svgLoadedRef.current) return;

    loadSvgText()
      .then((svgText) => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = svgText;
        svgLoadedRef.current = true;

        const svg = containerRef.current.querySelector('svg');
        if (svg) {
          svg.setAttribute('class', 'world-map-area-svg');
          svg.removeAttribute('width');
          svg.removeAttribute('height');
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        }

        // The source SVG leaves unidentified shapes (e.g. Antarctica, small
        // islands, multi-path country fragments) un-styled, which means the
        // browser's SVG default of solid black fills them in. Walk every
        // path/polygon once at mount and give it a neutral base colour so
        // nothing renders as a black blob outside the active area.
        containerRef.current
          .querySelectorAll<SVGElement>('path, polygon')
          .forEach((el) => {
            el.style.fill = NON_AREA_FILL;
            el.style.stroke = DEFAULT_STROKE;
            el.style.strokeWidth = '0.5';
            el.setAttribute('vector-effect', 'non-scaling-stroke');
          });

        applyStylesRef.current();

        const refine = () => {
          if (!containerRef.current) return;
          const svgEl = containerRef.current.querySelector(
            'svg',
          ) as SVGSVGElement | null;
          if (!svgEl) return;
          // Use the area at the time the frame fires, via the ref-backed
          // helper, so we always reflect the latest prop without re-running
          // the entire mount effect.
          const bb = computeAreaBBoxRef.current(area);
          if (!bb) return;
          const pad = Math.max(bb.w, bb.h) * 0.08;
          svgEl.setAttribute(
            'viewBox',
            `${bb.x - pad} ${bb.y - pad} ${bb.w + pad * 2} ${bb.h + pad * 2}`,
          );
        };
        requestAnimationFrame(() => {
          refine();
          requestAnimationFrame(refine);
        });
      })
      .catch((err) => console.error('Failed to load world-map.svg:', err));
    // Mount-only: we deliberately ignore `area` here because the mount logic
    // captures it via `computeAreaBBoxRef`, which always reads the latest.
  }, [area]);

  // Re-apply styles whenever highlighting / answers / area changes.
  useEffect(() => {
    applyStyles();
  }, [applyStyles]);

  return (
    <div
      className="world-map-area-container"
      ref={containerRef}
      role="img"
      aria-label="せかいちず"
    >
      <div className="world-map-area-loading">🌍 ちずを よみこみちゅう...</div>
    </div>
  );
}
