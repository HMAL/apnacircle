import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { fetchStateBySlug } from "../lib/db";
import { citySlug } from "../data/states";
import { getCountrySlug } from "../lib/country";

export default function StatePage() {
  const { stateSlug } = useParams();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStateBySlug(stateSlug).then(data => {
      setState(data);
      setLoading(false);
    });
  }, [stateSlug]);

  if (loading) return null;
  if (!state) return <Navigate to="/" />;

  const cities = state.cities || [];
  const regionLabel = getCountrySlug() === "ca" ? "Provinces" : "States";

  return (
    <div style={s.page}>
      <Link to="/" style={s.back}>← All {regionLabel}</Link>
      <h1 style={s.title}><span style={{ fontSize:36 }}>{state.icon}</span> {state.name}</h1>
      <p style={s.sub}>Select a city to browse local jobs, housing, lawyers, temples, and more.</p>
      <div style={s.grid}>
        {cities.map(city => (
          <Link key={city.id} to={`/states/${stateSlug}/${citySlug(city.name)}`} style={s.card}>
            <p style={s.cityName}>{city.name}</p>
            <p style={s.cityState}>{state.abbr}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding:"1.5rem 1.5rem 3rem" },
  back: { color:"var(--orange)", fontSize:13, fontWeight:600, display:"inline-block", marginBottom:10 },
  title: { fontSize:32, fontWeight:800, color:"#111", display:"flex", alignItems:"center", gap:12, marginBottom:8 },
  sub: { fontSize:14, color:"#555", marginBottom:"1.5rem" },
  grid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:14 },
  card: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem 1rem", textAlign:"center", transition:"box-shadow 0.15s" },
  cityName: { fontSize:16, fontWeight:700, color:"var(--orange)", marginBottom:4 },
  cityState: { fontSize:12, color:"var(--muted)", fontWeight:600 },
};
