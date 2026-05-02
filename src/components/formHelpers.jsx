import { useState } from "react";

export const ORANGE = "var(--orange)";

// ── Shared input styles ──────────────────────────────────────
export const f = {
  sectionTitle: { fontSize: 17, fontWeight: 700, color: "#111", marginBottom: "1.25rem" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid1: { display: "grid", gridTemplateColumns: "1fr", gap: 16 },
  group: { display: "flex", flexDirection: "column", gap: 6 },
  span2: { gridColumn: "span 2" },
  label: { fontSize: 13, fontWeight: 700, color: "#333" },
  req: { color: "var(--orange)" },
  input: { border: "0.5px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 14, color: "#111", background: "#fff", width: "100%", outline: "none" },
  textarea: { border: "0.5px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 14, color: "#111", background: "#fff", width: "100%", outline: "none", resize: "vertical", minHeight: 110 },
  select: { border: "0.5px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 14, color: "#111", background: "#fff", width: "100%", outline: "none" },
  btn: { marginTop: "1.25rem", background: "var(--orange)", color: "#fff", border: "none", borderRadius: 10, padding: "11px 26px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  btnSm: { background: "var(--orange)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  btnOutline: { background: "#fff", color: "var(--orange)", border: "1.5px solid var(--orange)", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
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

// ── localStorage helpers ─────────────────────────────────────
export const storageKey = (state, city, section) => `ac_${state}_${city}_${section}`;
export const ALL_SUBMISSIONS_KEY = "ac_all_submissions";

export function loadPosts(stateSlug, citySlug, section) {
  try { return JSON.parse(localStorage.getItem(storageKey(stateSlug, citySlug, section)) || "[]"); }
  catch { return []; }
}

export function savePost(stateSlug, citySlug, section, post, autoApprove = false) {
  // Save to section-specific store
  const key = storageKey(stateSlug, citySlug, section);
  const existing = loadPosts(stateSlug, citySlug, section);
  const newPost = { ...post, id: Date.now(), createdAt: formatDate(), status: autoApprove ? "approved" : "pending", stateSlug, citySlug, section };
  localStorage.setItem(key, JSON.stringify([newPost, ...existing]));

  // Also save to global admin store
  const all = loadAllSubmissions();
  localStorage.setItem(ALL_SUBMISSIONS_KEY, JSON.stringify([newPost, ...all]));
  return newPost;
}

export function loadAllSubmissions() {
  try { return JSON.parse(localStorage.getItem(ALL_SUBMISSIONS_KEY) || "[]"); }
  catch { return []; }
}

export function updateSubmissionStatus(id, status) {
  const all = loadAllSubmissions().map(s => s.id === id ? { ...s, status } : s);
  localStorage.setItem(ALL_SUBMISSIONS_KEY, JSON.stringify(all));

  // Update in section store too
  const updated = all.find(s => s.id === id);
  if (updated) {
    const key = storageKey(updated.stateSlug, updated.citySlug, updated.section);
    const sectionPosts = JSON.parse(localStorage.getItem(key) || "[]").map(s => s.id === id ? { ...s, status } : s);
    localStorage.setItem(key, JSON.stringify(sectionPosts));
  }
}

export function formatDate() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

// ── Shared card list renderer ────────────────────────────────
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
