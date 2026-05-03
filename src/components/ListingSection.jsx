import { useState, useEffect, useCallback } from "react";
import { f } from "./formHelpers";
import { fetchListings } from "../lib/db";

export function ListingSection({ stateSlug, citySlug, section, icon, title, description, FormFields, renderCard }) {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState([]);

  const reload = useCallback(async () => {
    const data = await fetchListings(section, stateSlug, citySlug);
    setListings(data);
  }, [section, stateSlug, citySlug]);

  useEffect(() => { reload(); }, [reload]);

  const handleDone = useCallback(() => {
    setShowForm(false);
    reload();
  }, [reload]);

  return (
    <div>
      <div style={{ background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.25rem 1.5rem", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:26 }}>{icon}</span>
            <h2 style={{ fontSize:21, fontWeight:800, color:"#111" }}>{title}</h2>
          </div>
          <button style={f.btnSm} onClick={() => setShowForm(v => !v)}>
            {showForm ? "✕ Cancel" : "+ Add"}
          </button>
        </div>
        <p style={{ fontSize:14, color:"#555", lineHeight:1.6, marginTop:8 }}>{description}</p>
      </div>

      {showForm && (
        <div style={{ background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:20 }}>
          <FormFields stateSlug={stateSlug} citySlug={citySlug} section={section} onDone={handleDone} />
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {listings.map(item => (
          <div key={item.id} style={{ background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.25rem 1.5rem" }}>
            {renderCard(item)}
          </div>
        ))}
        {listings.length === 0 && <p style={f.empty}>No listings yet. Be the first to add one!</p>}
      </div>
    </div>
  );
}
