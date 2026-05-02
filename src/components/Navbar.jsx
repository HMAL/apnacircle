import { Link } from "react-router-dom";

const FLAGS = [
  { flag: "🇮🇳", label: "India" },
  { flag: "🇨🇳", label: "China" },
  { flag: "🇲🇽", label: "Mexico" },
  { flag: "🇵🇭", label: "Philippines" },
  { flag: "🇯🇵", label: "Japan" },
  { flag: "🇰🇷", label: "Korea" },
  { flag: "🇱🇰", label: "Sri Lanka" },
  { flag: "🇳🇵", label: "Nepal" },
  { flag: "🇧🇩", label: "Bangladesh" },
  { flag: "🇵🇰", label: "Pakistan" },
];

export default function Navbar() {
  return (
    <header>
      <nav style={s.nav}>
        <Link to="/" style={s.brand}>Apnacircle</Link>
        <div style={s.links}>
          <Link to="/visa/h1b"    style={s.link}>Visa Experiences</Link>
          <Link to="/immigration" style={s.link}>Immigration Tips</Link>
          <Link to="/ds160"       style={s.link}>DS-160</Link>
          <Link to="/admin"       style={s.adminLink}>Admin</Link>
        </div>
      </nav>
      <div style={s.flagBar}>
        {FLAGS.map(({ flag, label }) => (
          <span key={label} style={s.flagItem} title={label}>{flag} {label}</span>
        ))}
      </div>
    </header>
  );
}

const s = {
  nav: {
    background: "var(--orange)", padding: "0 2rem", height: 52,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 100,
  },
  brand: { color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: -0.3 },
  links: { display: "flex", gap: 20, alignItems: "center" },
  link: { color: "rgba(255,255,255,0.88)", fontSize: 13, fontWeight: 600 },
  adminLink: { color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, background: "rgba(0,0,0,0.15)", padding: "4px 10px", borderRadius: 6 },
  flagBar: {
    background: "#1a1a1a", display: "flex", gap: 0, overflowX: "auto",
    scrollbarWidth: "none", padding: "0 1rem",
  },
  flagItem: {
    color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600,
    padding: "6px 14px", whiteSpace: "nowrap", cursor: "default",
    borderRight: "1px solid rgba(255,255,255,0.08)",
  },
};
