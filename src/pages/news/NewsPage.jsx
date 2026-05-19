import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AdBlock from "../../components/AdBlock";
import { useIsMobile } from "../../lib/useIsMobile";
import ResourceNav from "../../components/ResourceNav";
import { getCountrySlug } from "../../lib/country";

const CATEGORIES = [
  {
    slug: "immigration", icon: "🏛️", label: "Immigration Policy",
    desc:   "Visa rules, USCIS updates, H-1B cap, green card priority dates and policy changes.",
    caDesc: "IRCC updates, Express Entry draws, study and work permits, PNP news, and PR processing.",
  },
  {
    slug: "jobs", icon: "💼", label: "Job Market",
    desc:   "Layoffs, hiring trends, H-1B sponsorship availability, and OPT job market updates.",
    caDesc: "LMIA and work permit trends, PGWP updates, CUSMA categories, and employment tips for permit holders.",
  },
  {
    slug: "finance", icon: "📊", label: "Finance & Economy",
    desc:   "Fed rate, S&P 500, housing market, mortgage rates, and remittance updates.",
    caDesc: "Bank of Canada rate, Canadian housing market, TFSA limits, mortgage rates, and remittance tips.",
  },
];

const IMMIGRATION_NEWS = [
  {
    tag: "H-1B",
    date: "Apr 2026",
    headline: "H-1B FY2027 Lottery Completed — Selected Registrants Have 90 Days to File",
    body: "USCIS completed the FY2027 H-1B cap lottery in April 2026. Selected registrants received notifications online and have 90 days to file complete cap-subject H-1B petitions. Employers can request premium processing ($2,805) for a decision within 15 business days. If not selected, watch for a second lottery round if the initial pool falls short of the annual cap.",
    source: "USCIS — H-1B Specialty Occupations",
    url: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations",
  },
  {
    tag: "Green Card",
    date: "May 2026",
    headline: "Visa Bulletin May 2026: EB-2 India Holds at January 2013",
    body: "The State Department's May 2026 Visa Bulletin shows no movement in India EB-2 Final Action Dates, which remain at January 2013. EB-3 India Final Action Date sits at May 2013. The enormous backlog — driven by per-country caps — means Indian nationals face estimated multi-decade waits under current rules. Check both the Final Action Date and Date for Filing columns each month at travel.state.gov.",
    source: "State Dept. — Visa Bulletin",
    url: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
  },
  {
    tag: "USCIS",
    date: "Mar 2026",
    headline: "Premium Processing Expanded to More I-539 and I-140 Categories",
    body: "USCIS has expanded premium processing availability to additional petition types, allowing employers and applicants to pay an expedite fee for faster decisions. As of early 2026, it covers I-140 immigrant petitions, most H, L, O, P, Q, and R nonimmigrant classifications, and certain I-539 applications. Check uscis.gov/forms for the current list of eligible petition types and processing times.",
    source: "USCIS — Premium Processing",
    url: "https://www.uscis.gov/forms/filing-fees/premium-processing-fee",
  },
  {
    tag: "F-1 / OPT",
    date: "Feb 2026",
    headline: "STEM OPT 24-Month Extension: Key Deadlines and Requirements",
    body: "F-1 students with STEM degrees can apply for a 24-month OPT extension after the standard 12-month period. You must be employed by an E-Verify employer, and your employer must complete a training plan (Form I-983). File Form I-765 at least 90 days before your current OPT expires — USCIS processing can take 3–5 months and premium processing is not available for OPT. Your new EAD card must be valid before your first day of work.",
    source: "DHS — Study in the States",
    url: "https://studyinthestates.dhs.gov/stem-opt-hub",
  },
  {
    tag: "Travel",
    date: "Jan 2026",
    headline: "Advance Parole Processing Now Exceeds 12 Months — Plan Ahead",
    body: "USCIS Advance Parole (Form I-131) processing times have extended significantly and can exceed 12 months at some service centers. Green card applicants with pending I-485s should not travel internationally without an approved AP document or a valid visa stamp. File I-131 well in advance of any planned travel. H-4 and L-2 dependents with valid status may have separate travel options — consult an immigration attorney for your specific situation.",
    source: "USCIS — Form I-131",
    url: "https://www.uscis.gov/i-131",
  },
];

