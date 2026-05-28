import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchStates, fetchAllEvents, fetchSiteStats } from "../lib/db";
import ResourceNav, { MobileResourceNav } from "../components/ResourceNav";
import { fmtEventDate, daysUntilBadge, MapLink, googleCalendarUrl } from "../components/formHelpers";
import { getCountrySlug } from "../lib/country";
import { useIsMobile } from "../lib/useIsMobile";
import { BlogRailTile } from "./blog/BlogPage";
import { BLOGS } from "../data/blogs";

// ─── News Ticker ─────────────────────────────────────────────────────────────

const TICKER_STYLE_ID = "apna-ticker-style";

function NewsTicker() {
  const countrySlug = getCountrySlug();
  const isMobile = useIsMobile();
  const [items, setItems] = useState([]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetch("/news.json")
      .then(r => r.json())
      .then(data => {
        const c = data[countrySlug] || data.us || {};
        const all = [
          ...(c.immigration || []),
          ...(c.jobs       || []),
          ...(c.finance    || []),
        ].slice(0, 12);
        setItems(all);
      })
      .catch(() => {});
  }, [countrySlug]);

  useEffect(() => {
    if (!document.getElementById(TICKER_STYLE_ID)) {
      const el = document.createElement("style");
      el.id = TICKER_STYLE_ID;
      el.textContent = `
        @keyframes apna-ticker { from { transform:translateX(0) } to { transform:translateX(-50%) } }
        .apna-ticker-belt { animation:apna-ticker 80s linear infinite; display:inline-flex; align-items:center; }
      `;
      document.head.appendChild(el);
    }
  }, []);

  if (!items.length) return null;

  const doubled = [...items, ...items];

  const beltHandlers = isMobile
    ? { onClick: () => setPaused(p => !p) }
    : { onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false) };

  return (
    <div style={tk.wrap}>
      <div style={tk.pill}>📰 News</div>
      <div style={tk.track}>
        <div
          className="apna-ticker-belt"
          style={{ animationPlayState: paused ? "paused" : "running", cursor: isMobile ? "pointer" : "default" }}
          {...beltHandlers}
        >
          {doubled.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={tk.item}
              onClick={e => isMobile && e.stopPropagation()}>
              <span style={tk.tag}>{item.tag}</span>
              <span style={tk.txt}>{item.headline}</span>
              <span style={tk.dot}>&nbsp;·&nbsp;</span>
            </a>
          ))}
        </div>
      </div>
      {isMobile && paused && <div style={tk.pauseHint}>▶ tap to resume</div>}
    </div>
  );
}

const tk = {
  wrap:  { display:"flex", alignItems:"center", overflow:"hidden", background:"#fff", borderBottom:"0.5px solid var(--border)", borderTop:"0.5px solid var(--border)", height:36, flexShrink:0 },
  pill:  { flexShrink:0, fontSize:10, fontWeight:800, color:"var(--orange)", background:"var(--orange-light)", padding:"3px 10px", margin:"0 12px 0 14px", borderRadius:20, whiteSpace:"nowrap", letterSpacing:0.3 },
  track: { overflow:"hidden", flex:1, height:"100%", display:"flex", alignItems:"center" },
  item:  { display:"inline-flex", alignItems:"center", gap:6, textDecoration:"none", padding:"0 4px", whiteSpace:"nowrap", fontSize:12.5 },
  tag:   { fontSize:9, fontWeight:800, color:"var(--orange)", background:"var(--orange-light)", padding:"1px 6px", borderRadius:20, flexShrink:0, letterSpacing:0.2 },
  txt:   { color:"#333", fontWeight:500 },
  dot:        { color:"#ccc" },
  pauseHint:  { flexShrink:0, fontSize:10, color:"#aaa", paddingRight:10, whiteSpace:"nowrap" },
};

// ─── Community Stats Bar ──────────────────────────────────────────────────────

