'use client';

import { useEffect } from 'react';

/**
 * iOS / iPadOS Safari workaround.
 *
 * Without an active touch listener somewhere on the document, Safari will
 * sometimes skip firing `click` events even after a successful `touchstart`
 * + `touchend` pair — the visual `:active` flashes but the React onClick
 * handler never runs. Registering a no-op passive listener on `document`
 * makes Safari treat the page as touch-aware and properly emit the click.
 *
 * Must run on every mount (not just initial page load) so client-side
 * navigations also stay protected. Keeping a single, idempotent registration
 * via a module flag avoids piling up listeners.
 */
let installed = false;

export default function IOSTouchFix() {
  useEffect(() => {
    if (installed) return;
    installed = true;
    const noop = () => {};
    document.addEventListener('touchstart', noop, { passive: true });
  }, []);
  return null;
}
