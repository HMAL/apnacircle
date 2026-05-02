import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { STATES, citySlug } from "../data/states";

const GLOBAL_SECTIONS = [
  { icon: "🪪", label: "Visa Interview Experiences", sub: "F1 · H1B · B1/B2 · H4 · L1 · Other", to: "/visa/h1b" },
  { icon: "💡", label: "Immigration Tips",            sub: "General advice from the community",   to: "/immigration" },
  { icon: "📋", label: "DS-160 Tips",                 sub: "Form-filling tips & common mistakes",  to: "/ds160" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div style={s.hero}>
        <h1 style={s.h1}>Apnacircle</h1>
        <p style={s.sub}>A community-powered resource for immigrants — visa experiences, legal help, jobs, housing and local services, organized by state & city.</p>
      </div>

      {/* Global sections */}
      <div style={s.section}>
        <p style={s.sectionLabel}>📌 Community Resources (All States)</p>
        <div style={s.globalGrid}>
          {GLOBAL_SECTIONS.map(gs => (
            <Link key={gs.to} to={gs.to} style={s.globalCard}>
              <span style={{ fontSize: 30 }}>{gs.icon}</span>
              <div>
                <p style={s.gcLabel}>{gs.label}</p>
                <p style={s.gcSub}>{gs.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* States */}
      <div style={s.section}>
        <p style={s.sectionLabel}>🗺️ Browse by State</p>
        <div style={s.stateGrid}>
          {STATES.map(state => <StateCard key={state.slug} state={state} />)}
        </div>
      </div>

      <footer style={s.footer}>© 2026 Apnacircle. Built by the community, for the community.</footer>
    </div>
  );
}

function StateCard({ state }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const [city, setCity] = useState("");

  return (
    <div style={{ ...s.stateCard, ...(hovered ? s.stateCardHover : {}) }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link to={`/states/${state.slug}`} style={{ textDecoration: "none" }}>
        <div style={s.stateTop}>
          <span style={{ fontSize: 32 }}>{state.icon}</span>
          <div>
            <p style={s.stateName}>{state.name}</p>
            <p style={s.stateAbbr}>{state.abbr}</p>
          </div>
        </div>
      </Link>
      <div style={s.cityRow}>
        <select style={s.citySelect} value={city} onChange={e => setCity(e.target.value)}>
          <option value="">Select city...</option>
          {state.cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button style={s.goBtn} disabled={!city}
          onClick={() => city && navigate(`/states/${state.slug}/${citySlug(city)}`)}>
          Go →
        </button>
      </div>
    </div>
  );
}

const s = {
  hero: { textAlign: "center", padding: "2.5rem 1rem 1.5rem" },
  h1: { color: "var(--orange)", fontSize: 40, fontWeight: 800, letterSpacing: -1, marginBottom: "0.5rem" },
  sub: { color: "#555", fontSize: 14, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 },
  section: { maxWidth: 1000, margin: "0 auto", padding: "0 1.5rem 2rem" },
  sectionLabel: { fontSize: 13, fontWeight: 700, color: "#666", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5 },
  globalGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 },
  globalCard: { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 14, transition: "box-shadow 0.15s" },
  gcLabel: { fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 2 },
  gcSub: { fontSize: 12, color: "var(--muted)" },
  stateGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
  stateCard: { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem", transition: "box-shadow 0.15s, transform 0.15s" },
  stateCardHover: { boxShadow: "0 4px 16px rgba(0,0,0,0.08)", transform: "translateY(-2px)" },
  stateTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: "0.9rem" },
  stateName: { fontSize: 15, fontWeight: 700, color: "var(--orange)" },
  stateAbbr: { fontSize: 12, color: "var(--muted)", fontWeight: 600 },
  cityRow: { display: "flex", gap: 8 },
  citySelect: { flex: 1, border: "0.5px solid var(--border)", borderRadius: 8, padding: "7px 10px", fontSize: 13, outline: "none", background: "#fff" },
  goBtn: { background: "var(--orange)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  footer: { textAlign: "center", padding: "1.5rem", borderTop: "0.5px solid var(--border)", color: "#aaa", fontSize: 13, background: "#fff", marginTop: "1rem" },
};
