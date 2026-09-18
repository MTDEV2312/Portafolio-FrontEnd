import { useState, useEffect } from 'react';

/**
 * SSR-safe hook to detect mobile viewport.
 * Initializes to false during server-side prerendering,
 * and updates immediately upon client mount and on resize.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);

  return isMobile;
}
