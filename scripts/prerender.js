import { readFileSync, writeFileSync, mkdirSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const ssrOut = resolve(root, ".ssr-dist");

// Set SITE_URL env var in the CA deployment to get correct canonicals for that site.
// US build: SITE_URL=https://apnacircle.org (default)
// CA build: SITE_URL=https://ca.apnacircle.org
const BASE = (process.env.SITE_URL || "https://apnacircle.org").replace(/\/$/, "");
const IS_CA = BASE.startsWith("https://ca.");
const publicUrl = url => `${BASE}${url === "/" ? "/" : `${url}/`}`;
const OG_IMAGE = `${BASE}/og-image.svg`;

const CA_PROVINCE_SLUGS = new Set([
  "ontario", "british-columbia", "alberta", "quebec", "manitoba",
  "saskatchewan", "nova-scotia", "new-brunswick", "newfoundland", "prince-edward-island",
]);

const ALL_STATES = [
  // ── US States ────────────────────────────────────────────────────────────────
  { name: "Alabama",               abbr: "AL", slug: "alabama",              cities: ["Birmingham","Montgomery","Huntsville","Mobile","Tuscaloosa"] },
  { name: "Alaska",                abbr: "AK", slug: "alaska",               cities: ["Anchorage","Fairbanks","Juneau"] },
  { name: "Arizona",               abbr: "AZ", slug: "arizona",              cities: ["Phoenix","Tucson","Mesa","Chandler","Scottsdale","Tempe","Gilbert","Glendale"] },
  { name: "Arkansas",              abbr: "AR", slug: "arkansas",             cities: ["Little Rock","Fort Smith","Fayetteville","Springdale","Jonesboro"] },
  { name: "California",            abbr: "CA", slug: "california",           cities: ["Los Angeles","San Jose","San Francisco","San Diego","Fremont","Sunnyvale","Irvine","Santa Clara","Oakland","Cupertino"] },
  { name: "Colorado",              abbr: "CO", slug: "colorado",             cities: ["Denver","Aurora","Colorado Springs","Fort Collins","Boulder","Lakewood","Thornton","Arvada"] },
  { name: "Connecticut",           abbr: "CT", slug: "connecticut",          cities: ["Bridgeport","New Haven","Hartford","Stamford","Waterbury","Norwalk","Danbury"] },
  { name: "Delaware",              abbr: "DE", slug: "delaware",             cities: ["Wilmington","Dover","Newark","Middletown"] },
  { name: "Florida",               abbr: "FL", slug: "florida",              cities: ["Jacksonville","Miami","Tampa","Orlando","St. Petersburg","Hialeah","Tallahassee","Fort Lauderdale","Cape Coral","Pembroke Pines","Hollywood","Miramar","Gainesville","Coral Springs","Clearwater"] },
  { name: "Georgia",               abbr: "GA", slug: "georgia",              cities: ["Atlanta","Columbus","Augusta","Macon","Savannah","Athens","Sandy Springs","Roswell","Alpharetta","Duluth","Johns Creek","Warner Robins"] },
  { name: "Hawaii",                abbr: "HI", slug: "hawaii",               cities: ["Honolulu","Pearl City","Hilo","Kailua","Waipahu","Kaneohe"] },
  { name: "Idaho",                 abbr: "ID", slug: "idaho",                cities: ["Boise","Meridian","Nampa","Idaho Falls","Pocatello","Caldwell"] },
  { name: "Illinois",              abbr: "IL", slug: "illinois",             cities: ["Chicago","Aurora","Joliet","Rockford","Springfield","Naperville","Peoria","Elgin","Waukegan","Champaign","Schaumburg","Lisle","Lombard"] },
  { name: "Indiana",               abbr: "IN", slug: "indiana",              cities: ["Indianapolis","Fort Wayne","Evansville","South Bend","Carmel","Fishers","Bloomington","Hammond","Gary","Muncie"] },
  { name: "Iowa",                  abbr: "IA", slug: "iowa",                 cities: ["Des Moines","Cedar Rapids","Davenport","Sioux City","Iowa City","Waterloo","Council Bluffs","Ames"] },
  { name: "Kansas",                abbr: "KS", slug: "kansas",               cities: ["Wichita","Overland Park","Kansas City","Topeka","Olathe","Lawrence","Shawnee"] },
  { name: "Kentucky",              abbr: "KY", slug: "kentucky",             cities: ["Louisville","Lexington","Bowling Green","Owensboro","Covington","Richmond","Georgetown"] },
  { name: "Louisiana",             abbr: "LA", slug: "louisiana",            cities: ["New Orleans","Baton Rouge","Shreveport","Metairie","Lafayette","Lake Charles","Kenner"] },
  { name: "Maine",                 abbr: "ME", slug: "maine",                cities: ["Portland","Lewiston","Bangor","South Portland","Auburn"] },
  { name: "Maryland",              abbr: "MD", slug: "maryland",             cities: ["Baltimore","Columbia","Germantown","Silver Spring","Waldorf","Glen Burnie","Ellicott City","Rockville","Gaithersburg","Bethesda"] },
  { name: "Massachusetts",         abbr: "MA", slug: "massachusetts",        cities: ["Boston","Worcester","Springfield","Lowell","Cambridge","New Bedford","Brockton","Quincy","Lynn","Framingham","Somerville","Waltham"] },
  { name: "Michigan",              abbr: "MI", slug: "michigan",             cities: ["Detroit","Grand Rapids","Warren","Sterling Heights","Ann Arbor","Lansing","Flint","Dearborn","Troy","Westland","Livonia","Farmington Hills","Novi"] },
  { name: "Minnesota",             abbr: "MN", slug: "minnesota",            cities: ["Minneapolis","Saint Paul","Rochester","Duluth","Brooklyn Park","Plymouth","Maple Grove","Woodbury","Eden Prairie","Bloomington","Eagan"] },
  { name: "Mississippi",           abbr: "MS", slug: "mississippi",          cities: ["Jackson","Gulfport","Southaven","Hattiesburg","Biloxi","Meridian"] },
  { name: "Missouri",              abbr: "MO", slug: "missouri",             cities: ["Kansas City","Saint Louis","Springfield","Columbia","Independence","St. Joseph","St. Charles"] },
  { name: "Montana",               abbr: "MT", slug: "montana",              cities: ["Billings","Missoula","Great Falls","Bozeman","Butte","Helena"] },
  { name: "Nebraska",              abbr: "NE", slug: "nebraska",             cities: ["Omaha","Lincoln","Bellevue","Grand Island","Kearney"] },
  { name: "Nevada",                abbr: "NV", slug: "nevada",               cities: ["Las Vegas","Henderson","Reno","North Las Vegas","Sparks","Carson City"] },
  { name: "New Hampshire",         abbr: "NH", slug: "new-hampshire",        cities: ["Manchester","Nashua","Concord","Derry","Dover","Rochester"] },
  { name: "New Jersey",            abbr: "NJ", slug: "new-jersey",           cities: ["Newark","Jersey City","Paterson","Elizabeth","Lakewood","Edison","Woodbridge","Toms River","Parsippany","Iselin","Piscataway","South Brunswick"] },
  { name: "New Mexico",            abbr: "NM", slug: "new-mexico",           cities: ["Albuquerque","Las Cruces","Rio Rancho","Santa Fe","Roswell","Farmington"] },
  { name: "New York",              abbr: "NY", slug: "new-york",             cities: ["New York City","Buffalo","Rochester","Yonkers","Syracuse","Albany","New Rochelle","Mount Vernon","Schenectady","Utica"] },
  { name: "North Carolina",        abbr: "NC", slug: "north-carolina",       cities: ["Charlotte","Raleigh","Greensboro","Durham","Winston-Salem","Fayetteville","Cary","Wilmington","High Point","Concord","Gastonia","Morrisville","Apex","Asheville"] },
  { name: "North Dakota",          abbr: "ND", slug: "north-dakota",         cities: ["Fargo","Bismarck","Grand Forks","Minot","West Fargo"] },
  { name: "Ohio",                  abbr: "OH", slug: "ohio",                 cities: ["Columbus","Cleveland","Cincinnati","Toledo","Akron","Dayton","Parma","Canton","Youngstown","Lorain","Hamilton","Springfield"] },
  { name: "Oklahoma",              abbr: "OK", slug: "oklahoma",             cities: ["Oklahoma City","Tulsa","Norman","Broken Arrow","Edmond","Lawton","Moore"] },
  { name: "Oregon",                abbr: "OR", slug: "oregon",               cities: ["Portland","Salem","Eugene","Gresham","Hillsboro","Beaverton","Bend","Medford","Springfield","Corvallis"] },
  { name: "Pennsylvania",          abbr: "PA", slug: "pennsylvania",         cities: ["Philadelphia","Pittsburgh","Allentown","Erie","Reading","Scranton","Bethlehem","Lancaster","Harrisburg","York"] },
  { name: "Rhode Island",          abbr: "RI", slug: "rhode-island",         cities: ["Providence","Cranston","Warwick","Pawtucket","East Providence","Woonsocket"] },
  { name: "South Carolina",        abbr: "SC", slug: "south-carolina",       cities: ["Columbia","Charleston","North Charleston","Mount Pleasant","Rock Hill","Greenville","Summerville","Goose Creek","Spartanburg"] },
  { name: "South Dakota",          abbr: "SD", slug: "south-dakota",         cities: ["Sioux Falls","Rapid City","Aberdeen","Brookings","Watertown"] },
  { name: "Tennessee",             abbr: "TN", slug: "tennessee",            cities: ["Nashville","Memphis","Knoxville","Chattanooga","Clarksville","Murfreesboro","Franklin","Johnson City"] },
  { name: "Texas",                 abbr: "TX", slug: "texas",                cities: ["Houston","San Antonio","Dallas","Austin","Fort Worth","El Paso","Arlington","Corpus Christi","Plano","Laredo","Lubbock","Irving","Garland","Frisco","McKinney","Carrollton","Denton","Midland","Killeen","Mesquite","Waco","Pasadena","Amarillo","Grand Prairie","Richardson","Lewisville","Sugar Land","Round Rock"] },
  { name: "Utah",                  abbr: "UT", slug: "utah",                 cities: ["Salt Lake City","West Valley City","Provo","West Jordan","Orem","Sandy","Ogden","St. George","Layton","South Jordan"] },
  { name: "Vermont",               abbr: "VT", slug: "vermont",              cities: ["Burlington","Essex","South Burlington","Colchester","Rutland"] },
  { name: "Virginia",              abbr: "VA", slug: "virginia",             cities: ["Virginia Beach","Norfolk","Chesapeake","Arlington","Richmond","Newport News","Alexandria","Hampton","Roanoke","Portsmouth","Suffolk","Herndon","Chantilly","Sterling","Fairfax","Ashburn"] },
  { name: "Washington",            abbr: "WA", slug: "washington",           cities: ["Seattle","Spokane","Tacoma","Vancouver","Bellevue","Kent","Everett","Renton","Yakima","Kirkland","Bellingham","Redmond","Bothell","Federal Way","Sammamish"] },
  { name: "West Virginia",         abbr: "WV", slug: "west-virginia",        cities: ["Charleston","Huntington","Morgantown","Parkersburg","Wheeling"] },
  { name: "Wisconsin",             abbr: "WI", slug: "wisconsin",            cities: ["Milwaukee","Madison","Green Bay","Kenosha","Racine","Appleton","Waukesha","Oshkosh","Eau Claire","Janesville"] },
  { name: "Wyoming",               abbr: "WY", slug: "wyoming",              cities: ["Cheyenne","Casper","Laramie","Gillette","Rock Springs"] },
  // ── Canadian Provinces ────────────────────────────────────────────────────────
  { name: "Ontario",               abbr: "ON", slug: "ontario",              cities: ["Toronto","Ottawa","Mississauga","Brampton","Hamilton","London","Markham","Vaughan","Kitchener","Windsor","Richmond Hill","Oakville","Burlington","Oshawa","Barrie"] },
  { name: "British Columbia",      abbr: "BC", slug: "british-columbia",     cities: ["Vancouver","Surrey","Burnaby","Richmond","Kelowna","Abbotsford","Victoria","Coquitlam","Langley","Delta","Nanaimo","Kamloops"] },
  { name: "Alberta",               abbr: "AB", slug: "alberta",              cities: ["Calgary","Edmonton","Red Deer","Lethbridge","St. Albert","Medicine Hat","Grande Prairie","Airdrie","Spruce Grove","Leduc"] },
  { name: "Quebec",                abbr: "QC", slug: "quebec",               cities: ["Montreal","Quebec City","Laval","Gatineau","Longueuil","Sherbrooke","Saguenay","Levis","Trois-Rivieres","Terrebonne"] },
  { name: "Manitoba",              abbr: "MB", slug: "manitoba",             cities: ["Winnipeg","Brandon","Steinbach","Thompson","Portage la Prairie","Winkler"] },
  { name: "Saskatchewan",          abbr: "SK", slug: "saskatchewan",         cities: ["Saskatoon","Regina","Prince Albert","Moose Jaw","Swift Current","Yorkton"] },
  { name: "Nova Scotia",           abbr: "NS", slug: "nova-scotia",          cities: ["Halifax","Cape Breton","Truro","New Glasgow","Glace Bay","Dartmouth"] },
  { name: "New Brunswick",         abbr: "NB", slug: "new-brunswick",        cities: ["Moncton","Saint John","Fredericton","Dieppe","Miramichi","Riverview"] },
  { name: "Newfoundland",          abbr: "NL", slug: "newfoundland",         cities: ["St. John's","Corner Brook","Grand Falls-Windsor","Gander","Paradise"] },
  { name: "Prince Edward Island",  abbr: "PE", slug: "prince-edward-island", cities: ["Charlottetown","Summerside","Stratford","Cornwall"] },
];

// Each build only pre-renders the regions relevant to its site.
const SITE_REGIONS = IS_CA
  ? ALL_STATES.filter(s => CA_PROVINCE_SLUGS.has(s.slug))
  : ALL_STATES.filter(s => !CA_PROVINCE_SLUGS.has(s.slug));

const citySlug = name => name.toLowerCase().replace(/\s+/g, "-");

const STATIC_ROUTES = IS_CA ? [
  "/", "/visa/visitor", "/visa/study-permit", "/visa/work-permit",
  "/visa/express-entry", "/visa/pnp",
  "/immigration", "/ds160", "/health", "/lawyers",
  "/contact", "/events", "/privacy", "/disclaimer",
] : [
  "/", "/visa/h1b", "/visa/f1", "/visa/b1b2",
  "/immigration", "/ds160", "/health", "/lawyers",
  "/contact", "/events", "/privacy", "/disclaimer",
];

function metaForRoute(url) {
  const og = (title, desc, ld) => ({ title, desc, ld });

  if (url === "/") return {
    ...og(
      IS_CA
        ? "Apnacircle — Free Community Hub for Immigrants in Canada"
        : "Apnacircle — Free Community Hub for Immigrants in the US & Canada",
      "Free resource for immigrants — visa experiences, immigration lawyers, local jobs, housing, doctors, events and more. No ads, no signup, no fees.",
      JSON.stringify([
        { "@context":"https://schema.org","@type":"Organization","name":"Apnacircle","url":BASE,"logo":`${BASE}/favicon.svg`,"description": IS_CA ? "Free community hub for immigrants in Canada" : "Free community hub for immigrants in the US & Canada" },
        { "@context":"https://schema.org","@type":"WebSite","url":BASE,"name":"Apnacircle" },
      ]),
    ),
    hreflang: true,
  };

  if (url === "/immigration") return og(
    IS_CA
      ? "Immigration Tips for Canada — Community Advice | Apnacircle"
      : "Immigration Tips for United States — Community Advice | Apnacircle",
    IS_CA
      ? "Practical immigration tips shared by the immigrant community — PR, Express Entry, work permits, study permits and more."
      : "Practical immigration tips shared by the immigrant community — green card, work authorization, status changes, travel and more.",
  );
  if (url === "/ds160") return og(
    "DS-160 Tips — Community Guide | Apnacircle",
    "Tips and guidance on filling out DS-160 forms shared by immigrants who've been through the process.",
  );
  if (url === "/health") return og(
    IS_CA
      ? "Health & Wellness Tips for Immigrants — Canada | Apnacircle"
      : "Health & Wellness Tips for Immigrants — United States | Apnacircle",
    IS_CA
      ? "Community health tips for immigrants in Canada — doctors, provincial health coverage, pharmacies and nutrition advice."
      : "Community health tips for immigrants — doctors, health insurance, mental health, pharmacies, hospitals and nutrition advice.",
  );
  if (url === "/lawyers") return og(
    "Immigration Lawyers — Community Recommended | Apnacircle",
    "Find community-recommended immigration lawyers across the US and Canada — vetted by immigrants, for immigrants.",
  );
  if (url === "/contact") return og(
    "Contact Apnacircle — Get in Touch",
    "Send a message to the Apnacircle team. We're here to help the immigrant community.",
  );
  if (url === "/events") return og(
    "Community Events — Immigrant Meetups & Cultural Events | Apnacircle",
    IS_CA
      ? "Browse upcoming community events for immigrants across Canada — cultural gatherings, meetups, festivals and more."
      : "Browse upcoming community events for immigrants across the US — cultural gatherings, meetups, festivals and more.",
  );
  if (url === "/privacy") return og(
    "Privacy Policy | Apnacircle",
    "Privacy policy for Apnacircle — how we handle your data and protect your privacy.",
  );
  if (url === "/disclaimer") return og(
    "Disclaimer | Apnacircle",
    "Disclaimer for Apnacircle — important information about the nature of community-submitted content.",
  );

  // US visa routes
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

  // CA visa routes
  if (url === "/visa/visitor") return og(
    "Canada Visitor Visa Experiences — Community Stories | Apnacircle",
    "Real Canada visitor visa experiences shared by immigrants. Tips, processing times and approval stories.",
  );
  if (url === "/visa/study-permit") return og(
    "Canada Study Permit Experiences — Community Stories | Apnacircle",
    "Real Canada study permit experiences shared by international students. Tips and approval stories.",
  );
  if (url === "/visa/work-permit") return og(
    "Canada Work Permit Experiences — Community Stories | Apnacircle",
    "Real Canada work permit experiences shared by immigrants. Tips, processing times and approval stories.",
  );
  if (url === "/visa/express-entry") return og(
    "Express Entry Experiences — Community Stories | Apnacircle",
    "Real Express Entry immigration experiences shared by immigrants. Tips, CRS scores and PR approval stories.",
  );
  if (url === "/visa/pnp") return og(
    "Provincial Nominee Program (PNP) Experiences | Apnacircle",
    "Real PNP experiences shared by immigrants across Canadian provinces. Tips and nomination stories.",
  );

  const parts = url.split("/").filter(Boolean);
  if (parts[0] === "states" && parts[1]) {
    const state = SITE_REGIONS.find(s => s.slug === parts[1]);
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
      `Find local immigrant community resources in ${state.name} for Indians, Pakistanis, Koreans, Chinese, Japanese, Sri Lankans, and Mexicans — visa help, immigration lawyers, jobs, accommodation, doctors, events and more.`,
      JSON.stringify({ "@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":BASE},
        {"@type":"ListItem","position":2,"name":state.name,"item":publicUrl(`/states/${state.slug}`)},
      ]}),
    );
  }
  return null;
}

