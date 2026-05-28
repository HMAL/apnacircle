import { useState, useEffect } from "react";
import { useParams, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchStateBySlug, fetchCityStats, subscribeDigest } from "../lib/db";
import { citySlug, getCountrySlug } from "../lib/country";
import AdBlock from "../components/AdBlock";
import { useIsMobile } from "../lib/useIsMobile";
import { ScrollTabBar } from "../components/ScrollTabBar";
import Jobs from "../components/sections/Jobs";
import Accommodation from "../components/sections/Accommodation";
import Temples from "../components/sections/Temples";
import Lawyers from "../components/sections/Lawyers";
import Doctors from "../components/sections/Doctors";
import Babysitters from "../components/sections/Babysitters";
import Tutors from "../components/sections/Tutors";
import Realtors from "../components/sections/Realtors";
import Priests from "../components/sections/Priests";
import Photographers from "../components/sections/Photographers";
import PlacesToVisit from "../components/sections/PlacesToVisit";
import { FEATURED_CITIES } from "../data/featuredStateCities";

const SECTIONS = [
  { id: "jobs",          icon: "💼", label: "Local Jobs" },
  { id: "accommodation", icon: "🏠", label: "Accommodation" },
  { id: "temples",       icon: "🛕", label: "Worship" },
  { id: "lawyers",       icon: "⚖️", label: "Immigration Lawyers" },
  { id: "doctors",       icon: "🩺", label: "Doctors" },
  { id: "tutors",        icon: "📚", label: "Tutors" },
  { id: "realtors",      icon: "🏡", label: "Local Realtors" },
  { id: "photographers", icon: "📸", label: "DJ - Video - Photo" },
].sort((a, b) => a.label.localeCompare(b.label));

function WhatsAppShare({ message }) {
  const encoded = encodeURIComponent(message);
  return (
    <a href={`https://wa.me/?text=${encoded}`} target="_blank" rel="noopener noreferrer" style={ws.btn}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366" style={{ flexShrink:0 }}>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Share
    </a>
  );
}

