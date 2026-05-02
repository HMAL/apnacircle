import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { f, loadPosts, savePost, useToast, Toast } from "../../components/formHelpers";

const VISA_TYPES = [
  { id: "h1b",  label: "H-1B",    icon: "💼", desc: "Specialty occupation, employer-sponsored work visa" },
  { id: "f1",   label: "F-1",     icon: "🎓", desc: "Student visa experiences and interview tips" },
  { id: "b1b2", label: "B-1/B-2", icon: "✈️", desc: "Business and tourist visa experiences" },
  { id: "h4",   label: "H-4",     icon: "👨‍👩‍👧", desc: "Dependent visa for H-1B spouses and children" },
  { id: "l1",   label: "L-1",     icon: "🏢", desc: "Intracompany transferee visa experiences" },
  { id: "other",label: "Other",   icon: "🗂️", desc: "EB-2, EB-3, O-1, TN and other visa categories" },
];

const CONSULATES = ["US Consulate Mumbai","US Consulate Chennai","US Consulate Hyderabad","US Consulate New Delhi","US Consulate Kolkata","US Embassy Beijing","US Consulate Shanghai","US Consulate Guangzhou","US Embassy Seoul","US Consulate Other"];

export default function VisaPage() {
  const { type } = useParams();
  const activeVisa = VISA_TYPES.find(v => v.id === type) || VISA_TYPES[0];
  const posts = loadPosts("global", "visa", activeVisa.id);

  return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← Home</Link>
      <h1 style={s.title}>Visa Interview Experiences</h1>
      <p style={s.desc}>Community members share real interview experiences to help others prepare.</p>

      {/* Visa type tabs */}
      <div style={s.tabs}>
        {VISA_TYPES.map(v => (
          <Link key={v.id} to={`/visa/${v.id}`}
            style={{ ...s.tab, ...(activeVisa.id === v.id ? s.tabActive : {}) }}>
            {v.icon} {v.label}
          </Link>
        ))}
      </div>

      {/* Active type header */}
      <div style={s.typeCard}>
        <span style={{ fontSize:28 }}>{activeVisa.icon}</span>
        <div>
          <h2 style={{ fontSize:18, fontWeight:800, color:"#111" }}>{activeVisa.label} Visa</h2>
          <p style={{ fontSize:13, color:"#555" }}>{activeVisa.desc}</p>
        </div>
      </div>

      {/* Submit form */}
      <div style={s.card}>
        <VisaForm visaId={activeVisa.id} visaLabel={activeVisa.label} />
      </div>

      {/* Posts */}
      {posts.filter(p => p.status === "approved").length > 0 && (
        <div style={s.card}>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>Community Experiences</h3>
          {posts.filter(p => p.status === "approved").map(p => (
            <div key={p.id} style={f.card}>
              <div style={f.postMeta}><span style={f.postAuthor}>{p.name || "Anonymous"}</span><span style={f.postDate}>{p.createdAt}</span></div>
              <span style={f.tag}>{p.visaType}</span>
              <p style={f.text}>{p.experience}</p>
              {p.location && <p style={f.sub}>📍 {p.location}{p.interviewDate ? ` · ${p.interviewDate}` : ""}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VisaForm({ visaId, visaLabel }) {
  const [form, setForm] = useState({ name:"", location:"", interviewDate:"", experience:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = () => {
    if (!form.experience.trim()) { show("Please share your experience."); return; }
    savePost("global", "visa", visaId, { ...form, visaType: visaLabel }, false);
    setForm({ name:"", location:"", interviewDate:"", experience:"" });
    show("✓ Submitted for review! Thank you.");
  };
  return (
    <>
      <h3 style={f.sectionTitle}>Share Your Experience</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.name} onChange={set("name")} placeholder="Anonymous" /></div>
        <div style={f.group}><label style={f.label}>Interview Location</label>
          <select style={f.select} value={form.location} onChange={set("location")}><option value="">Select consulate...</option>{CONSULATES.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <div style={f.group}><label style={f.label}>Interview Date</label><input style={f.input} type="date" value={form.interviewDate} onChange={set("interviewDate")} /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Your Experience <span style={f.req}>*</span></label>
          <textarea style={f.textarea} value={form.experience} onChange={set("experience")} placeholder="Questions asked, wait time, documents checked, outcome, tips for others..." />
        </div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      <Toast msg={msg} />
    </>
  );
}

const s = {
  page: { maxWidth: 860, margin:"0 auto", padding:"1.5rem 1.5rem 3rem" },
  back: { color:"var(--orange)", fontSize:13, fontWeight:600, display:"inline-block", marginBottom:8 },
  title: { fontSize:32, fontWeight:800, color:"#111", marginBottom:6 },
  desc: { fontSize:14, color:"#555", marginBottom:"1.5rem" },
  tabs: { display:"flex", flexWrap:"wrap", gap:8, marginBottom:"1.25rem" },
  tab: { padding:"8px 16px", borderRadius:20, fontSize:13, fontWeight:700, background:"#fff", border:"0.5px solid var(--border)", color:"#555" },
  tabActive: { background:"var(--orange)", color:"#fff", border:"0.5px solid var(--orange)" },
  typeCard: { display:"flex", alignItems:"center", gap:14, background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1rem 1.5rem", marginBottom:20 },
  card: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:20 },
};
