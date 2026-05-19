import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AdBlock from "../components/AdBlock";
import { useIsMobile } from "../lib/useIsMobile";
import { getCountryName, getCountrySlug } from "../lib/country";
import ResourceNav from "../components/ResourceNav";

const PLAN_OPTS = [
  { label: "Bronze  (60/40)", pct: 60 },
  { label: "Silver  (70/30)", pct: 70 },
  { label: "Gold    (80/20)", pct: 80 },
  { label: "Platinum (90/10)", pct: 90 },
];

function InsuranceCalc() {
  const [deductible, setDeductible] = useState(2000);
  const [oopMax,     setOopMax]     = useState(6000);
  const [paidSoFar,  setPaidSoFar]  = useState(0);
  const [visitCost,  setVisitCost]  = useState(500);
  const [planPct,    setPlanPct]    = useState(80);

  const remainingDed   = Math.max(0, deductible - paidSoFar);
  const towardDed      = Math.min(remainingDed, visitCost);
  const aboveDed       = Math.max(0, visitCost - towardDed);
  const coinsurance    = aboveDed * (1 - planPct / 100);
  const rawYouPay      = towardDed + coinsurance;
  const remainingOop   = Math.max(0, oopMax - paidSoFar);
  const youPay         = Math.min(rawYouPay, remainingOop);
  const newPaidTotal   = paidSoFar + youPay;
  const hitDeductible  = newPaidTotal >= deductible;
  const hitOop         = newPaidTotal >= oopMax;

  return (
    <div style={hs.calcCard}>
      <div style={hs.calcTitle}>🧮 Health Insurance Cost Calculator</div>
      <p style={hs.calcSub}>Confused by deductibles and coinsurance? Enter your plan details to see exactly what you owe.</p>
      <div style={hs.calcGrid}>
        <label style={hs.label}>Annual deductible ($)<input style={hs.input} type="number" value={deductible} step={100} onChange={e => setDeductible(+e.target.value)} /></label>
        <label style={hs.label}>Out-of-pocket max ($)<input style={hs.input} type="number" value={oopMax} step={100} onChange={e => setOopMax(+e.target.value)} /></label>
        <label style={hs.label}>Already paid this year ($)<input style={hs.input} type="number" value={paidSoFar} step={100} onChange={e => setPaidSoFar(+e.target.value)} /></label>
        <label style={hs.label}>This visit / procedure ($)<input style={hs.input} type="number" value={visitCost} step={50} onChange={e => setVisitCost(+e.target.value)} /></label>
        <label style={{ ...hs.label, gridColumn: "1 / -1" }}>Plan type
          <select style={hs.input} value={planPct} onChange={e => setPlanPct(+e.target.value)}>
            {PLAN_OPTS.map(o => <option key={o.pct} value={o.pct}>{o.label}</option>)}
          </select>
        </label>
      </div>
      <div style={hs.results}>
        <div style={hs.result}>
          <span style={hs.rLabel}>You owe this visit</span>
          <span style={hs.rVal}>${youPay.toFixed(2)}</span>
        </div>
        <div style={hs.result}>
          <span style={hs.rLabel}>Remaining deductible</span>
          <span style={hs.rVal}>${Math.max(0, deductible - newPaidTotal).toFixed(0)}</span>
        </div>
        <div style={hs.result}>
          <span style={hs.rLabel}>Remaining OOP max</span>
          <span style={hs.rVal}>${Math.max(0, oopMax - newPaidTotal).toFixed(0)}</span>
        </div>
        {hitOop  && <div style={{ ...hs.badge, background: "#dcfce7", color: "#166534" }}>✓ OOP max hit — insurer pays 100% after this</div>}
        {!hitOop && hitDeductible && <div style={{ ...hs.badge, background: "#dbeafe", color: "#1e40af" }}>✓ Deductible met — coinsurance applies now</div>}
        {!hitDeductible && <div style={{ ...hs.badge, background: "#fef9c3", color: "#854d0e" }}>Deductible not yet met — you pay this bill in full until it is</div>}
      </div>
      <p style={hs.note}>Copay plans differ — this covers deductible + coinsurance structures (most employer plans).</p>
    </div>
  );
}

const ER_DATA = [
  { who: "Primary Care (PCP)", icon: "🩺", cost: "$20–$50 copay", wait: "Same/next day appt", best: "Routine checkups, chronic conditions, referrals, follow-ups", avoid: "Evenings, weekends, emergencies" },
  { who: "Urgent Care",        icon: "⚡", cost: "$50–$150 copay", wait: "30 min – 2 hrs walk-in", best: "Minor injuries, infections, stitches, X-rays, strep, UTIs", avoid: "Chest pain, stroke symptoms, severe injuries" },
  { who: "Emergency Room",     icon: "🚑", cost: "$150–$500+ copay", wait: "2–8 hrs (non-critical)", best: "Chest pain, difficulty breathing, severe bleeding, stroke", avoid: "Anything PCP or urgent care can handle — costs 5–10× more" },
];

