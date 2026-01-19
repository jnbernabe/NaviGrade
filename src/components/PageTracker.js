import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-FTG3HN9XEM", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

export default PageTracker;
