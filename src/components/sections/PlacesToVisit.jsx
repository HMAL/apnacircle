import { FEATURED_CITIES } from "../../data/featuredStateCities";

export default function PlacesToVisit({ stateName, cityName }) {
  const places = (FEATURED_CITIES[stateName]?.[cityName]?.places || []).slice(0, 10);

  if (places.length === 0) {
    return (
      <div style={s.empty}>
        <p style={s.emptyText}>No places listed yet for {cityName}.</p>
      </div>
    );
  }

  return (
    <div style={s.wrap}>
      <h2 style={s.heading}>🗺️ Places to Visit in {cityName}</h2>
      <p style={s.sub}>Top must-see spots — from local landmarks to hidden gems.</p>
      <div style={s.grid}>
        {places.map((place, i) => (
          <div key={i} style={s.card}>
            <div style={s.cardTop}>
              <span style={s.num}>{i + 1}</span>
              <p style={s.name}>{place.name}</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={s.address}
            >
              📍 {place.address}
            </a>
            <p style={s.desc}>{place.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  wrap: { padding: "0.25rem 0" },
  heading: { fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 6, marginTop: 0 },
  sub: { fontSize: 14, color: "#777", marginBottom: "1.5rem", marginTop: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 },
  card: { background: "linear-gradient(135deg, #f9f6ff 0%, #fff 60%, #f0f9ff 100%)", border: "1px solid #ddd4f5", borderRadius: "var(--radius)", padding: "1.1rem 1.25rem", boxShadow: "0 4px 14px rgba(80,40,160,0.06)", display: "flex", flexDirection: "column", gap: 8 },
  cardTop: { display: "flex", alignItems: "flex-start", gap: 10 },
  num: { flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: "var(--orange)", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 },
  name: { fontSize: 15, fontWeight: 800, color: "#2a1a5e", margin: 0, lineHeight: 1.35 },
  address: { fontSize: 12, color: "#5b6af5", fontWeight: 600, textDecoration: "none", wordBreak: "break-word" },
  desc: { fontSize: 13, color: "#444", lineHeight: 1.7, margin: 0 },
  empty: { padding: "3rem 0", textAlign: "center" },
  emptyText: { color: "#999", fontSize: 15 },
};
