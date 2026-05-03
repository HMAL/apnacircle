import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { f } from "../components/formHelpers";
import { fetchAllSubmissions, updateStatus, fetchSettings, updateSetting, updateAdsSettings, fetchStates } from "../lib/db";
import { supabase } from "../lib/supabase";
import { useAds } from "../lib/AdsContext";

const TABLE_LABELS = {
  accommodation:     "Accommodation",
  babysitters:       "Baby Sitters",
  doctors:           "Doctors",
  ds160_tips:        "DS-160 Tips",
  events:            "Events",
  health_tips:       "Health & Wellness",
  immigration_tips:  "Immigration Tips",
  jobs:              "Jobs",
  lawyers:           "Lawyers",
  photographers:     "Photographers",
  priests:           "Priests",
  realtors:          "Realtors",
  temples:           "Temples / Mosques",
  tutors:            "Tutors",
  visa_experiences:  "Visa Experiences",
};

const SECTIONS_ALPHA = Object.entries(TABLE_LABELS).sort((a, b) => a[1].localeCompare(b[1]));

const SKIP_KEYS = new Set(["id","status","created_at","state_slug","city_slug","_table"]);
const fmt = d => d ? new Date(d).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) : "";

export default function AdminPage() {
  const [authed, setAuthed]       = useState(false);
  const [email, setEmail]         = useState("");
  const [pw, setPw]               = useState("");
  const [loginErr, setLoginErr]   = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [settings, setSettings]   = useState({});
  const { ads, setAds }           = useAds();
  const [states, setStates]       = useState([]);
  const [filter, setFilter]       = useState("pending");
  const [tableFilter, setTableFilter] = useState("all");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setAuthed(true);
    });
  }, []);

  const refresh = async () => {
    const data = await fetchAllSubmissions();
    setSubmissions(data);
  };

  useEffect(() => {
    if (authed) {
      refresh();
      fetchSettings().then(setSettings);
      fetchStates().then(setStates);
    }
  }, [authed]);

  const login = async () => {
    setLoginErr("");
    setLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoggingIn(false);
    if (error) { setLoginErr("Invalid email or password."); return; }
    setAuthed(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthed(false);
    setEmail("");
    setPw("");
  };

  const toggleApproval = async (section, val) => {
    setSettings(prev => ({ ...prev, [section]: val }));
    await updateSetting(section, val);
  };

  const toggleGlobalAds = async (val) => {
    const updated = { ...ads, global: val };
    setAds(updated);
    await updateAdsSettings(updated);
  };

  const toggleStateAds = async (slug, val) => {
    const updated = { ...ads, states: { ...ads.states, [slug]: val } };
    setAds(updated);
    await updateAdsSettings(updated);
  };

  const approve = async (id, table) => { await updateStatus(table, id, "approved"); refresh(); };
  const reject  = async (id, table) => { await updateStatus(table, id, "rejected");  refresh(); };

  if (!authed) {
    return (
      <div style={{ maxWidth:400, margin:"4rem auto", padding:"0 1.5rem" }}>
        <Link to="/" style={{ color:"var(--orange)", fontSize:13, fontWeight:600 }}>← Home</Link>
        <h1 style={{ fontSize:28, fontWeight:800, margin:"1rem 0" }}>Admin Login</h1>
        <div style={f.group}>
          <label style={f.label}>Email</label>
          <input style={f.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" />
        </div>
        <div style={{ ...f.group, marginTop:12 }}>
          <label style={f.label}>Password</label>
          <input style={f.input} type="password" value={pw} onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()} />
        </div>
        {loginErr && <p style={{ color:"#ef4444", fontSize:13, marginTop:8 }}>{loginErr}</p>}
        <button style={{ ...f.btn, marginTop:12 }} onClick={login} disabled={loggingIn}>
          {loggingIn ? "Signing in…" : "Login"}
        </button>
      </div>
    );
  }

  const filtered = submissions.filter(s => {
    const statusMatch = filter === "all" || s.status === filter;
    const tableMatch  = tableFilter === "all" || s._table === tableFilter;
    return statusMatch && tableMatch;
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
        <button style={f.btnOutline} onClick={logout}>Logout</button>
      </div>

      {/* Stats */}
      <div style={s.statRow}>
        <StatCard label="Pending Review" value={pending}  color="#f59e0b" />
        <StatCard label="Approved"       value={approved} color="#10b981" />
        <StatCard label="Rejected"       value={rejected} color="#ef4444" />
        <StatCard label="Total"          value={submissions.length} color="#6366f1" />
      </div>

      {/* Approval settings */}
      <div style={s.settingsBox}>
        <h2 style={s.settingsTitle}>Posting Approval Settings</h2>
        <p style={s.settingsDesc}>Toggle sections between auto-approve (posts go live immediately) and manual review.</p>
        <div style={s.settingsGrid}>
          {SECTIONS_ALPHA.map(([key, label]) => (
            <div key={key} style={s.settingRow}>
              <span style={s.settingLabel}>{label}</span>
              <div style={s.toggle}>
                <span style={{ ...s.toggleOption, ...(settings[key] ? {} : s.toggleActive) }}>Manual</span>
                <div
                  onClick={() => toggleApproval(key, !settings[key])}
                  style={{ ...s.toggleSwitch, background: settings[key] ? "#10b981" : "#ccc" }}
                >
                  <div style={{ ...s.toggleThumb, transform: settings[key] ? "translateX(18px)" : "translateX(2px)" }} />
                </div>
                <span style={{ ...s.toggleOption, ...(settings[key] ? s.toggleActive : {}) }}>Auto</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ads settings */}
      <div style={s.settingsBox}>
        <h2 style={s.settingsTitle}>Ad Display Settings</h2>
        <p style={s.settingsDesc}>Control which ads appear on the site. Disable globally during rollout, then enable per state when ready.</p>

        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16, padding:"10px 12px", background:"#fafaf8", borderRadius:8, border:"0.5px solid var(--border)" }}>
          <span style={{ fontSize:13, fontWeight:700, color:"#333", flex:1 }}>Show Ads Globally</span>
          <span style={{ ...s.toggleOption, ...(ads.global ? {} : s.toggleActive) }}>Off</span>
          <div onClick={() => toggleGlobalAds(!ads.global)}
            style={{ ...s.toggleSwitch, background: ads.global ? "#10b981" : "#ccc" }}>
            <div style={{ ...s.toggleThumb, transform: ads.global ? "translateX(18px)" : "translateX(2px)" }} />
          </div>
          <span style={{ ...s.toggleOption, ...(ads.global ? s.toggleActive : {}) }}>On</span>
        </div>

        {ads.global && (
          <>
            <p style={{ fontSize:12, color:"#888", marginBottom:10 }}>Per-state — cities inherit their state's setting:</p>
            <div style={s.settingsGrid}>
              {states.map(state => {
                const enabled = ads.states[state.slug] !== false;
                return (
                  <div key={state.slug} style={s.settingRow}>
                    <span style={s.settingLabel}>{state.icon} {state.name}</span>
                    <div style={s.toggle}>
                      <span style={{ ...s.toggleOption, ...(enabled ? {} : s.toggleActive) }}>Off</span>
                      <div onClick={() => toggleStateAds(state.slug, !enabled)}
                        style={{ ...s.toggleSwitch, background: enabled ? "#10b981" : "#ccc" }}>
                        <div style={{ ...s.toggleThumb, transform: enabled ? "translateX(18px)" : "translateX(2px)" }} />
                      </div>
                      <span style={{ ...s.toggleOption, ...(enabled ? s.toggleActive : {}) }}>On</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
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
          <select style={f.select} value={tableFilter} onChange={e => setTableFilter(e.target.value)}>
            <option value="all">All Sections</option>
            {SECTIONS_ALPHA.map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0
        ? <p style={f.empty}>No submissions match this filter.</p>
        : filtered.map(sub => (
            <SubmissionCard key={`${sub._table}-${sub.id}`} sub={sub} settings={settings} onApprove={approve} onReject={reject} />
          ))
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

function SubmissionCard({ sub, settings, onApprove, onReject }) {
  const isAuto = settings[sub._table] === true;
  const statusColors = { pending:"#f59e0b", approved:"#10b981", rejected:"#ef4444" };

  return (
    <div style={{ background:"#fff", border:"0.5px solid var(--border)", borderRadius:10, padding:"1.25rem", marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <span style={{ ...f.tag, background:"#f0f0f0", color:"#333" }}>{TABLE_LABELS[sub._table] || sub._table}</span>
          {sub.state_slug && <span style={{ ...f.tag, background:"#e8f4ff", color:"#0066cc" }}>{sub.state_slug} / {sub.city_slug}</span>}
          {isAuto
            ? <span style={{ ...f.tag, background:"#d4edda", color:"#155724" }}>⚡ Auto-approved</span>
            : <span style={{ ...f.tag, background:"#fff3cd", color:"#856404" }}>⏳ Manual review</span>
          }
        </div>
        <span style={{ fontSize:12, fontWeight:700, color: statusColors[sub.status] }}>● {sub.status?.toUpperCase()}</span>
      </div>

      <div style={{ fontSize:13, color:"#333", lineHeight:1.8 }}>
        {Object.entries(sub)
          .filter(([k]) => !SKIP_KEYS.has(k) && sub[k])
          .map(([k, v]) => (
            <div key={k}>
              <strong style={{ textTransform:"capitalize", color:"#555" }}>{k.replace(/_/g," ")}:</strong> {String(v)}
            </div>
          ))
        }
        <div style={{ marginTop:4 }}><strong style={{ color:"#555" }}>Submitted:</strong> {fmt(sub.created_at)}</div>
      </div>

      {sub.status === "pending" && (
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          <button style={{ ...f.btnSm, background:"#10b981" }} onClick={() => onApprove(sub.id, sub._table)}>✓ Approve</button>
          <button style={{ ...f.btnSm, background:"#ef4444" }} onClick={() => onReject(sub.id, sub._table)}>✕ Reject</button>
        </div>
      )}
      {sub.status === "approved" && <button style={{ ...f.btnSm, background:"#ef4444", marginTop:10 }} onClick={() => onReject(sub.id, sub._table)}>Revoke</button>}
      {sub.status === "rejected" && <button style={{ ...f.btnSm, background:"#10b981", marginTop:10 }} onClick={() => onApprove(sub.id, sub._table)}>Re-approve</button>}
    </div>
  );
}

const s = {
  page:       { padding:"1.5rem 1.5rem 3rem" },
  header:     { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem" },
  title:      { fontSize:28, fontWeight:800, color:"#111", marginTop:6 },
  statRow:    { display:"flex", gap:14, marginBottom:"1.5rem", flexWrap:"wrap" },
  filterRow:  { display:"grid", gridTemplateColumns:"200px 200px", gap:14, marginBottom:"1.5rem" },
  settingsBox:  { background:"#fff", border:"0.5px solid var(--border)", borderRadius:10, padding:"1.25rem 1.5rem", marginBottom:"1.5rem" },
  settingsTitle: { fontSize:16, fontWeight:800, color:"#111", marginBottom:4 },
  settingsDesc:  { fontSize:13, color:"#666", marginBottom:"1rem" },
  settingsGrid:  { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:10 },
  settingRow:    { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:"#fafaf8", borderRadius:8, border:"0.5px solid var(--border)" },
  settingLabel:  { fontSize:13, fontWeight:600, color:"#333" },
  toggle:        { display:"flex", alignItems:"center", gap:6 },
  toggleOption:  { fontSize:11, color:"#aaa", fontWeight:600 },
  toggleActive:  { color:"#333" },
  toggleSwitch:  { width:38, height:22, borderRadius:11, position:"relative", cursor:"pointer", transition:"background 0.2s", flexShrink:0 },
  toggleThumb:   { position:"absolute", top:2, width:18, height:18, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,0.3)", transition:"transform 0.2s" },
};
