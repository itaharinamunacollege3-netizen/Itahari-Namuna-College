import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;

    let frameId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return children;
}