const ws = {
  btn: { display:"inline-flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700, color:"#16a34a", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:20, padding:"5px 13px", textDecoration:"none" },
};

function BookmarkButton({ stateSlug, citySlug, cityName }) {
  const key = `apna_bm_${stateSlug}_${citySlug}`;
  const [saved, setSaved] = useState(() => !!localStorage.getItem(key));

  const toggle = () => {
    const list = JSON.parse(localStorage.getItem("apna_bookmarks") || "[]");
    if (saved) {
      localStorage.removeItem(key);
      localStorage.setItem("apna_bookmarks", JSON.stringify(list.filter(b => !(b.s === stateSlug && b.c === citySlug))));
    } else {
      localStorage.setItem(key, "1");
      list.unshift({ s: stateSlug, c: citySlug, n: cityName, t: Date.now() });
      localStorage.setItem("apna_bookmarks", JSON.stringify(list.slice(0, 10)));
    }
    setSaved(v => !v);
  };

  return (
    <button onClick={toggle} style={{ ...bm.btn, ...(saved ? bm.btnSaved : {}) }}>
      {saved ? "🔖 Saved" : "🔖 Save city"}
    </button>
  );
}

const bm = {
  btn:      { fontSize:12, fontWeight:700, color:"#888", background:"#f5f4f0", border:"0.5px solid var(--border)", borderRadius:20, padding:"5px 13px", cursor:"pointer" },
  btnSaved: { color:"var(--orange)", background:"var(--orange-light)", border:"0.5px solid var(--orange)" },
};

function DigestSubscribe({ stateSlug, citySlug, cityName }) {
  const key = `apna_digest_${stateSlug}_${citySlug}`;
  const [done, setDone] = useState(() => !!localStorage.getItem(key));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (done) return (
    <div style={ds.wrap}>
      <span style={ds.done}>📬 You'll get weekly updates for {cityName}</span>
    </div>
  );

  const submit = async () => {
    if (!email.trim() || !email.includes("@")) return;
    setLoading(true);
    const ok = await subscribeDigest(email.trim(), stateSlug, citySlug);
    if (ok) { localStorage.setItem(key, "1"); setDone(true); }
    setLoading(false);
  };

  return (
    <div style={ds.wrap}>
      <span style={ds.icon}>📬</span>
      <span style={ds.label}>Get weekly updates for {cityName}</span>
      <input
        style={ds.input}
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
      />
      <button style={ds.btn} onClick={submit} disabled={loading}>
        {loading ? "…" : "Notify me"}
      </button>
    </div>
  );
}

const ds = {
  wrap:  { display:"flex", alignItems:"center", flexWrap:"wrap", gap:8, background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"10px 14px", marginBottom:12 },
  icon:  { fontSize:16, flexShrink:0 },
  label: { fontSize:13, fontWeight:600, color:"#333", flex:1, minWidth:120 },
  input: { flex:"1 1 180px", minWidth:0, padding:"7px 12px", fontSize:13, border:"0.5px solid var(--border)", borderRadius:8, outline:"none" },
  btn:   { flexShrink:0, padding:"7px 16px", fontSize:13, fontWeight:700, color:"#fff", background:"var(--orange)", border:"none", borderRadius:20, cursor:"pointer" },
  done:  { fontSize:13, fontWeight:600, color:"#166534" },
};

function CompletenessBar({ stateSlug, citySlug }) {
  const [stats, setStats] = useState(null);
  useEffect(() => { fetchCityStats(stateSlug, citySlug).then(setStats); }, [stateSlug, citySlug]);
  if (!stats || stats.filled === stats.total) return null;
  const pct = Math.round((stats.filled / stats.total) * 100);
  return (
    <div style={comp.wrap}>
      <div style={comp.top}>
        <span style={comp.label}>📋 {stats.filled} of {stats.total} sections have listings</span>
        <span style={comp.pct}>{pct}%</span>
      </div>
      <div style={comp.track}><div style={{ ...comp.fill, width:`${pct}%` }} /></div>
      <p style={comp.cta}>Help your community — be the first to add missing resources below.</p>
    </div>
  );
}

const comp = {
  wrap:  { background:"#fffbeb", border:"0.5px solid #fde68a", borderRadius:"var(--radius)", padding:"12px 16px", marginBottom:16 },
  top:   { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 },
  label: { fontSize:13, fontWeight:700, color:"#92400e" },
  pct:   { fontSize:12, fontWeight:700, color:"#b45309" },
  track: { height:6, background:"#fef3c7", borderRadius:99, overflow:"hidden", marginBottom:8 },
  fill:  { height:"100%", background:"#f59e0b", borderRadius:99, transition:"width 0.4s" },
  cta:   { fontSize:12, color:"#78350f", margin:0 },
};

const SECTION_MAP = {
  places: PlacesToVisit,
  jobs: Jobs,
  accommodation: Accommodation,
  temples: Temples,
  lawyers: Lawyers,
  doctors: Doctors,
  babysitters: Babysitters,
  tutors: Tutors,
  realtors: Realtors,
  priests: Priests,
  photographers: Photographers,
};

export default function CityPage() {
  const { stateSlug, citySlug: citySlugParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchStateBySlug(stateSlug).then(data => {
      setState(data);
      setLoading(false);
    });
  }, [stateSlug]);

  const cityObj = state?.cities?.find(c => citySlug(c.name) === citySlugParam);
  const cityName = cityObj?.name;
  const hasPlaces = !!(FEATURED_CITIES[state?.name]?.[cityName]?.places?.length);

  useEffect(() => {
    if (!state || !cityName) return;
    const requestedDefault = location.state?.defaultTab;
    const fallbackTab = SECTIONS[0]?.id || "jobs";
    const nextActive = hasPlaces
      ? "places"
      : requestedDefault && requestedDefault !== "places" && SECTION_MAP[requestedDefault]
        ? requestedDefault
        : fallbackTab;
    setActive(nextActive);
  }, [state, cityName, citySlugParam, hasPlaces, location.state?.defaultTab]);

  if (loading) return null;

  if (!state || !cityName) return <Navigate to="/" />;

  const placesTab = { id: "places", icon: "🗺️", label: "Places to Visit" };
  const allTabs = hasPlaces ? [placesTab, ...SECTIONS] : SECTIONS;

  const selectedActive = allTabs.some(sec => sec.id === active) ? active : allTabs[0]?.id || "jobs";
  const ActiveComp = SECTION_MAP[selectedActive];

  const siteBase = getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org";
  return (
    <div style={s.page}>
      <Helmet>
        <title>Immigrant Community in {cityName}, {state.abbr} — Jobs, Housing, Doctors | Apnacircle</title>
        <meta name="description" content={`Free community resources for Indian, Pakistani, Korean, Chinese, Japanese, Sri Lankan, and Mexican immigrants in ${cityName}, ${state.name} — local jobs, accommodation, lawyers, doctors, temples, events and more.`} />
        <link rel="canonical" href={`${siteBase}/states/${stateSlug}/${citySlugParam}/`} />
        <meta property="og:title" content={`Immigrant Community in ${cityName}, ${state.abbr} — Jobs, Housing, Doctors | Apnacircle`} />
        <meta property="og:description" content={`Free community resources for Indian, Pakistani, Korean, Chinese, Japanese, Sri Lankan, and Mexican immigrants in ${cityName}, ${state.name} — local jobs, accommodation, lawyers, doctors, temples, events and more.`} />
        <meta property="og:url" content={`${siteBase}/states/${stateSlug}/${citySlugParam}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({ "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
          {"@type":"ListItem","position":1,"name":"Home","item":siteBase},
          {"@type":"ListItem","position":2,"name":state.name,"item":`${siteBase}/states/${stateSlug}/`},
          {"@type":"ListItem","position":3,"name":cityName,"item":`${siteBase}/states/${stateSlug}/${citySlugParam}/`}
        ]})}</script>
      </Helmet>
      <Link to={`/states/${stateSlug}`} style={s.back}>← {state.name}</Link>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, marginBottom:"1.25rem" }}>
        <h1 style={{ ...s.title, marginBottom:0 }}>{cityName}, {state.abbr}</h1>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <BookmarkButton stateSlug={stateSlug} citySlug={citySlugParam} cityName={cityName} />
          <WhatsAppShare message={`Free community resources for immigrants in ${cityName}, ${state.abbr} — jobs, housing, doctors, lawyers & more (no signup needed) 👉 ${typeof window !== "undefined" ? window.location.href : ""}`} />
        </div>
      </div>
      <DigestSubscribe stateSlug={stateSlug} citySlug={citySlugParam} cityName={cityName} />
      <CompletenessBar stateSlug={stateSlug} citySlug={citySlugParam} />

      {isMobile && (
        <ScrollTabBar style={s.mobileTabs}>
          <button onClick={() => navigate(`/events?state=${stateSlug}`)}
            style={s.mobileTab}>
            <span style={{ fontSize: 18 }}>📅</span>
            <span style={{ fontSize: 10, whiteSpace: "nowrap" }}>Events</span>
          </button>
          {allTabs.map(sec => (
            <button key={sec.id} onClick={() => setActive(sec.id)}
              style={{ ...s.mobileTab, ...(selectedActive === sec.id ? s.mobileTabActive : {}) }}>
              <span style={{ fontSize: 18 }}>{sec.icon}</span>
              <span style={{ fontSize: 10, whiteSpace: "nowrap" }}>{sec.label}</span>
            </button>
          ))}
        </ScrollTabBar>
      )}

      <div style={{ ...s.layout, flexDirection: isMobile ? "column" : "row" }}>
        {!isMobile && (
          <aside style={s.sidebar}>
            <button onClick={() => navigate(`/events?state=${stateSlug}`)}
              style={s.sideItem}>
              <span>📅</span> Events
            </button>
            {allTabs.map(sec => (
              <button key={sec.id} onClick={() => setActive(sec.id)}
                style={{ ...s.sideItem, ...(selectedActive === sec.id ? s.sideActive : {}) }}>
                <span>{sec.icon}</span> {sec.label}
              </button>
            ))}
          </aside>
        )}

        <main style={s.main}>
          <ActiveComp stateSlug={stateSlug} citySlug={citySlugParam} cityName={cityName} stateName={state.name} />
        </main>

        {!isMobile && (
          <aside style={s.rail}>
            <AdBlock stateSlug={stateSlug} />
            <AdBlock stateSlug={stateSlug} />
          </aside>
        )}
      </div>
    </div>
  );
}

const s = {
  page:      { padding: "1rem 0.75rem 3rem" },
  mobileTabs:{ background:"#fff", borderBottom:"0.5px solid var(--border)", marginBottom:12 },
  mobileTab: { display:"flex", flexDirection:"column", alignItems:"center", gap:3, padding:"10px 14px", flexShrink:0, fontWeight:600, color:"#444", background:"transparent", border:"none", borderBottom:"2px solid transparent", cursor:"pointer" },
  mobileTabActive: { color:"var(--orange)", background:"var(--orange-light)", borderBottom:"2px solid var(--orange)" },
  back:      { color: "var(--orange)", fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 6 },
  title:     { fontSize: 34, fontWeight: 800, color: "#111", marginBottom: 0 },
  layout:    { display: "flex", gap: 22, alignItems: "flex-start" },
  sidebar:   { width: 210, flexShrink: 0, background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", display: "flex", flexDirection: "column", position: "sticky", top: 72 },
  sideItem:  { display: "flex", alignItems: "center", gap: 9, padding: "13px 15px", fontSize: 13, fontWeight: 600, color: "#444", background: "transparent", border: "none", borderLeft: "3px solid transparent", textAlign: "left", width: "100%", cursor: "pointer" },
  sideActive:{ background: "var(--orange-light)", color: "var(--orange)", borderLeft: "3px solid var(--orange)" },
  main:      { flex: 1, minWidth: 0 },
  rail:      { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 72 },
};
