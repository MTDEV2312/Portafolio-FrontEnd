import { useEffect } from 'react';

/**
 * Sets --sr (0→1) on the element as it moves through the viewport.
 * 0 = element just entering from bottom
 * 0.5 = element centered in viewport
 * 1 = element fully exited above
 *
 * Also sets --so (scroll opacity) as a bell-curve 0→1→0 peaking at 0.5.
 * These drive CSS calc() parallax transforms on child elements.
 */
export function useScrollRatio(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf: number;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const sr = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      // Bell-curve opacity: 0→0 at sr=0, →1 at sr=0.5, →0 at sr=1
      const raw = 1 - Math.abs(sr - 0.5) * 2.2;
      const so = Math.max(0, Math.min(1, raw));
      el.style.setProperty('--sr', sr.toFixed(4));
      el.style.setProperty('--so', so.toFixed(4));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}
