import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchStates, fetchAllEvents } from "../lib/db";
import AdBlock from "../components/AdBlock";
import { useAds } from "../lib/AdsContext";
import ResourceNav, { MobileResourceNav } from "../components/ResourceNav";
import { fmtEventDate, daysUntilBadge, MapLink } from "../components/formHelpers";
import { getCountrySlug } from "../lib/country";

export default function HomePage() {
  const [states, setStates] = useState([]);
  const [events, setEvents] = useState([]);
  const { ads } = useAds();
  const countrySlug = getCountrySlug();
  const regionLabel = countrySlug === "ca" ? "Province" : "State";
  const siteBase = countrySlug === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org";

  useEffect(() => {
    fetchStates().then(setStates);
    fetchAllEvents().then(setEvents);
  }, []);

  return (
    <div>
      <Helmet>
        <title>Apnacircle — Free Community Hub for Immigrants in the US & Canada</title>
        <meta name="description" content="Free resource for immigrants — visa experiences, immigration lawyers, local jobs, housing, doctors, events and more. No ads, no signup, no fees." />
        <meta name="keywords" content="immigrant community, visa experiences, immigration help, Indian community USA, Pakistani community, Korean community, Chinese immigrant community, Japanese community, Sri Lankan community, Mexican immigrant community, desi community, H1B tips, F1 visa, immigration lawyers, South Asian community, Asian immigrant" />
        <link rel="canonical" href={`${siteBase}/`} />
        <link rel="alternate" hreflang="en-us" href="https://apnacircle.org/" />
        <link rel="alternate" hreflang="en-ca" href="https://ca.apnacircle.org/" />
        <link rel="alternate" hreflang="x-default" href="https://apnacircle.org/" />
        <meta property="og:title" content="Apnacircle — Free Community Hub for Immigrants in the US & Canada" />
        <meta property="og:description" content="Free resource for immigrants — visa experiences, immigration lawyers, local jobs, housing, doctors, events and more. No ads, no signup, no fees." />
        <meta property="og:url" content={`${siteBase}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${siteBase}/og-image.svg`} />
        <script type="application/ld+json">{JSON.stringify([
          { "@context":"https://schema.org","@type":"Organization","name":"Apnacircle","url":siteBase,"logo":`${siteBase}/favicon.svg`,"description":"Free community hub for immigrants in the US & Canada" },
          { "@context":"https://schema.org","@type":"WebSite","url":siteBase,"name":"Apnacircle" }
        ])}</script>
      </Helmet>
      {/* Hero */}
      <div style={s.hero}>
        <p className="hero-sub" style={s.sub}>A community-powered FREE resource that focus on helping immigrants, No Ads, No fees, No Spam — visa experiences, legal help, Doctos, jobs, housing and local services in both <a href="https://apnacircle.org" target="_blank" rel="noopener noreferrer" style={{ color:"var(--orange)", fontWeight:700 }}>USA</a> & <a href="https://ca.apnacircle.org" target="_blank" rel="noopener noreferrer" style={{ color:"var(--orange)", fontWeight:700 }}>Canada</a>.</p>
      </div>

      {/* mobile quick-nav */}
      <div className="mobile-only">
        <MobileResourceNav style={{ padding:"0 1rem 0.75rem", borderBottom:"0.5px solid var(--border)" }} />
      </div>

      {/* body */}
      <div className="home-body" style={s.body}>
        {/* Left nav — desktop only */}
        <div className="home-sidebar">
          <ResourceNav />
        </div>

        {/* Center */}
        <main style={s.center}>
          {/* States */}
          <p style={s.sectionLabel}>🗺️ Browse by {regionLabel}</p>
          <div className="state-grid" style={s.stateGrid}>
            {states.map(state => <StateCard key={state.slug} state={state} />)}
          </div>

          {/* Upcoming events */}
          <div id="events" style={s.eventsSection}>
            <p style={s.sectionLabel}>📅 Upcoming Events</p>
            {events.length > 0 ? (
              <div style={s.eventList}>
                {events.map(e => {
                  const badge = daysUntilBadge(e.event_date);
                  return (
                    <div key={e.id} style={s.eventCard}>
                      <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                        <span style={s.eventName}>{e.name}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:"#fff", background:badge.color, padding:"2px 8px", borderRadius:20, flexShrink:0 }}>{badge.label}</span>
                      </div>
                      <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom: e.notes ? 6 : 0 }}>
                        <span style={s.eventMeta}>📅 {fmtEventDate(e.event_date)}{e.event_time ? ` · ${e.event_time}` : ""}</span>
                        {e.location  && <span style={s.eventMeta}>📍 <MapLink query={e.location}>{e.location}</MapLink></span>}
                        {e.entry_fee && <span style={s.eventMeta}>🎟️ {e.entry_fee}</span>}
                        <span style={{ ...s.eventMeta, marginLeft:"auto" }}>
                          <Link to={`/states/${e.state_slug}/${e.city_slug}`} style={{ color:"var(--orange)", fontWeight:600 }}>
                            {e.city_slug} →
                          </Link>
                        </span>
                      </div>
                      {e.notes && <p style={s.eventText}>{e.notes}</p>}
                      {e.ticket_url && (
                        <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" style={s.ticketLink}>
                          Get Tickets →
                        </a>
                      )}
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
        {ads.global && (
          <aside className="home-rail" style={s.rail}>
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
  body:         { padding: "0 1.5rem 2rem", display: "flex", flexDirection: "row", gap: 24, alignItems: "flex-start" },
  center:       { flex: 1, minWidth: 0 },
  rail:         { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 72 },
  sectionLabel: { fontSize: 13, fontWeight: 700, color: "#666", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: 0.5 },
  stateGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 },
  stateCard:    { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem", textAlign: "center", transition: "box-shadow 0.15s, transform 0.15s" },
  stateCardHover: { boxShadow: "0 4px 16px rgba(0,0,0,0.08)", transform: "translateY(-2px)" },
  stateName:    { fontSize: 14, fontWeight: 700, color: "var(--orange)", marginTop: 6 },
  stateAbbr:    { fontSize: 11, color: "var(--muted)", fontWeight: 600 },
  eventList:    { display: "flex", flexDirection: "column", gap: 10 },
  eventsSection:{ marginTop: 32, scrollMarginTop: 72 },
  eventCard:    { background: "#fff", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 16px" },
  eventName:    { fontSize: 14, fontWeight: 700, color: "#111" },
  eventMeta:    { fontSize: 12, color: "var(--muted)" },
  eventText:    { fontSize: 14, color: "#333", lineHeight: 1.6, marginTop: 4 },
  ticketLink:   { display: "inline-block", marginTop: 8, fontSize: 13, fontWeight: 700, color: "var(--orange)", textDecoration: "none" },
  footer:       { textAlign: "center", padding: "1.5rem", borderTop: "0.5px solid var(--border)", color: "#aaa", fontSize: 13, background: "#fff", marginTop: "1rem" },
};