const JOBS_NEWS = [
  {
    tag: "H-1B",
    date: "May 2026",
    headline: "Tech Hiring Cautiously Rebounds — H-1B Sponsorship Remains Selective",
    body: "Large technology employers are expanding headcount in 2026 after two years of contraction, but H-1B sponsorship has become more selective. Many companies have eliminated sponsorship for entry-level positions while continuing to support it for senior engineers, technical leads, and specialized roles. Mid-size technology companies and non-coastal employers often offer better sponsorship odds than large coastal tech firms.",
    source: "USCIS — H-1B Specialty Occupations",
    url: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations",
  },
  {
    tag: "Layoffs",
    date: "Apr 2026",
    headline: "Laid Off on H-1B? The 60-Day Grace Period Explained",
    body: "H-1B workers who lose their jobs have a 60-day grace period (or the remaining validity of their status, whichever is shorter) to take action. Options include finding a new H-1B employer and having them file a transfer petition, changing to another status (H-4, F-1, B-2), or departing the US. If your new employer files within 60 days, you can begin working immediately under H-1B portability rules before USCIS approves the transfer. Contact an immigration attorney within the first week of any job loss.",
    source: "USCIS — Grace Periods",
    url: "https://www.uscis.gov/working-in-the-united-states/immigration-and-citizenship-data",
  },
  {
    tag: "OPT",
    date: "Mar 2026",
    headline: "STEM OPT Job Market: Non-Coastal and Healthcare IT Roles Show Strength",
    body: "F-1 graduates on OPT are reporting longer job search timelines in software engineering and data science in 2026. Relatively stronger demand exists in healthcare IT, manufacturing engineering, civil and structural engineering, and supply chain roles. Expanding your search to mid-size companies in non-coastal markets (Midwest, Southeast, Texas) and considering contract-to-hire roles can significantly improve offer rates.",
    source: "BLS — Occupational Outlook Handbook",
    url: "https://www.bls.gov/ooh/",
  },
  {
    tag: "Cap-Exempt",
    date: "Feb 2026",
    headline: "Cap-Exempt H-1B Employers: Year-Round Filing, No Lottery Competition",
    body: "Cap-exempt employers — including universities, government research institutions, and qualifying nonprofits — can file H-1B petitions at any time of year without competing in the annual lottery. These positions are frequently overlooked by applicants focused on Big Tech. Academic medical centers, national labs, and research-focused nonprofits regularly hire engineers, scientists, and IT professionals with H-1B sponsorship available year-round.",
    source: "USCIS — Cap-Exempt H-1B",
    url: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations",
  },
];

