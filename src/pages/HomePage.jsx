import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchStates, fetchAllEvents } from "../lib/db";
import AdBlock from "../components/AdBlock";
import { useAds } from "../lib/AdsContext";
import { useIsMobile } from "../lib/useIsMobile";
import { ScrollTabBar } from "../components/ScrollTabBar";
import { fmtEventDate, daysUntilBadge } from "../components/formHelpers";
import { getCountrySlug, getFormsResource, getVisaStartPath } from "../lib/country";

export default function HomePage() {
  const [states, setStates] = useState([]);
  const [events, setEvents] = useState([]);
  const { ads } = useAds();
  const isMobile = useIsMobile();
  const regionLabel = getCountrySlug() === "ca" ? "Province" : "State";
  const formsResource = getFormsResource();
  const leftNav = [
    { icon: "📅", label: "Events",              to: "#events" },
    { icon: "🪪", label: "Visa Experiences",    to: getVisaStartPath() },
    { icon: "💡", label: "Immigration Tips",     to: "/immigration" },
    { icon: "📋", label: `${formsResource.label} Tips`, to: "/ds160" },
    { icon: "⚖️",  label: "Immigration Lawyers", to: "/lawyers" },
    { icon: "🏥", label: "Health & Wellness",    to: "/health" },
  ];

  useEffect(() => {
    fetchStates().then(setStates);
    fetchAllEvents().then(setEvents);
  }, []);

  return (
    <div>
      {/* Hero */}
      <div style={s.hero}>
        <p style={{ ...s.sub, whiteSpace: isMobile ? "normal" : "nowrap" }}>A community-powered FREE resource for immigrants, No Ads, No fees, No Spam — visa experiences, legal help, jobs, housing and local services.</p>
      </div>

      {/* mobile quick-nav */}
      {isMobile && (
        <ScrollTabBar style={{ padding:"0 1rem 0.75rem", borderBottom:"0.5px solid var(--border)" }}>
          {leftNav.map(item => (
            item.to.startsWith("#")
              ? <a key={item.to} href={item.to} style={s.mobileNavItem}>{item.icon}<span style={s.mobileNavLabel}>{item.label}</span></a>
              : <Link key={item.to} to={item.to} style={s.mobileNavItem}>{item.icon}<span style={s.mobileNavLabel}>{item.label}</span></Link>
          ))}
        </ScrollTabBar>
      )}

      {/* body */}
      <div style={{ ...s.body, flexDirection: isMobile ? "column" : "row" }}>
        {/* Left nav — desktop only */}
        {!isMobile && (
          <aside style={s.leftNav}>
            <p style={s.navLabel}>Resources</p>
            {leftNav.map(item => (
              item.to.startsWith("#")
                ? <a key={item.to} href={item.to} style={s.navLink}><span>{item.icon}</span> {item.label}</a>
                : <Link key={item.to} to={item.to} style={s.navLink}><span>{item.icon}</span> {item.label}</Link>
            ))}
          </aside>
        )}

        {/* Center */}
        <main style={s.center}>
          {/* States */}
          <p style={s.sectionLabel}>🗺️ Browse by {regionLabel}</p>
          <div style={s.stateGrid}>
            {states.map(state => <StateCard key={state.slug} state={state} />)}
          </div>

          {/* Upcoming events */}
          <div id="events" style={{ marginTop: 32 }}>
            <p style={s.sectionLabel}>📅 Upcoming Events</p>
            {events.length > 0 ? (
              <div style={s.eventList}>
                {events.map(e => {
                  const badge = daysUntilBadge(e.event_date);
                  return (
                    <div key={e.id} style={s.eventCard}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                        <span style={s.eventName}>{e.name}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:"#fff", background:badge.color, padding:"2px 7px", borderRadius:20, flexShrink:0 }}>{badge.label}</span>
                      </div>
                      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                        <span style={s.eventMeta}>📅 {fmtEventDate(e.event_date)}{e.event_time ? ` · ${e.event_time}` : ""}</span>
                        {e.location  && <span style={s.eventMeta}>📍 {e.location}</span>}
                        {e.entry_fee && <span style={s.eventMeta}>🎟️ {e.entry_fee}</span>}
                        <span style={{ ...s.eventMeta, marginLeft:"auto" }}>
                          <Link to={`/states/${e.state_slug}/${e.city_slug}`} style={{ color:"var(--orange)", fontWeight:600 }}>
                            {e.city_slug} →
                          </Link>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ fontSize:13, color:"#999", fontStyle:"italic" }}>No upcoming events yet — add one from your city page.</p>
            )}
          </div>
        </main>

        {/* Right — ads, desktop only */}
        {!isMobile && ads.global && (
          <aside style={s.rail}>
            <AdBlock />
            <AdBlock />
          </aside>
        )}
      </div>

      <footer style={s.footer}>© 2026 Apnacircle. Built by the community, for the community.</footer>
    </div>
  );
}

function StateCard({ state }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/states/${state.slug}`} style={{ textDecoration: "none" }}>
      <div style={{ ...s.stateCard, ...(hovered ? s.stateCardHover : {}) }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <span style={{ fontSize: 32 }}>{state.icon}</span>
        <p style={s.stateName}>{state.name}</p>
        <p style={s.stateAbbr}>{state.abbr}</p>
      </div>
    </Link>
  );
}

const s = {
  hero:         { textAlign: "center", padding: "2rem 1rem 1.25rem" },
  sub:          { color: "#555", fontSize: "clamp(10px, 1.1vw, 14px)", whiteSpace: "nowrap", margin: "0 auto" },
  body:         { padding: "0 1.5rem 2rem", display: "flex", gap: 24, alignItems: "flex-start" },
  leftNav:      { width: 180, flexShrink: 0, background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem", position: "sticky", top: 72 },
  navLabel:     { fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  navLink:      { display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", fontSize: 13, fontWeight: 600, color: "#444", borderRadius: 8, marginBottom: 2, textDecoration: "none" },
  center:       { flex: 1, minWidth: 0 },
  rail:         { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 72 },
  sectionLabel: { fontSize: 13, fontWeight: 700, color: "#666", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5 },
  stateGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 },
  stateCard:    { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem", textAlign: "center", transition: "box-shadow 0.15s, transform 0.15s" },
  stateCardHover: { boxShadow: "0 4px 16px rgba(0,0,0,0.08)", transform: "translateY(-2px)" },
  stateName:    { fontSize: 14, fontWeight: 700, color: "var(--orange)", marginTop: 6 },
  stateAbbr:    { fontSize: 11, color: "var(--muted)", fontWeight: 600 },
  eventList:    { display: "flex", flexDirection: "column", gap: 10 },
  eventCard:    { background: "#fff", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 16px" },
  eventName:    { fontSize: 14, fontWeight: 700, color: "#111" },
  eventMeta:    { fontSize: 12, color: "var(--muted)" },
  mobileNavItem:{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"6px 12px", flexShrink:0, textDecoration:"none", color:"#444" },
  mobileNavLabel:{ fontSize:10, fontWeight:700, whiteSpace:"nowrap" },
  footer:       { textAlign: "center", padding: "1.5rem", borderTop: "0.5px solid var(--border)", color: "#aaa", fontSize: 13, background: "#fff", marginTop: "1rem" },
};
