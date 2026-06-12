import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AdBlock from "../../components/AdBlock";
import { useIsMobile } from "../../lib/useIsMobile";
import ResourceNav from "../../components/ResourceNav";
import { getCountrySlug } from "../../lib/country";

const ARTICLES = [
  { slug: "retirement",     icon: "🏦", short: "Retirement",    title: "Retirement Planning: 401(k) vs Roth IRA",     desc: "Which account wins for your situation — and what to do if your employer doesn't offer a 401(k)." },
  { slug: "housing",        icon: "🏠", short: "Buy vs. Rent",  title: "Renting vs. Buying a Home",                    desc: "The math most real-estate agents don't show you. A 10-year comparison that may surprise you." },
  { slug: "car",            icon: "🚗", short: "Car",           title: "Lease vs. Buy a Car",                          desc: "An honest look at which option puts more money in your pocket — with a simple side-by-side comparison." },
  { slug: "index-funds",    icon: "📈", short: "Index Funds",   title: "Index Funds vs. Individual Stocks",            desc: "Why Wall Street professionals consistently lose to a basic index fund, and what that means for you." },
  { slug: "529",            icon: "🎓", short: "529 Plans",     title: "529 College Savings Plans",                    desc: "The tax-advantaged account every parent of young children should understand — and the new Roth IRA rollover rule." },
  { slug: "life-insurance", icon: "🛡️", short: "Life Insurance",title: "Life Insurance Basics",                       desc: "Term, whole, universal, IUL — cut through the sales pitch and find out what you actually need." },
  { slug: "w2-1099",        icon: "📄", short: "W-2 / 1099",   title: "W-2 vs 1099 Income",                           desc: "How to read your W-2, what every box means, and the real tax cost of switching from employee to contractor." },
];

const CA_ARTICLES = [
  { slug: "rrsp-tfsa",             icon: "🏦", short: "RRSP / TFSA",    title: "RRSP vs TFSA: Which Should You Prioritize?",       desc: "Canada's two core tax-advantaged accounts — and the right strategy for immigrants building wealth." },
  { slug: "canada-housing",        icon: "🏠", short: "Buy vs. Rent",   title: "Renting vs. Buying a Home in Canada",              desc: "The real math on Canadian real estate — CMHC insurance, the stress test, and when buying makes sense." },
  { slug: "canada-car",            icon: "🚗", short: "Car",            title: "Lease vs. Buy a Car in Canada",                    desc: "HST, provincial insurance differences, and why buying used still wins in Canada." },
  { slug: "canada-index-funds",    icon: "📈", short: "Index Funds",    title: "Index Funds for Canadian Investors",               desc: "All-in-one ETFs, TFSA vs RRSP wrappers, and why index investing beats active management." },
  { slug: "resp",                  icon: "🎓", short: "RESP",           title: "RESP: Canada's Education Savings Plan",            desc: "The 20% government grant most parents leave on the table — and how to maximize it from day one." },
  { slug: "canada-life-insurance", icon: "🛡️", short: "Life Insurance", title: "Life Insurance Basics in Canada",                  desc: "Term, whole, universal — what you actually need and why term almost always wins." },
  { slug: "t4-t4a",               icon: "📄", short: "T4 / T4A",       title: "T4 vs T4A Income: What Every Worker Should Know",  desc: "How to read your T4, the true cost of self-employment, and the GST/HST registration threshold." },
];

// ─── Shared layout ────────────────────────────────────────────────────────────

