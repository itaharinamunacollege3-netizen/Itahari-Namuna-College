import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }) {
  // 1. Get the current route
  const location = useLocation();

  useEffect(() => {
    // 2. Initialize Lenis
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    // 3. Animation frame loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 4. Force scroll to top whenever location (route) changes
    lenis.scrollTo(0, { immediate: true });

    // 5. Cleanup
    return () => {
      lenis.destroy();
    };
  }, [location]); // Triggered every time the route changes

  return children;
}