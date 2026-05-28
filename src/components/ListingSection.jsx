import { useState, useEffect, useCallback } from "react";
import { f, PIINotice } from "./formHelpers";
import { fetchListings, confirmListing, subscribeDigest } from "../lib/db";

function ConfirmButton({ section, item }) {
  const key = `confirmed_${section}_${item.id}`;
  const [confirmed, setConfirmed] = useState(() => !!localStorage.getItem(key));
  const [count, setCount] = useState(item.confirmations || 0);

  const handleConfirm = () => {
    if (confirmed) return;
    localStorage.setItem(key, "1");
    setConfirmed(true);
    setCount(c => c + 1);
    confirmListing(section, item.id); // fire-and-forget
  };

  return (
    <div style={cb.wrap}>
      {confirmed ? (
        <span style={cb.done}>✓ You confirmed this is still active{count > 0 ? ` · ${count} confirmed` : ""}</span>
      ) : (
        <span style={cb.row}>
          {count > 0 && <span style={cb.count}>{count} confirmed this ·</span>}
          <button onClick={handleConfirm} style={cb.link}>Is this still active? Confirm</button>
        </span>
      )}
    </div>
  );
}

const cb = {
  wrap:  { marginTop: 10, paddingTop: 8, borderTop: "0.5px solid var(--border)" },
  row:   { display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" },
  link:  { fontSize: 11, color: "#aaa", background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 },
  count: { fontSize: 11, color: "#888" },
  done:  { fontSize: 11, color: "#16a34a" },
};

function DigestBanner({ stateSlug, citySlug, onDismiss }) {
  const key = `digest_${stateSlug}_${citySlug}`;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const cityTitle = citySlug.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");

  const submit = () => {
    if (!email.includes("@")) return;
    localStorage.setItem(key, "1");
    subscribeDigest(email, stateSlug, citySlug);
    setDone(true);
    setTimeout(onDismiss, 2200);
  };

  if (done) return (
    <div style={dg.wrap}>
      <span style={dg.thanks}>✓ Subscribed! We'll send weekly updates for {cityTitle}.</span>
    </div>
  );

  return (
    <div style={dg.wrap}>
      <p style={dg.msg}>📬 Get a weekly digest of new listings in <strong>{cityTitle}</strong>?</p>
      <div style={dg.row}>
        <input style={dg.input} type="email" placeholder="your@email.com" value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()} />
        <button style={dg.btn} onClick={submit}>Subscribe</button>
        <button style={dg.skip} onClick={() => { localStorage.setItem(key, "skip"); onDismiss(); }}>No thanks</button>
      </div>
    </div>
  );
}

const dg = {
  wrap:  { background: "#f0fdf4", border: "0.5px solid #bbf7d0", borderRadius: "var(--radius)", padding: "14px 16px", marginBottom: 20 },
  msg:   { fontSize: 14, fontWeight: 700, color: "#166534", marginBottom: 10, marginTop: 0 },
  row:   { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  input: { border: "0.5px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#111", background: "#fff", outline: "none", flex: 1, minWidth: 180 },
  btn:   { background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", flexShrink: 0 },
  skip:  { background: "none", border: "none", fontSize: 12, color: "#6b7280", cursor: "pointer", textDecoration: "underline", padding: 0, flexShrink: 0 },
  thanks:{ fontSize: 13, color: "#16a34a", fontWeight: 700 },
};

export function ListingSection({ stateSlug, citySlug, section, icon, title, description, FormFields, renderCard }) {
  const [showForm, setShowForm] = useState(false);
  const [showDigest, setShowDigest] = useState(false);
  const [listings, setListings] = useState([]);

  const reload = useCallback(async () => {
    const data = await fetchListings(section, stateSlug, citySlug);
    setListings(data);
  }, [section, stateSlug, citySlug]);

  useEffect(() => { reload(); }, [reload]);

  const handleDone = useCallback(() => {
    setShowForm(false);
    reload();
    if (!localStorage.getItem(`digest_${stateSlug}_${citySlug}`)) {
      setShowDigest(true);
    }
  }, [reload, stateSlug, citySlug]);

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
          <PIINotice />
        </div>
      )}

      {showDigest && (
        <DigestBanner stateSlug={stateSlug} citySlug={citySlug} onDismiss={() => setShowDigest(false)} />
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        {listings.map(item => (
          <div key={item.id} style={{ background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.25rem 1.5rem" }}>
            {renderCard(item)}
            <ConfirmButton section={section} item={item} />
          </div>
        ))}
        {listings.length === 0 && <p style={f.empty}>No listings yet. Be the first to add one!</p>}
      </div>
    </div>
  );
}