function FinanceArticleLayout({ slug, title, icon, metaDesc, children }) {
  const isMobile = useIsMobile();
  const countrySlug = getCountrySlug();
  const articles = countrySlug === "ca" ? CA_ARTICLES : ARTICLES;
  const siteBase = countrySlug === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org";
  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>{title} — Finance Tips | Apnacircle</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`${siteBase}/finance/${slug}/`} />
        <meta property="og:title" content={`${title} | Apnacircle`} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={`${siteBase}/finance/${slug}/`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {!isMobile && <ResourceNav />}

      <article style={s.content}>
        <Link to="/finance" style={s.back}>← Finance Tips</Link>

        <div style={s.moreArticles}>
          <h3 style={s.moreTitle}>More Finance Topics</h3>
          <div style={s.moreGrid}>
            {articles.filter(a => a.slug !== slug).map(a => (
              <Link key={a.slug} to={`/finance/${a.slug}`} style={s.moreCard}>
                <span style={s.moreIcon}>{a.icon}</span>
                <span style={s.moreLabel}>{a.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <div style={s.heroCard}>
          <span style={s.heroIcon}>{icon}</span>
          <div>
            <p style={s.byline}>Expert Analysis · Apnacircle Finance</p>
            <h1 style={s.heroTitle}>{title}</h1>
            <p style={s.heroDesc}>{metaDesc}</p>
          </div>
        </div>

        <div style={s.articleBody}>
          {children}
        </div>
      </article>

      {!isMobile && (
        <aside style={s.rail}>
          <CurrencyWidget />
          <AdBlock />
          <AdBlock />
        </aside>
      )}
    </div>
  );
}

// ─── Shared content primitives ────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <section style={bs.section}>
      <h2 style={bs.h2}>{title}</h2>
      {children}
    </section>
  );
}

function Callout({ emoji, title, children }) {
  return (
    <div style={bs.callout}>
      <strong style={bs.calloutTitle}>{emoji} {title}</strong>
      <div style={bs.calloutBody}>{children}</div>
    </div>
  );
}

function MathTable({ caption, headers, rows }) {
  return (
    <div style={bs.tableWrap}>
      {caption && <p style={bs.tableCaption}>{caption}</p>}
      <table style={bs.table}>
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i} style={{ ...bs.th, ...(i === 0 ? {} : bs.thRight) }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={ri % 2 === 1 ? bs.trAlt : {}}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ ...bs.td, ...(ci === 0 ? {} : bs.tdRight), ...(row._bold ? bs.tdBold : {}) }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pros({ items }) {
  return (
    <ul style={bs.list}>
      {items.map((item, i) => <li key={i} style={bs.liGreen}>✓ {item}</li>)}
    </ul>
  );
}

function Cons({ items }) {
  return (
    <ul style={bs.list}>
      {items.map((item, i) => <li key={i} style={bs.liRed}>✗ {item}</li>)}
    </ul>
  );
}

function P({ children }) { return <p style={bs.p}>{children}</p>; }
function H3({ children }) { return <h3 style={bs.h3}>{children}</h3>; }

// ─── Currency widget ──────────────────────────────────────────────────────────

const CURRENCY_TTL = 30 * 60 * 1000;

const FX_PAIRS = [
  { code: "INR", flag: "🇮🇳", sym: "₹" },
  { code: "JPY", flag: "🇯🇵", sym: "¥" },
  { code: "KRW", flag: "🇰🇷", sym: "₩" },
  { code: "CNY", flag: "🇨🇳", sym: "¥" },
  { code: "MXN", flag: "🇲🇽", sym: "MX$" },
  { code: "PHP", flag: "🇵🇭", sym: "₱" },
  { code: "LKR", flag: "🇱🇰", sym: "₨" },
  { code: "BDT", flag: "🇧🇩", sym: "৳" },
  { code: "PKR", flag: "🇵🇰", sym: "₨" },
];

function fmtRate(r) {
  return r >= 100 ? Math.round(r).toLocaleString() : r.toFixed(2);
}

function CurrencyWidget() {
  const countrySlug = getCountrySlug();
  const base = countrySlug === "ca" ? "CAD" : "USD";
  const cacheKey = `apna_fx_${base}_v2`;

  const [rates, setRates] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts < CURRENCY_TTL) { setRates(data); return; }
      }
    } catch (_) {}

    fetch(`https://open.er-api.com/v6/latest/${base}`)
      .then(res => res.json())
      .then(json => {
        const data = {};
        FX_PAIRS.forEach(({ code }) => { if (json?.rates?.[code]) data[code] = json.rates[code]; });
        try { localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() })); } catch (_) {}
        setRates(data);
      })
      .catch(() => setFailed(true));
  }, []);

  if (failed) return null;

  return (
    <div style={s.fxWidget}>
      <div style={s.fxLabel}>💱 1 {base} =</div>
      {rates ? (
        <div style={s.fxList}>
          {FX_PAIRS.map(({ code, flag, sym }) => rates[code] && (
            <div key={code} style={s.fxRow}>
              <span style={s.fxCode}>{flag} {code}</span>
              <span style={s.fxVal}>{sym}{fmtRate(rates[code])}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={s.fxLoading}>Loading…</div>
      )}
    </div>
  );
}

// ─── Calculator helpers ───────────────────────────────────────────────────────

function CalLabel({ label, children }) {
  return <label style={cs.label}>{label}{children}</label>;
}
function CalInput({ value, onChange, min, max, step = 1 }) {
  return (
    <input style={cs.input} type="number" value={value}
      min={min} max={max} step={step}
      onChange={e => onChange(+e.target.value)} />
  );
}

// ─── Retirement Calculator ────────────────────────────────────────────────────

function RetirementCalc({ isCA = false }) {
  const isMobile = useIsMobile();
  const sym = isCA ? "CA$" : "$";
  const [age, setAge]           = useState(30);
  const [retireAt, setRetireAt] = useState(65);
  const [salary, setSalary]     = useState(isCA ? 90000 : 80000);
  const [contrib, setContrib]   = useState(6);
  const [match, setMatch]       = useState(isCA ? 0 : 3);
  const [matchCap, setMatchCap] = useState(isCA ? 0 : 6);
  const [saved, setSaved]       = useState(0);
  const [growth, setGrowth]     = useState(7);

  const years        = Math.max(0, retireAt - age);
  const annualContrib = salary * contrib / 100;
  const annualMatch  = isCA ? 0 : salary * (Math.min(contrib, matchCap) / 100) * (match / 100);
  const monthlyPmt   = (annualContrib + annualMatch) / 12;
  const r = growth / 100 / 12;
  const n = years * 12;
  const fv = n > 0
    ? saved * Math.pow(1 + r, n) + monthlyPmt * (Math.pow(1 + r, n) - 1) / r
    : saved;
  const monthly4pct = fv * 0.04 / 12;

  return (
    <div style={cs.card}>
      <div style={cs.title}>🧮 {isCA ? "RRSP / TFSA" : "401(k) / Roth IRA"} Calculator</div>
      <div style={{ ...cs.grid, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
        <CalLabel label="Your age"><CalInput value={age} min={18} max={64} onChange={setAge} /></CalLabel>
        <CalLabel label="Retire at"><CalInput value={retireAt} min={50} max={80} onChange={setRetireAt} /></CalLabel>
        <CalLabel label={`Annual salary (${sym})`}><CalInput value={salary} step={5000} min={0} onChange={setSalary} /></CalLabel>
        <CalLabel label="Your contribution (%)"><CalInput value={contrib} min={0} max={50} step={0.5} onChange={setContrib} /></CalLabel>
        {!isCA && <>
          <CalLabel label="Employer match (%)"><CalInput value={match} min={0} max={100} step={0.5} onChange={setMatch} /></CalLabel>
          <CalLabel label="Match applies up to your (%)"><CalInput value={matchCap} min={0} max={20} step={0.5} onChange={setMatchCap} /></CalLabel>
        </>}
        <CalLabel label={`Current savings (${sym})`}><CalInput value={saved} step={1000} min={0} onChange={setSaved} /></CalLabel>
        <CalLabel label="Expected annual return (%)"><CalInput value={growth} min={1} max={15} step={0.5} onChange={setGrowth} /></CalLabel>
      </div>
      <div style={cs.results}>
        <div style={cs.result}>
          <span style={cs.rLabel}>Balance at {retireAt}</span>
          <span style={cs.rVal}>{sym}{Math.round(fv).toLocaleString()}</span>
        </div>
        <div style={cs.result}>
          <span style={cs.rLabel}>Monthly income (4% rule)</span>
          <span style={cs.rVal}>{sym}{Math.round(monthly4pct).toLocaleString()}/mo</span>
        </div>
        {!isCA && annualMatch > 0 && (
          <div style={cs.result}>
            <span style={cs.rLabel}>Employer match / yr</span>
            <span style={{ ...cs.rVal, color: "#166534" }}>{sym}{Math.round(annualMatch).toLocaleString()} free</span>
          </div>
        )}
      </div>
      <p style={cs.note}>Estimates only. Actual results depend on market performance and contribution timing.</p>
    </div>
  );
}

// ─── Rent vs Buy Calculator ───────────────────────────────────────────────────

function RentVsBuyCalc({ isCA = false }) {
  const isMobile = useIsMobile();
  const sym = isCA ? "CA$" : "$";
  const [price, setPrice]         = useState(isCA ? 750000 : 500000);
  const [downPct, setDownPct]     = useState(20);
  const [rate, setRate]           = useState(isCA ? 5.5 : 7.0);
  const [monthRent, setMonthRent] = useState(isCA ? 2800 : 2200);
  const [propTax, setPropTax]     = useState(isCA ? 0.7 : 1.2);
  const [maint, setMaint]         = useState(1.0);
  const [appr, setAppr]           = useState(isCA ? 4.0 : 3.0);

  const downAmt      = price * downPct / 100;
  const loan         = price - downAmt;
  const mo           = rate / 100 / 12;
  const monthlyPI    = mo > 0 ? loan * mo * Math.pow(1 + mo, 360) / (Math.pow(1 + mo, 360) - 1) : loan / 360;
  const monthlyTax   = price * propTax / 100 / 12;
  const monthlyMaint = price * maint / 100 / 12;
  const monthlyOwn   = monthlyPI + monthlyTax + monthlyMaint;

  // Buyer: equity after 10 years
  const homeVal10  = price * Math.pow(1 + appr / 100, 10);
  const remaining10 = mo > 0
    ? loan * Math.pow(1 + mo, 120) - monthlyPI * (Math.pow(1 + mo, 120) - 1) / mo
    : Math.max(0, loan - monthlyPI * 120);
  const equity10 = homeVal10 - Math.max(0, remaining10);

  // Renter: invest down payment + monthly savings at 7%
  const diff          = Math.max(0, monthlyOwn - monthRent);
  const r7            = 0.07 / 12;
  const rentPortfolio = downAmt * Math.pow(1 + r7, 120) + diff * (Math.pow(1 + r7, 120) - 1) / r7;

  return (
    <div style={cs.card}>
      <div style={cs.title}>🏠 Rent vs. Buy Calculator</div>
      <div style={{ ...cs.grid, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr" }}>
        <CalLabel label={`Home price (${sym})`}><CalInput value={price} step={10000} min={0} onChange={setPrice} /></CalLabel>
        <CalLabel label="Down payment (%)"><CalInput value={downPct} min={5} max={50} onChange={setDownPct} /></CalLabel>
        <CalLabel label="Mortgage rate (%)"><CalInput value={rate} min={1} max={15} step={0.1} onChange={setRate} /></CalLabel>
        <CalLabel label={`Monthly rent alternative (${sym})`}><CalInput value={monthRent} step={100} min={0} onChange={setMonthRent} /></CalLabel>
        <CalLabel label="Property tax rate (%)"><CalInput value={propTax} min={0} max={5} step={0.1} onChange={setPropTax} /></CalLabel>
        <CalLabel label="Maintenance / yr (%)"><CalInput value={maint} min={0} max={5} step={0.1} onChange={setMaint} /></CalLabel>
        <CalLabel label="Home appreciation / yr (%)"><CalInput value={appr} min={0} max={15} step={0.5} onChange={setAppr} /></CalLabel>
      </div>
      <div style={cs.results}>
        <div style={cs.result}>
          <span style={cs.rLabel}>Monthly mortgage (P&I)</span>
          <span style={cs.rVal}>{sym}{Math.round(monthlyPI).toLocaleString()}</span>
        </div>
        <div style={cs.result}>
          <span style={cs.rLabel}>Monthly own total</span>
          <span style={cs.rVal}>{sym}{Math.round(monthlyOwn).toLocaleString()}</span>
        </div>
        <div style={cs.result}>
          <span style={cs.rLabel}>Monthly rent</span>
          <span style={cs.rVal}>{sym}{Math.round(monthRent).toLocaleString()}</span>
        </div>
        <div style={cs.result}>
          <span style={cs.rLabel}>Buyer equity (10 yr)</span>
          <span style={cs.rVal}>{sym}{Math.round(equity10).toLocaleString()}</span>
        </div>
        <div style={cs.result}>
          <span style={cs.rLabel}>Renter portfolio (10 yr)</span>
          <span style={cs.rVal}>{sym}{Math.round(rentPortfolio).toLocaleString()}</span>
        </div>
      </div>
      <p style={cs.note}>Renter scenario invests down payment + monthly savings at 7%. Excludes closing/selling costs.</p>
    </div>
  );
}

// ─── Remittance Calculator ────────────────────────────────────────────────────

const REMIT_DESTINATIONS = [
  { name: "India",       code: "INR", flag: "🇮🇳", sym: "₹" },
  { name: "Pakistan",    code: "PKR", flag: "🇵🇰", sym: "₨" },
  { name: "Philippines", code: "PHP", flag: "🇵🇭", sym: "₱" },
  { name: "Sri Lanka",   code: "LKR", flag: "🇱🇰", sym: "₨" },
  { name: "Bangladesh",  code: "BDT", flag: "🇧🇩", sym: "৳" },
  { name: "Mexico",      code: "MXN", flag: "🇲🇽", sym: "MX$" },
  { name: "Japan",       code: "JPY", flag: "🇯🇵", sym: "¥" },
  { name: "Korea",       code: "KRW", flag: "🇰🇷", sym: "₩" },
  { name: "China",       code: "CNY", flag: "🇨🇳", sym: "¥" },
];

const REMIT_PROVIDERS = [
  { name: "Wise",          feePct: 0.007, feeFlat: 0,    spread: 0.003, badge: "Best Rate" },
  { name: "Remitly",       feePct: 0,     feeFlat: 3.99, spread: 0.010, badge: "Popular" },
  { name: "Western Union", feePct: 0,     feeFlat: 5.00, spread: 0.018, badge: null },
  { name: "Xe.com",        feePct: 0,     feeFlat: 0,    spread: 0.015, badge: null },
  { name: "Bank Wire",     feePct: 0,     feeFlat: 35,   spread: 0.025, badge: "Avoid" },
];

function RemittanceCalc() {
  const isMobile    = useIsMobile();
  const countrySlug = getCountrySlug();
  const base        = countrySlug === "ca" ? "CAD" : "USD";
  const sym         = countrySlug === "ca" ? "CA$" : "$";
  const cacheKey    = `apna_fx_${base}_v2`;

  const [amount, setAmount]   = useState(500);
  const [destIdx, setDestIdx] = useState(0);
  const [fxRates, setFxRates] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const { data, ts } = JSON.parse(raw);
        if (Date.now() - ts < CURRENCY_TTL) { setFxRates(data); return; }
      }
    } catch (_) {}
    fetch(`https://open.er-api.com/v6/latest/${base}`)
      .then(r => r.json())
      .then(json => {
        const data = {};
        FX_PAIRS.forEach(({ code }) => { if (json?.rates?.[code]) data[code] = json.rates[code]; });
        try { localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() })); } catch (_) {}
        setFxRates(data);
      })
      .catch(() => {});
  }, []);

  const dest       = REMIT_DESTINATIONS[destIdx];
  const marketRate = fxRates?.[dest.code] ?? null;
  const rows       = marketRate
    ? REMIT_PROVIDERS.map(p => {
        const fee      = p.feeFlat + amount * p.feePct;
        const received = (amount - fee) * marketRate * (1 - p.spread);
        return { ...p, fee, received };
      }).sort((a, b) => b.received - a.received)
    : [];

  return (
    <div style={cs.card}>
      <div style={cs.title}>💸 Remittance Calculator — How much arrives?</div>
      <div style={{ ...cs.grid, gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", marginBottom: 16 }}>
        <CalLabel label={`Amount to send (${sym})`}>
          <CalInput value={amount} step={100} min={10} onChange={setAmount} />
        </CalLabel>
        <CalLabel label="Send to">
          <select style={cs.input} value={destIdx} onChange={e => setDestIdx(+e.target.value)}>
            {REMIT_DESTINATIONS.map((d, i) => (
              <option key={d.code} value={i}>{d.flag} {d.name}</option>
            ))}
          </select>
        </CalLabel>
      </div>
      {!marketRate ? (
        <p style={cs.note}>Loading rates…</p>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={cs.table}>
              <thead>
                <tr>
                  <th style={cs.th}>Provider</th>
                  <th style={{ ...cs.th, textAlign: "right" }}>Fee ({sym})</th>
                  <th style={{ ...cs.th, textAlign: "right" }}>Recipient gets ({dest.sym})</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => (
                  <tr key={p.name} style={i === 0 ? cs.trBest : i % 2 === 1 ? { background: "#fafaf8" } : {}}>
                    <td style={cs.td}>
                      {p.name}
                      {p.badge && (
                        <span style={i === 0 ? cs.badgeBest : cs.badge}>{p.badge}</span>
                      )}
                    </td>
                    <td style={{ ...cs.td, textAlign: "right" }}>{p.fee.toFixed(2)}</td>
                    <td style={{ ...cs.td, textAlign: "right", fontWeight: i === 0 ? 700 : 400 }}>
                      {dest.sym}{Math.round(p.received).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={cs.note}>Fee structures approximate as of 2025. Actual provider rates change daily — always verify before sending.</p>
        </>
      )}
    </div>
  );
}

// ─── Hub page ─────────────────────────────────────────────────────────────────

export default function FinanceHubPage() {
  const isMobile = useIsMobile();
  const countrySlug = getCountrySlug();
  const articles = countrySlug === "ca" ? CA_ARTICLES : ARTICLES;
  const siteBase = countrySlug === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org";
  const country = countrySlug === "ca" ? "Canada" : "the US";
  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>Finance Tips for Immigrants — Apnacircle</title>
        <meta name="description" content={`Practical, honest financial guidance for immigrants in ${country} — retirement accounts, renting vs. buying, car leasing, index funds, education savings, and life insurance.`} />
        <link rel="canonical" href={`${siteBase}/finance/`} />
        <meta property="og:title" content="Finance Tips for Immigrants | Apnacircle" />
        <meta property="og:description" content={`Practical, honest financial guidance for immigrants in ${country}.`} />
        <meta property="og:url" content={`${siteBase}/finance/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {!isMobile && <ResourceNav />}

      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>

        <div style={s.hubHero}>
          <span style={{ fontSize: 40 }}>💰</span>
          <div>
            <h1 style={s.heroTitle}>Finance Tips</h1>
            <p style={s.heroDesc}>
              Straightforward financial analysis — written for people building wealth in {country}.
              No fluff, no sales pitch, just the math and honest opinions.
            </p>
          </div>
        </div>

        <div style={s.articleGrid}>
          {articles.map(a => (
            <Link key={a.slug} to={`/finance/${a.slug}`} style={s.articleCard}>
              <span style={s.articleIcon}>{a.icon}</span>
              <div>
                <h2 style={s.articleCardTitle}>{a.title}</h2>
                <p style={s.articleCardDesc}>{a.desc}</p>
              </div>
              <span style={s.articleArrow}>→</span>
            </Link>
          ))}
        </div>
        <RemittanceCalc />
      </div>

      {!isMobile && (
        <aside style={s.rail}>
          <CurrencyWidget />
          <AdBlock />
          <AdBlock />
        </aside>
      )}
    </div>
  );
}

// ─── Article 1: Retirement ────────────────────────────────────────────────────

export function RetirementPage() {
  return (
    <FinanceArticleLayout
      slug="retirement"
      icon="🏦"
      title="Retirement Planning: 401(k) vs Roth IRA"
      metaDesc="Which retirement account is right for you — traditional 401(k), Roth IRA, or both? And what are your options if your employer doesn't offer a 401(k)?"
    >
      <Section title="The Short Answer">
        <P>If your employer offers a 401(k) with a match, contribute at least enough to get the full match — that's an instant 50–100% return on your money. Then max your Roth IRA. Then go back and max your 401(k). If your employer has no 401(k), open a Roth IRA today.</P>
        <P>That's the framework. The rest of this article explains why, and what to do in your specific situation.</P>
      </Section>

      <Section title="How Each Account Works">
        <H3>Traditional 401(k)</H3>
        <P>You contribute pre-tax dollars, which lowers your taxable income today. The money grows tax-deferred. You pay income tax when you withdraw in retirement. In 2024, you can contribute up to $23,000 (or $30,500 if you're 50 or older). Many employers match a portion of what you put in — that's free money you should never leave on the table.</P>

        <H3>Roth IRA</H3>
        <P>You contribute after-tax dollars — no deduction today. But the money grows completely tax-free, and qualified withdrawals in retirement are also tax-free. The 2024 limit is $7,000 ($8,000 if 50+). There are income limits: single filers earning above $161,000 and married filers above $240,000 begin to phase out. Crucially, Roth IRAs have no Required Minimum Distributions (RMDs), giving you complete flexibility in retirement.</P>

        <H3>Traditional IRA</H3>
        <P>Similar to a 401(k) in tax treatment, but with lower limits ($7,000/year). If you or your spouse have access to a workplace plan, the deductibility phases out at certain income levels. Still useful as a vehicle to do a "Backdoor Roth" conversion for high earners.</P>
      </Section>

      <Section title="Which Should You Choose?">
        <MathTable
          caption="Quick decision guide based on your situation"
          headers={["Your Situation", "Recommendation"]}
          rows={[
            ["Low tax bracket now, expect higher later", "Prioritize Roth IRA — pay taxes now while they're cheap"],
            ["High tax bracket now, expect lower in retirement", "Prioritize Traditional 401(k) — defer the taxes"],
            ["Early career (20s–30s)", "Roth IRA — decades of tax-free compounding is hard to beat"],
            ["Peak earning years, employer match available", "401(k) to the match → max Roth IRA → max 401(k)"],
            ["Near retirement (55+)", "Max 401(k) catch-up contributions, evaluate Roth conversions"],
          ]}
        />
      </Section>

      <Section title="The Priority Order">
        <P>Follow this sequence each year, in order:</P>
        <ol style={bs.ol}>
          <li style={bs.li}><strong>401(k) up to employer match.</strong> If your employer matches 50% of the first 6%, contribute at least 6%. Anything less is walking away from free money.</li>
          <li style={bs.li}><strong>Max your Roth IRA ($7,000/year).</strong> Open one at Fidelity, Vanguard, or Schwab. Invest in a low-cost S&P 500 index fund or a target-date fund.</li>
          <li style={bs.li}><strong>Max your 401(k) ($23,000/year).</strong> Go back and fill it to the legal limit.</li>
          <li style={bs.li}><strong>Taxable brokerage.</strong> If you've maxed all tax-advantaged accounts, invest the rest here.</li>
        </ol>
      </Section>

      <Section title="What If Your Employer Doesn't Offer a 401(k)?">
        <P>This is common at smaller companies. You still have excellent options:</P>

        <H3>Roth IRA or Traditional IRA</H3>
        <P>Open one yourself. Fidelity and Vanguard both have zero account minimums. Invest in a total market index fund. The $7,000 annual limit is low, but tax-free compounding over 30+ years is powerful.</P>

        <H3>SEP-IRA (If Self-Employed or Freelancing)</H3>
        <P>Contribute up to 25% of your net self-employment income, or $69,000 in 2024 — whichever is less. This is the most powerful retirement tool for freelancers and solo business owners. Easy to open at any major brokerage.</P>

        <H3>Solo 401(k) (If Self-Employed with No Full-Time Employees)</H3>
        <P>Allows the same contribution limits as a regular 401(k), plus the ability to also contribute as the "employer." Effective limit can reach $69,000/year. You can also choose a Roth Solo 401(k). Slightly more paperwork than a SEP-IRA but more contribution room.</P>

        <H3>HSA — The Hidden Triple-Advantage Account</H3>
        <P>If you're on a High-Deductible Health Plan (HDHP), max your HSA first. Contributions are pre-tax, growth is tax-free, and withdrawals for medical expenses are tax-free. After 65, you can withdraw for any reason (just like a Traditional IRA). 2024 limits: $4,150 single, $8,300 family. Many people under-appreciate how good this account is.</P>

        <Callout emoji="💡" title="The Backdoor Roth IRA (For High Earners)">
          If you earn too much to contribute directly to a Roth IRA, contribute to a Traditional IRA (non-deductible) and immediately convert it to a Roth. This legal strategy lets high earners access Roth benefits. Be mindful of the "pro-rata rule" if you have other Traditional IRA balances — consult a fee-only financial advisor if you're in this situation.
        </Callout>
      </Section>

      <Section title="One Simple Rule to Remember">
        <Callout emoji="🎯" title="My Take">
          The best retirement account is the one you actually contribute to consistently. A Roth IRA with automatic monthly contributions beats a perfectly optimized but inconsistent strategy every time. Open an account today, set up automatic transfers on payday, and invest in a broad index fund. Future you will be grateful.
        </Callout>
      </Section>
      <RetirementCalc />
    </FinanceArticleLayout>
  );
}

// ─── Article 2: Housing ───────────────────────────────────────────────────────

export function HousingPage() {
  return (
    <FinanceArticleLayout
      slug="housing"
      icon="🏠"
      title="Renting vs. Buying a Home"
      metaDesc="The math most real-estate agents don't show you. A clear 10-year comparison on a $500,000 home that may change how you think about homeownership."
    >
      <Section title="The Narrative vs. The Math">
        <P>
          "Renting is throwing money away." You've heard it. It's repeated so often it feels like common sense.
          It isn't. Renting is paying for housing — a real thing of real value. Buying is also paying for housing,
          just with a very different set of costs attached. Let's look at the actual numbers.
        </P>
      </Section>

      <Section title="10-Year Comparison: $500,000 Home">
        <P>Assume a $500,000 home in a typical US market. Both scenarios cover 10 years of housing.</P>

        <H3>The Buyer's True Costs</H3>
        <MathTable
          caption="Monthly costs for a $500,000 home (20% down, 7% mortgage rate)"
          headers={["Cost Item", "Monthly Amount"]}
          rows={[
            ["Mortgage payment ($400K at 7%, 30-yr)", "$2,661"],
            ["Property tax (1% annually)", "$417"],
            ["Home insurance", "$150"],
            ["Maintenance & repairs (1% annually)", "$417"],
            ["Total monthly housing cost", "$3,645"],
          ]}
        />

        <MathTable
          caption="Buyer's 10-year financial summary"
          headers={["Item", "Amount"]}
          rows={[
            ["Down payment (upfront)", "$100,000"],
            ["Monthly payments × 120 months", "$437,400"],
            ["Total cash out", "$537,400"],
            ["Home value after 10 yrs (3%/yr appreciation)", "$671,958"],
            ["Remaining mortgage balance", "−$349,000"],
            ["Gross equity", "$322,958"],
            ["Selling costs (6% of home value)", "−$40,317"],
            ["Net equity after sale", "$282,641"],
          ]}
        />

        <H3>The Renter's Position</H3>
        <MathTable
          caption="Renter invests the down payment and monthly savings at 8% annual return"
          headers={["Item", "Amount"]}
          rows={[
            ["Monthly rent (comparable home)", "$2,800"],
            ["Total rent paid over 10 years", "$336,000"],
            ["Monthly savings vs buying ($3,645 − $2,800)", "$845/mo"],
            ["$100,000 down payment invested at 8% for 10 yrs", "$215,892"],
            ["$845/mo invested at 8% for 10 yrs", "$154,871"],
            ["Total investment portfolio after 10 years", "$370,763"],
          ]}
        />

        <H3>The Side-by-Side</H3>
        <MathTable
          headers={["", "Buyer", "Renter"]}
          rows={[
            ["Total cash spent", "$537,400", "$336,000"],
            ["Assets accumulated", "$282,641 equity", "$370,763 portfolio"],
            ["Net financial position", "+$282,641", "+$370,763"],
          ]}
        />

        <Callout emoji="📊" title="The Result">
          The renter comes out <strong>$88,000 ahead</strong> after 10 years — and spent <strong>$201,400 less</strong> total. The renter's investment portfolio of $370K beats the buyer's net equity of $282K.
        </Callout>
      </Section>

      <Section title="What the Numbers Assume (And What Changes Things)">
        <P>These numbers favor renting under typical conditions. The calculation shifts if:</P>
        <Pros items={[
          "You stay in the home 15+ years (transaction costs amortize, equity compounds)",
          "Home appreciation significantly outpaces 3% (common in NYC, SF, Austin historically)",
          "Your mortgage rate is below 5% (makes monthly cost more competitive)",
          "You wouldn't invest the difference — behavioral discipline matters here",
        ]} />
        <Cons items={[
          "You move in under 5 years — transaction costs alone destroy the financial case for buying",
          "Maintenance costs spike (older homes, deferred repairs)",
          "Your local rental market is tight — forced renters pay a premium",
          "You over-buy — taking on more home than you need inflates every cost",
        ]} />
      </Section>

      <Section title="The Hidden Costs Buyers Underestimate">
        <P>Real-estate agents quote your mortgage payment. They rarely mention these:</P>
        <ul style={bs.list}>
          <li style={bs.li}><strong>Closing costs when buying:</strong> 2–4% of purchase price (~$10,000–$20,000 on a $500K home)</li>
          <li style={bs.li}><strong>Selling costs:</strong> 5–6% of sale price — often $30,000–$40,000</li>
          <li style={bs.li}><strong>Maintenance:</strong> Budget 1–2% of home value annually. On a $500K home, that's $5,000–$10,000/year</li>
          <li style={bs.li}><strong>Opportunity cost of down payment:</strong> $100,000 invested at 8% becomes $215,892 in 10 years</li>
          <li style={bs.li}><strong>Illiquidity:</strong> Your equity is locked in until you sell or take out a HELOC</li>
        </ul>
      </Section>

      <Section title="When Renting Makes Even More Sense for Immigrants">
        <P>As a newer arrival to the US, renting has additional advantages that the math doesn't fully capture:</P>
        <Pros items={[
          "Geographic flexibility — you can move where the best job opportunity is",
          "No credit history required beyond basic rental screening",
          "No exposure to local market downturns in a city you may not stay in long-term",
          "Time to understand neighborhoods before committing 30 years",
          "Preserves capital during a period when building an emergency fund matters most",
        ]} />
      </Section>

      <Section title="My Honest Opinion">
        <Callout emoji="🎯" title="Bottom Line">
          Buying a home can be a fine financial decision — but it is <em>not</em> automatically better than renting.
          The math depends on your time horizon, local market, mortgage rate, and whether you'd actually invest the difference.
          If you're planning to stay 7+ years in the same city and can buy without stretching your finances, it may make sense.
          If you're still getting settled, building your career, or carrying other debt — rent without guilt, invest the difference, and you'll likely come out ahead.
        </Callout>
      </Section>
      <RentVsBuyCalc />
    </FinanceArticleLayout>
  );
}

// ─── Article 3: Car ───────────────────────────────────────────────────────────

export function CarPage() {
  return (
    <FinanceArticleLayout
      slug="car"
      icon="🚗"
      title="Lease vs. Buy a Car: An Honest Comparison"
      metaDesc="Leasing is designed for the dealership's benefit, not yours. Here's the real math — and what the smartest car decision actually looks like."
    >
      <Section title="The Honest Starting Point">
        <P>Car dealers love leases. They generate steady return customers, higher profit margins, and customers who never build equity. That doesn't mean leasing is always wrong — but you should understand exactly what you're paying for before you sign anything.</P>
      </Section>

      <Section title="Three-Way Math: $35,000 Car">
        <P>Let's compare three ways to get the same $35,000 car over three years.</P>

        <MathTable
          caption="Option A: Lease (3 years)"
          headers={["Item", "Amount"]}
          rows={[
            ["Monthly payment", "$450/mo"],
            ["Payments over 36 months", "$16,200"],
            ["Drive-off fees (first month, taxes, fees)", "≈ $2,500"],
            ["Total out-of-pocket", "$18,700"],
            ["Equity at end of lease", "$0"],
            ["True cost for 3 years of transportation", "$18,700"],
          ]}
        />

        <MathTable
          caption="Option B: Buy New (5-year loan)"
          headers={["Item", "Amount"]}
          rows={[
            ["Vehicle price", "$35,000"],
            ["Monthly payment ($0 down, 5.5% for 60 mo)", "$670/mo"],
            ["Total paid over 5 years", "$40,200"],
            ["Car value after 5 years", "≈ $14,000"],
            ["Net cost of transportation", "$26,200"],
          ]}
        />

        <MathTable
          caption="Option C: Buy Certified Pre-Owned (same car, 3 years old)"
          headers={["Item", "Amount"]}
          rows={[
            ["Vehicle price (3-yr-old model)", "$21,000"],
            ["Monthly payment ($0 down, 5.5% for 48 mo)", "$490/mo"],
            ["Total paid over 4 years", "$23,520"],
            ["Car value after 4 years of ownership", "≈ $12,000"],
            ["Net cost of transportation", "$11,520"],
          ]}
        />

        <H3>Side-by-Side Over 48 Months</H3>
        <MathTable
          headers={["", "Lease (renew once)", "Buy New", "Buy Used CPO"]}
          rows={[
            ["Total cash paid", "≈ $37,400", "$40,200", "$23,520"],
            ["Asset owned at end", "$0", "Car worth $14K", "Car worth $12K"],
            ["True transportation cost", "$37,400", "$26,200", "$11,520"],
          ]}
        />

        <Callout emoji="📊" title="The Winner">
          Buying a reliable used car and driving it for years costs less than half of what leasing does over the same period.
        </Callout>
      </Section>

      <Section title="The Depreciation Reality">
        <P>New cars lose value fast. This is the core reason buying used beats buying new:</P>
        <MathTable
          caption="Typical depreciation on a $35,000 vehicle"
          headers={["Year", "Approx Value", "Value Lost"]}
          rows={[
            ["New (day of purchase)", "$35,000", "—"],
            ["Year 1", "$28,000", "−$7,000 (20%)"],
            ["Year 2", "$24,000", "−$4,000"],
            ["Year 3", "$21,000", "−$3,000"],
            ["Year 4", "$18,000", "−$3,000"],
            ["Year 5", "$14,000", "−$4,000"],
          ]}
        />
        <P>When you buy a 3-year-old car, you skip the brutal first-year depreciation. The previous owner absorbed that loss. You get a nearly-new car with significant savings built in.</P>
      </Section>

      <Section title="When Leasing Actually Makes Sense">
        <P>Leasing isn't always irrational. These are the cases where it might make sense for you:</P>
        <Pros items={[
          "You're self-employed and can deduct lease payments as a business expense",
          "You genuinely need a new car every 2–3 years for professional image reasons",
          "You drive low miles (leases penalize over-mileage at $0.15–$0.30/mi)",
          "You want exactly zero maintenance surprises during the lease term",
        ]} />
        <Cons items={[
          "You don't own anything at the end — it's rent, not investment",
          "Mileage penalties are brutal if you exceed the limit",
          "You need excellent credit for advertised lease deals",
          "Early termination fees can be several months of payments",
          "You're perpetually in a payment cycle — there's no 'paid off' moment",
        ]} />
      </Section>

      <Section title="The Smart Car Strategy">
        <ol style={bs.ol}>
          <li style={bs.li}><strong>Buy a reliable 2–4 year old car</strong> from a reputable brand (Toyota, Honda, Mazda have strong reliability records). Certified Pre-Owned programs add a warranty layer.</li>
          <li style={bs.li}><strong>Pay it off on schedule.</strong> Don't extend the loan to lower monthly payments — that costs you more in interest.</li>
          <li style={bs.li}><strong>Keep it for 8–12 years.</strong> Once your loan is paid off, keep saving the "car payment" amount into an investment account. When you eventually need a new car, you pay cash or make a large down payment.</li>
          <li style={bs.li}><strong>Maintain it properly.</strong> Regular oil changes, timing belt replacements, and tire rotations are far cheaper than new car payments.</li>
        </ol>

        <Callout emoji="🎯" title="My Take">
          The smartest car decision I've seen consistently is: buy a 3-year-old Toyota Camry or Honda Accord with under 35,000 miles, put 20% down, finance the rest at the lowest available rate, and drive it until 150,000+ miles. You'll save $10,000–$20,000 over a decade compared to leasing — and that money, invested, grows into something meaningful.
        </Callout>
      </Section>
    </FinanceArticleLayout>
  );
}

// ─── Article 4: Index Funds ───────────────────────────────────────────────────

export function IndexFundsPage() {
  return (
    <FinanceArticleLayout
      slug="index-funds"
      icon="📈"
      title="Index Funds vs. Individual Stocks"
      metaDesc="Why professional fund managers consistently lose to a simple index fund — and what that means for how you should invest your money."
    >
      <Section title="The Most Humbling Fact in Investing">
        <P>
          Over any 20-year period, roughly 90% of actively managed funds — run by highly paid professionals with
          teams of analysts, proprietary data, and sophisticated models — underperform a simple S&P 500 index fund.
          Not slightly underperform. Significantly underperform, after fees.
        </P>
        <P>
          This isn't opinion. It's documented by SPIVA (S&P Indices Versus Active) reports, published twice a year.
          If the professionals can't consistently beat the market, the odds of you doing it are not encouraging.
        </P>
      </Section>

      <Section title="What Is an Index Fund?">
        <P>An index fund is a fund that owns a slice of every company in a specific index — like the S&P 500 (500 largest US companies). When Apple, Microsoft, or Amazon grows, your fund grows proportionally. You're not betting on any one company; you're betting on the US economy.</P>
        <P>The key advantages are low cost (expense ratios as low as 0.03%), instant diversification, and zero decisions required beyond "keep investing."</P>
      </Section>

      <Section title="The Compounding Math">
        <MathTable
          caption="$10,000 invested for 30 years at different return rates"
          headers={["Investment Approach", "Avg Annual Return", "Final Value"]}
          rows={[
            ["S&P 500 index fund (historical avg)", "10%", "$174,494"],
            ["Index fund after 0.05% expense ratio", "9.95%", "$171,741"],
            ["Active fund after 1% expense ratio", "9%", "$132,677"],
            ["Active fund that slightly underperforms", "8%", "$100,627"],
            ["Stock picker who underperforms market by 2%", "8%", "$100,627"],
          ]}
        />
        <P>A 1% annual fee doesn't sound like much. Over 30 years on $10,000, it costs you over $40,000 in lost compounding. This is why fees matter so much in investing.</P>
      </Section>

      <Section title="Why Stock Picking Is So Hard">
        <P>Individual stock picking has real psychological and informational challenges that most investors underestimate:</P>
        <ul style={bs.list}>
          <li style={bs.li}><strong>Markets are efficient.</strong> By the time you read news about a company, millions of professional traders have already priced it in.</li>
          <li style={bs.li}><strong>Diversification requires capital.</strong> To properly diversify across sectors, you need to own 20–30 stocks minimum.</li>
          <li style={bs.li}><strong>Behavioral biases destroy returns.</strong> Selling during crashes and buying during rallies is the most common wealth-destroying pattern among individual investors.</li>
          <li style={bs.li}><strong>Time cost.</strong> Researching individual companies takes hours per week. That time has real value.</li>
          <li style={bs.li}><strong>Survivorship bias.</strong> We remember the big winners (Tesla, Nvidia). We forget the hundreds of stocks that went to zero.</li>
        </ul>
      </Section>

      <Section title="The Core Portfolio Most People Need">
        <P>You don't need complexity. Here are the core funds that cover almost everything:</P>
        <MathTable
          headers={["Fund", "What It Covers", "Ticker (Fidelity/Vanguard)", "Expense Ratio"]}
          rows={[
            ["Total US Market", "Every US stock", "FZROX / VTI", "0% / 0.03%"],
            ["S&P 500", "500 largest US companies", "FXAIX / VOO", "0.015% / 0.03%"],
            ["Total International", "Non-US stocks", "FZILX / VXUS", "0% / 0.07%"],
            ["Total Bond Market", "US bonds", "FXNAX / BND", "0.025% / 0.03%"],
          ]}
        />

        <H3>The Classic 3-Fund Portfolio</H3>
        <P>Most financial experts agree that these three funds — in proportions adjusted to your age and risk tolerance — cover virtually everything a long-term investor needs:</P>
        <ul style={bs.list}>
          <li style={bs.li}><strong>VTI or FZROX</strong> — Total US stock market (60–80% of portfolio)</li>
          <li style={bs.li}><strong>VXUS or FZILX</strong> — International stocks (15–25% of portfolio)</li>
          <li style={bs.li}><strong>BND or FXNAX</strong> — Bonds (5–25%, increase as you age)</li>
        </ul>
      </Section>

      <Section title="If You Still Want to Pick Stocks">
        <P>There's nothing wrong with finding it fun or intellectually engaging. Here's how to do it without harming your wealth:</P>
        <Callout emoji="✅" title="The 90/10 Rule">
          Put 90% of your portfolio in index funds. Use 10% as your "curiosity portfolio" for individual stocks you believe in. This way, even if your picks underperform, it has minimal impact on your overall financial outcome — and you get to scratch the investing itch without betting your future on it.
        </Callout>
      </Section>

      <Section title="Dollar-Cost Averaging: The One Habit That Matters Most">
        <P>Invest a fixed dollar amount every month, automatically, regardless of what the market is doing. This removes the temptation to time the market (which even professionals consistently fail at). When markets drop, your fixed amount buys more shares. When markets rise, you own more shares worth more.</P>
        <Callout emoji="🎯" title="My Take">
          Open a Fidelity or Vanguard account today. Set up automatic monthly investments into a total market index fund. Increase the amount whenever your income increases. Don't check the balance more than quarterly. In 30 years, you'll be shocked at what boring, consistent investing compounded into.
        </Callout>
      </Section>
    </FinanceArticleLayout>
  );
}

// ─── Article 5: 529 Plans ─────────────────────────────────────────────────────

export function Plans529Page() {
  return (
    <FinanceArticleLayout
      slug="529"
      icon="🎓"
      title="529 College Savings Plans: Everything You Need to Know"
      metaDesc="The tax-advantaged education account every parent should understand — including the new Roth IRA rollover rule that eliminates the biggest fear about 529s."
    >
      <Section title="What Is a 529 Plan?">
        <P>A 529 plan is a tax-advantaged savings account designed specifically for education expenses. Named after Section 529 of the IRS code, it works similarly to a Roth IRA: you contribute after-tax money, it grows tax-free, and withdrawals for qualified education expenses are completely tax-free at the federal level.</P>
        <P>Many states also offer a state income tax deduction or credit for contributions — this is free money that most people leave on the table simply because they don't know about it.</P>
      </Section>

      <Section title="What Qualifies as an Education Expense?">
        <P>More than most people realize:</P>
        <Pros items={[
          "College tuition, fees, and room & board (if enrolled at least half-time)",
          "Books, supplies, and required equipment",
          "Computers and software used for school",
          "K–12 tuition up to $10,000 per year",
          "Trade schools, vocational programs, and community colleges",
          "Apprenticeship programs registered with the US Department of Labor",
          "Student loan repayment up to $10,000 lifetime (SECURE 2.0 Act, 2022)",
        ]} />
      </Section>

      <Section title="The Biggest Fear — Eliminated">
        <P>"What if my child doesn't go to college?" This was the primary objection to 529 plans for years. The SECURE 2.0 Act (effective 2024) largely removes this concern.</P>

        <Callout emoji="🆕" title="New: Roth IRA Rollover for 529 Funds">
          Starting in 2024, unused 529 funds can be rolled into a Roth IRA for the beneficiary — up to $35,000 lifetime. Requirements: the 529 account must be at least 15 years old, and the rollover is subject to the annual Roth IRA contribution limit ($7,000 in 2024). This means even if your child takes a different path, the money still ends up in a powerful retirement account.
        </Callout>

        <P>You can also change the beneficiary to another family member — a sibling, cousin, your spouse, or even yourself — if the original beneficiary doesn't use the funds. The money is never truly "trapped."</P>
      </Section>

      <Section title="The Math: Starting Early vs. Late">
        <MathTable
          caption="$200/month invested in a 529 at 7% annual growth"
          headers={["Child's Age at First Contribution", "Years Invested", "Total Contributed", "Account Value at Age 18"]}
          rows={[
            ["At birth", "18 years", "$43,200", "$84,349"],
            ["Age 5", "13 years", "$31,200", "$51,628"],
            ["Age 10", "8 years", "$19,200", "$27,432"],
            ["Age 15", "3 years", "$7,200", "$8,019"],
          ]}
        />
        <P>Starting at birth versus age 10 results in $57,000 more — from the same $200/month. This is why opening a 529 at birth (or even before, if your state allows it) matters so much.</P>
      </Section>

      <Section title="Contribution Rules">
        <P>There's no annual IRS contribution limit for 529 plans, but gift tax rules apply. In 2024, you can contribute up to $18,000 per year per donor per beneficiary without filing a gift tax return ($36,000 for married couples filing jointly).</P>

        <H3>Superfunding</H3>
        <P>529 plans offer a unique "superfunding" option: you can contribute 5 years' worth of gifts all at once — up to $90,000 per individual ($180,000 per couple) — and elect to spread it over 5 years for gift tax purposes. This is a powerful strategy for grandparents or parents with a lump sum to invest early.</P>
      </Section>

      <Section title="Which 529 Plan Should You Choose?">
        <P>You don't have to use your state's 529 plan. You can open any state's plan for any school in any state. Here's how to decide:</P>
        <ol style={bs.ol}>
          <li style={bs.li}><strong>Check your state's tax deduction first.</strong> If your state offers a meaningful deduction for contributions, use your state's plan (up to the deductible limit), then contribute to a better plan if you want more investment options.</li>
          <li style={bs.li}><strong>If no state deduction, choose by investment quality.</strong> Utah's my529 and Nevada's Vanguard 529 consistently rank among the best for low-cost index fund options.</li>
          <li style={bs.li}><strong>Use age-based portfolios.</strong> These automatically shift more conservative as your child approaches college age — less risk when you need the money soon.</li>
        </ol>

        <Callout emoji="🎯" title="My Take">
          Open a 529 the day your child is born. Even $25/month at birth beats $200/month starting at age 10. If your state has a tax deduction, max that out first. Otherwise, open a Utah my529 account and invest in a total stock market index fund in an age-based portfolio. Set it, forget it, and let compounding do its work.
        </Callout>
      </Section>

      <Section title="What If You Over-Save?">
        <P>This is a good problem to have. Your options, in order of preference:</P>
        <ol style={bs.ol}>
          <li style={bs.li}>Change beneficiary to another family member</li>
          <li style={bs.li}>Roll up to $35,000 into a Roth IRA for the beneficiary (SECURE 2.0)</li>
          <li style={bs.li}>Leave it for grandchildren</li>
          <li style={bs.li}>Withdraw non-qualified: pay income tax + 10% penalty only on the earnings (not contributions)</li>
        </ol>
      </Section>
    </FinanceArticleLayout>
  );
}

// ─── Article 6: Life Insurance ────────────────────────────────────────────────

export function LifeInsurancePage() {
  return (
    <FinanceArticleLayout
      slug="life-insurance"
      icon="🛡️"
      title="Life Insurance Basics: What You Actually Need"
      metaDesc="Term, whole, universal, IUL — cut through the sales pitch and find out which type of life insurance actually makes sense, and why most people only need term."
    >
      <Section title="Why This Topic Matters (And Why It's Confusing)">
        <P>Life insurance is one of the most over-complicated, over-sold financial products in existence. Insurance agents earn enormous commissions — sometimes 50–110% of your first year's premium — on certain types of policies. Understanding the incentive structure helps you understand why you're often steered toward products that benefit the seller more than you.</P>
        <P>The good news: for most people, the right answer is simple.</P>
      </Section>

      <Section title="How Much Life Insurance Do You Need?">
        <P>Before choosing a type, understand the purpose: life insurance replaces your income if you die, so your dependents can continue their financial lives.</P>
        <P>A common rule of thumb: <strong>10–12 times your annual income.</strong> If you earn $80,000/year, a $800,000–$960,000 policy is a reasonable starting point. Adjust upward if you have a mortgage, young children, or non-working spouse. Adjust downward if your spouse earns well and you have significant savings.</P>
      </Section>

      <Section title="The Six Types of Life Insurance">

        <H3>1. Term Life Insurance — The Right Choice for Most People</H3>
        <P>Pure protection. You pay a fixed premium for a set term (10, 20, or 30 years). If you die during that term, your beneficiaries receive the death benefit. If you don't, the policy expires. No cash value, no investment component, no complexity.</P>
        <MathTable
          caption="Sample term life premiums — healthy 35-year-old"
          headers={["Coverage Amount", "20-Year Term", "30-Year Term"]}
          rows={[
            ["$500,000", "≈ $25–30/mo", "≈ $35–45/mo"],
            ["$1,000,000", "≈ $40–50/mo", "≈ $60–80/mo"],
          ]}
        />
        <Pros items={[
          "By far the most affordable type of coverage",
          "Simple and transparent — no hidden fees",
          "Covers you during the years your family needs it most (while kids are young, mortgage is high)",
          "Frees up money to invest in actual investment accounts",
        ]} />
        <Cons items={[
          "No cash value — premium dollars don't build equity",
          "Coverage ends with the term; renewals at older age cost much more",
        ]} />

        <H3>2. Whole Life Insurance — Usually the Wrong Choice</H3>
        <P>Permanent coverage that doesn't expire, combined with a "cash value" savings component. Premiums are 5–15 times higher than comparable term coverage. The cash value grows slowly (2–4% guaranteed) and is heavily front-loaded with fees. Agents earn huge commissions on these policies.</P>
        <Pros items={[
          "Lifelong coverage — doesn't expire",
          "Guaranteed cash value growth",
          "Can borrow against cash value tax-free",
          "Useful for certain estate planning strategies (very high net worth)",
        ]} />
        <Cons items={[
          "Premiums are 5–15× higher than term for same death benefit",
          "Cash value grows very slowly — far underperforms index funds",
          "High surrender charges in early years if you cancel",
          "Often sold as an 'investment' — it's a poor one",
          "Complexity hides costs from buyers",
        ]} />

        <Callout emoji="⚠️" title="Red Flag">
          If an agent presents whole life insurance primarily as an investment or wealth-building tool, that's a serious warning sign. The investment returns are significantly worse than a simple index fund. The only people who reliably benefit from whole life insurance are the agents selling it.
        </Callout>

        <H3>3. Universal Life Insurance — Flexible but Complex</H3>
        <P>A more flexible version of whole life. You can adjust premiums and death benefit within limits. Cash value earns interest tied to money market rates. More transparent than whole life, but still carries significant complexity and fees. Generally not recommended unless you have a specific estate planning need.</P>

        <H3>4. Indexed Universal Life (IUL) — Commonly Oversold</H3>
        <P>Cash value growth is linked to a market index (like the S&P 500), but with a cap (typically 8–12%) and a floor (0%). Sounds appealing — you participate in market gains without downside risk. In reality: the caps, participation rates, and administrative fees significantly erode returns. IUL illustrations often use optimistic assumptions that don't hold over time.</P>
        <Cons items={[
          "High fees dramatically reduce effective returns",
          "Cap rates limit upside in strong bull markets",
          "Illustrations often use unrealistically optimistic projections",
          "Complex enough that most buyers don't fully understand what they're buying",
          "Very high agent commissions create obvious conflicts of interest",
        ]} />

        <H3>5. Variable Life Insurance — Market Risk in an Insurance Wrapper</H3>
        <P>Cash value is invested in sub-accounts similar to mutual funds. You bear the full market risk — cash value can go to zero in a severe market downturn. Higher upside potential but also higher risk. For sophisticated investors with specific tax planning needs only.</P>

        <H3>6. Group Life Insurance (Through Employer)</H3>
        <P>Most employers offer 1–2× your salary in group life insurance for free. This is worth taking — it costs you nothing. However, it's not a substitute for personal term coverage: it disappears when you leave your job, and the coverage amount is usually insufficient for a family with dependents.</P>
      </Section>

      <Section title="'Buy Term and Invest the Difference' — The Math">
        <P>This is the core argument against whole life as an investment vehicle:</P>
        <MathTable
          caption="$500,000 coverage — Whole Life vs Term + Investing the Difference (35-year-old)"
          headers={["", "Whole Life", "Term + Invest Difference"]}
          rows={[
            ["Monthly premium", "$400/mo", "$28/mo term"],
            ["Monthly invested separately", "—", "$372/mo in index funds"],
            ["After 30 years — insurance cash value", "≈ $180,000", "Term expires (mission accomplished)"],
            ["After 30 years — investment portfolio", "—", "≈ $540,000 at 8% return"],
            ["Winner", "", "Term + invest by $360,000"],
          ]}
        />
        <P>By 65, your children are financially independent, your mortgage is paid, and you've built substantial wealth. You may not need life insurance at all. If you do, term policies for seniors exist, though at higher premiums.</P>
      </Section>

      <Section title="The Bottom Line">
        <Callout emoji="🎯" title="My Take">
          For the vast majority of people: buy a 20–30 year term life policy for 10–12× your income, from a reputable company (Banner Life, Pacific Life, Protective Life, or Lincoln Financial all have strong ratings). Get quotes at Policygenius or Term4Sale. Pay the low premium, invest the rest in index funds, and review your coverage every 5 years as your situation changes. Do not let anyone convince you that life insurance is an investment vehicle — the math simply doesn't support it.
        </Callout>
      </Section>
    </FinanceArticleLayout>
  );
}

// ─── Article 7: W-2 vs 1099 ──────────────────────────────────────────────────

export function W2Page() {
  return (
    <FinanceArticleLayout
      slug="w2-1099"
      icon="📄"
      title="W-2 vs 1099 Income: What Every Worker Should Know"
      metaDesc="How to read every box on your W-2, the real tax difference between employee and contractor status, and what 1099 workers must do to avoid an IRS penalty."
    >
      <Section title="Two Ways to Get Paid — Very Different Tax Outcomes">
        <P>In the US, most workers receive income in one of two ways: as a W-2 employee (you work for a company that withholds your taxes) or as a 1099 independent contractor (you work for yourself and handle taxes on your own). The difference affects how much tax you owe, what benefits you receive, and what you must file every year.</P>
      </Section>

      <Section title="The W-2: What Your Employer Sends You">
        <P>A W-2 (Wage and Tax Statement) is mailed or made available electronically by your employer by January 31 each year. It summarizes your total wages and exactly how much was withheld for taxes. You use it to file your federal and state tax returns.</P>
        <P>Note: the W-2 is sent <em>to you</em> — you don't fill it out. What you <em>do</em> fill out when you start a job is the <strong>W-4</strong> (Employee's Withholding Certificate), which tells your employer how much federal tax to hold back from each paycheck.</P>
      </Section>

      <Section title="How to Read Your W-2: Box by Box">
        <MathTable
          caption="The most important boxes on your W-2"
          headers={["Box", "Label", "What It Means"]}
          rows={[
            ["1",  "Wages, tips, other compensation", "Your total taxable wages for the year. This is what you report as income on your federal return. It may be lower than your actual salary if you contributed to a 401(k) or FSA (those reduce Box 1)."],
            ["2",  "Federal income tax withheld", "Total federal income tax your employer sent to the IRS on your behalf throughout the year."],
            ["3",  "Social Security wages", "Wages subject to the 6.2% Social Security tax. May differ from Box 1 — 401(k) contributions reduce Box 1 but not Box 3."],
            ["4",  "Social Security tax withheld", "Should be exactly 6.2% of Box 3 (up to the $168,600 wage base in 2024)."],
            ["5",  "Medicare wages", "Wages subject to the 1.45% Medicare tax. No wage cap — all earnings are included."],
            ["6",  "Medicare tax withheld", "1.45% of Box 5. If you earned over $200,000, an extra 0.9% Additional Medicare Tax applies."],
            ["12", "Codes (D, W, DD, etc.)", "Code D = traditional 401(k) contributions. Code W = HSA employer contributions. Code DD = employer-paid health insurance cost (informational only). Code AA = Roth 401(k) contributions."],
            ["14", "Other", "State disability insurance (SDI), union dues, employer-paid tuition, or other items your employer chooses to report."],
            ["16", "State wages", "Wages subject to state income tax — may differ from Box 1 in some states."],
            ["17", "State income tax withheld", "State taxes withheld and sent to your state tax agency."],
          ]}
        />
        <Callout emoji="💡" title="Why Box 1 May Be Lower Than Your Salary">
          If you contributed $10,000 to a traditional 401(k) and $2,750 to a health FSA, your Box 1 wages will be $12,750 lower than your gross pay. This is tax savings working in your favor — those contributions reduced your taxable income before the W-2 was calculated.
        </Callout>
      </Section>

      <Section title="The W-4: The Form YOU Fill Out">
        <P>When you start a new job (or want to update your withholding), you complete a <strong>W-4</strong>. The redesigned 2020 form has five steps:</P>
        <ol style={bs.ol}>
          <li style={bs.li}><strong>Personal info</strong> — name, SSN, filing status</li>
          <li style={bs.li}><strong>Multiple jobs or working spouse</strong> — if you or your spouse have more than one job, use the IRS withholding estimator or check the box to withhold at the higher rate</li>
          <li style={bs.li}><strong>Claim dependents</strong> — reduces withholding based on Child Tax Credit eligibility</li>
          <li style={bs.li}><strong>Other adjustments</strong> — add extra withholding, deduct non-job income (dividends, freelance), or claim deductions beyond the standard deduction</li>
          <li style={bs.li}><strong>Sign and date</strong></li>
        </ol>
        <P>If your tax situation is simple (one job, no side income), Steps 2–4 are optional. Use the <strong>IRS Tax Withholding Estimator</strong> at irs.gov anytime your situation changes — new job, marriage, new child, or large side income.</P>
      </Section>

      <Section title="What Is a 1099?">
        <P>A 1099 is a family of IRS forms that report non-employment income. The most common ones:</P>
        <MathTable
          headers={["Form", "What It Reports", "Who Sends It"]}
          rows={[
            ["1099-NEC", "Freelance / contractor income ($600+)", "Clients who paid you"],
            ["1099-MISC", "Rent, royalties, prizes, medical payments", "Payers of miscellaneous income"],
            ["1099-INT", "Bank and savings interest", "Banks and credit unions"],
            ["1099-DIV", "Dividends and capital gain distributions", "Brokerages and mutual funds"],
            ["1099-B",   "Proceeds from stock or asset sales", "Brokerages"],
            ["1099-G",   "Unemployment compensation, state refunds", "Government agencies"],
            ["1099-R",   "Retirement account distributions", "401(k)/IRA custodians"],
          ]}
        />
        <P>For the W-2 vs 1099 comparison, the relevant form is the <strong>1099-NEC</strong> (Non-Employee Compensation) — what a client sends you after paying you $600 or more for contract work during the year.</P>
      </Section>

      <Section title="W-2 Employee vs 1099 Contractor: The Real Differences">
        <MathTable
          headers={["", "W-2 Employee", "1099 Contractor"]}
          rows={[
            ["Tax withholding",       "Employer withholds automatically", "You pay quarterly estimated taxes yourself"],
            ["Social Security (12.4%)", "Split: you pay 6.2%, employer 6.2%", "You pay the full 12.4%"],
            ["Medicare (2.9%)",        "Split: you pay 1.45%, employer 1.45%", "You pay the full 2.9%"],
            ["Total FICA tax burden",  "7.65% of wages",                  "15.3% of net earnings"],
            ["Health insurance",       "Often employer-subsidized",        "You buy it yourself (deductible)"],
            ["Retirement plan",        "401(k), often with employer match", "SEP-IRA or Solo 401(k)"],
            ["Unemployment insurance", "Eligible",                         "Not eligible"],
            ["Workers' comp",          "Covered by employer",              "Not covered"],
            ["Paid time off",          "Common",                           "None — no work, no pay"],
            ["Business deductions",    "Very limited",                     "Expenses reduce taxable income"],
            ["Tax form",               "W-2",                             "1099-NEC"],
            ["Tax filing",             "W-2 + 1040",                      "Schedule C + Schedule SE + 1040"],
          ]}
        />
      </Section>

      <Section title="The Real Cost of 1099 Income: Self-Employment Tax">
        <P>The most misunderstood part of contractor income is <strong>self-employment tax</strong>. As a W-2 employee, your employer pays half your Social Security and Medicare taxes (6.2% + 1.45% = 7.65%). As a 1099 contractor, you pay both halves — the full 15.3%.</P>
        <P>This means $100 of 1099 income costs significantly more in taxes than $100 of W-2 income. Here's the math on a $90,000 annual income:</P>

        <MathTable
          caption="Tax comparison: $90,000 income — W-2 employee vs 1099 contractor (single filer, 2024)"
          headers={["", "W-2 Employee", "1099 Contractor"]}
          rows={[
            ["Gross income",              "$90,000",  "$90,000"],
            ["Self-employment tax (15.3%)", "—",      "$12,717 (on 92.35% of income)"],
            ["SE tax deduction (½ of SE tax)", "—",   "−$6,359"],
            ["Standard deduction",        "−$14,600", "−$14,600"],
            ["Federal taxable income",    "$75,400",  "$69,041"],
            ["Estimated federal income tax", "≈ $11,400", "≈ $9,800"],
            ["FICA (employee share only)", "$6,885",  "—"],
            ["Total federal tax burden",  "≈ $18,285", "≈ $22,517"],
            ["Extra tax as 1099",         "—",        "+$4,232 more"],
          ]}
        />

        <Callout emoji="📊" title="The Rule of Thumb">
          To match the take-home pay of a $90,000 W-2 salary, a 1099 contractor needs to charge roughly <strong>$100,000–$105,000</strong> — about 15–20% more — just to cover the self-employment tax gap, before accounting for the cost of benefits (health insurance, no employer 401(k) match, no paid leave).
        </Callout>
      </Section>

      <Section title="Quarterly Estimated Taxes: The 1099 Worker's #1 Mistake">
        <P>As a 1099 contractor, no one withholds taxes from your payments. You must pay the IRS yourself — four times a year. Missing these payments triggers an <strong>underpayment penalty</strong>, even if you pay everything you owe when you file in April.</P>

        <MathTable
          caption="2024 estimated tax due dates"
          headers={["Quarter", "Income Covered", "Due Date"]}
          rows={[
            ["Q1", "Jan 1 – Mar 31",  "April 15"],
            ["Q2", "Apr 1 – May 31",  "June 17"],
            ["Q3", "Jun 1 – Aug 31",  "September 16"],
            ["Q4", "Sep 1 – Dec 31",  "January 15 (next year)"],
          ]}
        />

        <P>A simple way to stay safe: set aside <strong>25–30% of every payment you receive</strong> into a separate savings account, then send quarterly payments to the IRS using IRS Direct Pay or EFTPS (Electronic Federal Tax Payment System).</P>
      </Section>

      <Section title="Tax Advantages of Being a 1099 Contractor">
        <P>The higher tax burden comes with a real upside: legitimate business expenses reduce your taxable income before any income tax or self-employment tax is calculated.</P>
        <Pros items={[
          "Home office deduction — a portion of rent/mortgage, utilities, and internet",
          "Equipment: computers, monitors, cameras, tools directly used for work",
          "Software subscriptions used for your business",
          "Mileage: 67 cents per mile for business driving in 2024",
          "Health insurance premiums — fully deductible above-the-line if no employer plan is available",
          "Half of self-employment tax is deductible (reduces income tax, not SE tax)",
          "Retirement contributions: SEP-IRA up to $69,000/year or Solo 401(k) with high limits",
          "Professional development, courses, books, and conferences related to your work",
        ]} />
        <Callout emoji="⚠️" title="Track Everything">
          Keep receipts and records for every business expense throughout the year. Use a dedicated business bank account and credit card so you're not sorting personal from business spending every April. Apps like Wave, QuickBooks Self-Employed, or even a simple spreadsheet work well.
        </Callout>
      </Section>

      <Section title="Common Mistakes to Avoid">
        <ul style={bs.list}>
          <li style={bs.li}><strong>Not paying quarterly taxes.</strong> The penalty isn't huge, but it's avoidable. Set a calendar reminder.</li>
          <li style={bs.li}><strong>Spending your tax reserve.</strong> The money you set aside for quarterly taxes isn't yours to spend. Keep it in a separate account.</li>
          <li style={bs.li}><strong>Accepting 1099 status when you're really an employee.</strong> If a company controls when, where, and how you work, you may legally be an employee. Misclassification is illegal — the IRS takes it seriously. If you suspect it, file IRS Form SS-8 to request a determination.</li>
          <li style={bs.li}><strong>Forgetting state taxes.</strong> Most states also require quarterly estimated payments if you have 1099 income.</li>
          <li style={bs.li}><strong>Missing the $600 threshold myth.</strong> You owe taxes on ALL self-employment income, even if a client didn't send you a 1099-NEC because they paid you less than $600.</li>
        </ul>
      </Section>

      <Section title="Which Is Better: W-2 or 1099?">
        <Callout emoji="🎯" title="My Take">
          Neither is universally better — it depends on your situation. W-2 employment offers stability, automatic tax handling, and employer benefits that have real dollar value (health insurance, 401(k) match, paid leave can easily add $15,000–$30,000/year to your total compensation). 1099 work offers higher gross pay, business expense deductions, and the freedom to set your own rates and schedule. If you're evaluating a contractor offer, always convert it to a W-2 equivalent by adding 15–20% for self-employment tax plus the cost of benefits you'd be buying yourself. That's your true apples-to-apples comparison.
        </Callout>
      </Section>
    </FinanceArticleLayout>
  );
}

// ─── CA Article 1: RRSP vs TFSA ───────────────────────────────────────────────

export function RrspTfsaPage() {
  return (
    <FinanceArticleLayout slug="rrsp-tfsa" icon="🏦" title="RRSP vs TFSA: Which Should You Prioritize?"
      metaDesc="Canada's two core tax-advantaged accounts explained — and the right priority order for immigrants building wealth in Canada.">
      <Section title="The Two Accounts Every Canadian Resident Should Open">
        <P>The RRSP reduces your taxable income today; the TFSA lets money grow and be withdrawn completely tax-free. Both are powerful. The right priority depends on your income bracket, how much RRSP room you have, and your plans for Canada long-term.</P>
      </Section>
      <Section title="How the RRSP Works">
        <P>Contributions are deducted from your taxable income — if you earn $80,000 CAD and contribute $10,000 to an RRSP, you're taxed on $70,000. Contribution room is 18% of your prior year's earned income, to a maximum of $31,560 (2024). You must have filed a Canadian tax return to build RRSP room. Money grows tax-sheltered and you pay income tax on withdrawal — ideally in retirement when your bracket is lower.</P>
        <Callout emoji="💡" title="Immigrant Note">
          RRSP room is based on Canadian earned income. If you arrived recently, your room may be limited. Check your CRA Notice of Assessment (NOA) or sign into My CRA Account to see your exact available room before contributing.
        </Callout>
      </Section>
      <Section title="How the TFSA Works">
        <P>Contributions use after-tax dollars — no deduction today. But all growth and withdrawals are completely tax-free forever. You can withdraw anytime for any reason and re-contribute the withdrawn amount in the following calendar year. The 2024 annual limit is $7,000.</P>
        <Callout emoji="⚠️" title="TFSA Pitfall for New Immigrants">
          You only accumulate TFSA room from the year you become a Canadian resident aged 18+. A common mistake is assuming the full lifetime cumulative room ($95,000+ by 2024) is available on arrival — it isn't. Over-contributing triggers a 1% monthly penalty. Verify your room in My CRA Account.
        </Callout>
      </Section>
      <Section title="New: The First Home Savings Account (FHSA)">
        <Callout emoji="🆕" title="Best New Account in Years">
          Available since 2023, the FHSA allows eligible first-time homebuyers to contribute $8,000/year (lifetime max $40,000). Contributions are tax-deductible like an RRSP. Qualifying withdrawals for a first home purchase are completely tax-free like a TFSA. Unused funds transfer to your RRSP. If you might buy your first home in Canada, open an FHSA immediately.
        </Callout>
      </Section>
      <Section title="The Priority Order for Immigrants">
        <MathTable
          caption="Recommended priority by situation"
          headers={["Your Situation", "Recommendation"]}
          rows={[
            ["New to Canada, income under $60K", "Max TFSA first — flexible, no income requirement, no clawback risk"],
            ["Income $60K–$100K", "Split: TFSA + RRSP once contribution room is confirmed"],
            ["Income $100K+", "RRSP first for high-bracket deduction, then TFSA"],
            ["Planning to buy first home", "Open FHSA immediately — deductible contributions + tax-free withdrawals"],
            ["Employer RRSP match available", "Contribute enough to get the full match first — it's instant free money"],
          ]}
        />
        <Callout emoji="🎯" title="My Take">
          Open a TFSA the day you become a Canadian resident — at Wealthsimple, RBC, TD, or CIBC. Open a FHSA if a first home purchase is possible in the next 15 years. Add RRSP contributions once your income is established and you have confirmed room. Invest all three in a low-cost all-in-one ETF like XEQT or VGRO.
        </Callout>
      </Section>
      <RetirementCalc isCA />
    </FinanceArticleLayout>
  );
}

// ─── CA Article 2: Canada Housing ─────────────────────────────────────────────

export function CanadaHousingPage() {
  return (
    <FinanceArticleLayout slug="canada-housing" icon="🏠" title="Renting vs. Buying a Home in Canada"
      metaDesc="The real math on Canadian real estate — CMHC insurance, the mortgage stress test, and when buying in Canada actually makes financial sense.">
      <Section title="The Canadian Housing Reality">
        <P>Canada's housing market is among the most expensive in the world relative to income. The national median home price is roughly $700,000 CAD; in the Greater Toronto Area and Metro Vancouver it exceeds $1.1 million. These numbers change the rent vs. buy math significantly from most other countries.</P>
      </Section>
      <Section title="The CMHC Insurance Cost Most Buyers Underestimate">
        <P>With less than 20% down, you must pay CMHC mortgage default insurance — a premium added to your mortgage balance:</P>
        <MathTable
          headers={["Down Payment", "CMHC Premium"]}
          rows={[
            ["5–9.99%", "4.00% of mortgage amount"],
            ["10–14.99%", "3.10% of mortgage amount"],
            ["15–19.99%", "2.80% of mortgage amount"],
            ["20%+", "None"],
          ]}
        />
        <P>On a $750,000 home with 5% down ($37,500): CMHC premium = $28,500 added to your mortgage. You then pay interest on that premium for the life of the loan.</P>
      </Section>
      <Section title="The Mortgage Stress Test">
        <P>To qualify for a mortgage, you must prove you can afford payments at the higher of: your contract rate + 2%, or 5.25%. If your rate is 5.5%, you qualify at 7.5%. This reduces your maximum purchase price by roughly 15–20% compared to what your actual payments would support — a significant constraint in high-price markets.</P>
      </Section>
      <Section title="Immigrant-Specific Considerations">
        <Pros items={[
          "Permanent residents qualify for CMHC-insured mortgages on the same terms as citizens",
          "Temporary residents with 183+ days remaining on permit may purchase (but face stricter lender policies)",
          "Build Canadian credit history early — secured credit card, then an unsecured card paid in full monthly",
          "Non-resident rental income is subject to 25% withholding unless you elect to file a T1159",
        ]} />
        <Callout emoji="⚠️" title="Foreign Buyer Restrictions">
          Canada's Prohibition on the Purchase of Residential Property by Non-Canadians (extended to 2027) restricts most non-residents from purchasing residential property in urban areas. Key exceptions: permanent residents, and temporary residents who have filed taxes for 2+ years or have 183+ days remaining on their permit.
        </Callout>
      </Section>
      <Section title="When Buying Makes Sense in Canada">
        <Pros items={[
          "You plan to stay 7+ years in the same city",
          "You have 20%+ down payment to avoid CMHC insurance",
          "You're buying in a secondary market (Calgary, Edmonton, Halifax, Winnipeg) with better price-to-rent ratios",
          "You have a stable, established income and strong Canadian credit",
        ]} />
        <Cons items={[
          "Toronto and Vancouver: price-to-rent ratios make buying very expensive relative to renting and investing the difference",
          "On a temporary work permit with uncertain long-term plans",
          "Less than 2 years of Canadian credit history — mortgage rates will be higher",
          "Moving in under 5 years — transaction costs (land transfer tax, legal fees, realtor) alone destroy the financial case",
        ]} />
        <Callout emoji="🎯" title="My Take">
          In Toronto and Vancouver, the math on buying is genuinely difficult at current prices and rates. If you're a permanent resident or citizen in Calgary, Edmonton, or Halifax with 20% down and a long-term horizon, buying can make sense. If you're on a temporary permit or still getting settled, rent without guilt, max your TFSA and FHSA, and revisit the decision in a few years.
        </Callout>
      </Section>
      <RentVsBuyCalc isCA />
    </FinanceArticleLayout>
  );
}

// ─── CA Article 3: Canada Car ──────────────────────────────────────────────────

export function CanadaCarPage() {
  return (
    <FinanceArticleLayout slug="canada-car" icon="🚗" title="Lease vs. Buy a Car in Canada"
      metaDesc="How the rent vs. buy car math works in Canada — HST on purchases, provincial insurance differences, and why buying used still wins.">
      <Section title="The Same Core Conclusion">
        <P>The math is identical to anywhere else: buying a reliable used car and driving it for years costs far less than perpetual leasing. But Canada has meaningful differences in purchase costs and insurance that are worth understanding before you sign anything.</P>
      </Section>
      <Section title="Canada-Specific Purchase Costs">
        <MathTable
          caption="Additional costs on a $35,000 CAD vehicle purchase (Ontario)"
          headers={["Cost Item", "Amount"]}
          rows={[
            ["HST (13% in Ontario)", "$4,550"],
            ["Dealer admin/documentation fee", "$400–$800"],
            ["OMVIC fee (Ontario)", "$10"],
            ["License plate transfer/registration", "$60–$120"],
            ["Total additional costs", "≈ $5,100–$5,600"],
          ]}
        />
        <P>HST rates vary by province: 15% in NS/NB/NL/PEI, 14.975% in QC, 12% in BC, 5% GST only in AB/SK/MB. Ontario's 13% is among the highest. On a private sale, PST applies instead of HST in some provinces.</P>
      </Section>
      <Section title="Provincial Insurance — A Major Variable">
        <P>Auto insurance costs vary dramatically by province and are a significant part of the true cost of car ownership:</P>
        <MathTable
          headers={["Province", "System", "Avg Annual Premium"]}
          rows={[
            ["BC", "ICBC (public Crown corporation)", "≈ $1,800–$2,200"],
            ["Ontario", "Private market (highest in Canada)", "≈ $1,800–$2,500+"],
            ["Alberta", "Private market", "≈ $1,400–$1,800"],
            ["Quebec", "Hybrid: public accident, private property", "≈ $900–$1,200"],
            ["Manitoba / Saskatchewan", "Public Crown corporation", "≈ $1,000–$1,400"],
          ]}
        />
        <P>In Ontario especially, high-performance vehicles, luxury SUVs, or cars with poor insurance ratings can cost $300–$400/month to insure — sometimes exceeding the car payment itself.</P>
      </Section>
      <Section title="The Smart Canadian Car Strategy">
        <ol style={bs.ol}>
          <li style={bs.li}><strong>Buy a 3–4 year old reliable used car.</strong> Toyota Corolla, Honda Civic, and Mazda3 consistently top reliability rankings in Canada and hold value well. Certified Pre-Owned programs add a warranty layer.</li>
          <li style={bs.li}><strong>Factor in insurance before buying.</strong> Get an insurance quote before finalizing your purchase — the rate varies by make, model, trim, and your postal code.</li>
          <li style={bs.li}><strong>Pay it off, then keep it.</strong> Once your loan is paid off (aim for 4 years), continue saving that "car payment" amount. When you need a replacement, you'll have a large down payment or buy outright.</li>
        </ol>
        <Callout emoji="🎯" title="My Take">
          A 3–4 year old Toyota Corolla or Honda Civic under 60,000 km, financed over 4 years and driven to 200,000 km, is the reliable immigrant wealth-building move in Canada. Avoid long-term leases and new-vehicle depreciation. The HST savings alone on a used car purchase make it significantly cheaper than buying new.
        </Callout>
      </Section>
    </FinanceArticleLayout>
  );
}

// ─── CA Article 4: Canada Index Funds ─────────────────────────────────────────

export function CanadaIndexFundsPage() {
  return (
    <FinanceArticleLayout slug="canada-index-funds" icon="📈" title="Index Funds for Canadian Investors"
      metaDesc="All-in-one ETFs, TFSA vs RRSP wrappers, and why low-cost index investing consistently beats active management in Canada.">
      <Section title="The Same Truth, the Canadian Context">
        <P>Over any 10-year period, roughly 90% of actively managed Canadian equity funds underperform their benchmark index after fees. The average Canadian equity mutual fund charges a Management Expense Ratio (MER) of 2–2.5% — among the highest in the developed world. A comparable index ETF charges 0.05–0.25%.</P>
      </Section>
      <Section title="Canada's All-in-One ETFs">
        <P>Canadian investors have access to outstanding all-in-one ETF products — single funds that hold thousands of global stocks and bonds, automatically rebalanced:</P>
        <MathTable
          headers={["Fund", "Mix", "MER", "Provider"]}
          rows={[
            ["XEQT", "100% global equity", "0.20%", "iShares (BlackRock)"],
            ["VEQT", "100% global equity", "0.24%", "Vanguard Canada"],
            ["XGRO", "80% equity / 20% bonds", "0.20%", "iShares"],
            ["VGRO", "80% equity / 20% bonds", "0.24%", "Vanguard Canada"],
            ["XBAL", "60% equity / 40% bonds", "0.20%", "iShares"],
            ["VBAL", "60% equity / 40% bonds", "0.25%", "Vanguard Canada"],
          ]}
        />
        <P>For most investors under 50, XEQT or VEQT held inside a TFSA is all you need. One fund, one purchase, automatic global diversification.</P>
      </Section>
      <Section title="TFSA vs RRSP: Where to Hold Your Investments">
        <P>Where you hold investments in Canada matters due to US dividend withholding tax:</P>
        <MathTable
          headers={["Account", "US ETFs (S&P 500)", "All-in-One ETFs (XEQT/VEQT)"]}
          rows={[
            ["RRSP", "Best — US withholding tax treaty-exempt", "Good"],
            ["TFSA", "15% US withholding on dividends, not recoverable", "Good (small drag from US portion)"],
            ["Taxable", "Annual capital gains reporting required", "Good"],
          ]}
        />
        <Callout emoji="💡" title="Practical Rule">
          Max your TFSA first — buy XEQT or VEQT there. If you have additional investment room in an RRSP, consider holding a pure S&P 500 ETF (like ZSP or VFV) there to avoid the 15% US dividend withholding tax drag. For most new investors, TFSA + XEQT is the complete answer.
        </Callout>
      </Section>
      <Section title="Dollar-Cost Averaging">
        <P>Invest a fixed dollar amount every month — automatically. When markets drop, your fixed amount buys more units. When markets rise, you own more units worth more. Remove emotion from the process entirely.</P>
        <Callout emoji="🎯" title="My Take">
          Open a Wealthsimple account (no trading fees on ETFs). Buy XEQT inside your TFSA every month. Increase the amount whenever your income increases. Don't check the balance more than once per quarter. In 30 years, you will be genuinely surprised at what boring, consistent investing compounded into.
        </Callout>
      </Section>
    </FinanceArticleLayout>
  );
}

// ─── CA Article 5: RESP ───────────────────────────────────────────────────────

export function RespPage() {
  return (
    <FinanceArticleLayout slug="resp" icon="🎓" title="RESP: Canada's Education Savings Plan"
      metaDesc="The Canada Education Savings Grant gives you 20% free money on your first $2,500 contributed per year — here's how to maximize it from day one.">
      <Section title="What Is an RESP?">
        <P>A Registered Education Savings Plan is a tax-advantaged savings account for post-secondary education. Contributions grow tax-sheltered. When withdrawn for education, the money is taxed in the student's hands — who typically has little or no income and pays minimal tax. The federal government also matches a portion through grants.</P>
      </Section>
      <Section title="The Canada Education Savings Grant — Free Money">
        <P>The federal government contributes 20% on the first $2,500 you contribute each year — up to <strong>$500/year free money</strong> per child. Lifetime CESG maximum is $7,200 per beneficiary. You do not have to be a citizen — permanent residents and some temporary residents qualify.</P>
        <Callout emoji="🆕" title="Canada Learning Bond (CLB)">
          Lower-income families qualify for an additional $500 in the first year plus $100/year for up to 15 years ($2,000 total), with no contributions required to receive it. Simply opening the RESP triggers the CLB for eligible families.
        </Callout>
      </Section>
      <Section title="The Math: Starting Early vs. Late">
        <MathTable
          caption="$200/month invested in RESP at 7% annual growth + CESG"
          headers={["Start Age", "Years Invested", "Portfolio at Age 18", "Total CESG Received", "Combined Value"]}
          rows={[
            ["Birth", "18 yrs", "$84,349", "$7,200", "$91,549"],
            ["Age 5", "13 yrs", "$51,628", "$5,500", "$57,128"],
            ["Age 10", "8 yrs", "$27,432", "$3,200", "$30,632"],
            ["Age 15", "3 yrs", "$8,019", "$1,200", "$9,219"],
          ]}
        />
      </Section>
      <Section title="What If Your Child Doesn't Attend Post-Secondary?">
        <ol style={bs.ol}>
          <li style={bs.li}><strong>Change beneficiary</strong> to another child — CESG transfers too if the new beneficiary is under 21</li>
          <li style={bs.li}><strong>Transfer growth (AIP) to your RRSP</strong> — up to $50,000 lifetime if you have available RRSP room</li>
          <li style={bs.li}><strong>Withdraw your contributions</strong> tax-free (only the growth + CESG is subject to tax + 20% penalty if non-educational)</li>
        </ol>
      </Section>
      <Section title="Which RESP to Open">
        <P>Use a self-directed RESP at Wealthsimple, RBC Direct Investing, or TD Direct Investing. Invest in a low-cost all-in-one ETF (XGRO or VGRO for long horizons; shift to XBAL/VBAL as post-secondary approaches). Avoid group scholarship plans (CST, Heritage) — high fees, rigid rules, and poor returns make them a bad deal.</P>
        <Callout emoji="🎯" title="My Take">
          Open an RESP the week your child is born. Contribute $2,500 in the first year to trigger the maximum $500 CESG immediately. Even $200/month consistently invested in XGRO from birth reaches $90,000+ by age 18. The CESG alone is worth $7,200 of free government money — don't leave it on the table.
        </Callout>
      </Section>
    </FinanceArticleLayout>
  );
}

// ─── CA Article 6: Canada Life Insurance ──────────────────────────────────────

export function CanadaLifeInsurancePage() {
  return (
    <FinanceArticleLayout slug="canada-life-insurance" icon="🛡️" title="Life Insurance Basics in Canada"
      metaDesc="Term, whole, universal — what type of life insurance you actually need in Canada, and why term almost always wins.">
      <Section title="The Purpose Is Simple">
        <P>Life insurance replaces your income for dependents if you die. A common starting point: <strong>10–12 times your annual income.</strong> If you earn $90,000/year, a $900,000–$1,080,000 policy covers your family's financial life for 10+ years. Adjust upward for a mortgage, young children, or a non-working spouse.</P>
      </Section>
      <Section title="Term Life — The Right Choice for Most People">
        <P>You pay a fixed premium for a set term (10, 20, or 30 years). If you die during the term, your beneficiaries receive the benefit. No cash value, no complexity.</P>
        <MathTable
          caption="Sample Canadian term life premiums — healthy non-smoking 35-year-old"
          headers={["Coverage Amount", "20-Year Term", "30-Year Term"]}
          rows={[
            ["$500,000", "≈ $28–$38/mo", "≈ $42–$55/mo"],
            ["$1,000,000", "≈ $48–$65/mo", "≈ $72–$95/mo"],
          ]}
        />
        <P>Leading Canadian term life providers: Manulife, Sun Life, Canada Life, Empire Life, Industrial Alliance. Use PolicyMe (Canada-specific broker) or an independent broker to compare quotes.</P>
      </Section>
      <Section title="Immigrant-Specific Considerations">
        <Pros items={[
          "Permanent residents qualify for Canadian life insurance on the same terms as citizens",
          "Temporary residents (work permit, study permit) generally qualify after establishing Canadian residency",
          "Medical underwriting may request your home-country health history",
          "Group life insurance through your Canadian employer (typically 1–2× salary) is worth taking — it's free coverage",
        ]} />
        <Cons items={[
          "Group coverage disappears when you change employers — don't rely on it as your only coverage",
          "If you depart Canada permanently, confirm policy treatment with your insurer",
        ]} />
      </Section>
      <Section title="Whole Life and Universal Life — Usually the Wrong Choice">
        <P>Premiums are 5–15× higher than comparable term coverage. Cash value growth typically underperforms a simple ETF in your TFSA. The same critiques from the US apply equally to Canadian whole life products. If an advisor leads with cash value or investment returns in an insurance context, that is a strong warning sign.</P>
        <Callout emoji="🎯" title="My Take">
          Get a 20-year term policy for 10–12× your income from a reputable Canadian insurer. Use PolicyMe for an online comparison in under 10 minutes. Pay the low monthly premium and invest the rest in your TFSA. The math in Canada is identical to the US: term + invest beats whole life by a wide margin.
        </Callout>
      </Section>
    </FinanceArticleLayout>
  );
}

// ─── CA Article 7: T4 vs T4A ──────────────────────────────────────────────────

export function T4Page() {
  return (
    <FinanceArticleLayout slug="t4-t4a" icon="📄" title="T4 vs T4A Income: What Every Worker Should Know"
      metaDesc="How to read your T4, the true cost of self-employment CPP in Canada, and the $30,000 GST/HST registration threshold every contractor must know.">
      <Section title="Two Ways to Get Paid in Canada">
        <P>Most Canadian workers receive either a T4 (employment income — your employer withholds tax, CPP, and EI) or a T4A (self-employment, contract, pension, or other income — you manage your own taxes and contributions). The difference has significant implications for how much you owe and when.</P>
      </Section>
      <Section title="How to Read Your T4 — Box by Box">
        <MathTable
          caption="Most important boxes on your T4"
          headers={["Box", "Label", "What It Means"]}
          rows={[
            ["14", "Employment income", "Total taxable wages. May be lower than your salary if you have RRSP payroll deductions or benefit deductions."],
            ["16", "Employee's CPP contributions", "Your share of Canada Pension Plan contributions — 5.95% of pensionable earnings in 2024."],
            ["18", "Employee's EI premiums", "Your Employment Insurance premium — 1.66% of insurable earnings in 2024."],
            ["22", "Income tax deducted", "Total federal + provincial income tax withheld and remitted to CRA on your behalf."],
            ["40", "Other taxable allowances", "Employer-paid benefits included in income — car allowance, housing benefit, etc."],
            ["52", "Pension adjustment", "Reduces your RRSP room if you participate in a registered pension plan at work."],
          ]}
        />
      </Section>
      <Section title="The Real Cost of Self-Employment: Double CPP">
        <P>As a T4 employee, your employer matches your CPP contribution — you each pay roughly half. As a self-employed contractor, you pay both the employee and employer share of CPP. This is often the biggest surprise for new Canadian contractors:</P>
        <MathTable
          caption="CPP comparison — $90,000 income (2024)"
          headers={["", "T4 Employee", "Self-Employed (T4A)"]}
          rows={[
            ["CPP rate", "5.95% (employee share only)", "11.9% (both shares)"],
            ["CPP maximum contribution", "≈ $3,867", "≈ $7,735"],
            ["EI premiums", "1.66% (employee share)", "Not eligible for EI"],
            ["Half of CPP deductible on return", "N/A", "Yes — reduces net income"],
          ]}
        />
      </Section>
      <Section title="The $30,000 GST/HST Registration Threshold">
        <Callout emoji="⚠️" title="This Is Not Optional">
          When your self-employment revenue exceeds $30,000 in any single calendar quarter, or over four consecutive rolling quarters, you must register for GST/HST with CRA. Once registered, you charge GST/HST on all invoices and remit the net amount quarterly. You can claim Input Tax Credits (ITCs) on business purchases to reduce the amount owed. Register before you hit the threshold — the paperwork takes time and late registration carries penalties.
        </Callout>
      </Section>
      <Section title="Quarterly Instalment Payments">
        <P>If you owe more than $3,000 in combined federal and provincial income tax for two consecutive years (or $1,800 in Quebec), CRA requires quarterly instalment payments. Missing these triggers interest charges from the due date. A practical rule: set aside <strong>30–35% of every payment</strong> you receive into a separate savings account, then pay CRA quarterly via My CRA Account.</P>
        <Callout emoji="🎯" title="My Take">
          In your first year of self-employment, spend $300–$500 on one session with a Canadian accountant who works with contractors. They will save you far more than that in avoided penalties, legitimate deductions (home office, equipment, mileage, professional development), and CPP optimization. Track every business expense in a simple spreadsheet from day one — the CRA does not care that you forgot to keep receipts.
        </Callout>
      </Section>
    </FinanceArticleLayout>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const cs = {
  card:      { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", marginBottom: 24, borderTop: "3px solid var(--orange)" },
  title:     { fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 16 },
  grid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", marginBottom: 20 },
  label:     { display: "flex", flexDirection: "column", gap: 4, fontSize: 12, fontWeight: 600, color: "#666" },
  input:     { padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 14, color: "#111", width: "100%", boxSizing: "border-box" },
  results:   { display: "flex", gap: 12, flexWrap: "wrap", background: "#fafaf8", borderRadius: 8, padding: "1rem", marginBottom: 8 },
  result:    { flex: "1 1 130px", display: "flex", flexDirection: "column", gap: 2 },
  rLabel:    { fontSize: 11, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 },
  rVal:      { fontSize: 20, fontWeight: 800, color: "#111" },
  note:      { fontSize: 11, color: "#aaa", margin: 0 },
  table:     { width: "100%", borderCollapse: "collapse", fontSize: 14, marginBottom: 8 },
  th:        { padding: "8px 10px", fontWeight: 700, textAlign: "left", borderBottom: "2px solid var(--border)", fontSize: 12, color: "#888", textTransform: "uppercase" },
  td:        { padding: "8px 10px", borderBottom: "0.5px solid var(--border)", color: "#333" },
  trBest:    { background: "#f0fdf4" },
  badge:     { fontSize: 10, fontWeight: 700, color: "#888", background: "#f0f0f0", borderRadius: 4, padding: "1px 5px", marginLeft: 6 },
  badgeBest: { fontSize: 10, fontWeight: 700, color: "#166534", background: "#dcfce7", borderRadius: 4, padding: "1px 5px", marginLeft: 6 },
};

const s = {
  outer:        { padding: "1.5rem 1.5rem 3rem", display: "flex", gap: 24, alignItems: "flex-start" },
  content:      { flex: 1, minWidth: 0 },
  rail:         { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 72 },
  back:         { color: "var(--orange)", fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 8, textDecoration: "none" },
  heroCard:     { display: "flex", gap: 20, alignItems: "flex-start", background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.75rem", marginBottom: 24, flexWrap: "wrap" },
  heroIcon:     { fontSize: 52, lineHeight: 1, flexShrink: 0 },
  heroTitle:    { fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 6, lineHeight: 1.2 },
  heroDesc:     { fontSize: 14, color: "#555", lineHeight: 1.6, margin: 0 },
  byline:       { fontSize: 11, fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  articleBody:  { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "2rem", marginBottom: 24 },
  hubHero:      { display: "flex", gap: 20, alignItems: "center", background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.75rem", marginBottom: 24, flexWrap: "wrap" },
  articleGrid:  { display: "flex", flexDirection: "column", gap: 12 },
  articleCard:  { display: "flex", alignItems: "center", gap: 16, background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem 1.5rem", textDecoration: "none", color: "#111", transition: "border-color 0.15s" },
  articleIcon:  { fontSize: 32, flexShrink: 0 },
  articleCardTitle: { fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 4 },
  articleCardDesc:  { fontSize: 13, color: "#666", lineHeight: 1.5 },
  articleArrow: { marginLeft: "auto", fontSize: 18, color: "#bbb", flexShrink: 0 },
  moreArticles: { background: "#fafaf8", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem" },
  moreTitle:    { fontSize: 14, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  moreGrid:     { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
  moreCard:     { display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#fff", border: "0.5px solid var(--border)", borderRadius: 8, textDecoration: "none", color: "#333", fontSize: 13, fontWeight: 600 },
  moreIcon:     { fontSize: 18, flexShrink: 0, marginTop: 1 },
  moreLabel:    { lineHeight: 1.4 },
  fxWidget:     { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "0.6rem 0.75rem" },
  fxLabel:      { fontSize: 10, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 },
  fxList:       { display: "flex", flexDirection: "column", gap: 3 },
  fxRow:        { display: "flex", justifyContent: "space-between", alignItems: "center" },
  fxCode:       { fontSize: 11, color: "#777" },
  fxVal:        { fontSize: 12, fontWeight: 700, color: "#111", fontVariantNumeric: "tabular-nums" },
  fxLoading:    { fontSize: 12, color: "#ccc", fontStyle: "italic" },
};

const bs = {
  section:      { marginBottom: "2rem" },
  h2:           { fontSize: 20, fontWeight: 800, color: "#111", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "2px solid var(--orange-light)" },
  h3:           { fontSize: 16, fontWeight: 700, color: "#222", marginBottom: "0.5rem", marginTop: "1.25rem" },
  p:            { fontSize: 15, color: "#444", lineHeight: 1.75, marginBottom: "0.9rem" },
  ol:           { paddingLeft: 20, marginBottom: "0.9rem" },
  list:         { paddingLeft: 20, marginBottom: "0.9rem" },
  li:           { fontSize: 15, color: "#444", lineHeight: 1.7, marginBottom: 6 },
  liGreen:      { fontSize: 15, color: "#166534", lineHeight: 1.7, marginBottom: 4 },
  liRed:        { fontSize: 15, color: "#991b1b", lineHeight: 1.7, marginBottom: 4 },
  callout:      { background: "var(--orange-light, #fff7ed)", border: "1.5px solid var(--orange)", borderRadius: 10, padding: "1rem 1.25rem", margin: "1.25rem 0" },
  calloutTitle: { display: "block", fontSize: 14, fontWeight: 800, color: "#111", marginBottom: 6 },
  calloutBody:  { fontSize: 14, color: "#444", lineHeight: 1.7 },
  tableWrap:    { overflowX: "auto", margin: "1rem 0 1.5rem" },
  tableCaption: { fontSize: 12, color: "#888", fontStyle: "italic", marginBottom: 6 },
  table:        { width: "100%", borderCollapse: "collapse", fontSize: 14, color: "#333" },
  th:           { background: "#f5f3ef", padding: "9px 12px", fontWeight: 700, textAlign: "left", borderBottom: "2px solid var(--border)", whiteSpace: "nowrap" },
  thRight:      { textAlign: "right" },
  td:           { padding: "8px 12px", borderBottom: "0.5px solid var(--border)", verticalAlign: "top" },
  tdRight:      { textAlign: "right", fontVariantNumeric: "tabular-nums" },
  tdBold:       { fontWeight: 700 },
  trAlt:        { background: "#fafaf8" },
};
