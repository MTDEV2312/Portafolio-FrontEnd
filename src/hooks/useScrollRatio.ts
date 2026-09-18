import { useEffect } from 'react';

type ElementUpdateCallback = (vh: number) => void;

const registeredElements = new Set<ElementUpdateCallback>();
let globalRaf: number | null = null;
let isScrollListening = false;

function onSharedScroll() {
  if (globalRaf !== null) return;
  globalRaf = requestAnimationFrame(() => {
    globalRaf = null;
    const vh = window.innerHeight;
    registeredElements.forEach((callback) => callback(vh));
  });
}

function startGlobalScroll() {
  if (typeof window === 'undefined' || isScrollListening) return;
  window.addEventListener('scroll', onSharedScroll, { passive: true });
  window.addEventListener('resize', onSharedScroll, { passive: true });
  isScrollListening = true;
}

function stopGlobalScroll() {
  if (typeof window === 'undefined' || !isScrollListening) return;
  if (registeredElements.size === 0) {
    window.removeEventListener('scroll', onSharedScroll);
    window.removeEventListener('resize', onSharedScroll);
    if (globalRaf !== null) {
      cancelAnimationFrame(globalRaf);
      globalRaf = null;
    }
    isScrollListening = false;
  }
}

/**
 * Sets --sr (0→1) on the element as it moves through the viewport using a single centralized scroll loop.
 * Also sets --so (scroll opacity) as a bell-curve 0→1→0 peaking at 0.5.
 * Respects prefers-reduced-motion: reduce.
 */
export function useScrollRatio(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--sr', '0.5');
      el.style.setProperty('--so', '1');
      return;
    }

    const update: ElementUpdateCallback = (vh: number) => {
      const rect = el.getBoundingClientRect();
      // Skip updates for elements far off-screen
      if (rect.bottom < -100 || rect.top > vh + 100) return;

      const sr = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      const raw = 1 - Math.abs(sr - 0.5) * 2.2;
      const so = Math.max(0, Math.min(1, raw));
      el.style.setProperty('--sr', sr.toFixed(4));
      el.style.setProperty('--so', so.toFixed(4));
    };

    registeredElements.add(update);
    startGlobalScroll();
    update(window.innerHeight);

    return () => {
      registeredElements.delete(update);
      stopGlobalScroll();
    };
  }, [ref]);
}
