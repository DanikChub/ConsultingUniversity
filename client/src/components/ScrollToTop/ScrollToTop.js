import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Или 'auto' для мгновенного перехода
    });
  }, [pathname]); // Перепрокрутка происходит при каждом изменении пути

  return null;
}

export default ScrollToTop;