import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchStates, fetchAllEvents, fetchSiteStats } from "../lib/db";
import AdBlock from "../components/AdBlock";
import { useAds } from "../lib/AdsContext";
import ResourceNav, { MobileResourceNav } from "../components/ResourceNav";
import { fmtEventDate, daysUntilBadge, MapLink } from "../components/formHelpers";
import { getCountrySlug } from "../lib/country";

// ─── Community Stats Bar ──────────────────────────────────────────────────────

function StatsBar() {
  const [stats, setStats] = useState(null);
  useEffect(() => { fetchSiteStats().then(setStats); }, []);
  if (!stats) return null;
  const items = [
    { icon: "🛂", label: "visa experiences", count: stats.visaExperiences },
    { icon: "💡", label: "immigration tips",  count: stats.tips },
  ].filter(i => i.count > 0);
  if (!items.length) return null;
  return (
    <div style={hs.statsBar}>
      {items.map((item, i) => (
        <span key={i} style={hs.statItem}>
          {item.icon} <strong>{item.count.toLocaleString()}</strong> {item.label}
        </span>
      ))}
    </div>
  );
}

// ─── Which State Quiz ─────────────────────────────────────────────────────────

const STATE_PROFILES = [
  { name: "California",    abbr: "CA", emoji: "🌴", tags: ["tech","warm","expensive","large-community"],         desc: "Biggest South Asian community, top tech jobs, highest cost of living." },
  { name: "Texas",         abbr: "TX", emoji: "⭐", tags: ["tech","healthcare","warm","affordable","large-community"], desc: "No state income tax, fast-growing tech, warm climate, large community." },
  { name: "New Jersey",    abbr: "NJ", emoji: "🏙️", tags: ["finance","healthcare","cold","expensive","large-community"], desc: "Densest Indian-American population, pharma corridor, near NYC." },
  { name: "Washington",    abbr: "WA", emoji: "🌲", tags: ["tech","moderate","expensive","large-community"],     desc: "Seattle tech hub (Amazon, Microsoft), no state income tax." },
  { name: "New York",      abbr: "NY", emoji: "🗽", tags: ["finance","cold","expensive","large-community"],       desc: "Finance capital, massive South Asian community in the NYC metro." },
  { name: "Virginia",      abbr: "VA", emoji: "🏛️", tags: ["tech","finance","moderate","medium-cost","large-community"], desc: "Amazon HQ2, defense tech corridor, diverse Northern VA community." },
  { name: "Georgia",       abbr: "GA", emoji: "🍑", tags: ["tech","healthcare","warm","affordable","large-community"], desc: "Atlanta's growing tech scene, affordable suburbs, large community." },
  { name: "Illinois",      abbr: "IL", emoji: "🌆", tags: ["finance","healthcare","cold","medium-cost","medium-community"], desc: "Chicago financial hub, major medical centers, vibrant South Asian community." },
  { name: "Florida",       abbr: "FL", emoji: "🌊", tags: ["healthcare","warm","medium-cost","medium-community"], desc: "No state income tax, warm year-round, growing Miami tech scene." },
  { name: "Massachusetts", abbr: "MA", emoji: "🦞", tags: ["tech","healthcare","cold","expensive","medium-community"], desc: "Biotech and university hub, MIT/Harvard, excellent healthcare system." },
  { name: "North Carolina",abbr: "NC", emoji: "🌿", tags: ["tech","healthcare","moderate","affordable","medium-community"], desc: "Research Triangle (RTP), growing pharma and tech, very affordable." },
  { name: "Arizona",       abbr: "AZ", emoji: "🌵", tags: ["healthcare","warm","affordable","medium-community"],  desc: "Hot climate, fast-growing Scottsdale/Phoenix tech scene, affordable housing." },
];

const QUIZ_QUESTIONS = [
  {
    q: "What's your job field?",
    opts: [
      { label: "Software / IT / Engineering", tags: ["tech"] },
      { label: "Healthcare / Life Sciences",  tags: ["healthcare"] },
      { label: "Finance / Consulting",        tags: ["finance"] },
      { label: "Other / General",             tags: ["tech","healthcare","finance"] },
    ],
  },
  {
    q: "Preferred climate?",
    opts: [
      { label: "Warm / Sunny",       tags: ["warm"] },
      { label: "Moderate (4 seasons)",tags: ["moderate","warm"] },
      { label: "Cold is fine",       tags: ["cold","moderate","warm"] },
    ],
  },
  {
    q: "Cost of living priority?",
    opts: [
      { label: "Keep it low",          tags: ["affordable","medium-cost"] },
      { label: "Medium is fine",       tags: ["affordable","medium-cost","expensive"] },
      { label: "High is OK for the right job", tags: ["affordable","medium-cost","expensive"] },
    ],
  },
  {
    q: "How important is a large South Asian community?",
    opts: [
      { label: "Very important",  tags: ["large-community"] },
      { label: "Somewhat",        tags: ["large-community","medium-community"] },
      { label: "Doesn't matter",  tags: ["large-community","medium-community","small-community"] },
    ],
  },
];

