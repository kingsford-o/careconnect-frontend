import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to hide navbar on scroll down and show on scroll up
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Scroll threshold in pixels before hiding (default: 80)
 * @param {boolean} options.isMobileMenuOpen - Whether mobile menu is open (default: false)
 * @returns {boolean} - Whether the navbar should be hidden
 */
export default function useHideOnScroll({ threshold = 80, isMobileMenuOpen = false } = {}) {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const tickingRef = useRef(false);
  const lastScrollYRef = useRef(0);

  // Check if user prefers reduced motion
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleScroll = useCallback(() => {
    if (prefersReducedMotion()) {
      return;
    }

    lastScrollYRef.current = window.scrollY;
    
    if (!tickingRef.current) {
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const currentScrollY = lastScrollYRef.current;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        const scrollDistance = Math.abs(currentScrollY - lastScrollY);

        // Don't hide if mobile menu is open
        if (isMobileMenuOpen) {
          setIsHidden(false);
          setLastScrollY(currentScrollY);
          tickingRef.current = false;
          return;
        }

        // At the top of the page, always show navbar
        if (currentScrollY < 10) {
          setIsHidden(false);
          setLastScrollY(currentScrollY);
          setIsScrolling(false);
          tickingRef.current = false;
          return;
        }

        // Only hide/show after scrolling past threshold
        if (currentScrollY > threshold) {
          if (scrollDirection === 'down' && scrollDistance > 5) {
            setIsHidden(true);
            setIsScrolling(true);
          } else if (scrollDirection === 'up' && scrollDistance > 5) {
            setIsHidden(false);
            setIsScrolling(true);
          }
        } else {
          setIsHidden(false);
        }

        setLastScrollY(currentScrollY);
        tickingRef.current = false;
      });
    }
  }, [lastScrollY, threshold, isMobileMenuOpen, prefersReducedMotion]);

  useEffect(() => {
    // Set initial scroll position
    setLastScrollY(window.scrollY);

    // Add scroll listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Reset hidden state when mobile menu opens/closes
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsHidden(false);
    }
  }, [isMobileMenuOpen]);

  return { isHidden, isScrolling };
}
