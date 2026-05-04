import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function HashScroller() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = decodeURIComponent(location.hash.slice(1));
    let frameId = 0;
    let resizeObserver = null;

    const scrollToHash = () => {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ block: "start", behavior: "auto" });
    };

    const queueScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(scrollToHash);
    };

    queueScroll();
    const timers = [100, 300, 700, 1200].map(delay => window.setTimeout(queueScroll, delay));

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(queueScroll);
      resizeObserver.observe(document.body);
      timers.push(window.setTimeout(() => resizeObserver?.disconnect(), 1500));
    }

    return () => {
      cancelAnimationFrame(frameId);
      timers.forEach(window.clearTimeout);
      resizeObserver?.disconnect();
    };
  }, [location.pathname, location.hash]);

  return null;
}
