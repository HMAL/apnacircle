import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const STATES = [
  { slug: "new-york",       cities: ["Albany","New York City","Buffalo","Syracuse","Rochester","Yonkers"] },
  { slug: "texas",          cities: ["Dallas","Houston","Austin","San Antonio","Fort Worth","Plano","Irving"] },
  { slug: "california",     cities: ["San Francisco","Los Angeles","San Jose","San Diego","Fremont","Sunnyvale","Irvine"] },
  { slug: "georgia",        cities: ["Atlanta","Savannah","Augusta","Columbus","Alpharetta","Duluth"] },
  { slug: "north-carolina", cities: ["Charlotte","Raleigh","Durham","Greensboro","Cary","Morrisville"] },
  { slug: "new-jersey",     cities: ["Newark","Jersey City","Edison","Parsippany","Iselin","Piscataway"] },
  { slug: "illinois",       cities: ["Chicago","Naperville","Schaumburg","Lisle","Aurora","Lombard"] },
  { slug: "florida",        cities: ["Miami","Orlando","Tampa","Jacksonville","Clearwater","Gainesville"] },
  { slug: "virginia",       cities: ["Arlington","Fairfax","Richmond","Herndon","Chantilly","Sterling"] },
  { slug: "washington",     cities: ["Seattle","Bellevue","Redmond","Kirkland","Bothell","Renton"] },
];

const citySlug = name => name.toLowerCase().replace(/\s+/g, "-");

const BASE = "https://apnacircle.org";
const today = new Date().toISOString().split("T")[0];

const staticPages = [
  { url: "/",            priority: "1.0", changefreq: "daily" },
  { url: "/visa/h1b",    priority: "0.8", changefreq: "weekly" },
  { url: "/visa/f1",     priority: "0.8", changefreq: "weekly" },
  { url: "/visa/b1b2",   priority: "0.7", changefreq: "weekly" },
  { url: "/immigration", priority: "0.8", changefreq: "weekly" },
  { url: "/ds160",       priority: "0.7", changefreq: "weekly" },
  { url: "/health",      priority: "0.7", changefreq: "weekly" },
  { url: "/lawyers",     priority: "0.8", changefreq: "weekly" },
  { url: "/contact",     priority: "0.4", changefreq: "monthly" },
];

const urls = [];

for (const { url, priority, changefreq } of staticPages) {
  urls.push(`  <url>
    <loc>${BASE}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
}

for (const state of STATES) {
  urls.push(`  <url>
    <loc>${BASE}/states/${state.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);

  for (const city of state.cities) {
    urls.push(`  <url>
    <loc>${BASE}/states/${state.slug}/${citySlug(city)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

const out = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(out, xml, "utf-8");
console.log(`Sitemap written � ${urls.length} URLs ? public/sitemap.xml`);
