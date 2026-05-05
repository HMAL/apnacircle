import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const US_STATES = [
  { slug: "alabama",              cities: ["Birmingham","Montgomery","Huntsville","Mobile","Tuscaloosa"] },
  { slug: "alaska",               cities: ["Anchorage","Fairbanks","Juneau"] },
  { slug: "arizona",              cities: ["Phoenix","Tucson","Mesa","Chandler","Scottsdale","Tempe","Gilbert","Glendale"] },
  { slug: "arkansas",             cities: ["Little Rock","Fort Smith","Fayetteville","Springdale","Jonesboro"] },
  { slug: "california",           cities: ["Los Angeles","San Jose","San Francisco","San Diego","Fremont","Sunnyvale","Irvine","Santa Clara","Oakland","Cupertino"] },
  { slug: "colorado",             cities: ["Denver","Aurora","Colorado Springs","Fort Collins","Boulder","Lakewood","Thornton","Arvada"] },
  { slug: "connecticut",          cities: ["Bridgeport","New Haven","Hartford","Stamford","Waterbury","Norwalk","Danbury"] },
  { slug: "delaware",             cities: ["Wilmington","Dover","Newark","Middletown"] },
  { slug: "florida",              cities: ["Jacksonville","Miami","Tampa","Orlando","St. Petersburg","Hialeah","Tallahassee","Fort Lauderdale","Cape Coral","Pembroke Pines","Hollywood","Miramar","Gainesville","Coral Springs","Clearwater"] },
  { slug: "georgia",              cities: ["Atlanta","Columbus","Augusta","Macon","Savannah","Athens","Sandy Springs","Roswell","Alpharetta","Duluth","Johns Creek","Warner Robins"] },
  { slug: "hawaii",               cities: ["Honolulu","Pearl City","Hilo","Kailua","Waipahu","Kaneohe"] },
  { slug: "idaho",                cities: ["Boise","Meridian","Nampa","Idaho Falls","Pocatello","Caldwell"] },
  { slug: "illinois",             cities: ["Chicago","Aurora","Joliet","Rockford","Springfield","Naperville","Peoria","Elgin","Waukegan","Champaign","Schaumburg","Lisle","Lombard"] },
  { slug: "indiana",              cities: ["Indianapolis","Fort Wayne","Evansville","South Bend","Carmel","Fishers","Bloomington","Hammond","Gary","Muncie"] },
  { slug: "iowa",                 cities: ["Des Moines","Cedar Rapids","Davenport","Sioux City","Iowa City","Waterloo","Council Bluffs","Ames"] },
  { slug: "kansas",               cities: ["Wichita","Overland Park","Kansas City","Topeka","Olathe","Lawrence","Shawnee"] },
  { slug: "kentucky",             cities: ["Louisville","Lexington","Bowling Green","Owensboro","Covington","Richmond","Georgetown"] },
  { slug: "louisiana",            cities: ["New Orleans","Baton Rouge","Shreveport","Metairie","Lafayette","Lake Charles","Kenner"] },
  { slug: "maine",                cities: ["Portland","Lewiston","Bangor","South Portland","Auburn"] },
  { slug: "maryland",             cities: ["Baltimore","Columbia","Germantown","Silver Spring","Waldorf","Glen Burnie","Ellicott City","Rockville","Gaithersburg","Bethesda"] },
  { slug: "massachusetts",        cities: ["Boston","Worcester","Springfield","Lowell","Cambridge","New Bedford","Brockton","Quincy","Lynn","Framingham","Somerville","Waltham"] },
  { slug: "michigan",             cities: ["Detroit","Grand Rapids","Warren","Sterling Heights","Ann Arbor","Lansing","Flint","Dearborn","Troy","Westland","Livonia","Farmington Hills","Novi"] },
  { slug: "minnesota",            cities: ["Minneapolis","Saint Paul","Rochester","Duluth","Brooklyn Park","Plymouth","Maple Grove","Woodbury","Eden Prairie","Bloomington","Eagan"] },
  { slug: "mississippi",          cities: ["Jackson","Gulfport","Southaven","Hattiesburg","Biloxi","Meridian"] },
  { slug: "missouri",             cities: ["Kansas City","Saint Louis","Springfield","Columbia","Independence","St. Joseph","St. Charles"] },
  { slug: "montana",              cities: ["Billings","Missoula","Great Falls","Bozeman","Butte","Helena"] },
  { slug: "nebraska",             cities: ["Omaha","Lincoln","Bellevue","Grand Island","Kearney"] },
  { slug: "nevada",               cities: ["Las Vegas","Henderson","Reno","North Las Vegas","Sparks","Carson City"] },
  { slug: "new-hampshire",        cities: ["Manchester","Nashua","Concord","Derry","Dover","Rochester"] },
  { slug: "new-jersey",           cities: ["Newark","Jersey City","Paterson","Elizabeth","Lakewood","Edison","Woodbridge","Toms River","Parsippany","Iselin","Piscataway","South Brunswick"] },
  { slug: "new-mexico",           cities: ["Albuquerque","Las Cruces","Rio Rancho","Santa Fe","Roswell","Farmington"] },
  { slug: "new-york",             cities: ["New York City","Buffalo","Rochester","Yonkers","Syracuse","Albany","New Rochelle","Mount Vernon","Schenectady","Utica"] },
  { slug: "north-carolina",       cities: ["Charlotte","Raleigh","Greensboro","Durham","Winston-Salem","Fayetteville","Cary","Wilmington","High Point","Concord","Gastonia","Morrisville","Apex","Asheville"] },
  { slug: "north-dakota",         cities: ["Fargo","Bismarck","Grand Forks","Minot","West Fargo"] },
  { slug: "ohio",                 cities: ["Columbus","Cleveland","Cincinnati","Toledo","Akron","Dayton","Parma","Canton","Youngstown","Lorain","Hamilton","Springfield"] },
  { slug: "oklahoma",             cities: ["Oklahoma City","Tulsa","Norman","Broken Arrow","Edmond","Lawton","Moore"] },
  { slug: "oregon",               cities: ["Portland","Salem","Eugene","Gresham","Hillsboro","Beaverton","Bend","Medford","Springfield","Corvallis"] },
  { slug: "pennsylvania",         cities: ["Philadelphia","Pittsburgh","Allentown","Erie","Reading","Scranton","Bethlehem","Lancaster","Harrisburg","York"] },
  { slug: "rhode-island",         cities: ["Providence","Cranston","Warwick","Pawtucket","East Providence","Woonsocket"] },
  { slug: "south-carolina",       cities: ["Columbia","Charleston","North Charleston","Mount Pleasant","Rock Hill","Greenville","Summerville","Goose Creek","Spartanburg"] },
  { slug: "south-dakota",         cities: ["Sioux Falls","Rapid City","Aberdeen","Brookings","Watertown"] },
  { slug: "tennessee",            cities: ["Nashville","Memphis","Knoxville","Chattanooga","Clarksville","Murfreesboro","Franklin","Johnson City"] },
  { slug: "texas",                cities: ["Houston","San Antonio","Dallas","Austin","Fort Worth","El Paso","Arlington","Corpus Christi","Plano","Laredo","Lubbock","Irving","Garland","Frisco","McKinney","Carrollton","Denton","Midland","Killeen","Mesquite","Waco","Pasadena","Amarillo","Grand Prairie","Richardson","Lewisville","Sugar Land","Round Rock"] },
  { slug: "utah",                 cities: ["Salt Lake City","West Valley City","Provo","West Jordan","Orem","Sandy","Ogden","St. George","Layton","South Jordan"] },
  { slug: "vermont",              cities: ["Burlington","Essex","South Burlington","Colchester","Rutland"] },
  { slug: "virginia",             cities: ["Virginia Beach","Norfolk","Chesapeake","Arlington","Richmond","Newport News","Alexandria","Hampton","Roanoke","Portsmouth","Suffolk","Herndon","Chantilly","Sterling","Fairfax","Ashburn"] },
  { slug: "washington",           cities: ["Seattle","Spokane","Tacoma","Vancouver","Bellevue","Kent","Everett","Renton","Yakima","Kirkland","Bellingham","Redmond","Bothell","Federal Way","Sammamish"] },
  { slug: "west-virginia",        cities: ["Charleston","Huntington","Morgantown","Parkersburg","Wheeling"] },
  { slug: "wisconsin",            cities: ["Milwaukee","Madison","Green Bay","Kenosha","Racine","Appleton","Waukesha","Oshkosh","Eau Claire","Janesville"] },
  { slug: "wyoming",              cities: ["Cheyenne","Casper","Laramie","Gillette","Rock Springs"] },
];

