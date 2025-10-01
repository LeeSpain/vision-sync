import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on every route change (unless it's a hash link)
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.search]);

  return null;
};

export default ScrollToTop;