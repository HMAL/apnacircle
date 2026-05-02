import { useState } from "react";
import { Link } from "react-router-dom";
import { f, loadPosts, savePost, useToast, Toast } from "../../components/formHelpers";

function TipPage({ icon, title, description, section, placeholder }) {
  const posts = loadPosts("global", "tips", section).filter(p => p.status === "approved");
  const [form, setForm] = useState({ name:"", tip:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = () => {
    if (!form.tip.trim()) { show("Please enter your tip."); return; }
    savePost("global", "tips", section, form, false);
    setForm({ name:"", tip:"" });
    show("✓ Submitted for review!");
  };

  return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← Home</Link>
      <div style={s.header}>
        <span style={{ fontSize:32 }}>{icon}</span>
        <div>
          <h1 style={s.title}>{title}</h1>
          <p style={s.desc}>{description}</p>
        </div>
      </div>
      <div style={s.card}>
        <h3 style={f.sectionTitle}>Share a Tip</h3>
        <div style={f.grid1}>
          <div style={f.group}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.name} onChange={set("name")} placeholder="Anonymous" /></div>
          <div style={f.group}><label style={f.label}>Your Tip <span style={f.req}>*</span></label><textarea style={f.textarea} value={form.tip} onChange={set("tip")} placeholder={placeholder} /></div>
        </div>
        <button style={f.btn} onClick={submit}>Submit</button>
        <Toast msg={msg} />
      </div>
      {posts.length > 0 && (
        <div style={s.card}>
          <h3 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>Community Tips</h3>
          {posts.map(p => (
            <div key={p.id} style={f.card}>
              <div style={f.postMeta}><span style={f.postAuthor}>{p.name || "Anonymous"}</span><span style={f.postDate}>{p.createdAt}</span></div>
              <p style={f.text}>{p.tip}</p>
            </div>
          ))}
        </div>
      )}
      {posts.length === 0 && <p style={f.empty}>No tips yet. Be the first to share!</p>}
    </div>
  );
}

export function ImmigrationPage() {
  return <TipPage icon="💡" title="Immigration Tips" section="immigration"
    description="General advice shared by the community to help navigate the US immigration process."
    placeholder="E.g., Keep copies of all documents. File early to avoid RFEs. Track every I-94..." />;
}

export function DS160Page() {
  return <TipPage icon="📋" title="DS-160 Tips" section="ds160"
    description="Tips from community members who have successfully completed the DS-160 application form."
    placeholder="E.g., Always double-check travel history dates. Use exact passport address. Save frequently..." />;
}

const s = {
  page: { maxWidth: 760, margin:"0 auto", padding:"1.5rem 1.5rem 3rem" },
  back: { color:"var(--orange)", fontSize:13, fontWeight:600, display:"inline-block", marginBottom:8 },
  header: { display:"flex", alignItems:"center", gap:16, marginBottom:"1.5rem" },
  title: { fontSize:28, fontWeight:800, color:"#111", marginBottom:4 },
  desc: { fontSize:14, color:"#555" },
  card: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:20 },
};
