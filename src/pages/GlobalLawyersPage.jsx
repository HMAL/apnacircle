import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { f, fmtDate, formatPhone, MapLink, PhoneLink } from "../components/formHelpers";
import { fetchAllLawyers } from "../lib/db";
import AdBlock from "../components/AdBlock";
import { useIsMobile } from "../lib/useIsMobile";
import { getCountryName } from "../lib/country";

export default function GlobalLawyersPage() {
  const [lawyers, setLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const isMobile = useIsMobile();
  const countryName = getCountryName();
  const regionLabel = countryName === "Canada" ? "Province" : "State";

  useEffect(() => { fetchAllLawyers().then(setLawyers); }, []);

  const titleizeSlug = value =>
    (value || "")
      .split("-")
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const states = [...new Set(lawyers.map(l => l.state_slug))].sort();

  const filtered = lawyers.filter(l => {
    const matchState = !stateFilter || l.state_slug === stateFilter;
    const q = search.trim().toLowerCase();
    const matchSearch = !q || [
      l.firm_name,
      l.name,
      l.phone,
      l.address,
      l.website,
      l.notes,
      l.submitted_by,
      l.state_slug,
      l.city_slug,
    ].some(v => v?.toLowerCase().includes(q));
    return matchState && matchSearch;
  });

  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>Immigration Lawyers — Community Recommended | Apnacircle</title>
        <meta name="description" content="Find community-recommended immigration lawyers across the US and Canada — vetted by immigrants, for immigrants. Specializing in H-1B, green card, family visa and more." />
        <link rel="canonical" href="https://apnacircle.org/lawyers" />
      </Helmet>
      <div style={s.content}>
        <Link to="/" style={s.back}>Home</Link>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>Immigration Lawyers</h1>
            <p style={s.desc}>Community-recommended immigration lawyers across {countryName}. Add one from your city page.</p>
          </div>
        </div>

        <div style={s.filterRow}>
          <input
            style={{ ...f.input, flex:1 }}
            placeholder="Search by firm, lawyer, city, notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            style={{ ...f.select, width:180, flexShrink:0 }}
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
          >
            <option value="">All {regionLabel}s</option>
            {states.map(st => <option key={st} value={st}>{titleizeSlug(st)}</option>)}
          </select>
        </div>

        <div style={s.card}>
          <p style={{ fontSize:13, color:"#888", marginBottom:14 }}>
            {filtered.length} lawyer{filtered.length !== 1 ? "s" : ""} found
            {stateFilter && ` in ${titleizeSlug(stateFilter)}`}
            {search && ` matching "${search}"`}
          </p>
          {filtered.length > 0 ? (
            filtered.map(l => (
              <div key={l.id} style={f.card}>
                <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:6, alignItems:"center" }}>
                  <span style={f.postAuthor}>{l.firm_name || l.name}</span>
                  {l.phone && <span style={f.sub}>Phone: {formatPhone(l.phone)}</span>}
                  {l.address && <span style={f.sub}>Address: <MapLink query={l.address}>{l.address}</MapLink></span>}
                  {l.website && (
                    <span style={f.sub}>
                      Website: <a href={l.website} target="_blank" rel="noreferrer" style={{ color:"var(--orange)" }}>{l.website}</a>
                    </span>
                  )}
                  <span style={{ ...f.tag, background:"#e8f4ff", color:"#0066cc" }}>
                    {titleizeSlug(l.state_slug)} / {titleizeSlug(l.city_slug)}
                  </span>
                  <span style={f.postDate}>{fmtDate(l.created_at)}</span>
                </div>
                {l.notes && <p style={f.text}>{l.notes}</p>}
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
