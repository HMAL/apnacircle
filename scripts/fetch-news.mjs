// Fetches official government RSS/Atom feeds and writes public/news.json
// Run manually: node scripts/fetch-news.mjs
// Run via GitHub Actions daily to keep news fresh.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/news.json");

// ─── XML helpers ───────────────────────────────────────────────────────────────

function decode(s = "") {
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&#\d+;/g, "").trim();
}

function stripHtml(s = "") {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function xmlTag(block, tagName) {
  const m = block.match(
    new RegExp(`<${tagName}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tagName}>`, "i")
  );
  return m ? m[1].trim() : "";
}

function xmlAttr(block, tagName, attrName) {
  const m = block.match(new RegExp(`<${tagName}[^>]*${attrName}="([^"]+)"`, "i"));
  return m ? m[1] : "";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function truncate(s, maxWords = 55) {
  const words = s.split(/\s+/);
  if (words.length <= maxWords) return s;
  return words.slice(0, maxWords).join(" ") + "…";
}

async function fetchXml(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ApnacircleNewsBot/1.0)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function parseItems(xml) {
  const items = [];
  const re = /<(item|entry)[\s>]([\s\S]*?)<\/(item|entry)>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const b = m[2];
    const title = decode(xmlTag(b, "title"));
    const link = xmlTag(b, "link") || xmlAttr(b, "link", "href") || "";
    const rawDesc = xmlTag(b, "description") || xmlTag(b, "summary") || xmlTag(b, "content") || "";
    const desc = truncate(decode(stripHtml(rawDesc)));
    const pub = xmlTag(b, "pubDate") || xmlTag(b, "updated") || xmlTag(b, "published") || "";
    if (title) items.push({ title, link, desc, pub });
  }
  return items;
}

// ─── Tag derivation ────────────────────────────────────────────────────────────

// Each hint is [keyword, tag]. First match wins; last entry is default.
const US_IMMI_HINTS = [
  ["h-1b", "H-1B"], ["h1b", "H-1B"],
  ["green card", "Green Card"], ["eb-2", "Green Card"], ["eb-3", "Green Card"],
  ["eb-1", "Green Card"], ["i-140", "Green Card"], ["i-485", "Green Card"],
  ["priority date", "Green Card"], ["visa bulletin", "Green Card"],
  ["f-1", "F-1 / OPT"], ["opt ", "F-1 / OPT"], ["stem opt", "F-1 / OPT"],
  ["advance parole", "Travel"], ["travel document", "Travel"],
  ["cap-exempt", "Cap-Exempt"],
  ["premium processing", "USCIS"],
  ["uscis", "USCIS"],
  ["immigration", "USCIS"],
];

const US_JOBS_HINTS = [
  ["h-1b", "H-1B"], ["h1b", "H-1B"], ["sponsorship", "H-1B"],
  ["layoff", "Layoffs"], ["laid off", "Layoffs"], ["job loss", "Layoffs"],
  ["opt ", "OPT"], ["stem opt", "OPT"],
  ["cap-exempt", "Cap-Exempt"],
  ["employment", "H-1B"],
];

const US_FIN_HINTS = [
  ["federal reserve", "Fed Rate"], ["fomc", "Fed Rate"], ["interest rate", "Fed Rate"],
  ["mortgage", "Housing"], ["housing", "Housing"], ["home price", "Housing"],
  ["remittance", "Remittance"], ["wire transfer", "Remittance"],
  ["tax", "Tax"], ["irs", "Tax"], ["itin", "Tax"],
  ["s&p", "Markets"], ["stock market", "Markets"], ["market", "Markets"],
  ["economy", "Markets"],
];

const CA_IMMI_HINTS = [
  ["express entry", "Express Entry"], ["crs score", "Express Entry"], ["invitation to apply", "Express Entry"],
  ["study permit", "Study Permit"], ["international student", "Study Permit"], ["dli", "Study Permit"],
  ["pgwp", "PGWP"], ["post-graduation work", "PGWP"],
  ["lmia", "Work Permit"], ["work permit", "Work Permit"],
  ["provincial nominee", "PNP"], ["pnp", "PNP"],
  ["pr card", "PR"], ["permanent resident", "PR"],
  ["ircc", "IRCC"],
  ["immigration", "IRCC"],
];

const CA_JOBS_HINTS = [
  ["lmia", "Work Permit"], ["work permit", "Work Permit"],
  ["layoff", "Layoffs"], ["laid off", "Layoffs"],
  ["pgwp", "PGWP"],
  ["cusma", "CUSMA"], ["usmca", "CUSMA"],
  ["employment", "Work Permit"],
];

const CA_FIN_HINTS = [
  ["bank of canada", "BoC Rate"], ["overnight rate", "BoC Rate"],
  ["tfsa", "TFSA"], ["rrsp", "TFSA"], ["contribution room", "TFSA"],
  ["mortgage", "Housing"], ["housing", "Housing"],
  ["remittance", "Remittance"],
  ["tax", "Tax"], ["cra", "Tax"], ["filing", "Tax"],
  ["economy", "BoC Rate"],
];

function deriveTag(title, desc, hints) {
  const text = (title + " " + desc).toLowerCase();
  for (const [kw, tag] of hints) {
    if (text.includes(kw)) return tag;
  }
  return hints[hints.length - 1]?.[1] ?? "News";
}

function toNewsItem(raw, hints, sourceName) {
  return {
    tag: deriveTag(raw.title, raw.desc, hints),
    date: formatDate(raw.pub),
    headline: raw.title,
    body: raw.desc,
    source: sourceName,
    url: raw.link,
  };
}

// ─── Feed definitions ──────────────────────────────────────────────────────────

const FEEDS = [
  {
    url: "https://www.uscis.gov/news/rss-feed/23269",
    source: "USCIS",
    bucket: "us_immigration",
    hints: US_IMMI_HINTS,
  },
  {
    url: "https://www.bls.gov/feed/bls_latest.rss",
    source: "Bureau of Labor Statistics",
    bucket: "us_jobs",
    hints: US_JOBS_HINTS,
  },
  {
    url: "https://www.federalreserve.gov/feeds/press_all.xml",
    source: "Federal Reserve",
    bucket: "us_finance",
    hints: US_FIN_HINTS,
  },
  {
    url: "https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofcitizenshipandimmigration&type=newsreleases&sort=publishedDate&orderBy=desc&pick=10&format=atom&atomtitle=IRCC",
    source: "IRCC — Canada.ca",
    bucket: "ca_immigration",
    hints: CA_IMMI_HINTS,
  },
  {
    url: "https://api.io.canada.ca/io-server/gc/news/en/v2?dept=departmentofemploymentandsocialdevelopment&type=newsreleases&sort=publishedDate&orderBy=desc&pick=10&format=atom&atomtitle=ESDC",
    source: "ESDC — Canada.ca",
    bucket: "ca_jobs",
    hints: CA_JOBS_HINTS,
  },
  {
    url: "https://www.bankofcanada.ca/feed/",
    source: "Bank of Canada",
    bucket: "ca_finance",
    hints: CA_FIN_HINTS,
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const buckets = {
    us_immigration: [], us_jobs: [], us_finance: [],
    ca_immigration: [], ca_jobs: [], ca_finance: [],
  };

  for (const feed of FEEDS) {
    try {
      process.stdout.write(`Fetching ${feed.source}… `);
      const xml = await fetchXml(feed.url);
      const items = parseItems(xml).slice(0, 8);
      buckets[feed.bucket].push(...items.map(r => toNewsItem(r, feed.hints, feed.source)));
      console.log(`${items.length} items`);
    } catch (err) {
      console.log(`SKIPPED (${err.message})`);
    }
  }

  // Cap each category at 5 items
  for (const key of Object.keys(buckets)) {
    buckets[key] = buckets[key].slice(0, 5);
  }

  const total = Object.values(buckets).reduce((n, b) => n + b.length, 0);
  if (total === 0) {
    console.error("No items fetched — leaving existing file unchanged.");
    process.exit(1);
  }

  const out = {
    generatedAt: new Date().toISOString(),
    us: {
      immigration: buckets.us_immigration,
      jobs: buckets.us_jobs,
      finance: buckets.us_finance,
    },
    ca: {
      immigration: buckets.ca_immigration,
      jobs: buckets.ca_jobs,
      finance: buckets.ca_finance,
    },
  };

  writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${total} total items → ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
