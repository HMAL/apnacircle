import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { f, useToast, Toast, fmtDate } from "../../components/formHelpers";
import { fetchVisaExperiences, submitVisaExperience, fetchConsulates } from "../../lib/db";
import AdBlock from "../../components/AdBlock";
import { useIsMobile } from "../../lib/useIsMobile";
import { getCountrySlug } from "../../lib/country";

const US_VISA_TYPES = [
  { id: "h1b",  label: "H-1B",    icon: "💼", desc: "Specialty occupation, employer-sponsored work visa" },
  { id: "f1",   label: "F-1",     icon: "🎓", desc: "Student visa experiences and interview tips" },
  { id: "b1b2", label: "B-1/B-2", icon: "✈️", desc: "Business and tourist visa experiences" },
  { id: "h4",   label: "H-4",     icon: "👨‍👩‍👧", desc: "Dependent visa for H-1B spouses and children" },
  { id: "l1",   label: "L-1",     icon: "🏢", desc: "Intracompany transferee visa experiences" },
  { id: "other",label: "Other",   icon: "🗂️", desc: "EB-2, EB-3, O-1, TN and other visa categories" },
];

const CA_VISA_TYPES = [
  { id: "visitor",       label: "Visitor Visa",       icon: "✈️", desc: "Temporary resident visitor visa experiences" },
  { id: "study-permit",  label: "Study Permit",       icon: "🎓", desc: "Student permit applications and interview experiences" },
  { id: "work-permit",   label: "Work Permit",        icon: "💼", desc: "Employer-specific and open work permit experiences" },
  { id: "express-entry", label: "Express Entry",      icon: "🍁", desc: "Federal skilled worker, CEC, and PR process experiences" },
  { id: "pnp",           label: "PNP",                icon: "📍", desc: "Provincial nominee program experiences" },
  { id: "super-visa",    label: "Super Visa",         icon: "👨‍👩‍👧", desc: "Parent and grandparent super visa experiences" },
  { id: "other",         label: "Other",              icon: "🗂️", desc: "Spousal sponsorship, PR cards, citizenship, and other Canadian immigration topics" },
];

