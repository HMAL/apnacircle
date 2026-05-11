import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { f, useToast, Toast, fmtDate } from "../components/formHelpers";
import { fetchTips, getSubmitError, submitTip } from "../lib/db";
import AdBlock from "../components/AdBlock";
import { useIsMobile } from "../lib/useIsMobile";
import { getCountryName, getCountrySlug } from "../lib/country";
import ResourceNav from "../components/ResourceNav";

const CATEGORIES = [
  "Doctors & Specialists",
  "Health Insurance",
  "Mental Health",
  "Nutrition & Diet",
  "Pharmacy / Medications",
  "Hospitals & Urgent Care",
  "Dental",
  "Other",
];

export default function HealthWellnessPage() {
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();
  const countryName = getCountryName();

  const reload = () => fetchTips("health_tips").then(setPosts);
  useEffect(() => { reload(); }, []);

  const filtered = search
    ? posts.filter(p => [p.tip, p.name, p.category].some(v => v?.toLowerCase().includes(search.toLowerCase())))
    : posts;

  const siteBase = getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org";
  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>Health & Wellness Tips for Immigrants — {countryName} | Apnacircle</title>
        <meta name="description" content={`Community health tips for immigrants in ${countryName} — doctors, health insurance, mental health, pharmacies, hospitals and nutrition advice.`} />
        <link rel="canonical" href={`${siteBase}/health/`} />
        <meta property="og:title" content={`Health & Wellness Tips for Immigrants — ${countryName} | Apnacircle`} />
        <meta property="og:description" content={`Community health tips for immigrants in ${countryName} — doctors, health insurance, mental health, pharmacies, hospitals and nutrition advice.`} />
        <meta property="og:url" content={`${siteBase}/health/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {!isMobile && <ResourceNav />}
      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>
        <div style={s.header}>
          <span style={{ fontSize:32 }}>🏥</span>
          <div style={{ flex:1 }}>
            <h1 style={s.title}>Health & Wellness</h1>
            <p style={s.desc}>Community tips on navigating healthcare in {countryName} — insurance, doctors, hospitals and more.</p>
          </div>
          <button style={s.addBtn} onClick={() => setShowForm(v => !v)}>
            {showForm ? "✕ Cancel" : "+ Share a Tip"}
          </button>
        </div>

        {showForm && (
          <div style={s.card}>
            <HealthForm onSubmit={() => { setShowForm(false); reload(); }} />
          </div>
        )}

        <div style={s.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
            <h3 style={{ fontSize:16, fontWeight:700, margin:0 }}>Community Tips</h3>
            <input style={{ ...f.input, width:220, margin:0 }} placeholder="Search tips..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {filtered.length > 0 ? (
            filtered.map(p => (
              <div key={p.id} style={f.card}>
                <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:6, alignItems:"center" }}>
                  <span style={f.postAuthor}>{p.name || "Anonymous"}</span>
                  {p.category && <span style={{ ...f.tag, background:"#e8f4ff", color:"#0066cc" }}>{p.category}</span>}
                  <span style={f.postDate}>{fmtDate(p.created_at)}</span>
                </div>
                <p style={f.text}>{p.tip}</p>
              </div>
            ))
          ) : (
            <p style={s.empty}>
              {search ? `No results for "${search}".` : "Be the first to share a health & wellness tip with the community!"}
            </p>
          )}
        </div>
      </div>

      {!isMobile && (
        <aside style={s.rail}>
          <AdBlock />
          <AdBlock />
        </aside>
      )}
    </div>
  );
}

function HealthForm({ onSubmit }) {
  const [form, setForm] = useState({ name:"", category:"", tip:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = async () => {
    if (!form.tip.trim()) { show("Please share your tip."); return; }
    const ok = await submitTip("health_tips", {
      name:     form.name     || null,
      category: form.category || null,
      tip:      form.tip,
    });
    if (ok) {
      setForm({ name:"", category:"", tip:"" });
      show("✓ Submitted for review! Thank you.");
      setTimeout(() => onSubmit?.(), 1500);
    } else {
      show(getSubmitError("Error submitting. Please try again."));
    }
  };
  return (
    <>
      <h3 style={f.sectionTitle}>Share Your Tip</h3>
      <div style={f.grid2}>
        <div style={f.group}>
          <label style={f.label}>Your Name (optional)</label>
          <input style={f.input} value={form.name} onChange={set("name")} placeholder="Anonymous" />
        </div>
        <div style={f.group}>
          <label style={f.label}>Category</label>
          <select style={f.select} value={form.category} onChange={set("category")}>
            <option value="">Select category...</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{...f.group,...f.span2}}>
          <label style={f.label}>Your Tip <span style={f.req}>*</span></label>
          <textarea style={f.textarea} value={form.tip} onChange={set("tip")} placeholder="Share tips about healthcare, insurance, finding doctors, hospitals..." />
        </div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      <Toast msg={msg} />
    </>
  );
}

const s = {
  outer:   { padding:"1.5rem 1.5rem 3rem", display:"flex", gap:24, alignItems:"flex-start" },
  content: { flex:1, minWidth:0 },
  rail:    { width:260, flexShrink:0, display:"flex", flexDirection:"column", gap:16, position:"sticky", top:72 },
  back:    { color:"var(--orange)", fontSize:13, fontWeight:600, display:"inline-block", marginBottom:8 },
  header:  { display:"flex", alignItems:"center", gap:16, marginBottom:"1.5rem", flexWrap:"wrap" },
  title:   { fontSize:28, fontWeight:800, color:"#111", marginBottom:4 },
  desc:    { fontSize:14, color:"#555" },
  card:    { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:20 },
  addBtn:  { marginLeft:"auto", padding:"8px 18px", background:"#555", color:"#fff", border:"none", borderRadius:20, fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" },
  empty:   { fontSize:14, color:"#777", fontStyle:"italic", textAlign:"center", padding:"1.5rem 0" },
};
