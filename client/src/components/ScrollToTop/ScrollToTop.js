import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {


    // При обычном переходе — скроллим вверх
    window.scrollTo({
      top: 0,

    });

  }, [location.pathname, navigationType]);

  return null;
}