const CA_PROVINCES = [
  { slug: "ontario",               cities: ["Toronto","Ottawa","Mississauga","Brampton","Hamilton","London","Markham","Vaughan","Kitchener","Windsor","Richmond Hill","Oakville","Burlington","Oshawa","Barrie"] },
  { slug: "british-columbia",      cities: ["Vancouver","Surrey","Burnaby","Richmond","Kelowna","Abbotsford","Victoria","Coquitlam","Langley","Delta","Nanaimo","Kamloops"] },
  { slug: "alberta",               cities: ["Calgary","Edmonton","Red Deer","Lethbridge","St. Albert","Medicine Hat","Grande Prairie","Airdrie","Spruce Grove","Leduc"] },
  { slug: "quebec",                cities: ["Montreal","Quebec City","Laval","Gatineau","Longueuil","Sherbrooke","Saguenay","Levis","Trois-Rivieres","Terrebonne"] },
  { slug: "manitoba",              cities: ["Winnipeg","Brandon","Steinbach","Thompson","Portage la Prairie","Winkler"] },
  { slug: "saskatchewan",          cities: ["Saskatoon","Regina","Prince Albert","Moose Jaw","Swift Current","Yorkton"] },
  { slug: "nova-scotia",           cities: ["Halifax","Cape Breton","Truro","New Glasgow","Glace Bay","Dartmouth"] },
  { slug: "new-brunswick",         cities: ["Moncton","Saint John","Fredericton","Dieppe","Miramichi","Riverview"] },
  { slug: "newfoundland",          cities: ["St. John's","Corner Brook","Grand Falls-Windsor","Gander","Paradise"] },
  { slug: "prince-edward-island",  cities: ["Charlottetown","Summerside","Stratford","Cornwall"] },
];