function ErComparisonCard() {
  return (
    <div style={hs.calcCard}>
      <div style={hs.calcTitle}>🏥 ER vs Urgent Care vs PCP — When to Go Where</div>
      <p style={hs.calcSub}>Choosing the wrong facility costs you hundreds of dollars. Here's the quick guide.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ER_DATA.map(row => (
          <div key={row.who} style={hs.erRow}>
            <div style={hs.erHeader}>
              <span style={{ fontSize: 22 }}>{row.icon}</span>
              <span style={hs.erName}>{row.who}</span>
              <span style={hs.erCost}>{row.cost}</span>
              <span style={hs.erWait}>⏱ {row.wait}</span>
            </div>
            <div style={hs.erBody}>
              <span style={hs.erGood}>✓ {row.best}</span>
              <span style={hs.erBad}>✗ {row.avoid}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HealthWellnessPage() {
  const isMobile = useIsMobile();
  const countryName = getCountryName();
  const siteBase = getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org";
  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>Health & Wellness Tips for Immigrants — {countryName} | Apnacircle</title>
        <meta name="description" content={`Community health tips for immigrants in ${countryName} — doctors, health insurance, mental health, pharmacies, hospitals and nutrition advice.`} />
        <link rel="canonical" href={`${siteBase}/health/`} />
        <meta property="og:title" content={`Health & Wellness Tips for Immigrants — ${countryName} | Apnacircle`} />
        <meta property="og:description" content={`Community health tips for immigrants in ${countryName} — doctors, health insurance, mental health, pharmacies, hospitals and nutrition advice.`} />
        <meta property="og:url" content={`${siteBase}/health/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {!isMobile && <ResourceNav />}
      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>
        <div style={s.header}>
          <span style={{ fontSize:32 }}>🏥</span>
          <div style={{ flex:1 }}>
            <h1 style={s.title}>Health & Wellness</h1>
            <p style={s.desc}>Practical guidance on navigating healthcare in {countryName} — insurance costs, and where to go.</p>
          </div>
        </div>
        <InsuranceCalc />
        <ErComparisonCard />
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


const hs = {
  calcCard: { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:20, borderTop:"3px solid var(--orange)" },
  calcTitle:{ fontSize:16, fontWeight:800, color:"#111", marginBottom:6 },
  calcSub:  { fontSize:13, color:"#666", marginBottom:16, lineHeight:1.5 },
  calcGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 20px", marginBottom:16 },
  label:    { display:"flex", flexDirection:"column", gap:4, fontSize:12, fontWeight:600, color:"#666" },
  input:    { padding:"6px 10px", border:"1px solid var(--border)", borderRadius:6, fontSize:14, color:"#111", width:"100%", boxSizing:"border-box" },
  results:  { display:"flex", gap:12, flexWrap:"wrap", background:"#fafaf8", borderRadius:8, padding:"1rem", marginBottom:8 },
  result:   { flex:"1 1 120px", display:"flex", flexDirection:"column", gap:2 },
  rLabel:   { fontSize:11, color:"#888", fontWeight:600, textTransform:"uppercase", letterSpacing:0.3 },
  rVal:     { fontSize:22, fontWeight:800, color:"#111" },
  badge:    { width:"100%", padding:"8px 12px", borderRadius:6, fontSize:13, fontWeight:600 },
  note:     { fontSize:11, color:"#aaa", margin:0 },
  erRow:    { border:"0.5px solid var(--border)", borderRadius:8, padding:"12px 14px", background:"#fafaf8" },
  erHeader: { display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:6 },
  erName:   { fontSize:15, fontWeight:800, color:"#111" },
  erCost:   { fontSize:12, fontWeight:700, color:"var(--orange)", background:"var(--orange-light)", padding:"2px 8px", borderRadius:20 },
  erWait:   { fontSize:12, color:"#777" },
  erBody:   { display:"flex", flexDirection:"column", gap:3 },
  erGood:   { fontSize:13, color:"#166534" },
  erBad:    { fontSize:13, color:"#991b1b" },
};

const s = {
  outer:   { padding:"1.5rem 1.5rem 3rem", display:"flex", gap:24, alignItems:"flex-start" },
  content: { flex:1, minWidth:0 },
  rail:    { width:260, flexShrink:0, display:"flex", flexDirection:"column", gap:16, position:"sticky", top:72 },
  back:    { color:"var(--orange)", fontSize:13, fontWeight:600, display:"inline-block", marginBottom:8 },
  header:  { display:"flex", alignItems:"center", gap:16, marginBottom:"1.5rem", flexWrap:"wrap" },
  title:   { fontSize:28, fontWeight:800, color:"#111", marginBottom:4 },
  desc:    { fontSize:14, color:"#555" },
};