const FINANCE_NEWS = [
  {
    tag: "Markets",
    date: "May 2026",
    headline: "S&P 500 Recovers in 2026 — Immigrant Investor Account Basics",
    body: "US equity markets have recovered after a choppy start to 2026. For immigrants on H-1B, F-1 OPT, or a green card: US brokerage accounts at Fidelity, Schwab, and Vanguard are open to legal residents regardless of citizenship. You will need a US SSN or ITIN and a US address. Index fund investing remains the most practical approach — see our Finance Tips section for a full guide.",
    source: "SEC — Investor.gov",
    url: "https://www.investor.gov",
  },
  {
    tag: "Fed Rate",
    date: "Apr 2026",
    headline: "Fed Holds Benchmark Rate — High-Yield Savings Accounts Still Pay 4.5%+",
    body: "The Federal Reserve has held rates steady, keeping high-yield savings accounts (HYSA) at Marcus, Ally, and SoFi at 4.5–5% APY — meaningfully better than traditional savings accounts. For immigrants building an emergency fund (recommended: 3–6 months of expenses), a HYSA is the best place to hold it while it earns a return. Opening an account requires only a SSN or ITIN and takes under 10 minutes online.",
    source: "Federal Reserve",
    url: "https://www.federalreserve.gov",
  },
  {
    tag: "Housing",
    date: "Mar 2026",
    headline: "Mortgage Rates Near 6.8% — What Immigrant Homebuyers Should Know",
    body: "The national 30-year fixed mortgage rate hovers near 6.8% in early 2026. Immigrants without a 2+ year US credit history may face stricter loan-to-value requirements. Build US credit by becoming an authorized user on a trusted person's card, opening a secured credit card, and paying in full monthly. Non-citizen legal residents (H-1B, L-1, green card holders) qualify for conventional loans — no citizenship required. See our Finance Tips housing guide for the full rent vs. buy analysis.",
    source: "CFPB — Explore Mortgage Rates",
    url: "https://www.consumerfinance.gov/owning-a-home/explore-rates/",
  },
  {
    tag: "Remittance",
    date: "Feb 2026",
    headline: "USD/INR Rates — Use Wise or Remitly to Cut Transfer Fees",
    body: "Wire transfer costs vary enormously: bank wire fees run $25–$45 flat regardless of amount, while services like Wise (0.3–0.6% fee) and Remitly (0.5–1%) save significant money on transfers above $2,000. For transfers over $10,000, the fee difference between a bank wire and a dedicated transfer service can exceed $300 per transaction. Always compare rates before sending — even small differences add up over a year of regular remittances.",
    source: "CFPB — Send Money Abroad",
    url: "https://www.consumerfinance.gov/consumer-tools/send-money-abroad/",
  },
  {
    tag: "Tax",
    date: "Jan 2026",
    headline: "ITIN Holders: Renew Expired ITINs Before the April Filing Deadline",
    body: "The IRS automatically expires ITINs not used on a federal return for three consecutive years. If your ITIN has expired, renew via Form W-7 submitted with original or certified documents. IRS processing takes 8–11 weeks during tax season. Some Certified Acceptance Agents (CAAs) can certify document copies so you don't need to mail your original passport. File your W-7 by mid-January to receive a renewed ITIN in time for the April 15 filing deadline.",
    source: "IRS — Individual Taxpayer Identification Number",
    url: "https://www.irs.gov/individuals/individual-taxpayer-identification-number-itin",
  },
];

// ─── Canada news arrays ────────────────────────────────────────────────────────

const CA_IMMIGRATION_NEWS = [
  {
    tag: "Express Entry",
    date: "May 2026",
    headline: "IRCC Resumes Category-Based Express Entry Draws — Healthcare and Trades Prioritized",
    body: "IRCC continues to run category-based Express Entry draws targeting French-language proficiency, healthcare occupations, STEM professionals, and skilled trades. All-program draws also continue regularly. Candidates with a Comprehensive Ranking System (CRS) score above 480 are competitive in most draws. Check your score using the CRS tool on Canada.ca and update your profile to reflect any new job offers or credential assessments.",
    source: "IRCC — Express Entry",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html",
  },
  {
    tag: "Study Permit",
    date: "Apr 2026",
    headline: "IRCC Cap on International Student Permits Continues into 2026",
    body: "Canada's cap on international student study permits, introduced in 2024, remains in effect for 2026. Allocations are distributed by province based on population. Acceptance letters from Designated Learning Institutions (DLIs) are required before applying, and not all DLIs are eligible to issue letters under the cap system. Verify your institution's DLI status on Canada.ca before applying.",
    source: "IRCC — Study Permits",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html",
  },
  {
    tag: "Work Permit",
    date: "Mar 2026",
    headline: "LMIA Processing Times Improving — Employer-Specific Permits Remain Most Common Path",
    body: "Labour Market Impact Assessment (LMIA) processing times have improved at Service Canada in early 2026. A positive LMIA allows employers to hire foreign workers when qualified Canadians are unavailable. LMIA-exempt categories — including intra-company transfers, CUSMA (USMCA) professionals, and significant benefit workers — remain an important alternative. Check the ESDC website for current processing times and LMIA-exempt categories.",
    source: "ESDC — LMIA",
    url: "https://www.canada.ca/en/employment-social-development/services/foreign-workers.html",
  },
  {
    tag: "PR",
    date: "Feb 2026",
    headline: "PR Card Renewal Processing: Plan 12+ Months in Advance",
    body: "IRCC PR card renewal processing continues to take 12–18 months. Permanent residents whose cards expire should apply well in advance. If you need to travel urgently with an expired PR card, you may apply for a Permanent Resident Travel Document (PRTD) at a Canadian visa office abroad. Do not let your PR card expire without a renewal application in progress.",
    source: "IRCC — PR Card",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/new-immigrants/pr-card/apply-renew-replace.html",
  },
  {
    tag: "PNP",
    date: "Jan 2026",
    headline: "Provincial Nominee Programs: Alberta, Ontario, and BC Remain Most Active",
    body: "Provincial Nominee Programs (PNPs) continue to be a major pathway to Canadian permanent residence, particularly for candidates with provincial job offers or regional ties. Alberta, Ontario (OINP), and British Columbia (BC PNP) conduct regular draws. Saskatchewan and Manitoba target workers in healthcare, agriculture, and trades. A provincial nomination adds 600 CRS points, making it essentially a guaranteed invitation in the next Express Entry draw.",
    source: "IRCC — Provincial Nominees",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html",
  },
];

