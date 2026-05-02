// ── ADD NEW STATES / CITIES HERE ──────────────────────────────
export const STATES = [
  { name: "New York",       abbr: "NY", slug: "new-york",       icon: "🗽",
    cities: ["Albany","New York City","Buffalo","Syracuse","Rochester","Yonkers"] },
  { name: "Texas",          abbr: "TX", slug: "texas",           icon: "⭐",
    cities: ["Dallas","Houston","Austin","San Antonio","Fort Worth","Plano","Irving"] },
  { name: "California",     abbr: "CA", slug: "california",      icon: "🌴",
    cities: ["San Francisco","Los Angeles","San Jose","San Diego","Fremont","Sunnyvale","Irvine"] },
  { name: "Georgia",        abbr: "GA", slug: "georgia",         icon: "🍑",
    cities: ["Atlanta","Savannah","Augusta","Columbus","Alpharetta","Duluth"] },
  { name: "North Carolina", abbr: "NC", slug: "north-carolina",  icon: "🏙️",
    cities: ["Charlotte","Raleigh","Durham","Greensboro","Cary","Morrisville"] },
  { name: "New Jersey",     abbr: "NJ", slug: "new-jersey",      icon: "🌆",
    cities: ["Newark","Jersey City","Edison","Edison","Parsippany","Iselin","Piscataway"] },
  { name: "Illinois",       abbr: "IL", slug: "illinois",        icon: "🌃",
    cities: ["Chicago","Naperville","Schaumburg","Lisle","Aurora","Lombard"] },
  { name: "Florida",        abbr: "FL", slug: "florida",         icon: "🌞",
    cities: ["Miami","Orlando","Tampa","Jacksonville","Clearwater","Gainesville"] },
  { name: "Virginia",       abbr: "VA", slug: "virginia",        icon: "🏛️",
    cities: ["Arlington","Fairfax","Richmond","Herndon","Chantilly","Sterling"] },
  { name: "Washington",     abbr: "WA", slug: "washington",      icon: "🌲",
    cities: ["Seattle","Bellevue","Redmond","Kirkland","Bothell","Renton"] },
];

export function getState(slug) {
  return STATES.find(s => s.slug === slug);
}

export function citySlug(cityName) {
  return cityName.toLowerCase().replace(/\s+/g, "-");
}

export function cityFromSlug(state, slug) {
  if (!state) return null;
  return state.cities.find(c => citySlug(c) === slug);
}
