import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { f, useToast, Toast, fmtDate } from "../../components/formHelpers";
import { fetchTips, getSubmitError, submitTip } from "../../lib/db";
import AdBlock from "../../components/AdBlock";
import { useIsMobile } from "../../lib/useIsMobile";
import { getCountryName, getFormsResource } from "../../lib/country";

export function ImmigrationPage() {
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();
  const countryName = getCountryName();

  const reload = () => fetchTips("immigration_tips").then(setPosts);
  useEffect(() => { reload(); }, []);

  const filtered = search
    ? posts.filter(p => [p.tip, p.name, p.port_of_entry].some(v => v?.toLowerCase().includes(search.toLowerCase())))
    : posts;

  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>
        <div style={{ ...s.header, flexWrap:"wrap" }}>
          <span style={{ fontSize:32 }}>💡</span>
          <div style={{ flex:1 }}>
            <h1 style={s.title}>Immigration Experiences</h1>
            <p style={s.desc}>General advice shared by the community to help navigate the {countryName} immigration process.</p>
          </div>
          <button style={s.addBtn} onClick={() => setShowForm(v => !v)}>
            {showForm ? "✕ Cancel" : "+ Your Immigration Experience"}
          </button>
        </div>

        {showForm && (
          <div style={s.card}>
            <ImmigrationForm onSubmit={() => { setShowForm(false); reload(); }} />
          </div>
        )}

        <div style={s.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:10 }}>
            <h3 style={{ fontSize:16, fontWeight:700, margin:0 }}>Community Experiences</h3>
            <input style={{ ...f.input, width:220, margin:0 }} placeholder="Search experiences..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {filtered.length > 0 ? (
            filtered.map(p => (
              <div key={p.id} style={f.card}>
                <div style={f.postMeta}>
                  <span style={f.postAuthor}>{p.name || "Anonymous"}</span>
                  <span style={f.postDate}>{fmtDate(p.created_at)}</span>
                </div>
                {p.port_of_entry && <p style={f.sub}>✈️ Port of Entry: {p.port_of_entry}</p>}
                <p style={f.text}>{p.tip}</p>
              </div>
            ))
          ) : (
            <p style={s.empty}>
              {search ? `No results for "${search}".` : "Be the first to share your immigration experience!"}
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

function ImmigrationForm({ onSubmit }) {
  const [form, setForm] = useState({ name:"", portOfEntry:"", context:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = async () => {
    if (!form.context.trim()) { show("Please share your experience."); return; }
    const ok = await submitTip("immigration_tips", {
      name:          form.name || null,
      port_of_entry: form.portOfEntry || null,
      tip:           form.context,
    });
    if (ok) {
      setForm({ name:"", portOfEntry:"", context:"" });
      show("✓ Submitted for review! Thank you.");
      setTimeout(() => onSubmit?.(), 1500);
    } else {
      show(getSubmitError("Error submitting. Please try again."));
    }
  };
  return (
    <>
      <h3 style={f.sectionTitle}>Share Your Experience</h3>
      <div style={f.grid2}>
        <div style={f.group}>
          <label style={f.label}>Your Name (optional)</label>
          <input style={f.input} value={form.name} onChange={set("name")} placeholder="Anonymous" />
        </div>
        <div style={f.group}>
          <label style={f.label}>Port of Entry</label>
          <input style={f.input} value={form.portOfEntry} onChange={set("portOfEntry")} placeholder="e.g. JFK, ORD, LAX" maxLength={20} />
        </div>
        <div style={{...f.group,...f.span2}}>
          <label style={f.label}>Your Experience <span style={f.req}>*</span></label>
          <textarea style={f.textarea} value={form.context} onChange={set("context")} placeholder="Share your immigration experience, tips, what to expect..." />
        </div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      <Toast msg={msg} />
    </>
  );
}

export function DS160Page() {
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const isMobile = useIsMobile();
  const formsResource = getFormsResource();

  const reload = () => fetchTips("ds160_tips").then(setPosts);
  useEffect(() => { reload(); }, []);

  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>
        <div style={{ ...s.header, flexWrap:"wrap" }}>
          <span style={{ fontSize:32 }}>📋</span>
          <div style={{ flex:1 }}>
            <h1 style={s.title}>{formsResource.title}</h1>
            <p style={s.desc}>{formsResource.description}</p>
          </div>
          <button style={s.addBtn} onClick={() => setShowForm(v => !v)}>
            {showForm ? "✕ Cancel" : formsResource.addLabel}
          </button>
        </div>

        {showForm && (
          <div style={s.card}>
            <DS160Form formsResource={formsResource} onSubmit={() => { setShowForm(false); reload(); }} />
          </div>
        )}

        <div style={s.card}>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>Community Tips</h3>
          {posts.length > 0 ? (
            posts.map(p => (
              <div key={p.id} style={f.card}>
                <div style={f.postMeta}>
                  <span style={f.postAuthor}>{p.name || "Anonymous"}</span>
                  <span style={f.postDate}>{fmtDate(p.created_at)}</span>
                </div>
                <p style={f.text}>{p.tip}</p>
              </div>
            ))
          ) : (
            <p style={s.empty}>{formsResource.empty}</p>
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

function DS160Form({ formsResource, onSubmit }) {
  const [form, setForm] = useState({ name:"", context:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = async () => {
    if (!form.context.trim()) { show("Please share your tip."); return; }
    const ok = await submitTip("ds160_tips", {
      name: form.name || null,
      tip:  form.context,
    });
    if (ok) {
      setForm({ name:"", context:"" });
      show("✓ Submitted for review! Thank you.");
      setTimeout(() => onSubmit?.(), 1500);
    } else {
      show(getSubmitError("Error submitting. Please try again."));
    }
  };
  return (
    <>
      <h3 style={f.sectionTitle}>Share Your Tip</h3>
      <div style={f.grid1}>
        <div style={f.group}>
          <label style={f.label}>Your Name (optional)</label>
          <input style={f.input} value={form.name} onChange={set("name")} placeholder="Anonymous" />
        </div>
        <div style={f.group}>
          <label style={f.label}>Your Tip <span style={f.req}>*</span></label>
          <textarea style={f.textarea} value={form.context} onChange={set("context")} placeholder={formsResource.placeholder} />
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
  header:  { display:"flex", alignItems:"center", gap:16, marginBottom:"1.5rem" },
  title:   { fontSize:28, fontWeight:800, color:"#111", marginBottom:4 },
  desc:    { fontSize:14, color:"#555" },
  card:    { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:20 },
  addBtn:  { marginLeft:"auto", padding:"8px 18px", background:"#555", color:"#fff", border:"none", borderRadius:20, fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" },
  empty:   { fontSize:14, color:"#777", fontStyle:"italic", textAlign:"center", padding:"1.5rem 0" },
};
