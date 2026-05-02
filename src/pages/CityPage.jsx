import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { getState, cityFromSlug } from "../data/states";
import AdBlock from "../components/AdBlock";
import Jobs from "../components/sections/Jobs";
import Accommodation from "../components/sections/Accommodation";
import Temples from "../components/sections/Temples";
import Lawyers from "../components/sections/Lawyers";
import Realtors from "../components/sections/Realtors";
import Priests from "../components/sections/Priests";
import Photographers from "../components/sections/Photographers";

const SECTIONS = [
  { id: "jobs",          icon: "💼", label: "Local Jobs" },
  { id: "accommodation", icon: "🏠", label: "Accommodation" },
  { id: "temples",       icon: "🛕", label: "Temples & Mosques" },
  { id: "lawyers",       icon: "⚖️",  label: "Immigration Lawyers" },
  { id: "realtors",      icon: "🏡", label: "Local Realtors" },
  { id: "priests",       icon: "🙏", label: "Priest Services" },
  { id: "photographers", icon: "📸", label: "Photographers" },
];

const SECTION_MAP = { jobs: Jobs, accommodation: Accommodation, temples: Temples, lawyers: Lawyers, realtors: Realtors, priests: Priests, photographers: Photographers };

export default function CityPage() {
  const { stateSlug, citySlug } = useParams();
  const state = getState(stateSlug);
  const cityName = cityFromSlug(state, citySlug);
  const [active, setActive] = useState("jobs");

  if (!state || !cityName) return <Navigate to="/" />;

  const ActiveComp = SECTION_MAP[active];

  return (
    <div style={s.page}>
      <Link to={`/states/${stateSlug}`} style={s.back}>← {state.name}</Link>
      <h1 style={s.title}>{cityName}, {state.abbr}</h1>

      {/* Top ad */}
      <AdBlock size="banner" />

      <div style={s.layout}>
        {/* Sidebar */}
        <aside style={s.sidebar}>
          {SECTIONS.map(sec => (
            <button key={sec.id} onClick={() => setActive(sec.id)}
              style={{ ...s.sideItem, ...(active === sec.id ? s.sideActive : {}) }}>
              <span>{sec.icon}</span> {sec.label}
            </button>
          ))}
          {/* Sidebar ad */}
          <div style={s.sideAd}>
            <AdBlock size="rectangle" />
          </div>
        </aside>

        {/* Main */}
        <main style={s.main}>
          <ActiveComp stateSlug={stateSlug} citySlug={citySlug} cityName={cityName} stateName={state.name} />
          {/* Mid-page ad */}
          <AdBlock size="strip" />
        </main>
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1.5rem 3rem" },
  back: { color: "var(--orange)", fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 6 },
  title: { fontSize: 34, fontWeight: 800, color: "#111", marginBottom: "1.25rem" },
  layout: { display: "flex", gap: 22, alignItems: "flex-start" },
  sidebar: { width: 220, flexShrink: 0, background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", display: "flex", flexDirection: "column" },
  sideItem: { display: "flex", alignItems: "center", gap: 9, padding: "13px 15px", fontSize: 13, fontWeight: 600, color: "#444", background: "transparent", border: "none", borderLeft: "3px solid transparent", textAlign: "left", width: "100%", cursor: "pointer" },
  sideActive: { background: "var(--orange-light)", color: "var(--orange)", borderLeft: "3px solid var(--orange)" },
  sideAd: { padding: "10px 8px" },
  main: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0 },
};
