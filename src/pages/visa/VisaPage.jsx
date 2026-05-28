import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { f, useToast, Toast, fmtDate } from "../../components/formHelpers";
import { fetchVisaExperiences, submitVisaExperience, fetchConsulates, getSubmitError, voteVisaHelpful, fetchVisaReplies, submitVisaReply } from "../../lib/db";
import AdBlock from "../../components/AdBlock";
import { useIsMobile } from "../../lib/useIsMobile";
import { getCountrySlug } from "../../lib/country";
import ResourceNav from "../../components/ResourceNav";


function ConsulateStats({ posts }) {
  if (!posts.length) return null;
  const counts = {};
  posts.forEach(p => { if (p.location) counts[p.location] = (counts[p.location] || 0) + 1; });
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  return (
    <div style={vs.statsBar}>
      <span style={vs.statsLabel}>📊 {posts.length} experience{posts.length !== 1 ? "s" : ""} shared</span>
      {top.map(([loc, n]) => (
        <span key={loc} style={vs.statsPill}>{loc} · {n}</span>
      ))}
    </div>
  );
}

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

export default function VisaPage({ embedded = false }) {
  const { type } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [consulates, setConsulates] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [embeddedType, setEmbeddedType] = useState("h1b");
  const isMobile = useIsMobile();
  const visaTypes = getCountrySlug() === "ca" ? CA_VISA_TYPES : US_VISA_TYPES;
  const activeVisa = visaTypes.find(v => v.id === (embedded ? embeddedType : type)) || visaTypes[0];

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

  const inner = (
    <>
      {/* Visa type tabs */}
      <div style={s.tabs}>
        {visaTypes.map(v => embedded ? (
          <button key={v.id} onClick={() => setEmbeddedType(v.id)}
            style={{ ...s.tab, ...(activeVisa.id === v.id ? s.tabActive : {}), border: "none", cursor: "pointer" }}>
            {v.icon} {v.label}
          </button>
        ) : (
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
            <VisaForm visaId={activeVisa.id} groupedConsulates={groupedConsulates} onSubmit={(data) => {
              setShowForm(false);
              setShareData({ ...data, visaLabel: activeVisa.label, visaId: activeVisa.id });
              fetchVisaExperiences(activeVisa.id).then(setPosts);
            }} />
          </div>
        )}

        {/* Share card after submission */}
        {shareData && (
          <div style={s.shareCard}>
            <div style={s.shareCardRow}>
              <span style={{ fontSize: 28 }}>🎉</span>
              <div style={{ flex: 1 }}>
                <p style={s.shareTitle}>Thanks for sharing your {shareData.visaLabel} experience!</p>
                {shareData.location && <p style={s.shareDesc}>Your {shareData.location} experience will help others prepare.</p>}
                <p style={s.sharePending}>It's under review and will appear here shortly.</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`I just shared my ${shareData.visaLabel} visa experience on Apnacircle 🛂\n\nReal stories from real people — help your friends prepare!\n\n👉 https://apnacircle.org/visa/${shareData.visaId}`)}`}
                target="_blank" rel="noopener noreferrer" style={s.shareWa}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366" style={{ flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </a>
              <button onClick={() => setShareData(null)} style={s.shareDismiss}>Dismiss</button>
            </div>
          </div>
        )}

        {/* Posts */}
        <div style={s.card}>
          <ConsulateStats posts={filteredPosts} />
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
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginTop:8 }}>
                  <HelpfulButton id={p.id} count={p.helpful_count || 0} />
                </div>
                <VisaReplies experienceId={p.id} />
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
    </>
  );

  if (embedded) return <div style={{ flex: 1, minWidth: 0 }}>{inner}</div>;

  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>US Visa Interview Experiences — H1B, F1, B1/B2 | Apnacircle</title>
        <meta name="description" content="Real visa interview experiences shared by immigrants — H-1B, F-1, B-1/B-2, H-4, L-1 and more. Tips, consulate reviews and approval stories." />
        <link rel="canonical" href={`${getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org"}/visa/${activeVisa.id}/`} />
        <meta property="og:title" content={`${activeVisa.label} Visa Interview Experiences | Apnacircle`} />
        <meta property="og:description" content="Real visa interview experiences shared by immigrants — tips, consulate reviews and approval stories." />
        <meta property="og:url" content={`${getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org"}/visa/${activeVisa.id}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org"}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {!isMobile && <ResourceNav />}
      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>
        <h1 style={s.title}>Visa Interview Experiences</h1>
        <p style={s.desc}>Community members share real interview experiences to help others prepare.</p>
        {inner}
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

function VisaForm({ visaId, groupedConsulates, onSubmit }) {
  const [form, setForm] = useState({ name:"", location:"", interviewDate:"", experience:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = async () => {
    if (!form.experience.trim()) { show("Please share your experience."); return; }
    const ok = await submitVisaExperience(form, visaId);
    if (ok) {
      onSubmit?.({ name: form.name || "Anonymous", location: form.location });
      setForm({ name:"", location:"", interviewDate:"", experience:"" });
    } else {
      show(getSubmitError("Error submitting. Please try again."));
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

function VisaReplies({ experienceId }) {
  const [open, setOpen]       = useState(false);
  const [replies, setReplies] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState({ name: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const load = () => fetchVisaReplies(experienceId).then(setReplies);

  const toggle = () => {
    if (!open && replies === null) load();
    setOpen(v => !v);
  };

  const submit = async () => {
    if (!form.message.trim()) return;
    setSubmitting(true);
    const ok = await submitVisaReply(experienceId, form);
    if (ok) { setSubmitted(true); setShowForm(false); setForm({ name: "", message: "" }); }
    setSubmitting(false);
  };

  return (
    <div style={vr.wrap}>
      <button onClick={toggle} style={vr.toggle}>
        💬 {open ? "Hide" : "Replies"}{replies !== null && replies.length > 0 ? ` (${replies.length})` : ""}
      </button>

      {open && (
        <div style={vr.body}>
          {replies === null ? (
            <p style={vr.loading}>Loading…</p>
          ) : replies.length === 0 ? (
            <p style={vr.empty}>No replies yet. Be the first!</p>
          ) : (
            replies.map(r => (
              <div key={r.id} style={vr.reply}>
                <span style={vr.replyAuthor}>{r.name || "Anonymous"}</span>
                <p style={vr.replyText}>{r.message}</p>
              </div>
            ))
          )}

          {submitted && <p style={vr.success}>✓ Reply submitted — it'll appear after review.</p>}

          {!submitted && !showForm && (
            <button onClick={() => setShowForm(true)} style={vr.replyBtn}>+ Add a reply</button>
          )}

          {!submitted && showForm && (
            <div style={vr.form}>
              <input
                style={vr.input}
                placeholder="Your name (optional)"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              />
              <textarea
                style={vr.textarea}
                placeholder="Your question or comment…"
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              />
              <div style={{ display:"flex", gap:8 }}>
                <button style={vr.submitBtn} onClick={submit} disabled={submitting}>
                  {submitting ? "…" : "Submit"}
                </button>
                <button style={vr.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const vr = {
  wrap:        { marginTop:10 },
  toggle:      { fontSize:12, fontWeight:700, color:"#555", background:"none", border:"0.5px solid var(--border)", borderRadius:20, padding:"4px 12px", cursor:"pointer" },
  body:        { marginTop:10, paddingLeft:4 },
  loading:     { fontSize:13, color:"#999", fontStyle:"italic" },
  empty:       { fontSize:13, color:"#999", fontStyle:"italic" },
  reply:       { borderLeft:"2px solid var(--border)", paddingLeft:12, marginBottom:10 },
  replyAuthor: { fontSize:12, fontWeight:700, color:"var(--orange)" },
  replyText:   { fontSize:13, color:"#444", lineHeight:1.5, margin:"3px 0 0" },
  success:     { fontSize:13, color:"#166534", fontWeight:600, marginTop:6 },
  replyBtn:    { fontSize:12, fontWeight:700, color:"var(--orange)", background:"none", border:"0.5px solid var(--orange)", borderRadius:20, padding:"4px 14px", cursor:"pointer", marginTop:6 },
  form:        { display:"flex", flexDirection:"column", gap:8, marginTop:8 },
  input:       { padding:"7px 12px", fontSize:13, border:"0.5px solid var(--border)", borderRadius:8, outline:"none" },
  textarea:    { padding:"7px 12px", fontSize:13, border:"0.5px solid var(--border)", borderRadius:8, resize:"vertical", minHeight:70, outline:"none", fontFamily:"inherit" },
  submitBtn:   { padding:"7px 18px", fontSize:13, fontWeight:700, color:"#fff", background:"var(--orange)", border:"none", borderRadius:20, cursor:"pointer" },
  cancelBtn:   { padding:"7px 14px", fontSize:13, fontWeight:600, color:"#888", background:"none", border:"0.5px solid var(--border)", borderRadius:20, cursor:"pointer" },
};

function HelpfulButton({ id, count: initialCount }) {
  const storageKey = `apna_helpful_${id}`;
  const [voted, setVoted] = useState(() => !!localStorage.getItem(storageKey));
  const [count, setCount] = useState(initialCount);

  const vote = () => {
    if (voted) return;
    setVoted(true);
    setCount(c => c + 1);
    localStorage.setItem(storageKey, "1");
    voteVisaHelpful(id);
  };

  return (
    <button onClick={vote} style={{ ...vs.helpfulBtn, ...(voted ? vs.helpfulBtnVoted : {}) }}>
      👍 {voted ? "Helpful!" : "Helpful"}{count > 0 ? ` · ${count}` : ""}
    </button>
  );
}

const vs = {
  statsBar:       { display:"flex", flexWrap:"wrap", gap:8, alignItems:"center", marginBottom:14, padding:"10px 0", borderBottom:"0.5px solid var(--border)" },
  statsLabel:     { fontSize:13, fontWeight:700, color:"#333" },
  statsPill:      { fontSize:11, fontWeight:600, color:"#555", background:"#f0eee8", padding:"3px 10px", borderRadius:20 },
  helpfulBtn:     { marginTop:8, padding:"5px 14px", fontSize:12, fontWeight:700, color:"#555", background:"#f5f4f0", border:"0.5px solid var(--border)", borderRadius:20, cursor:"pointer" },
  helpfulBtnVoted:{ color:"#166534", background:"#dcfce7", border:"0.5px solid #bbf7d0", cursor:"default" },
};

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
  card:         { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:20 },
  empty:        { fontSize:14, color:"#777", fontStyle:"italic", textAlign:"center", padding:"1.5rem 0" },
  shareCard:    { background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:"var(--radius)", padding:"1.25rem 1.5rem", marginBottom:20 },
  shareCardRow: { display:"flex", gap:14, alignItems:"flex-start" },
  shareTitle:   { fontSize:15, fontWeight:800, color:"#14532d", marginBottom:4 },
  shareDesc:    { fontSize:13, color:"#166534", marginBottom:2 },
  sharePending: { fontSize:12, color:"#4b7a5a", fontStyle:"italic" },
  shareWa:      { display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:700, color:"#16a34a", background:"#fff", border:"1px solid #bbf7d0", borderRadius:20, padding:"6px 14px", textDecoration:"none" },
  shareDismiss: { fontSize:12, fontWeight:600, color:"#888", background:"none", border:"0.5px solid var(--border)", borderRadius:20, padding:"6px 14px", cursor:"pointer" },
};
