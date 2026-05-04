import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchStateBySlug } from "../lib/db";
import { citySlug } from "../data/states";
import { getCountrySlug } from "../lib/country";
import { STATE_FUN_FACTS } from "../data/stateFunFacts";
import ResourceNav from "../components/ResourceNav";
import { useIsMobile } from "../lib/useIsMobile";

export default function StatePage() {
  const { stateSlug } = useParams();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchStateBySlug(stateSlug).then(data => {
      setState(data);
      setLoading(false);
    });
  }, [stateSlug]);

  const pageStyle = { ...s.page, flexDirection: isMobile ? "column" : "row" };

  if (loading) {
    return (
      <div style={pageStyle}>
        {!isMobile && <ResourceNav />}
        <main style={s.content} />
      </div>
    );
  }
  if (!state) return <Navigate to="/" />;

  const cities = state.cities || [];
  const regionLabel = getCountrySlug() === "ca" ? "Provinces" : "States";
  const funFact = STATE_FUN_FACTS[state.name];

  return (
    <div style={pageStyle}>
      <Helmet>
        <title>Immigrant Community in {state.name} — Jobs, Housing, Events | Apnacircle</title>
        <meta name="description" content={`Find local immigrant community resources in ${state.name} for Indians, Pakistanis, Koreans, Chinese, Japanese, Sri Lankans, and Mexicans — visa help, immigration lawyers, jobs, accommodation, doctors, events and more.`} />
        <link rel="canonical" href={`https://apnacircle.org/states/${stateSlug}/`} />
        <meta property="og:title" content={`Immigrant Community in ${state.name} — Jobs, Housing, Events | Apnacircle`} />
        <meta property="og:description" content={`Find local immigrant community resources in ${state.name} for Indians, Pakistanis, Koreans, Chinese, Japanese, Sri Lankans, and Mexicans — visa help, lawyers, jobs, accommodation, doctors, events and more.`} />
        <meta property="og:url" content={`https://apnacircle.org/states/${stateSlug}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content="https://apnacircle.org/og-image.svg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({ "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
          {"@type":"ListItem","position":1,"name":"Home","item":"https://apnacircle.org"},
          {"@type":"ListItem","position":2,"name":state.name,"item":`https://apnacircle.org/states/${stateSlug}`}
        ]})}</script>
      </Helmet>
      {!isMobile && <ResourceNav />}
      <main style={s.content}>
      <Link to="/" style={s.back}>← All {regionLabel}</Link>
      <h1 style={s.title}><span style={{ fontSize:36 }}>{state.icon}</span> {state.name}</h1>
      <p style={s.sub}>Select a city to browse local jobs, housing, lawyers, temples, and more.</p>
      {funFact && (
        <div style={s.fact}>
          <div style={s.factBadge}>Did you know?</div>
          <p style={s.factText}>{funFact}</p>
        </div>
      )}
      <div style={s.grid}>
        {cities.map(city => (
          <Link key={city.id} to={`/states/${stateSlug}/${citySlug(city.name)}`} style={s.card}>
            <p style={s.cityName}>{city.name}</p>
            <p style={s.cityState}>{state.abbr}</p>
          </Link>
        ))}
      </div>
      </main>
    </div>
  );
}

const s = {
  page: { padding:"1.5rem 1.5rem 3rem", display:"flex", gap:24, alignItems:"flex-start" },
  content: { flex:1, minWidth:0 },
  back: { color:"var(--orange)", fontSize:13, fontWeight:600, display:"inline-block", marginBottom:10 },
  title: { fontSize:32, fontWeight:800, color:"#111", display:"flex", alignItems:"center", gap:12, marginBottom:8 },
  sub: { fontSize:14, color:"#555", marginBottom:"1.5rem" },
  fact: { background:"linear-gradient(135deg, #fff7ed 0%, #fff 58%, #eefdf6 100%)", border:"1px solid #f2c98b", borderRadius:"var(--radius)", padding:"1rem 1.25rem", marginBottom:"1.5rem", boxShadow:"0 8px 22px rgba(120, 73, 25, 0.08)", position:"relative", overflow:"hidden" },
  factBadge: { display:"inline-flex", alignItems:"center", background:"#fff", color:"var(--orange)", border:"1px solid #f2c98b", borderRadius:20, padding:"4px 10px", fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:0.5, marginBottom:9 },
  factText: { fontSize:15, color:"#2f2418", lineHeight:1.65, fontWeight:600 },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:14 },
  card: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem 1rem", textAlign:"center", transition:"box-shadow 0.15s" },
  cityName: { fontSize:16, fontWeight:700, color:"var(--orange)", marginBottom:4 },
  cityState: { fontSize:12, color:"var(--muted)", fontWeight:600 },
};