const citySlug = name => name.toLowerCase().replace(/\s+/g, "-");
const today = new Date().toISOString().split("T")[0];

function buildUrls(base, staticPages, regions) {
  const publicUrl = path => `${base}${path === "/" ? "/" : `${path}/`}`;
  const urls = [];

  for (const { url, priority, changefreq } of staticPages) {
    urls.push(`  <url>
    <loc>${publicUrl(url)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
  }

  for (const region of regions) {
    urls.push(`  <url>
    <loc>${publicUrl(`/states/${region.slug}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);

    for (const city of region.cities) {
      urls.push(`  <url>
    <loc>${publicUrl(`/states/${region.slug}/${citySlug(city)}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);
    }
  }

  return urls;
}

function toXml(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

// ── US sitemap ────────────────────────────────────────────────────────────────
const US_STATIC = [
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

const usUrls = buildUrls("https://apnacircle.org", US_STATIC, US_STATES);
const usOut = resolve(__dirname, "../public/sitemap.xml");
writeFileSync(usOut, toXml(usUrls), "utf-8");
console.log(`US sitemap written — ${usUrls.length} URLs → public/sitemap.xml`);

// ── Canada sitemap ────────────────────────────────────────────────────────────
const CA_STATIC = [
  { url: "/",            priority: "1.0", changefreq: "daily" },
  { url: "/visa/visitor",       priority: "0.8", changefreq: "weekly" },
  { url: "/visa/study-permit",  priority: "0.8", changefreq: "weekly" },
  { url: "/visa/work-permit",   priority: "0.7", changefreq: "weekly" },
  { url: "/visa/express-entry", priority: "0.8", changefreq: "weekly" },
  { url: "/visa/pnp",           priority: "0.7", changefreq: "weekly" },
  { url: "/immigration", priority: "0.8", changefreq: "weekly" },
  { url: "/ds160",       priority: "0.7", changefreq: "weekly" },
  { url: "/health",      priority: "0.7", changefreq: "weekly" },
  { url: "/lawyers",     priority: "0.8", changefreq: "weekly" },
  { url: "/contact",     priority: "0.4", changefreq: "monthly" },
];

const caUrls = buildUrls("https://ca.apnacircle.org", CA_STATIC, CA_PROVINCES);
const caOut = resolve(__dirname, "../public/sitemap-ca.xml");
writeFileSync(caOut, toXml(caUrls), "utf-8");
console.log(`CA sitemap written  — ${caUrls.length} URLs → public/sitemap-ca.xml`);