const CA_JOBS_NEWS = [
  {
    tag: "Work Permit",
    date: "May 2026",
    headline: "Employer-Sponsored Work Permits: LMIA vs LMIA-Exempt — Know the Difference",
    body: "Most Canadian work permits fall into two categories: LMIA-based (employer proves no Canadian was available) and LMIA-exempt (under international agreements like CUSMA, intra-company transfers, or significant benefit provisions). LMIA-exempt positions can be processed faster via Global Skills Strategy for high-skilled roles — as quickly as 2 weeks. Ask your employer which category applies before starting the permit process.",
    source: "IRCC — Work in Canada",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/work-permit.html",
  },
  {
    tag: "Layoffs",
    date: "Apr 2026",
    headline: "Losing Your Job on a Canadian Work Permit: What to Do",
    body: "Unlike the US H-1B 60-day grace period, Canada does not have a formally codified grace period for work permit holders who lose their job. If your employer-specific work permit is tied to one employer, you may no longer be authorized to work the day employment ends. Options include applying to change employers (open work permit or new employer-specific permit), applying to change status, or departing Canada. Consult an immigration lawyer within days of any job loss.",
    source: "IRCC — Work Permit Conditions",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/temporary/extend/eligibility.html",
  },
  {
    tag: "PGWP",
    date: "Mar 2026",
    headline: "Post-Graduation Work Permit Changes: Length Now Tied to Program Duration",
    body: "PGWP length is now more closely tied to your program length, with a maximum of 3 years for programs 2+ years long. PGWP holders who complete a second qualifying program may be eligible for an additional permit. The PGWP is an open work permit — you can work for any Canadian employer, in any occupation. Apply within 180 days of receiving your final marks and before your study permit expires.",
    source: "IRCC — Post-Graduation Work Permit",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html",
  },
  {
    tag: "CUSMA",
    date: "Feb 2026",
    headline: "CUSMA (USMCA) Professional Categories: A Fast Track for US and Mexican Workers",
    body: "Under the Canada–United States–Mexico Agreement, citizens of the US and Mexico in designated professional categories (engineers, accountants, scientists, computer systems analysts, and more) can obtain Canadian work permits at the port of entry or through IRCC without an LMIA. The process is relatively fast. If you're a US or Mexican citizen in a qualifying profession with a Canadian job offer, this is often the fastest legal work authorization pathway.",
    source: "IRCC — CUSMA Workers",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/permit/cusma-workers.html",
  },
];

