import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCookieConsent } from "./CookieConsent";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const location = useLocation();
  const { consent } = useCookieConsent();
  const enabled = consent === "accepted";

  useEffect(() => {
    if (!GA_ID || !enabled || window.gtag) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { send_page_view: false, anonymize_ip: true });
  }, [enabled]);

  useEffect(() => {
    if (!GA_ID || !enabled || !window.gtag) return;

    window.gtag("event", "page_view", {
      page_path: location.pathname + location.search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location, enabled]);

  return null;
}
