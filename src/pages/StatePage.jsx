import { Link, useParams, Navigate } from "react-router-dom";
import { getState, citySlug } from "../data/states";

export default function StatePage() {
  const { stateSlug } = useParams();
  const state = getState(stateSlug);
  if (!state) return <Navigate to="/" />;

  return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← All States</Link>
      <h1 style={s.title}><span style={{ fontSize:36 }}>{state.icon}</span> {state.name}</h1>
      <p style={s.sub}>Select a city to browse local jobs, housing, lawyers, temples, and more.</p>
      <div style={s.grid}>
        {state.cities.map(city => (
          <Link key={city} to={`/states/${stateSlug}/${citySlug(city)}`} style={s.card}>
            <p style={s.cityName}>{city}</p>
            <p style={s.cityState}>{state.abbr}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { maxWidth: 900, margin:"0 auto", padding:"1.5rem 1.5rem 3rem" },
  back: { color:"var(--orange)", fontSize:13, fontWeight:600, display:"inline-block", marginBottom:10 },
  title: { fontSize:32, fontWeight:800, color:"#111", display:"flex", alignItems:"center", gap:12, marginBottom:8 },
  sub: { fontSize:14, color:"#555", marginBottom:"1.5rem" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:14 },
  card: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem 1rem", textAlign:"center", transition:"box-shadow 0.15s" },
  cityName: { fontSize:16, fontWeight:700, color:"var(--orange)", marginBottom:4 },
  cityState: { fontSize:12, color:"var(--muted)", fontWeight:600 },
};
