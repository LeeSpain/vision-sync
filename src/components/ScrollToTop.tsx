import { useLayoutEffect, useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();
  const navType = useNavigationType();

  // Force manual scroll restoration to prevent browser from interfering
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Use layoutEffect to scroll before paint
  useLayoutEffect(() => {
    if (!location.hash) {
      // Triple-ensure scroll to top
      const forceScrollTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };
      
      // Immediate
      forceScrollTop();
      
      // After next paint
      requestAnimationFrame(forceScrollTop);
      
      // Backup after event loop
      setTimeout(forceScrollTop, 0);
    }
  }, [location.pathname, location.search, navType]);

  return null;
};

export default ScrollToTop;