export default function VisaPage() {
  const { type } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [consulates, setConsulates] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const isMobile = useIsMobile();
  const visaTypes = getCountrySlug() === "ca" ? CA_VISA_TYPES : US_VISA_TYPES;
  const activeVisa = visaTypes.find(v => v.id === type) || visaTypes[0];

  useEffect(() => {
    fetchVisaExperiences(activeVisa.id).then(setPosts);
    setLocationFilter("");
  }, [activeVisa.id]);

  useEffect(() => {
    fetchConsulates().then(setConsulates);
  }, []);

  const groupedConsulates = consulates.reduce((acc, c) => {
    if (!acc[c.country]) acc[c.country] = [];
    acc[c.country].push(c.location);
    return acc;
  }, {});

  const filteredPosts = locationFilter
    ? posts.filter(p => p.location === locationFilter)
    : posts;

  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>
        <h1 style={s.title}>Visa Interview Experiences</h1>
        <p style={s.desc}>Community members share real interview experiences to help others prepare.</p>

        {/* Visa type tabs */}
        <div style={s.tabs}>
          {visaTypes.map(v => (
            <Link key={v.id} to={`/visa/${v.id}`}
              style={{ ...s.tab, ...(activeVisa.id === v.id ? s.tabActive : {}) }}>
              {v.icon} {v.label}
            </Link>
          ))}
        </div>

        {/* Active type header */}
        <div style={s.typeCard}>
          <span style={{ fontSize:28 }}>{activeVisa.icon}</span>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111" }}>{activeVisa.label} Visa</h2>
            <p style={{ fontSize:13, color:"#555" }}>{activeVisa.desc}</p>
          </div>
          <button style={s.addBtn} onClick={() => setShowForm(v => !v)}>
            {showForm ? "✕ Cancel" : "+ Add Your Visa Experience"}
          </button>
        </div>

        {/* Submit form */}
        {showForm && (
          <div style={s.card}>
            <VisaForm visaId={activeVisa.id} groupedConsulates={groupedConsulates} onSubmit={() => {
              setShowForm(false);
              fetchVisaExperiences(activeVisa.id).then(setPosts);
            }} />
          </div>
        )}

        {/* Posts */}
        <div style={s.card}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:14 }}>
            <h3 style={{ fontSize:16, fontWeight:700, margin:0 }}>
              Community Experiences
              {locationFilter && <span style={{ fontSize:13, fontWeight:400, color:"#888", marginLeft:8 }}>· {filteredPosts.length} result{filteredPosts.length !== 1 ? "s" : ""}</span>}
            </h3>
            <select style={{ ...f.select, width:"auto", minWidth:200 }}
              value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
              <option value="">All Locations</option>
              {Object.entries(groupedConsulates).map(([country, locations]) => (
                <optgroup key={country} label={country}>
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          {filteredPosts.length > 0 ? (
            filteredPosts.map(p => (
              <div key={p.id} style={f.card}>
                <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
                  <span style={f.postAuthor}>{p.name || "Anonymous"}</span>
                  {p.location      && <span style={f.sub}>📍 {p.location}</span>}
                  {p.interview_date && <span style={f.sub}>📅 {fmtDate(p.interview_date)}</span>}
                  <span style={f.postDate}>{fmtDate(p.created_at)}</span>
                </div>
                <p style={f.text}>{p.experience}</p>
              </div>
            ))
          ) : (
            <p style={s.empty}>
              {locationFilter
                ? `No experiences yet for ${locationFilter}. Be the first to share!`
                : "Experiences shared will give confidence to those who are going for their interview. Please take a moment and submit yours."}
            </p>
          )}
        </div>
      </div>

      {/* Right ad rail — desktop only */}
      {!isMobile && (
        <aside style={s.rail}>
          <AdBlock />
          <AdBlock />
        </aside>
      )}
    </div>
  );
}

function VisaForm({ visaId, groupedConsulates, onSubmit }) {
  const [form, setForm] = useState({ name:"", location:"", interviewDate:"", experience:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = async () => {
    if (!form.experience.trim()) { show("Please share your experience."); return; }
    const ok = await submitVisaExperience(form, visaId);
    if (ok) {
      setForm({ name:"", location:"", interviewDate:"", experience:"" });
      show("✓ Submitted for review! Thank you.");
      setTimeout(() => onSubmit?.(), 1500);
    } else {
      show("Error submitting. Please try again.");
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Share Your Experience</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.name} onChange={set("name")} placeholder="Anonymous" /></div>
        <div style={f.group}><label style={f.label}>Interview Location</label>
          <select style={f.select} value={form.location} onChange={set("location")}>
            <option value="">Select consulate...</option>
            {Object.entries(groupedConsulates).map(([country, locations]) => (
              <optgroup key={country} label={country}>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </optgroup>
            ))}
          </select>
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
  outer:    { padding:"1.5rem 1.5rem 3rem", display:"flex", gap:24, alignItems:"flex-start" },
  content:  { flex:1, minWidth:0 },
  rail:     { width:260, flexShrink:0, display:"flex", flexDirection:"column", gap:16, position:"sticky", top:72 },
  back:     { color:"var(--orange)", fontSize:13, fontWeight:600, display:"inline-block", marginBottom:8 },
  title:    { fontSize:32, fontWeight:800, color:"#111", marginBottom:6 },
  desc:     { fontSize:14, color:"#555", marginBottom:"1.5rem" },
  tabs:     { display:"flex", flexWrap:"wrap", gap:8, marginBottom:"1.25rem" },
  tab:      { padding:"8px 16px", borderRadius:20, fontSize:13, fontWeight:700, background:"#fff", border:"0.5px solid var(--border)", color:"#555" },
  tabActive:{ background:"var(--orange)", color:"#fff", border:"0.5px solid var(--orange)" },
  typeCard: { display:"flex", alignItems:"center", gap:14, background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1rem 1.5rem", marginBottom:20, flexWrap:"wrap" },
  addBtn:   { marginLeft:"auto", padding:"8px 18px", background:"#555", color:"#fff", border:"none", borderRadius:20, fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" },
  card:     { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:20 },
  empty:    { fontSize:14, color:"#777", fontStyle:"italic", textAlign:"center", padding:"1.5rem 0" },
};
