import { useAds } from "../lib/AdsContext";

export default function AdBlock({ stateSlug }) {
  const { ads } = useAds();
  if (!ads.global) return null;
  if (stateSlug && ads.states[stateSlug] === false) return null;
  return (
    <div style={s.box}>
      <span style={{ fontSize: 26 }}>📢</span>
      <span>Ad Slot</span>
      {stateSlug && <span style={s.slug}>{stateSlug}</span>}
    </div>
  );
}

const s = {
  box: {
    width: 250, height: 250,
    background: "#f0eee8",
    border: "1.5px dashed #ccc",
    borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: 8,
    color: "#bbb", fontSize: 13, fontWeight: 600,
    userSelect: "none",
  },
  slug: { fontSize: 11, color: "#ccc" },
};
