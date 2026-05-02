export default function AdBlock({ size = "banner" }) {
  const sizes = {
    banner:    { height: 90,  label: "728×90 — Leaderboard Ad" },
    rectangle: { height: 250, label: "300×250 — Medium Rectangle Ad" },
    strip:     { height: 60,  label: "468×60 — Banner Ad" },
  };
  const { height, label } = sizes[size] || sizes.banner;
  return (
    <div style={{
      width: "100%", height, background: "#f0eee8",
      border: "1.5px dashed #ccc", borderRadius: 10,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#bbb", fontSize: 13, fontWeight: 600,
      marginBottom: 20, userSelect: "none",
    }}>
      📢 {label} — Your Ad Here
    </div>
  );
}