const CA_FINANCE_NEWS = [
  {
    tag: "BoC Rate",
    date: "May 2026",
    headline: "Bank of Canada Holds Policy Rate — High-Interest Savings Accounts Pay 3.5%+",
    body: "The Bank of Canada has held its overnight rate steady in recent meetings after a cutting cycle in 2024–2025. High-interest savings accounts (HISAs) at EQ Bank, Oaken Financial, and WealthOne continue to offer 3.5–4.5% — significantly better than the big bank savings rate of under 1%. For immigrants building an emergency fund (recommended: 3–6 months of expenses), a HISA is the best place to hold it. CDIC insures up to $100,000 per depositor category.",
    source: "Bank of Canada",
    url: "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/",
  },
  {
    tag: "Housing",
    date: "Apr 2026",
    headline: "Canadian Housing: Secondary Markets Offer Better Value as Toronto and Vancouver Stay Elevated",
    body: "Canadian home prices remain elevated nationally, with Toronto and Vancouver still well above affordability thresholds for most immigrants. Calgary, Edmonton, Halifax, and Winnipeg continue to offer significantly better price-to-income ratios. The mortgage stress test (qualifying at contract rate + 2%) remains in effect. If you're on a work permit, note that many lenders require at least 2 years of Canadian employment history for standard mortgage qualification.",
    source: "CMHC — Housing Market Data",
    url: "https://www.cmhc-schl.gc.ca/en/data-and-research",
  },
  {
    tag: "TFSA",
    date: "Mar 2026",
    headline: "2026 TFSA Contribution Limit Confirmed at $7,000 — Cumulative Room Now $102,000",
    body: "The 2026 TFSA annual contribution limit remains $7,000. For Canadians who have been eligible since the TFSA's inception in 2009, cumulative room is now $102,000. New residents accumulate room from the year they become Canadian residents aged 18+. Verify your personal room in My CRA Account before contributing — over-contributing triggers a 1% monthly penalty on the excess.",
    source: "CRA — TFSA",
    url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/tax-free-savings-account.html",
  },
  {
    tag: "Remittance",
    date: "Feb 2026",
    headline: "CAD/INR and Transfer Fees — Wise and Remitly Save Significantly vs Bank Wires",
    body: "The Canadian dollar fluctuates against major remittance currencies. Bank wire fees from Canadian banks run $15–$30 flat per transfer, while services like Wise (0.3–0.8%) and Remitly charge a percentage — meaning larger transfers save significantly more with a dedicated service. For transfers above $2,000 CAD, check Wise rates before wiring from your bank. FINTRAC reporting applies to transfers above $10,000 CAD — financial institutions must report these automatically.",
    source: "FCAC — Sending Money Abroad",
    url: "https://www.canada.ca/en/financial-consumer-agency/services/sending-money-abroad.html",
  },
  {
    tag: "Tax",
    date: "Jan 2026",
    headline: "CRA Filing Deadline April 30 — Self-Employed Workers Have Until June 15 (Interest Still Accrues)",
    body: "The CRA tax filing deadline for most Canadians is April 30. Self-employed individuals and their spouses have until June 15 to file, but any balance owing still accrues interest from May 1. New residents must file a Canadian tax return for the year they arrive, reporting world income for the portion of the year they were resident. First-time filers should obtain a SIN and register for My CRA Account before the filing season to avoid delays.",
    source: "CRA — Filing Dates",
    url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/important-dates-individuals.html",
  },
];

// ─── Shared tag colors ─────────────────────────────────────────────────────────

