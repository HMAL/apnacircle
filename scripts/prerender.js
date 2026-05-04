import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const ssrOut = resolve(root, ".ssr-dist");

const STATES = [
  { name: "New York",       abbr: "NY", slug: "new-york",       cities: ["Albany","New York City","Buffalo","Syracuse","Rochester","Yonkers"] },
  { name: "Texas",          abbr: "TX", slug: "texas",           cities: ["Dallas","Houston","Austin","San Antonio","Fort Worth","Plano","Irving"] },
  { name: "California",     abbr: "CA", slug: "california",      cities: ["San Francisco","Los Angeles","San Jose","San Diego","Fremont","Sunnyvale","Irvine"] },
  { name: "Georgia",        abbr: "GA", slug: "georgia",         cities: ["Atlanta","Savannah","Augusta","Columbus","Alpharetta","Duluth"] },
  { name: "North Carolina", abbr: "NC", slug: "north-carolina",  cities: ["Charlotte","Raleigh","Durham","Greensboro","Cary","Morrisville"] },
  { name: "New Jersey",     abbr: "NJ", slug: "new-jersey",      cities: ["Newark","Jersey City","Edison","Parsippany","Iselin","Piscataway"] },
  { name: "Illinois",       abbr: "IL", slug: "illinois",        cities: ["Chicago","Naperville","Schaumburg","Lisle","Aurora","Lombard"] },
  { name: "Florida",        abbr: "FL", slug: "florida",         cities: ["Miami","Orlando","Tampa","Jacksonville","Clearwater","Gainesville"] },
  { name: "Virginia",       abbr: "VA", slug: "virginia",        cities: ["Arlington","Fairfax","Richmond","Herndon","Chantilly","Sterling"] },
  { name: "Washington",     abbr: "WA", slug: "washington",      cities: ["Seattle","Bellevue","Redmond","Kirkland","Bothell","Renton"] },
];

const citySlug = name => name.toLowerCase().replace(/\s+/g, "-");
const BASE = "https://apnacircle.org";
const publicUrl = url => `${BASE}${url === "/" ? "/" : `${url}/`}`;

const OG_IMAGE = `${BASE}/og-image.svg`;

function metaForRoute(url) {
  const og = (title, desc, ld) => ({ title, desc, ld });

  if (url === "/") return {
    ...og(
      "Apnacircle — Free Community Hub for Immigrants in the US & Canada",
      "Free resource for immigrants — visa experiences, immigration lawyers, local jobs, housing, doctors, events and more. No ads, no signup, no fees.",
      JSON.stringify([
        { "@context":"https://schema.org","@type":"Organization","name":"Apnacircle","url":BASE,"logo":`${BASE}/favicon.svg`,"description":"Free community hub for immigrants in the US & Canada" },
        { "@context":"https://schema.org","@type":"WebSite","url":BASE,"name":"Apnacircle" },
      ]),
    ),
    hreflang: true,
  };
  if (url === "/immigration") return og(
    "Immigration Tips for United States — Community Advice | Apnacircle",
    "Practical immigration tips shared by the immigrant community — green card, work authorization, status changes, travel and more.",
  );
  if (url === "/ds160") return og(
    "DS-160 Tips — Community Guide | Apnacircle",
    "Tips and guidance on filling out DS-160 forms shared by immigrants who've been through the process.",
  );
  if (url === "/health") return og(
    "Health & Wellness Tips for Immigrants — United States | Apnacircle",
    "Community health tips for immigrants — doctors, health insurance, mental health, pharmacies, hospitals and nutrition advice.",
  );
  if (url === "/lawyers") return og(
    "Immigration Lawyers — Community Recommended | Apnacircle",
    "Find community-recommended immigration lawyers across the US and Canada — vetted by immigrants, for immigrants.",
  );
  if (url === "/contact") return og(
    "Contact Apnacircle — Get in Touch",
    "Send a message to the Apnacircle team. We're here to help the immigrant community.",
  );
  if (url === "/visa/h1b") return og(
    "H-1B Visa Interview Experiences — Community Stories | Apnacircle",
    "Real H-1B visa interview experiences shared by immigrants. Tips, consulate reviews and approval stories.",
  );
  if (url === "/visa/f1") return og(
    "F-1 Student Visa Interview Experiences | Apnacircle",
    "Real F-1 student visa interview experiences shared by immigrants. Tips and approval stories.",
  );
  if (url === "/visa/b1b2") return og(
    "B-1/B-2 Visitor Visa Interview Experiences | Apnacircle",
    "Real B-1/B-2 visitor visa interview experiences shared by immigrants.",
  );

  const parts = url.split("/").filter(Boolean);
  if (parts[0] === "states" && parts[1]) {
    const state = STATES.find(s => s.slug === parts[1]);
    if (!state) return null;

    if (parts[2]) {
      const city = state.cities.find(c => citySlug(c) === parts[2]);
      if (!city) return null;
      return og(
        `Immigrant Community in ${city}, ${state.abbr} — Jobs, Housing, Doctors | Apnacircle`,
        `Free community resources for Indian, Pakistani, Korean, Chinese, Japanese, Sri Lankan, and Mexican immigrants in ${city}, ${state.name} — local jobs, accommodation, lawyers, doctors, temples, events and more.`,
        JSON.stringify({ "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
          {"@type":"ListItem","position":1,"name":"Home","item":BASE},
          {"@type":"ListItem","position":2,"name":state.name,"item":publicUrl(`/states/${state.slug}`)},
          {"@type":"ListItem","position":3,"name":city,"item":publicUrl(`/states/${state.slug}/${citySlug(city)}`)},
        ]}),
      );
    }
    return og(
      `Immigrant Community in ${state.name} — Jobs, Housing, Events | Apnacircle`,
      `Find local immigrant community resources in ${state.name} for Indians, Pakistanis, Koreans, Chinese, Japanese, Sri Lankans, and Mexicans — visa help, lawyers, jobs, accommodation, doctors, events and more.`,
      JSON.stringify({ "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":BASE},
        {"@type":"ListItem","position":2,"name":state.name,"item":publicUrl(`/states/${state.slug}`)},
      ]}),
    );
  }
  return null;
}