const routes = [...STATIC_ROUTES];
for (const region of SITE_REGIONS) {
  routes.push(`/states/${region.slug}`);
  for (const city of region.cities) routes.push(`/states/${region.slug}/${citySlug(city)}`);
}

// Build SSR bundle
console.log(`Building SSR bundle for ${BASE}...`);
execSync(`vite build --ssr src/entry-server.jsx --outDir ${ssrOut}`, { cwd: root, stdio: "inherit" });

const { render } = await import(pathToFileURL(resolve(ssrOut, "entry-server.js")).href);
const template = readFileSync(resolve(root, "dist/index.html"), "utf-8");

let ok = 0;
for (const url of routes) {
  try {
    const { html } = render(url);
    const meta = metaForRoute(url);
    const canonical = publicUrl(url);

    // Both sites cross-reference each other on the home page so Google understands
    // apnacircle.org targets US users and ca.apnacircle.org targets Canadian users.
    const hreflangTags = meta?.hreflang ? [
      `<link rel="alternate" hreflang="en-us" href="https://apnacircle.org/" />`,
      `<link rel="alternate" hreflang="en-ca" href="https://ca.apnacircle.org/" />`,
      `<link rel="alternate" hreflang="x-default" href="https://apnacircle.org/" />`,
    ] : [];

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
      ...hreflangTags,
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