function StatsBar() {
  const [stats, setStats] = useState(null);
  useEffect(() => { fetchSiteStats().then(setStats); }, []);
  if (!stats) return null;
  const items = [
    { icon: "🛂", label: "visa experiences", count: stats.visaExperiences, newCount: stats.recentVisaExperiences },
    { icon: "💡", label: "immigration tips", count: stats.tips, newCount: 0 },
  ].filter(i => i.count > 0);
  if (!items.length) return null;
  return (
    <div style={hs.statsBar}>
      {items.map((item, i) => (
        <span key={i} style={hs.statItem}>
          {item.icon} <strong>{item.count.toLocaleString()}</strong> {item.label}
          {item.newCount > 0 && <span style={hs.statNew}>+{item.newCount} this week</span>}
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
      <div style={hs.quizHeader}>
        <div style={hs.quizTitle}>🗺️ Which State Is Right for You?</div>
        {!result && <div style={hs.quizStep}>Question {step + 1} of {QUIZ_QUESTIONS.length}</div>}
      </div>
      {!result ? (
        <div style={hs.quizBody}>
          <div style={hs.quizQ}>{QUIZ_QUESTIONS[step].q}</div>
          <div style={hs.quizOpts}>
            {QUIZ_QUESTIONS[step].opts.map((o, i) => (
              <button key={i} style={hs.quizBtn} onClick={() => pick(o)}>{o.label}</button>
            ))}
          </div>
        </div>
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
          <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
            <button style={hs.quizReset} onClick={reset}>↩ Retake quiz</button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I got ${result[0].emoji} ${result[0].name} on the "Which US State Is Right For You?" quiz on Apnacircle!\n\n${result[0].desc}\n\nTake the quiz 👉 https://apnacircle.org`)}`}
              target="_blank" rel="noopener noreferrer" style={hs.quizShare}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#25D366" style={{ flexShrink:0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share Result
            </a>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Saved Cities ─────────────────────────────────────────────────────────────

function SavedCities() {
  const [cities, setCities] = useState([]);
  useEffect(() => {
    try { setCities(JSON.parse(localStorage.getItem("apna_bookmarks") || "[]")); } catch (_) {}
  }, []);
  if (!cities.length) return null;
  return (
    <div style={sc.wrap}>
      <span style={sc.label}>🔖 Saved cities</span>
      <div style={sc.list}>
        {cities.map(b => (
          <Link key={`${b.s}_${b.c}`} to={`/states/${b.s}/${b.c}`} style={sc.pill}>{b.n}</Link>
        ))}
      </div>
    </div>
  );
}

const sc = {
  wrap:  { display:"flex", alignItems:"center", flexWrap:"wrap", gap:8, padding:"10px 1.5rem", background:"#fff", borderBottom:"0.5px solid var(--border)" },
  label: { fontSize:11, fontWeight:800, color:"#888", textTransform:"uppercase", letterSpacing:0.4, whiteSpace:"nowrap" },
  list:  { display:"flex", flexWrap:"wrap", gap:6 },
  pill:  { fontSize:12, fontWeight:700, color:"var(--orange)", background:"var(--orange-light)", padding:"3px 12px", borderRadius:20, textDecoration:"none" },
};

// ─── What's New Strip ──────────────────────────────────────────────────────────

function WhatsNewStrip({ stats, events }) {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newEvents = events.filter(e => new Date(e.created_at).getTime() > sevenDaysAgo).length;
  const newVisa   = stats?.recentVisaExperiences || 0;
  if (!newEvents && !newVisa) return null;
  return (
    <div style={wn.wrap}>
      <span style={wn.badge}>🆕 This week</span>
      {newVisa  > 0 && <span style={wn.item}><Link to="/visa/h1b" style={wn.link}>{newVisa} new visa experience{newVisa !== 1 ? "s" : ""}</Link></span>}
      {newEvents > 0 && <span style={wn.item}><Link to="/events" style={wn.link}>{newEvents} new event{newEvents !== 1 ? "s" : ""}</Link></span>}
    </div>
  );
}

const wn = {
  wrap:  { display:"flex", alignItems:"center", flexWrap:"wrap", gap:"4px 16px", padding:"8px 1.5rem", background:"#fefce8", borderBottom:"0.5px solid #fde68a" },
  badge: { fontSize:11, fontWeight:800, color:"#92400e", textTransform:"uppercase", letterSpacing:0.3 },
  item:  { fontSize:13, color:"#555" },
  link:  { color:"var(--orange)", fontWeight:700, textDecoration:"none" },
};

const RAIL_POSTS = BLOGS.filter((_, i) => [0, 4, 8, 1, 5, 9].includes(i)).slice(0, 6);

const EVENTS_PAGE_SIZE = 5;

export default function HomePage() {
  const [states, setStates] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventsPage, setEventsPage] = useState(0);
  const [stats, setStats] = useState(null);
  const countrySlug = getCountrySlug();
  const regionLabel = countrySlug === "ca" ? "Province" : "State";
  const siteBase = countrySlug === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org";

  useEffect(() => {
    fetchStates().then(setStates);
    fetchAllEvents().then(setEvents);
    fetchSiteStats().then(setStats);
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
      {/* Stats */}
      {countrySlug !== "ca" && <StatsBar />}
      <SavedCities />
      {countrySlug !== "ca" && <WhatsNewStrip stats={stats} events={events} />}

      {/* Hero */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Built by immigrants, for immigrants.</h1>
        <p className="hero-sub" style={s.sub}>
          Real visa stories, local lawyers, doctors, jobs &amp; housing — curated by people who've been through it. Free, always. No login, no ads, no spam. Across <a href="https://apnacircle.org" target="_blank" rel="noopener noreferrer" style={{ color:"var(--orange)", fontWeight:700 }}>USA</a> &amp; <a href="https://ca.apnacircle.org" target="_blank" rel="noopener noreferrer" style={{ color:"var(--orange)", fontWeight:700 }}>Canada</a>.
        </p>
      </div>

      {/* mobile quick-nav */}
      <div className="mobile-only">
        <MobileResourceNav style={{ padding:"0 1rem 0.75rem", borderBottom:"0.5px solid var(--border)" }} />
        {countrySlug !== "ca" && (
          <div style={s.mobileQuizWrap}>
            <WhichStateQuiz />
          </div>
        )}
      </div>

      {/* News ticker — full width */}
      <NewsTicker />

      {/* body */}
      <div className="home-body" style={s.body}>
        {/* Left nav — desktop only */}
        <div className="home-sidebar" style={s.sidebarStack}>
          <ResourceNav style={s.sidebarNav} />
          {countrySlug !== "ca" && <WhichStateQuiz />}
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
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"0.75rem", flexWrap:"wrap", gap:8 }}>
              <p style={{ ...s.sectionLabel, marginBottom:0 }}>📅 Upcoming Events</p>
              {events.length > 0 && <span style={{ fontSize:12, color:"#999" }}>{events.length} event{events.length !== 1 ? "s" : ""}</span>}
            </div>
            {events.length > 0 ? (() => {
              const totalPages = Math.ceil(events.length / EVENTS_PAGE_SIZE);
              const page = Math.min(eventsPage, totalPages - 1);
              const visible = events.slice(page * EVENTS_PAGE_SIZE, (page + 1) * EVENTS_PAGE_SIZE);
              const goTo = p => {
                setEventsPage(p);
                document.getElementById("events")?.scrollIntoView({ behavior:"smooth", block:"start" });
              };
              return (
                <>
                  <div style={s.eventList}>
                    {visible.map(e => {
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
                          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:8, alignItems:"center" }}>
                            {e.ticket_url && (
                              <a href={e.ticket_url} target="_blank" rel="noopener noreferrer" style={s.ticketLink}>
                                Get Tickets →
                              </a>
                            )}
                            <a href={googleCalendarUrl(e)} target="_blank" rel="noopener noreferrer" style={s.calBtn}>
                              📅 Add to Calendar
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {totalPages > 1 && (
                    <div style={s.pagination}>
                      <button style={{ ...s.pageBtn, opacity: page === 0 ? 0.35 : 1 }} disabled={page === 0} onClick={() => goTo(page - 1)}>← Prev</button>
                      <span style={s.pageInfo}>Page {page + 1} of {totalPages}</span>
                      <button style={{ ...s.pageBtn, opacity: page === totalPages - 1 ? 0.35 : 1 }} disabled={page === totalPages - 1} onClick={() => goTo(page + 1)}>Next →</button>
                    </div>
                  )}
                </>
              );
            })() : (
              <p style={{ fontSize:13, color:"#999", fontStyle:"italic" }}>No upcoming events yet — add one from your city page.</p>
            )}
          </div>
        </main>

        {/* Right — blog tiles, desktop only */}
        <aside className="home-rail" style={s.rail}>
          <p style={s.railLabel}>Guides & Tips</p>
          {RAIL_POSTS.map(post => <BlogRailTile key={post.slug} post={post} />)}
          <Link to="/blog" style={s.railMore}>See all guides →</Link>
        </aside>
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
  statsBar:        { display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"6px 24px", padding:"8px 1rem", background:"var(--orange-light)", borderBottom:"0.5px solid #F0C9A0", fontSize:13, color:"#3D1F00" },
  statItem:        { whiteSpace:"nowrap", fontWeight:500 },
  statNew:         { fontSize:11, fontWeight:700, color:"var(--green)", background:"var(--green-light)", padding:"1px 7px", borderRadius:20, marginLeft:5 },
  quizCard:        { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1rem", marginBottom:0, borderTop:"3px solid var(--orange)", display:"flex", flexDirection:"column", gap:12 },
  quizHeader:      { display:"flex", alignItems:"center", justifyContent:"space-between", gap:"6px 12px", flexWrap:"wrap" },
  quizTitle:       { fontSize:15, fontWeight:800, color:"#111", lineHeight:1.25 },
  quizStep:        { fontSize:10, fontWeight:800, color:"var(--orange)", textTransform:"uppercase", letterSpacing:0.4, whiteSpace:"nowrap" },
  quizBody:        { display:"flex", alignItems:"stretch", gap:10, flexWrap:"wrap" },
  quizQ:           { flex:"1 1 150px", fontSize:14, fontWeight:700, color:"#222", lineHeight:1.35 },
  quizOpts:        { flex:"2 1 260px", display:"flex", flexWrap:"wrap", gap:8 },
  quizBtn:         { flex:"1 1 150px", minWidth:0, padding:"9px 12px", background:"#fafaf8", border:"0.5px solid var(--border)", borderRadius:8, fontSize:13, fontWeight:600, color:"#333", cursor:"pointer", textAlign:"left", lineHeight:1.25 },
  quizResultLabel: { fontSize:13, color:"#666", marginBottom:0 },
  quizResults:     { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:10, marginBottom:2 },
  quizResultCard:  { background:"#fafaf8", borderRadius:8, padding:"12px 14px" },
  quizResultHeader:{ display:"flex", alignItems:"center", gap:10, marginBottom:6 },
  quizResultName:  { fontSize:16, fontWeight:800, color:"#111", marginRight:8 },
  quizBadge:       { fontSize:10, fontWeight:700, color:"#166534", background:"#dcfce7", borderRadius:20, padding:"2px 8px" },
  quizResultDesc:  { fontSize:13, color:"#555", lineHeight:1.5, margin:0 },
  quizReset:       { fontSize:13, fontWeight:700, color:"var(--orange)", background:"none", border:"none", cursor:"pointer", padding:0 },
  quizShare:       { display:"inline-flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:"#16a34a", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:20, padding:"5px 12px", textDecoration:"none" },
};

const s = {
  hero:         { textAlign: "center", padding: "2rem 1rem 1.25rem" },
  heroTitle:    { fontSize: "clamp(22px, 3.2vw, 34px)", fontWeight: 700, color: "var(--text)", letterSpacing: -0.6, marginBottom: "0.5rem", lineHeight: 1.15 },
  sub:          { color: "var(--muted)", fontSize: "clamp(13px, 1.1vw, 15px)", margin: "0 auto", maxWidth: 580, lineHeight: 1.65 },
  body:         { padding: "0 1.5rem 2rem", display: "flex", flexDirection: "row", gap: 24, alignItems: "flex-start" },
  sidebarStack: { width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 72, alignSelf: "flex-start" },
  sidebarNav:   { width: "100%", position: "static" },
  mobileQuizWrap: { padding: "0.9rem 1rem 1rem", borderBottom: "0.5px solid var(--border)" },
  center:       { flex: 1, minWidth: 0 },
  rail:         { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10, position: "sticky", top: 72, alignSelf: "flex-start" },
  railLabel:    { fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
  railMore:     { fontSize: 13, fontWeight: 700, color: "var(--orange)", textDecoration: "none", marginTop: 4 },
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
  ticketLink:   { fontSize: 13, fontWeight: 700, color: "var(--orange)", textDecoration: "none" },
  calBtn:       { fontSize: 12, fontWeight: 600, color: "#3b82f6", background: "#eff6ff", border: "0.5px solid #bfdbfe", borderRadius: 20, padding: "4px 12px", textDecoration: "none" },
  pagination:   { display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 16 },
  pageBtn:      { background: "#fff", border: "0.5px solid var(--border)", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 700, color: "#333", cursor: "pointer" },
  pageInfo:     { fontSize: 13, color: "#888", fontWeight: 600 },
  footer:       { textAlign: "center", padding: "1.5rem", borderTop: "0.5px solid var(--border)", color: "#aaa", fontSize: 13, background: "#fff", marginTop: "1rem" },
};
