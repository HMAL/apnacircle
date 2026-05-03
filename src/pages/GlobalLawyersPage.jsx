import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { f, fmtDate, formatPhone } from "../components/formHelpers";
import { fetchAllLawyers } from "../lib/db";
import AdBlock from "../components/AdBlock";
import { useIsMobile } from "../lib/useIsMobile";

export default function GlobalLawyersPage() {
  const [lawyers, setLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => { fetchAllLawyers().then(setLawyers); }, []);

  const states = [...new Set(lawyers.map(l => l.state_slug))].sort();

  const filtered = lawyers.filter(l => {
    const matchState = !stateFilter || l.state_slug === stateFilter;
    const q = search.toLowerCase();
    const matchSearch = !search || [l.name, l.phone, l.email, l.message, l.city_slug].some(v => v?.toLowerCase().includes(q));
    return matchState && matchSearch;
  });

  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>
        <div style={s.header}>
          <span style={{ fontSize:32 }}>⚖️</span>
          <div>
            <h1 style={s.title}>Immigration Lawyers</h1>
            <p style={s.desc}>Community-recommended immigration lawyers across the US. Add one from your city page.</p>
          </div>
        </div>

        <div style={s.filterRow}>
          <input style={{ ...f.input, flex:1 }} placeholder="Search by name, city, notes..." value={search} onChange={e => setSearch(e.target.value)} />
          <select style={{ ...f.select, width:180, flexShrink:0 }} value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
            <option value="">All States</option>
            {states.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>

        <div style={s.card}>
          <p style={{ fontSize:13, color:"#888", marginBottom:14 }}>
            {filtered.length} lawyer{filtered.length !== 1 ? "s" : ""} found
            {stateFilter && ` in ${stateFilter}`}
            {search && ` matching "${search}"`}
          </p>
          {filtered.length > 0 ? (
            filtered.map(l => (
              <div key={l.id} style={f.card}>
                <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:6, alignItems:"center" }}>
                  <span style={f.postAuthor}>{l.name}</span>
                  {l.phone && <span style={f.sub}>📞 {formatPhone(l.phone)}</span>}
                  {l.email && <span style={f.sub}>✉️ {l.email}</span>}
                  <span style={{ ...f.tag, background:"#e8f4ff", color:"#0066cc" }}>{l.state_slug} / {l.city_slug}</span>
                  <span style={f.postDate}>{fmtDate(l.created_at)}</span>
                </div>
                {l.message && <p style={f.text}>{l.message}</p>}
              </div>
            ))
          ) : (
            <p style={s.empty}>No lawyers found. Add one from your city page!</p>
          )}
        </div>
      </div>

      {!isMobile && (
        <aside style={s.rail}>
          <AdBlock />
          <AdBlock />
        </aside>
      )}
    </div>
  );
}

const s = {
  outer:     { padding:"1.5rem 1.5rem 3rem", display:"flex", gap:24, alignItems:"flex-start" },
  content:   { flex:1, minWidth:0 },
  rail:      { width:260, flexShrink:0, display:"flex", flexDirection:"column", gap:16, position:"sticky", top:72 },
  back:      { color:"var(--orange)", fontSize:13, fontWeight:600, display:"inline-block", marginBottom:8 },
  header:    { display:"flex", alignItems:"center", gap:16, marginBottom:"1.25rem", flexWrap:"wrap" },
  title:     { fontSize:28, fontWeight:800, color:"#111", marginBottom:4 },
  desc:      { fontSize:14, color:"#555" },
  filterRow: { display:"flex", gap:12, marginBottom:"1rem", flexWrap:"wrap" },
  card:      { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:20 },
  empty:     { fontSize:14, color:"#777", fontStyle:"italic", textAlign:"center", padding:"1.5rem 0" },
};