function WhichStateQuiz() {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult]   = useState(null);

  const pick = opt => {
    const next = [...answers, opt.tags];
    if (step < QUIZ_QUESTIONS.length - 1) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      const scored = STATE_PROFILES.map(state => {
        const score = next.reduce((acc, tagSet) => acc + tagSet.filter(t => state.tags.includes(t)).length, 0);
        return { ...state, score };
      }).sort((a, b) => b.score - a.score).slice(0, 3);
      setResult(scored);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setResult(null); };

  return (
    <div style={hs.quizCard}>
      <div style={hs.quizTitle}>🗺️ Which State Is Right for You?</div>
      {!result ? (
        <>
          <div style={hs.quizStep}>Question {step + 1} of {QUIZ_QUESTIONS.length}</div>
          <div style={hs.quizQ}>{QUIZ_QUESTIONS[step].q}</div>
          <div style={hs.quizOpts}>
            {QUIZ_QUESTIONS[step].opts.map((o, i) => (
              <button key={i} style={hs.quizBtn} onClick={() => pick(o)}>{o.label}</button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p style={hs.quizResultLabel}>Based on your answers, top picks:</p>
          <div style={hs.quizResults}>
            {result.map((state, i) => (
              <div key={state.name} style={{ ...hs.quizResultCard, borderTop: i === 0 ? "3px solid var(--orange)" : "0.5px solid var(--border)" }}>
                <div style={hs.quizResultHeader}>
                  <span style={{ fontSize: 24 }}>{state.emoji}</span>
                  <div>
                    <span style={hs.quizResultName}>{state.name}</span>
                    {i === 0 && <span style={hs.quizBadge}>Best match</span>}
                  </div>
                </div>
                <p style={hs.quizResultDesc}>{state.desc}</p>
              </div>
            ))}
          </div>
          <button style={hs.quizReset} onClick={reset}>↩ Retake quiz</button>
        </>
      )}
    </div>
  );
}

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
        <meta name="impact-site-verification" value="ee8a53ac-4fa3-4f6d-a93f-d18fa57ee08b" />
      </Helmet>
      {/* Stats */}
      {countrySlug !== "ca" && <StatsBar />}

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

          {/* Which State quiz — US only */}
          {countrySlug !== "ca" && <WhichStateQuiz />}

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

const hs = {
  statsBar:        { display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"6px 24px", padding:"8px 1rem", background:"var(--orange-light)", borderBottom:"0.5px solid #f2c98b", fontSize:13, color:"#333" },
  statItem:        { whiteSpace:"nowrap" },
  quizCard:        { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:24, borderTop:"3px solid var(--orange)" },
  quizTitle:       { fontSize:16, fontWeight:800, color:"#111", marginBottom:10 },
  quizStep:        { fontSize:11, fontWeight:700, color:"var(--orange)", textTransform:"uppercase", letterSpacing:0.4, marginBottom:6 },
  quizQ:           { fontSize:15, fontWeight:700, color:"#222", marginBottom:14 },
  quizOpts:        { display:"flex", flexDirection:"column", gap:8 },
  quizBtn:         { padding:"10px 16px", background:"#fafaf8", border:"0.5px solid var(--border)", borderRadius:8, fontSize:14, fontWeight:600, color:"#333", cursor:"pointer", textAlign:"left" },
  quizResultLabel: { fontSize:13, color:"#666", marginBottom:12 },
  quizResults:     { display:"flex", flexDirection:"column", gap:10, marginBottom:16 },
  quizResultCard:  { background:"#fafaf8", borderRadius:8, padding:"12px 14px" },
  quizResultHeader:{ display:"flex", alignItems:"center", gap:10, marginBottom:6 },
  quizResultName:  { fontSize:16, fontWeight:800, color:"#111", marginRight:8 },
  quizBadge:       { fontSize:10, fontWeight:700, color:"#166534", background:"#dcfce7", borderRadius:20, padding:"2px 8px" },
  quizResultDesc:  { fontSize:13, color:"#555", lineHeight:1.5, margin:0 },
  quizReset:       { fontSize:13, fontWeight:700, color:"var(--orange)", background:"none", border:"none", cursor:"pointer", padding:0 },
};

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
