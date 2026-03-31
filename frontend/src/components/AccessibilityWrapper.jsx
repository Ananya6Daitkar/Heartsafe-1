import { useEffect } from 'react';

export function AccessibilityWrapper({ children }) {
  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--transition-fast', '0s');
      document.documentElement.style.setProperty('--transition-base', '0s');
      document.documentElement.style.setProperty('--transition-slow', '0s');
    }

    // Set ARIA live region for dynamic updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'aria-live-region';
    document.body.appendChild(liveRegion);

    return () => {
      document.body.removeChild(liveRegion);
    };
  }, []);

  return children;
}

// Screen reader only text
export function ScreenReaderOnly({ children }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
}
