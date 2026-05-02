import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { loadAllSubmissions, updateSubmissionStatus, f } from "../components/formHelpers";

const ADMIN_PASSWORD = "apna2026"; // ← change this!
const AUTO_SECTIONS  = ["job_offer","job_seek","acc_looking","acc_providing"];
const MANUAL_SECTIONS = ["temples","lawyers","realtors","priests","photographers","visa","immigration","ds160"];
const SECTION_LABELS = {
  job_offer:"Job Offering", job_seek:"Job Seeking", acc_looking:"Accommodation Seeking",
  acc_providing:"Accommodation Offering", temples:"Temple/Mosque", lawyers:"Lawyers",
  realtors:"Realtors", priests:"Priests", photographers:"Photographers",
  visa:"Visa Experience", immigration:"Immigration Tip", ds160:"DS-160 Tip",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [sectionFilter, setSectionFilter] = useState("all");

  useEffect(() => {
    if (authed) setSubmissions(loadAllSubmissions());
  }, [authed]);

  const refresh = () => setSubmissions(loadAllSubmissions());

  const approve = (id) => { updateSubmissionStatus(id, "approved"); refresh(); };
  const reject  = (id) => { updateSubmissionStatus(id, "rejected");  refresh(); };

  if (!authed) {
    return (
      <div style={{ maxWidth:400, margin:"4rem auto", padding:"0 1.5rem" }}>
        <Link to="/" style={{ color:"var(--orange)", fontSize:13, fontWeight:600 }}>← Home</Link>
        <h1 style={{ fontSize:28, fontWeight:800, margin:"1rem 0" }}>Admin Login</h1>
        <div style={f.group}>
          <label style={f.label}>Password</label>
          <input style={f.input} type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && pw === ADMIN_PASSWORD && setAuthed(true)} />
        </div>
        <button style={{ ...f.btn, marginTop:12 }} onClick={() => pw === ADMIN_PASSWORD ? setAuthed(true) : alert("Wrong password")}>Login</button>
      </div>
    );
  }

  const filtered = submissions.filter(s => {
    const statusMatch  = filter === "all" || s.status === filter;
    const sectionMatch = sectionFilter === "all" || s.section === sectionFilter;
    return statusMatch && sectionMatch;
  });

  const pending  = submissions.filter(s => s.status === "pending").length;
  const approved = submissions.filter(s => s.status === "approved").length;
  const rejected = submissions.filter(s => s.status === "rejected").length;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <Link to="/" style={{ color:"var(--orange)", fontSize:13, fontWeight:600 }}>← Home</Link>
          <h1 style={s.title}>Admin Dashboard</h1>
        </div>
        <button style={f.btnOutline} onClick={() => setAuthed(false)}>Logout</button>
      </div>

      {/* Stats */}
      <div style={s.statRow}>
        <StatCard label="Pending Review" value={pending}  color="#f59e0b" />
        <StatCard label="Approved"       value={approved} color="#10b981" />
        <StatCard label="Rejected"       value={rejected} color="#ef4444" />
        <StatCard label="Total"          value={submissions.length} color="#6366f1" />
      </div>

      {/* Filters */}
      <div style={s.filterRow}>
        <div style={f.group}>
          <label style={f.label}>Status</label>
          <select style={f.select} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div style={f.group}>
          <label style={f.label}>Section</label>
          <select style={f.select} value={sectionFilter} onChange={e => setSectionFilter(e.target.value)}>
            <option value="all">All Sections</option>
            {[...AUTO_SECTIONS,...MANUAL_SECTIONS].map(sec => <option key={sec} value={sec}>{SECTION_LABELS[sec]}</option>)}
          </select>
        </div>
      </div>

      {/* Submissions table */}
      {filtered.length === 0
        ? <p style={f.empty}>No submissions match this filter.</p>
        : filtered.map(sub => <SubmissionCard key={sub.id} sub={sub} onApprove={approve} onReject={reject} />)
      }
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background:"#fff", border:"0.5px solid var(--border)", borderRadius:10, padding:"1rem 1.25rem", flex:1 }}>
      <p style={{ fontSize:28, fontWeight:800, color }}>{value}</p>
      <p style={{ fontSize:13, color:"#555" }}>{label}</p>
    </div>
  );
}

function SubmissionCard({ sub, onApprove, onReject }) {
  const isManual = MANUAL_SECTIONS.includes(sub.section);
  const statusColors = { pending:"#f59e0b", approved:"#10b981", rejected:"#ef4444" };

  return (
    <div style={{ background:"#fff", border:"0.5px solid var(--border)", borderRadius:10, padding:"1.25rem", marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <span style={{ ...f.tag, background:"#f0f0f0", color:"#333" }}>{SECTION_LABELS[sub.section] || sub.section}</span>
          {sub.stateSlug && <span style={{ ...f.tag, background:"#e8f4ff", color:"#0066cc" }}>{sub.stateSlug} / {sub.citySlug}</span>}
          {isManual
            ? <span style={{ ...f.tag, background:"#fff3cd", color:"#856404" }}>⏳ Manual review</span>
            : <span style={{ ...f.tag, background:"#d4edda", color:"#155724" }}>⚡ Auto-approved</span>
          }
        </div>
        <span style={{ fontSize:12, fontWeight:700, color: statusColors[sub.status] }}>● {sub.status?.toUpperCase()}</span>
      </div>

      {/* Show all fields */}
      <div style={{ fontSize:13, color:"#333", lineHeight:1.8 }}>
        {Object.entries(sub).filter(([k]) => !["id","status","createdAt","stateSlug","citySlug","section"].includes(k)).map(([k,v]) => v ? (
          <div key={k}><strong style={{ textTransform:"capitalize", color:"#555" }}>{k.replace(/([A-Z])/g," $1")}:</strong> {String(v)}</div>
        ) : null)}
        <div style={{ marginTop:4 }}><strong style={{ color:"#555" }}>Submitted:</strong> {sub.createdAt}</div>
      </div>

      {/* Actions */}
      {sub.status === "pending" && (
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          <button style={{ ...f.btnSm, background:"#10b981" }} onClick={() => onApprove(sub.id)}>✓ Approve</button>
          <button style={{ ...f.btnSm, background:"#ef4444" }} onClick={() => onReject(sub.id)}>✕ Reject</button>
        </div>
      )}
      {sub.status === "approved" && <button style={{ ...f.btnSm, background:"#ef4444", marginTop:10 }} onClick={() => onReject(sub.id)}>Revoke</button>}
      {sub.status === "rejected" && <button style={{ ...f.btnSm, background:"#10b981", marginTop:10 }} onClick={() => onApprove(sub.id)}>Re-approve</button>}
    </div>
  );
}

const s = {
  page: { maxWidth:960, margin:"0 auto", padding:"1.5rem 1.5rem 3rem" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem" },
  title: { fontSize:28, fontWeight:800, color:"#111", marginTop:6 },
  statRow: { display:"flex", gap:14, marginBottom:"1.5rem", flexWrap:"wrap" },
  filterRow: { display:"grid", gridTemplateColumns:"200px 200px", gap:14, marginBottom:"1.5rem" },
};
