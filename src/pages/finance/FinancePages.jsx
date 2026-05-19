import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AdBlock from "../../components/AdBlock";
import { useIsMobile } from "../../lib/useIsMobile";
import ResourceNav from "../../components/ResourceNav";

const ARTICLES = [
  { slug: "retirement",     icon: "🏦", title: "Retirement Planning: 401(k) vs Roth IRA",     desc: "Which account wins for your situation — and what to do if your employer doesn't offer a 401(k)." },
  { slug: "housing",        icon: "🏠", title: "Renting vs. Buying a Home",                    desc: "The math most real-estate agents don't show you. A 10-year comparison that may surprise you." },
  { slug: "car",            icon: "🚗", title: "Lease vs. Buy a Car",                          desc: "An honest look at which option puts more money in your pocket — with a simple side-by-side comparison." },
  { slug: "index-funds",    icon: "📈", title: "Index Funds vs. Individual Stocks",            desc: "Why Wall Street professionals consistently lose to a basic index fund, and what that means for you." },
  { slug: "529",            icon: "🎓", title: "529 College Savings Plans",                    desc: "The tax-advantaged account every parent of young children should understand — and the new Roth IRA rollover rule." },
  { slug: "life-insurance", icon: "🛡️", title: "Life Insurance Basics",                       desc: "Term, whole, universal, IUL — cut through the sales pitch and find out what you actually need." },
  { slug: "w2-1099",        icon: "📄", title: "W-2 vs 1099 Income",                           desc: "How to read your W-2, what every box means, and the real tax cost of switching from employee to contractor." },
];

// ─── Shared layout ────────────────────────────────────────────────────────────

function FinanceArticleLayout({ slug, title, icon, metaDesc, children }) {
  const isMobile = useIsMobile();
  const siteBase = "https://apnacircle.org";
  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>{title} — Finance Tips | Apnacircle</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`${siteBase}/finance/${slug}`} />
        <meta property="og:title" content={`${title} | Apnacircle`} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={`${siteBase}/finance/${slug}`} />
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
            {ARTICLES.filter(a => a.slug !== slug).map(a => (
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

// ─── Hub page ─────────────────────────────────────────────────────────────────

export default function FinanceHubPage() {
  const isMobile = useIsMobile();
  const siteBase = "https://apnacircle.org";
  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>Finance Tips for Immigrants — Apnacircle</title>
        <meta name="description" content="Practical, honest financial guidance for immigrants in the US — retirement accounts, renting vs. buying, car leasing, index funds, 529 plans, and life insurance." />
        <link rel="canonical" href={`${siteBase}/finance`} />
        <meta property="og:title" content="Finance Tips for Immigrants | Apnacircle" />
        <meta property="og:description" content="Practical, honest financial guidance for immigrants in the US." />
        <meta property="og:url" content={`${siteBase}/finance`} />
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
              Straightforward financial analysis — written for people building wealth in a new country.
              No fluff, no sales pitch, just the math and honest opinions.
            </p>
          </div>
        </div>

        <div style={s.articleGrid}>
          {ARTICLES.map(a => (
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

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  moreGrid:     { display: "flex", flexDirection: "column", gap: 8 },
  moreCard:     { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#fff", border: "0.5px solid var(--border)", borderRadius: 8, textDecoration: "none", color: "#333", fontSize: 13, fontWeight: 600 },
  moreIcon:     { fontSize: 18, flexShrink: 0 },
  moreLabel:    { lineHeight: 1.4 },
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
