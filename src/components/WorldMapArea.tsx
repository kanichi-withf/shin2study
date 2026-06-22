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
function computeSvgBBox(
  svg: SVGSVGElement,
  target: SVGGraphicsElement,
): { x: number; y: number; w: number; h: number } | null {
  try {
    const paths =
      target.tagName.toLowerCase() === 'g'
        ? Array.from(target.querySelectorAll<SVGGraphicsElement>('path, polygon'))
        : [target];

    if (paths.length === 0) return null;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let found = false;

    for (const p of paths) {
      const bbox = p.getBBox();
      if (!bbox.width && !bbox.height) continue;

      let matrix = new DOMMatrix();
      let cur: Element | null = p;
      while (cur && cur instanceof SVGGraphicsElement && cur !== svg) {
        const transformList = cur.transform.baseVal;
        if (transformList && transformList.numberOfItems > 0) {
          const consolidated = transformList.consolidate();
          if (consolidated) {
            matrix = consolidated.matrix.multiply(matrix);
          }
        }
        cur = cur.parentElement;
      }

      const p1 = new DOMPoint(bbox.x, bbox.y);
      const p2 = new DOMPoint(bbox.x + bbox.width, bbox.y);
      const p3 = new DOMPoint(bbox.x, bbox.y + bbox.height);
      const p4 = new DOMPoint(bbox.x + bbox.width, bbox.y + bbox.height);

      const pt1 = p1.matrixTransform(matrix);
      const pt2 = p2.matrixTransform(matrix);
      const pt3 = p3.matrixTransform(matrix);
      const pt4 = p4.matrixTransform(matrix);

      const pMinX = Math.min(pt1.x, pt2.x, pt3.x, pt4.x);
      const pMaxX = Math.max(pt1.x, pt2.x, pt3.x, pt4.x);
      const pMinY = Math.min(pt1.y, pt2.y, pt3.y, pt4.y);
      const pMaxY = Math.max(pt1.y, pt2.y, pt3.y, pt4.y);

      found = true;
      if (pMinX < minX) minX = pMinX;
      if (pMinY < minY) minY = pMinY;
      if (pMaxX > maxX) maxX = pMaxX;
      if (pMaxY > maxY) maxY = pMaxY;
    }

    if (!found) return null;

    return {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY,
    };
  } catch (e) {
    console.error('Failed to compute SVG bbox:', e);
    return null;
  }
}

function computeAreaBBox(svg: SVGSVGElement, area: AreaId): Rect | null {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let found = false;

  for (const country of getCountriesInArea(area)) {
    const el = findCountryElement(svg, country.code);
    if (!el) continue;
    const r = computeSvgBBox(svg, el);
    if (!r) continue;
    found = true;
    if (r.x < minX) minX = r.x;
    if (r.y < minY) minY = r.y;
    if (r.x + r.w > maxX) maxX = r.x + r.w;
    if (r.y + r.h > maxY) maxY = r.y + r.h;
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
      let fillOpacity = '';
      if (isHighlight) {
        fill = HIGHLIGHT_FILL;
        stroke = HIGHLIGHT_STROKE;
        strokeWidth = '1.2';
        fillOpacity = '1';
      } else if (isAnswered) {
        fill = ANSWERED_FILL;
        fillOpacity = '1';
      } else if (inArea) {
        fill = DEFAULT_FILL;
        fillOpacity = '1';
      }
      paths.forEach((p) => {
        p.style.fill = fill;
        p.style.fillOpacity = fillOpacity;
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
        refine();
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
