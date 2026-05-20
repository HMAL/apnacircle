import { useState, useEffect } from "react";

const KEY = "apna_cookie_consent";

export function useCookieConsent() {
  const [consent, setConsent] = useState(() => localStorage.getItem(KEY));
  const accept = () => { localStorage.setItem(KEY, "accepted"); setConsent("accepted"); };
  const decline = () => { localStorage.setItem(KEY, "declined"); setConsent("declined"); };
  return { consent, accept, decline };
}

export default function CookieConsent() {
  const { consent, accept, decline } = useCookieConsent();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!consent) setVisible(true);
  }, [consent]);

  if (!visible) return null;

  return (
    <div style={s.bar}>
      <p style={s.text}>
        We use Google Analytics to understand how visitors use this site.
        By clicking "Accept," you consent to analytics cookies.{" "}
        <a href="/privacy" style={s.link}>Privacy Policy</a>
      </p>
      <div style={s.buttons}>
        <button style={s.accept} onClick={() => { accept(); setVisible(false); }}>Accept</button>
        <button style={s.decline} onClick={() => { decline(); setVisible(false); }}>Decline</button>
      </div>
    </div>
  );
}

const s = {
  bar: {
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
    background: "#1a1a1a", color: "#fff", padding: "12px 20px",
    display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
    boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
  },
  text: { margin: 0, fontSize: 13, flex: 1, lineHeight: 1.5 },
  link: { color: "#f0a070", fontWeight: 600 },
  buttons: { display: "flex", gap: 8, flexShrink: 0 },
  accept: {
    padding: "7px 18px", background: "var(--orange, #B85C38)", color: "#fff",
    border: "none", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer",
  },
  decline: {
    padding: "7px 18px", background: "transparent", color: "#ccc",
    border: "1px solid #555", borderRadius: 20, fontSize: 13, cursor: "pointer",
  },
};
