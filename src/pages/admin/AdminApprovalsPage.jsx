import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { f } from "../../components/formHelpers";
import { fetchAllSubmissions, fetchSettings, updateSetting, updateStatus } from "../../lib/db";
import AdminGate from "./AdminGate";

const TABLE_LABELS = {
  accommodation: "Accommodation",
  babysitters: "Baby Sitters",
  doctors: "Doctors",
  events: "Events",
  health_tips: "Health & Wellness",
  jobs: "Jobs",
  lawyers: "Lawyers",
  photographers: "Photographers",
  priests: "Priests",
  realtors: "Realtors",
  temples: "Temples / Mosques",
  tutors: "Tutors",
  visa_experiences: "Visa Experiences",
};

const SECTIONS_ALPHA = Object.entries(TABLE_LABELS).sort((a, b) => a[1].localeCompare(b[1]));
const SKIP_KEYS = new Set(["id", "status", "created_at", "country_slug", "state_slug", "city_slug", "_table"]);
const fmt = d => d ? new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "";

export default function AdminApprovalsPage() {
  return (
    <AdminGate>
      {({ logout }) => <ApprovalsDashboard logout={logout} />}
    </AdminGate>
  );
}

function ApprovalsDashboard({ logout }) {
  const [submissions, setSubmissions] = useState([]);
  const [settings, setSettings] = useState({});
  const [filter, setFilter] = useState("pending");
  const [tableFilter, setTableFilter] = useState("all");

  const refresh = async () => {
    const data = await fetchAllSubmissions();
    setSubmissions(data);
  };

  useEffect(() => {
    refresh();
    fetchSettings().then(setSettings);
  }, []);

  const toggleApproval = async (section, val) => {
    setSettings(prev => ({ ...prev, [section]: val }));
    await updateSetting(section, val);
  };

  const approve = async (id, table) => { await updateStatus(table, id, "approved"); refresh(); };
  const reject = async (id, table) => { await updateStatus(table, id, "rejected"); refresh(); };

  const filtered = submissions.filter(sub => {
    const statusMatch = filter === "all" || sub.status === filter;
    const tableMatch = tableFilter === "all" || sub._table === tableFilter;
    return statusMatch && tableMatch;
  });

  const pending = submissions.filter(sub => sub.status === "pending").length;
  const approved = submissions.filter(sub => sub.status === "approved").length;
  const rejected = submissions.filter(sub => sub.status === "rejected").length;

  return (
    <main style={s.page}>
      <div style={s.header}>
        <div>
          <Link to="/admin" style={s.back}>Back to admin</Link>
          <h1 style={s.title}>Approvals</h1>
        </div>
        <button style={f.btnOutline} onClick={logout}>Logout</button>
      </div>

          <div style={s.statRow}>
            <StatCard label="Pending Review" value={pending} color="#f59e0b" />
            <StatCard label="Approved" value={approved} color="#10b981" />
            <StatCard label="Rejected" value={rejected} color="#ef4444" />
            <StatCard label="Total" value={submissions.length} color="#6366f1" />
          </div>

          <div style={s.settingsBox}>
            <h2 style={s.settingsTitle}>Posting Approval Settings</h2>
            <p style={s.settingsDesc}>Toggle sections between auto-approve and manual review.</p>
            <div style={s.settingsGrid}>
              {SECTIONS_ALPHA.map(([key, label]) => (
                <div key={key} style={s.settingRow}>
                  <span style={s.settingLabel}>{label}</span>
                  <div style={s.toggle}>
                    <span style={{ ...s.toggleOption, ...(settings[key] ? {} : s.toggleActive) }}>Manual</span>
                    <div onClick={() => toggleApproval(key, !settings[key])} style={{ ...s.toggleSwitch, background: settings[key] ? "#10b981" : "#ccc" }}>
                      <div style={{ ...s.toggleThumb, transform: settings[key] ? "translateX(18px)" : "translateX(2px)" }} />
                    </div>
                    <span style={{ ...s.toggleOption, ...(settings[key] ? s.toggleActive : {}) }}>Auto</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
              <select style={f.select} value={tableFilter} onChange={e => setTableFilter(e.target.value)}>
                <option value="all">All Sections</option>
                {SECTIONS_ALPHA.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
          </div>

          {filtered.length === 0
            ? <p style={f.empty}>No submissions match this filter.</p>
            : filtered.map(sub => <SubmissionCard key={`${sub._table}-${sub.id}`} sub={sub} settings={settings} onApprove={approve} onReject={reject} />)
          }
    </main>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={s.statCard}>
      <p style={{ fontSize:28, fontWeight:800, color }}>{value}</p>
      <p style={{ fontSize:13, color:"#555" }}>{label}</p>
    </div>
  );
}

function SubmissionCard({ sub, settings, onApprove, onReject }) {
  const isAuto = settings[sub._table] === true;
  const statusColors = { pending:"#f59e0b", approved:"#10b981", rejected:"#ef4444" };

  return (
    <div style={s.submission}>
      <div style={s.submissionHeader}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <span style={{ ...f.tag, background:"#f0f0f0", color:"#333" }}>{TABLE_LABELS[sub._table] || sub._table}</span>
          {sub.state_slug && <span style={{ ...f.tag, background:"#e8f4ff", color:"#0066cc" }}>{sub.state_slug} / {sub.city_slug}</span>}
          <span style={{ ...f.tag, background: isAuto ? "#d4edda" : "#fff3cd", color: isAuto ? "#155724" : "#856404" }}>
            {isAuto ? "Auto-approved" : "Manual review"}
          </span>
        </div>
        <span style={{ fontSize:12, fontWeight:700, color: statusColors[sub.status] }}>{sub.status?.toUpperCase()}</span>
      </div>

      <div style={{ fontSize:13, color:"#333", lineHeight:1.8 }}>
        {Object.entries(sub)
          .filter(([key]) => !SKIP_KEYS.has(key) && sub[key])
          .map(([key, val]) => (
            <div key={key}>
              <strong style={{ textTransform:"capitalize", color:"#555" }}>{key.replace(/_/g, " ")}:</strong> {String(val)}
            </div>
          ))}
        <div style={{ marginTop:4 }}><strong style={{ color:"#555" }}>Submitted:</strong> {fmt(sub.created_at)}</div>
      </div>

      {sub.status === "pending" && (
        <div style={s.actionRow}>
          <button style={{ ...f.btnSm, background:"#10b981" }} onClick={() => onApprove(sub.id, sub._table)}>Approve</button>
          <button style={{ ...f.btnSm, background:"#ef4444" }} onClick={() => onReject(sub.id, sub._table)}>Reject</button>
        </div>
      )}
      {sub.status === "approved" && <button style={{ ...f.btnSm, background:"#ef4444", marginTop:10 }} onClick={() => onReject(sub.id, sub._table)}>Revoke</button>}
      {sub.status === "rejected" && <button style={{ ...f.btnSm, background:"#10b981", marginTop:10 }} onClick={() => onApprove(sub.id, sub._table)}>Re-approve</button>}
    </div>
  );
}

const s = {
  page: { padding:"1.5rem 1.5rem 3rem" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem" },
  back: { color:"var(--orange)", fontSize:13, fontWeight:600 },
  title: { fontSize:28, fontWeight:800, color:"#111", marginTop:6 },
  statRow: { display:"flex", gap:14, marginBottom:"1.5rem", flexWrap:"wrap" },
  statCard: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:10, padding:"1rem 1.25rem", flex:1 },
  filterRow: { display:"grid", gridTemplateColumns:"200px 200px", gap:14, marginBottom:"1.5rem" },
  settingsBox: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:10, padding:"1.25rem 1.5rem", marginBottom:"1.5rem" },
  settingsTitle: { fontSize:16, fontWeight:800, color:"#111", marginBottom:4 },
  settingsDesc: { fontSize:13, color:"#666", marginBottom:"1rem" },
  settingsGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:10 },
  settingRow: { display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, padding:"8px 12px", background:"#fafaf8", borderRadius:8, border:"0.5px solid var(--border)" },
  settingLabel: { fontSize:13, fontWeight:600, color:"#333" },
  toggle: { display:"flex", alignItems:"center", gap:6 },
  toggleOption: { fontSize:11, color:"#aaa", fontWeight:600 },
  toggleActive: { color:"#333" },
  toggleSwitch: { width:38, height:22, borderRadius:11, position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 },
  toggleThumb: { position:"absolute", top:2, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,0.3)", transition:"transform 0.2s" },
  submission: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:10, padding:"1.25rem", marginBottom:14 },
  submissionHeader: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, gap:12 },
  actionRow: { display:"flex", gap:8, marginTop:12 },
};