const routes = [
  "/", "/visa/h1b", "/visa/f1", "/visa/b1b2",
  "/immigration", "/ds160", "/health", "/lawyers", "/contact",
];
for (const state of STATES) {
  routes.push(`/states/${state.slug}`);
  for (const city of state.cities) routes.push(`/states/${state.slug}/${citySlug(city)}`);
}

// Build SSR bundle
console.log("Building SSR bundle...");
execSync(`vite build --ssr src/entry-server.jsx --outDir ${ssrOut}`, { cwd: root, stdio: "inherit" });

const { render } = await import(pathToFileURL(resolve(ssrOut, "entry-server.js")).href);
const template = readFileSync(resolve(root, "dist/index.html"), "utf-8");

let ok = 0;
for (const url of routes) {
  try {
    const { html } = render(url);
    const meta = metaForRoute(url);
    const canonical = publicUrl(url);

    const headTags = meta ? [
      `<title>${meta.title}</title>`,
      `<meta name="description" content="${meta.desc}" />`,
      `<link rel="canonical" href="${canonical}" />`,
      `<meta property="og:title" content="${meta.title}" />`,
      `<meta property="og:description" content="${meta.desc}" />`,
      `<meta property="og:url" content="${canonical}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="Apnacircle" />`,
      `<meta property="og:image" content="${OG_IMAGE}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:image" content="${OG_IMAGE}" />`,
      ...(meta.hreflang ? [
        `<link rel="alternate" hreflang="en" href="${canonical}" />`,
        `<link rel="alternate" hreflang="x-default" href="${canonical}" />`,
      ] : []),
      ...(meta.ld ? [`<script type="application/ld+json">${meta.ld}</script>`] : []),
    ].join("\n    ") : "";

    const page = template
      .replace("<!--prerender-head-->", headTags)
      .replace("<!--app-html-->", html);

    const file = url === "/" ? "index.html" : `${url.slice(1)}/index.html`;
    const fullPath = resolve(root, "dist", file);
    mkdirSync(dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, page, "utf-8");
    ok++;
  } catch (e) {
    console.warn(`  Skipped ${url}: ${e.message}`);
  }
}

rmSync(ssrOut, { recursive: true, force: true });
console.log(`Prerendering done — ${ok}/${routes.length} pages written.`);
