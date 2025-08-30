import { useState, useEffect, useCallback } from 'react';

const useScrollDirection = (threshold = 100) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const updateScrollDirection = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY < 10) {
      setIsVisible(true);
    } else if (currentScrollY > lastScrollY && currentScrollY > threshold) {
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY) {
      setIsVisible(true);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY, threshold]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateScrollDirection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateScrollDirection]);

  return isVisible;
};

export default useScrollDirection;