const TAG_COLORS = {
  // CA tags
  "Express Entry": { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
  "Study Permit":  { background: "#fdf4ff", color: "#7e22ce", border: "1px solid #e9d5ff" },
  "Work Permit":   { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" },
  "PR":            { background: "#f0fdf4", color: "#14532d", border: "1px solid #bbf7d0" },
  "PNP":           { background: "#f0f9ff", color: "#075985", border: "1px solid #bae6fd" },
  "PGWP":          { background: "#fdf4ff", color: "#6b21a8", border: "1px solid #e9d5ff" },
  "CUSMA":         { background: "#fff7ed", color: "#92400e", border: "1px solid #fde68a" },
  "BoC Rate":      { background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" },
  "TFSA":          { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
  // US tags
  "H-1B":       { background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" },
  "Green Card":  { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
  "USCIS":       { background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" },
  "F-1 / OPT":  { background: "#fdf4ff", color: "#7e22ce", border: "1px solid #e9d5ff" },
  "OPT":         { background: "#fdf4ff", color: "#7e22ce", border: "1px solid #e9d5ff" },
  "Travel":      { background: "#f0f9ff", color: "#075985", border: "1px solid #bae6fd" },
  "Layoffs":     { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
  "Cap-Exempt":  { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
  "Markets":     { background: "#fff7ed", color: "#92400e", border: "1px solid #fde68a" },
  "Fed Rate":    { background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" },
  "Housing":     { background: "#fdf4ff", color: "#7e22ce", border: "1px solid #e9d5ff" },
  "Remittance":  { background: "#f0fdf4", color: "#14532d", border: "1px solid #bbf7d0" },
  "Tax":         { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
};

// ─── Shared sub-page layout ────────────────────────────────────────────────────

function NewsPageLayout({ slug, title, icon, desc, children }) {
  const isMobile = useIsMobile();
  const siteBase = getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org";
  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>{title} — News | Apnacircle</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={`${siteBase}/news/${slug}`} />
        <meta property="og:title" content={`${title} | Apnacircle`} />
        <meta property="og:description" content={desc} />
        <meta property="og:url" content={`${siteBase}/news/${slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {!isMobile && <ResourceNav />}

      <div style={s.content}>
        <Link to="/news" style={s.back}>← News</Link>

        {/* Category tiles */}
        <div style={s.catGrid}>
          {CATEGORIES.map(c => (
            <Link
              key={c.slug}
              to={`/news/${c.slug}`}
              style={{ ...s.catTile, ...(c.slug === slug ? s.catTileActive : {}) }}
            >
              <span style={s.catIcon}>{c.icon}</span>
              <span style={s.catLabel}>{c.label}</span>
            </Link>
          ))}
        </div>

        {/* Header */}
        <div style={s.heroCard}>
          <span style={s.heroIcon}>{icon}</span>
          <div>
            <p style={s.byline}>Community Digest · Apnacircle News</p>
            <h1 style={s.heroTitle}>{title}</h1>
            <p style={s.heroDesc}>{desc}</p>
          </div>
        </div>

        <div style={s.newsCards}>{children}</div>
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

function NewsCard({ item }) {
  const tagStyle = TAG_COLORS[item.tag] || { background: "#f5f5f5", color: "#555", border: "1px solid #ddd" };
  return (
    <div style={s.newsCard}>
      <div style={s.newsCardTop}>
        <span style={{ ...s.tag, ...tagStyle }}>{item.tag}</span>
        <span style={s.newsDate}>{item.date}</span>
      </div>
      <h2 style={s.newsHeadline}>{item.headline}</h2>
      <p style={s.newsBody}>{item.body}</p>
      {item.url && (
        <a href={item.url} target="_blank" rel="noopener noreferrer" style={s.sourceLink}>
          Source: {item.source} →
        </a>
      )}
    </div>
  );
}

// ─── Hub page ──────────────────────────────────────────────────────────────────

export default function NewsHubPage() {
  const isMobile = useIsMobile();
  const isCA = getCountrySlug() === "ca";
  const siteBase = isCA ? "https://ca.apnacircle.org" : "https://apnacircle.org";
  const country = isCA ? "Canada" : "the US";
  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>News for Immigrants — Apnacircle</title>
        <meta name="description" content={`Immigration policy updates, job market news, and finance & economy coverage — curated for immigrants in ${country}.`} />
        <link rel="canonical" href={`${siteBase}/news`} />
        <meta property="og:title" content="News for Immigrants | Apnacircle" />
        <meta property="og:description" content={`Immigration policy, job market, and finance news curated for immigrants in ${country}.`} />
        <meta property="og:url" content={`${siteBase}/news`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {!isMobile && <ResourceNav />}

      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>

        <div style={s.hubHero}>
          <span style={{ fontSize: 40 }}>📰</span>
          <div>
            <h1 style={s.heroTitle}>News</h1>
            <p style={s.heroDesc}>
              Immigration policy, job market, and financial news — curated for immigrants in {country}.
              No noise, just what directly affects your status, career, and finances.
            </p>
          </div>
        </div>

        <div style={s.articleGrid}>
          {CATEGORIES.map(c => (
            <Link key={c.slug} to={`/news/${c.slug}`} style={s.articleCard}>
              <span style={s.articleIcon}>{c.icon}</span>
              <div>
                <h2 style={s.articleCardTitle}>{c.label}</h2>
                <p style={s.articleCardDesc}>{isCA ? c.caDesc : c.desc}</p>
              </div>
              <span style={s.articleArrow}>→</span>
            </Link>
          ))}
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

// ─── Immigration News ──────────────────────────────────────────────────────────

export function ImmigrationNewsPage() {
  const isCA = getCountrySlug() === "ca";
  const news = isCA ? CA_IMMIGRATION_NEWS : IMMIGRATION_NEWS;
  const desc = isCA
    ? "IRCC updates, Express Entry draws, study and work permits, PNP news, and PR processing — curated for immigrants in Canada."
    : "USCIS updates, H-1B cap, green card priority dates, visa rule changes, and travel policy — curated for immigrants in the US.";
  return (
    <NewsPageLayout slug="immigration" icon="🏛️" title="Immigration Policy News" desc={desc}>
      {news.map((item, i) => <NewsCard key={i} item={item} />)}
    </NewsPageLayout>
  );
}

// ─── Job Market News ───────────────────────────────────────────────────────────

export function JobsNewsPage() {
  const isCA = getCountrySlug() === "ca";
  const news = isCA ? CA_JOBS_NEWS : JOBS_NEWS;
  const desc = isCA
    ? "LMIA and work permit trends, job loss guidance, PGWP updates, and employment tips for work permit holders in Canada."
    : "H-1B sponsorship trends, layoffs, OPT job market, and employment tips for immigrants and work visa holders.";
  return (
    <NewsPageLayout slug="jobs" icon="💼" title="Job Market News" desc={desc}>
      {news.map((item, i) => <NewsCard key={i} item={item} />)}
    </NewsPageLayout>
  );
}

// ─── Finance News ──────────────────────────────────────────────────────────────

export function FinanceNewsPage() {
  const isCA = getCountrySlug() === "ca";
  const news = isCA ? CA_FINANCE_NEWS : FINANCE_NEWS;
  const desc = isCA
    ? "Bank of Canada rate, Canadian housing market, TFSA limits, mortgage rates, and remittance tips for immigrants in Canada."
    : "Fed rate decisions, S&P 500 updates, housing market, mortgage rates, and remittance tips for immigrants in the US.";
  return (
    <NewsPageLayout slug="finance" icon="📊" title="Finance & Economy News" desc={desc}>
      {news.map((item, i) => <NewsCard key={i} item={item} />)}
    </NewsPageLayout>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  outer:        { padding: "1.5rem 1.5rem 3rem", display: "flex", gap: 24, alignItems: "flex-start" },
  content:      { flex: 1, minWidth: 0 },
  rail:         { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 72 },
  back:         { color: "var(--orange)", fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 8, textDecoration: "none" },

  // hub
  hubHero:          { display: "flex", gap: 20, alignItems: "center", background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.75rem", marginBottom: 24, flexWrap: "wrap" },
  articleGrid:      { display: "flex", flexDirection: "column", gap: 12 },
  articleCard:      { display: "flex", alignItems: "center", gap: 16, background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem 1.5rem", textDecoration: "none", color: "#111" },
  articleIcon:      { fontSize: 32, flexShrink: 0 },
  articleCardTitle: { fontSize: 16, fontWeight: 700, color: "#111", marginBottom: 4 },
  articleCardDesc:  { fontSize: 13, color: "#666", lineHeight: 1.5 },
  articleArrow:     { marginLeft: "auto", fontSize: 18, color: "#bbb", flexShrink: 0 },

  // sub-page category tiles
  catGrid:      { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  catTile:      { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 14px", background: "#fff", border: "0.5px solid var(--border)", borderRadius: 8, textDecoration: "none", color: "#555", flex: "1 1 100px", textAlign: "center", minWidth: 90 },
  catTileActive:{ background: "var(--orange)", color: "#fff", border: "0.5px solid var(--orange)" },
  catIcon:      { fontSize: 20 },
  catLabel:     { fontSize: 12, fontWeight: 700, lineHeight: 1.3 },

  // sub-page header
  heroCard:  { display: "flex", gap: 20, alignItems: "flex-start", background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.75rem", marginBottom: 20, flexWrap: "wrap" },
  heroIcon:  { fontSize: 48, lineHeight: 1, flexShrink: 0 },
  heroTitle: { fontSize: 26, fontWeight: 800, color: "#111", marginBottom: 6, lineHeight: 1.2 },
  heroDesc:  { fontSize: 14, color: "#555", lineHeight: 1.6, margin: 0 },
  byline:    { fontSize: 11, fontWeight: 700, color: "var(--orange)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },

  // news cards
  newsCards:    { display: "flex", flexDirection: "column", gap: 12 },
  newsCard:     { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem 1.5rem" },
  newsCardTop:  { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  tag:          { fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20 },
  newsDate:     { fontSize: 12, color: "#999", fontWeight: 600 },
  newsHeadline: { fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 8, lineHeight: 1.4 },
  newsBody:     { fontSize: 14, color: "#555", lineHeight: 1.75, marginBottom: 10 },
  sourceLink:   { fontSize: 12, fontWeight: 600, color: "var(--orange)", textDecoration: "none", display: "inline-block" },
};
