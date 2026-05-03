import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { fetchStateBySlug } from "../lib/db";
import { citySlug } from "../data/states";
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
import Events from "../components/sections/Events";

const SECTIONS = [
  { id: "events",        icon: "📅", label: "Events" },
  { id: "jobs",          icon: "💼", label: "Local Jobs" },
  { id: "accommodation", icon: "🏠", label: "Accommodation" },
  { id: "temples",       icon: "🛕", label: "Temples & Mosques" },
  { id: "lawyers",       icon: "⚖️", label: "Immigration Lawyers" },
  { id: "doctors",       icon: "🩺", label: "Doctors" },
  { id: "babysitters",   icon: "🧸", label: "Baby Sitters" },
  { id: "tutors",        icon: "📚", label: "Tutors" },
  { id: "realtors",      icon: "🏡", label: "Local Realtors" },
  { id: "priests",       icon: "🙏", label: "Priest Services" },
  { id: "photographers", icon: "📸", label: "DJ - Video - Photo" },
];

const SECTION_MAP = {
  events: Events,
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
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("events");
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchStateBySlug(stateSlug).then(data => {
      setState(data);
      setLoading(false);
    });
  }, [stateSlug]);

  if (loading) return null;

  const cityObj = state?.cities?.find(c => citySlug(c.name) === citySlugParam);
  const cityName = cityObj?.name;

  if (!state || !cityName) return <Navigate to="/" />;

  const ActiveComp = SECTION_MAP[active];

  return (
    <div style={s.page}>
      <Link to={`/states/${stateSlug}`} style={s.back}>← {state.name}</Link>
      <h1 style={s.title}>{cityName}, {state.abbr}</h1>

      {isMobile && (
        <ScrollTabBar style={s.mobileTabs}>
          {SECTIONS.map(sec => (
            <button key={sec.id} onClick={() => setActive(sec.id)}
              style={{ ...s.mobileTab, ...(active === sec.id ? s.mobileTabActive : {}) }}>
              <span style={{ fontSize: 18 }}>{sec.icon}</span>
              <span style={{ fontSize: 10, whiteSpace: "nowrap" }}>{sec.label}</span>
            </button>
          ))}
        </ScrollTabBar>
      )}

      <div style={{ ...s.layout, flexDirection: isMobile ? "column" : "row" }}>
        {!isMobile && (
          <aside style={s.sidebar}>
            {SECTIONS.map(sec => (
              <button key={sec.id} onClick={() => setActive(sec.id)}
                style={{ ...s.sideItem, ...(active === sec.id ? s.sideActive : {}) }}>
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
  title:     { fontSize: 34, fontWeight: 800, color: "#111", marginBottom: "1.25rem" },
  layout:    { display: "flex", gap: 22, alignItems: "flex-start" },
  sidebar:   { width: 210, flexShrink: 0, background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", display: "flex", flexDirection: "column", position: "sticky", top: 72 },
  sideItem:  { display: "flex", alignItems: "center", gap: 9, padding: "13px 15px", fontSize: 13, fontWeight: 600, color: "#444", background: "transparent", border: "none", borderLeft: "3px solid transparent", textAlign: "left", width: "100%", cursor: "pointer" },
  sideActive:{ background: "var(--orange-light)", color: "var(--orange)", borderLeft: "3px solid var(--orange)" },
  main:      { flex: 1, minWidth: 0 },
  rail:      { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 72 },
};
