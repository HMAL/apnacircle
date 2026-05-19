import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchStateBySlug } from "../lib/db";
import { citySlug, getCountrySlug } from "../lib/country";
import { STATE_FUN_FACTS } from "../data/stateFunFacts";
import { STATE_ATLAS_OBSCURA } from "../data/stateAtlasObscura";
import { PROVINCE_ATLAS_OBSCURA } from "../data/provinceAtlasObscura";
import { FEATURED_CITIES } from "../data/featuredStateCities";
import ResourceNav from "../components/ResourceNav";
import { useIsMobile } from "../lib/useIsMobile";

const RESOURCE_ICONS = [
  { icon: "💼", label: "Jobs" },
  { icon: "🏠", label: "Housing" },
  { icon: "⚖️", label: "Lawyers" },
  { icon: "🏥", label: "Doctors" },
  { icon: "🎉", label: "Events" },
];

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
  const atlasData = getCountrySlug() === "ca" ? PROVINCE_ATLAS_OBSCURA : STATE_ATLAS_OBSCURA;
  const coolPlaces = atlasData[state.name] || [];
  const featuredCityMap = FEATURED_CITIES[state.name] || {};
  const featuredCities = cities.filter(c => featuredCityMap[c.name]);
  const regularCities = cities.filter(c => !featuredCityMap[c.name]);

  const siteBase = getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org";
  return (
    <div style={pageStyle}>
      <Helmet>
        <title>Immigrant Community in {state.name} — Jobs, Housing, Events | Apnacircle</title>
        <meta name="description" content={`Find local immigrant community resources in ${state.name} for Indians, Pakistanis, Koreans, Chinese, Japanese, Sri Lankans, and Mexicans — visa help, immigration lawyers, jobs, accommodation, doctors, events and more.`} />
        <link rel="canonical" href={`${siteBase}/states/${stateSlug}/`} />
        <meta property="og:title" content={`Immigrant Community in ${state.name} — Jobs, Housing, Events | Apnacircle`} />
        <meta property="og:description" content={`Find local immigrant community resources in ${state.name} for Indians, Pakistanis, Koreans, Chinese, Japanese, Sri Lankans, and Mexicans — visa help, lawyers, jobs, accommodation, doctors, events and more.`} />
        <meta property="og:url" content={`${siteBase}/states/${stateSlug}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({ "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
          {"@type":"ListItem","position":1,"name":"Home","item":siteBase},
          {"@type":"ListItem","position":2,"name":state.name,"item":`${siteBase}/states/${stateSlug}/`}
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
      {featuredCities.length > 0 && (
        <div style={s.featuredGrid}>
          {featuredCities.map(city => {
            const f = featuredCityMap[city.name];
            return (
              <Link
                key={city.id}
                to={`/states/${stateSlug}/${citySlug(city.name)}`}
                state={{ defaultTab: "places" }}
                style={s.featuredCard}
              >
                <div style={s.featuredTop}>
                  <span style={s.featuredEmoji}>{f.emoji}</span>
                  <div>
                    <p style={s.featuredName}>{city.name}</p>
                    <p style={s.featuredTagline}>{f.tagline}</p>
                  </div>
                </div>
                <p style={s.featuredDesc}>{f.description}</p>
                {f.places?.length > 0 && (
                  <div style={s.placesPreview}>
                    <p style={s.placesPreviewLabel}>🗺️ Must-visit places</p>
                    <ul style={s.placesList}>
                      {f.places.slice(0, 3).map((place, i) => (
                        <li key={i} style={s.placesItem}>
                          <span style={s.placesNum}>{i + 1}</span> {place.name}
                        </li>
                      ))}
                      {f.places.length > 3 && (
                        <li style={{ ...s.placesItem, color: "#aaa", fontStyle: "italic" }}>
                          +{f.places.length - 3} more places…
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                <div style={s.featuredFooter}>
                  <div style={s.resourceRow}>
                    {RESOURCE_ICONS.map(r => (
                      <span key={r.label} style={s.resourceChip}>{r.icon} {r.label}</span>
                    ))}
                  </div>
                  <span style={s.exploreCta}>Explore {city.name} →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {regularCities.length > 0 && (
        <>
          {featuredCities.length > 0 && <h2 style={s.allCitiesHeading}>All Cities</h2>}
          <div style={s.grid}>
            {regularCities.map(city => (
              <Link key={city.id} to={`/states/${stateSlug}/${citySlug(city.name)}`} style={s.card}>
                <p style={s.cityName}>{city.name}</p>
                <div style={s.resourceRowSmall}>
                  {RESOURCE_ICONS.map(r => (
                    <span key={r.label} style={s.resourceChipSmall} title={r.label}>{r.icon}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {coolPlaces.length > 0 && (
        <div style={s.coolSection}>
          <div style={s.coolHeader}>
            <span style={s.coolIcon}>🗺️</span>
            <h2 style={s.coolTitle}>Cool &amp; Unusual Places in {state.name}</h2>
          </div>
          <p style={s.coolSub}>Hidden gems, weird wonders, and offbeat attractions worth the detour.</p>
          <div style={s.coolGrid}>
            {coolPlaces.map((place, i) => (
              <div key={i} style={s.coolCard}>
                <p style={s.coolName}>{place.name}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={s.coolAddress}
                >
                  📍 {place.address}
                </a>
                <p style={s.coolDesc}>{place.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
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
  featuredGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:16, marginBottom:"2rem" },
  featuredCard: { background:"linear-gradient(135deg, #fff8f2 0%, #fff 55%, #f2faff 100%)", border:"1px solid #f2c98b", borderRadius:"var(--radius)", padding:"1.25rem 1.25rem 1rem", textDecoration:"none", display:"flex", flexDirection:"column", gap:10, boxShadow:"0 4px 18px rgba(230,100,20,0.07)", transition:"box-shadow 0.15s" },
  featuredTop: { display:"flex", alignItems:"flex-start", gap:10 },
  featuredEmoji: { fontSize:28, lineHeight:1, flexShrink:0, marginTop:2 },
  featuredName: { fontSize:17, fontWeight:800, color:"var(--orange)", margin:0, marginBottom:2 },
  featuredTagline: { fontSize:12, fontWeight:600, color:"#888", margin:0, lineHeight:1.4 },
  featuredDesc: { fontSize:13, color:"#444", lineHeight:1.7, margin:0 },
  placesPreview: { background:"rgba(255,255,255,0.7)", border:"1px solid #ede0ff", borderRadius:8, padding:"0.65rem 0.9rem" },
  placesPreviewLabel: { fontSize:11, fontWeight:800, color:"#7c3aed", textTransform:"uppercase", letterSpacing:0.5, margin:"0 0 6px" },
  placesList: { listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:4 },
  placesItem: { fontSize:13, color:"#333", fontWeight:600, display:"flex", alignItems:"center", gap:7 },
  placesNum: { width:18, height:18, borderRadius:"50%", background:"var(--orange)", color:"#fff", fontSize:10, fontWeight:800, display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  featuredFooter: { display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginTop:2, paddingTop:10, borderTop:"1px solid #f0dfc8" },
  resourceRow: { display:"flex", flexWrap:"wrap", gap:6 },
  resourceChip: { fontSize:12, fontWeight:600, color:"#5b6af5", background:"#f0f1ff", border:"1px solid #dde0ff", borderRadius:20, padding:"3px 9px", whiteSpace:"nowrap" },
  exploreCta: { fontSize:13, fontWeight:800, color:"var(--orange)", whiteSpace:"nowrap" },
  allCitiesHeading: { fontSize:16, fontWeight:700, color:"#888", letterSpacing:0.4, textTransform:"uppercase", marginBottom:12, marginTop:0 },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:14 },
  card: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.25rem 1rem 0.9rem", textAlign:"center", transition:"box-shadow 0.15s", textDecoration:"none", display:"flex", flexDirection:"column", gap:4 },
  cityName: { fontSize:16, fontWeight:700, color:"var(--orange)", marginBottom:2 },
  resourceRowSmall: { display:"flex", justifyContent:"center", gap:4, marginTop:6 },
  resourceChipSmall: { fontSize:14, lineHeight:1, opacity:0.75 },
  coolSection: { marginTop:"2.5rem" },
  coolHeader: { display:"flex", alignItems:"center", gap:10, marginBottom:6 },
  coolIcon: { fontSize:22 },
  coolTitle: { fontSize:20, fontWeight:800, color:"#111", margin:0 },
  coolSub: { fontSize:13, color:"#777", marginBottom:"1.25rem", marginTop:2 },
  coolGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:14 },
  coolCard: { background:"linear-gradient(135deg, #f9f6ff 0%, #fff 60%, #f0f9ff 100%)", border:"1px solid #ddd4f5", borderRadius:"var(--radius)", padding:"1rem 1.25rem", boxShadow:"0 4px 14px rgba(80, 40, 160, 0.06)" },
  coolName: { fontSize:15, fontWeight:800, color:"#2a1a5e", marginBottom:5 },
  coolAddress: { display:"inline-block", fontSize:12, color:"#5b6af5", fontWeight:600, marginBottom:8, textDecoration:"none", wordBreak:"break-word" },
  coolDesc: { fontSize:13, color:"#444", lineHeight:1.65, margin:0 },
};
