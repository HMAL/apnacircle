import { useState } from "react";

export const ORANGE = "var(--orange)";

// ── Shared input styles ──────────────────────────────────────
export const f = {
  sectionTitle: { fontSize: 17, fontWeight: 700, color: "#111", marginBottom: "1.25rem" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 16 },
  grid1: { display: "grid", gridTemplateColumns: "1fr", gap: 16 },
  group: { display: "flex", flexDirection: "column", gap: 6 },
  span2: { gridColumn: "span 2" },
  label: { fontSize: 13, fontWeight: 700, color: "#333" },
  req: { color: "var(--orange)" },
  input: { border: "0.5px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 14, color: "#111", background: "#fff", width: "100%", outline: "none" },
  textarea: { border: "0.5px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 14, color: "#111", background: "#fff", width: "100%", outline: "none", resize: "vertical", minHeight: 110 },
  select: { border: "0.5px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 14, color: "#111", background: "#fff", width: "100%", outline: "none" },
  btn: { marginTop: "1.25rem", background: "#555", color: "#fff", border: "none", borderRadius: 10, padding: "11px 26px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  btnSm: { background: "#555", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  btnOutline: { background: "#fff", color: "#555", border: "1.5px solid #bbb", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  card: { background: "#fafaf8", border: "0.5px solid var(--border)", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: 12 },
  postMeta: { display: "flex", justifyContent: "space-between", marginBottom: 4 },
  postAuthor: { fontSize: 13, fontWeight: 700, color: "var(--orange)" },
  postDate: { fontSize: 12, color: "var(--muted)" },
  tag: { display: "inline-block", background: "var(--orange-light)", color: "var(--orange)", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, marginBottom: 6 },
  text: { fontSize: 14, color: "#333", lineHeight: 1.6 },
  sub: { fontSize: 12, color: "var(--muted)", marginTop: 3 },
  empty: { textAlign: "center", padding: "2rem", color: "var(--muted)", fontSize: 14 },
  divider: { border: "none", borderTop: "0.5px solid var(--border)", margin: "1.5rem 0" },
};

// ── Date formatters ──────────────────────────────────────────
// For DB timestamps (created_at, interview_date)
export const fmtDate = d =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

export const isValidEmail = v =>
  /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(String(v).trim());

export const isValidPhone = v =>
  String(v || "").replace(/\D/g, "").length === 10;

export const formatPhone = value => {
  const digits = String(value || "").replace(/\D/g, "");
  const normalized = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits.slice(0, 10);

  if (normalized.length <= 3) return normalized;
  if (normalized.length <= 6) return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
  return `${normalized.slice(0, 3)}-${normalized.slice(3, 6)}-${normalized.slice(6)}`;
};

// For date-only strings (event_date) — adds T00:00:00 to avoid timezone shift
export const googleMapsSearchUrl = query =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "")}`;

export function MapLink({ query, children, style }) {
  if (!query) return null;

  return (
    <a
      href={googleMapsSearchUrl(query)}
      target="_blank"
      rel="noreferrer"
      style={{ color: "var(--orange)", textDecoration: "none", ...style }}
    >
      {children || query}
    </a>
  );
}

export const fmtEventDate = d =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";

// ── Event urgency badge ──────────────────────────────────────
export function daysUntilBadge(dateStr) {
  const diff = Math.ceil((new Date(dateStr + "T00:00:00") - new Date().setHours(0, 0, 0, 0)) / 86400000);
  if (diff === 0) return { label: "Today",    color: "#ef4444" };
  if (diff === 1) return { label: "Tomorrow", color: "#f59e0b" };
  if (diff <= 7)  return { label: `${diff}d`, color: "#f59e0b" };
  return { label: `${diff}d`, color: "#10b981" };
}

// ── Toast ────────────────────────────────────────────────────
export function useToast() {
  const [msg, setMsg] = useState("");
  const show = (text) => { setMsg(text); setTimeout(() => setMsg(""), 3500); };
  return { msg, show };
}
export function Toast({ msg }) {
  if (!msg) return null;
  return <div style={{ position:"fixed", bottom:"2rem", right:"2rem", background:"#111", color:"#fff", padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:600, zIndex:9999 }}>{msg}</div>;
}

// ── Section header + content wrapper ────────────────────────
export function SectionWrapper({ title, icon, description, children }) {
  return (
    <div>
      <div style={{ background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.25rem 1.5rem", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:6 }}>
          <span style={{ fontSize:26 }}>{icon}</span>
          <h2 style={{ fontSize:21, fontWeight:800, color:"#111" }}>{title}</h2>
        </div>
        <p style={{ fontSize:14, color:"#555", lineHeight:1.6 }}>{description}</p>
      </div>
      <div style={{ background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem" }}>
        {children}
      </div>
    </div>
  );
}
