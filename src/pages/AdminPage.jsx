import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { f } from "../components/formHelpers";
import { fetchAllSubmissions, fetchContactMessages, fetchStates, updateAdsSettings } from "../lib/db";
import { useAds } from "../lib/AdsContext";
import AdminGate from "./admin/AdminGate";

export default function AdminPage() {
  return (
    <AdminGate>
      {({ logout }) => <AdminDashboard logout={logout} />}
    </AdminGate>
  );
}

function AdminDashboard({ logout }) {
  const [pendingCount, setPendingCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [states, setStates] = useState([]);
  const { ads, setAds } = useAds();

  useEffect(() => {
    fetchAllSubmissions().then(rows => setPendingCount(rows.filter(row => row.status === "pending").length));
    fetchContactMessages().then(rows => setMessageCount(rows.length));
    fetchStates().then(setStates);
  }, []);

  const toggleGlobalAds = async val => {
    const updated = { ...ads, global: val };
    setAds(updated);
    await updateAdsSettings(updated);
  };

  const toggleStateAds = async (slug, val) => {
    const updated = { ...ads, states: { ...ads.states, [slug]: val } };
    setAds(updated);
    await updateAdsSettings(updated);
  };

  return (
    <main style={s.page}>
      <div style={s.header}>
        <div>
          <Link to="/" style={s.back}>Back to home</Link>
          <h1 style={s.title}>Admin Dashboard</h1>
        </div>
        <button style={f.btnOutline} onClick={logout}>Logout</button>
      </div>

      <div style={s.actions}>
        <AdminButton
          to="/admin/messages"
          title="Messages"
          count={messageCount}
          description="Read messages submitted from the Contact Us page."
        />
        <AdminButton
          to="/admin/approvals"
          title="Approvals"
          count={pendingCount}
          description="Review pending posts and manage approval settings."
        />
      </div>

      <section style={s.settingsBox}>
        <h2 style={s.settingsTitle}>Ad Display Settings</h2>
        <p style={s.settingsDesc}>Control which ads appear on the site.</p>

        <div style={s.settingRow}>
          <span style={s.settingLabel}>Show Ads Globally</span>
          <div style={s.toggle}>
            <span style={{ ...s.toggleOption, ...(ads.global ? {} : s.toggleActive) }}>Off</span>
            <div onClick={() => toggleGlobalAds(!ads.global)} style={{ ...s.toggleSwitch, background: ads.global ? "#10b981" : "#ccc" }}>
              <div style={{ ...s.toggleThumb, transform: ads.global ? "translateX(18px)" : "translateX(2px)" }} />
            </div>
            <span style={{ ...s.toggleOption, ...(ads.global ? s.toggleActive : {}) }}>On</span>
          </div>
        </div>

        {ads.global && (
          <div style={{ ...s.settingsGrid, marginTop:10 }}>
            {states.map(state => {
              const enabled = ads.states[state.slug] !== false;
              return (
                <div key={state.slug} style={s.settingRow}>
                  <span style={s.settingLabel}>{state.icon} {state.name}</span>
                  <div style={s.toggle}>
                    <span style={{ ...s.toggleOption, ...(enabled ? {} : s.toggleActive) }}>Off</span>
                    <div onClick={() => toggleStateAds(state.slug, !enabled)} style={{ ...s.toggleSwitch, background: enabled ? "#10b981" : "#ccc" }}>
                      <div style={{ ...s.toggleThumb, transform: enabled ? "translateX(18px)" : "translateX(2px)" }} />
                    </div>
                    <span style={{ ...s.toggleOption, ...(enabled ? s.toggleActive : {}) }}>On</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function AdminButton({ to, title, count, description }) {
  return (
    <Link to={to} style={s.actionCard}>
      <div style={s.count}>{count}</div>
      <h2 style={s.actionTitle}>{title}</h2>
      <p style={s.actionDesc}>{description}</p>
    </Link>
  );
}

const s = {
  page: { padding:"1.5rem 1.5rem 3rem", maxWidth:960, margin:"0 auto" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem" },
  back: { color:"var(--orange)", fontSize:13, fontWeight:600 },
  title: { fontSize:28, fontWeight:800, color:"#111", marginTop:6 },
  actions: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap:16, marginBottom:"1.5rem" },
  actionCard: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:10, padding:"1.5rem", color:"#111", textDecoration:"none" },
  count: { fontSize:32, fontWeight:800, color:"var(--orange)", marginBottom:12 },
  actionTitle: { fontSize:20, fontWeight:800, marginBottom:8 },
  actionDesc: { fontSize:14, color:"#555", lineHeight:1.6 },
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
};
