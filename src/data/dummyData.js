// Dummy data for development — shown by default until real submissions come in
// Keyed by stateSlug-citySlug

const ALBANY = "new-york-albany";
const DALLAS = "texas-dallas";
const SF     = "california-san-francisco";

export const DUMMY_LAWYERS = {
  [ALBANY]: [
    { id: "d1", firmName: "Patel & Associates Immigration Law", phone: "+1 (518) 555-0101", address: "123 State St, Albany, NY 12207", website: "https://example.com", notes: "Specializes in H1B, EB-2 NIW. Very responsive, flat fee billing. Hindi & Gujarati speaking staff.", approved: true },
    { id: "d2", firmName: "Singh Law Group",                    phone: "+1 (518) 555-0202", address: "456 Central Ave, Albany, NY 12206", website: "", notes: "Handles family-based GC and naturalization. Punjabi speaking. Free initial consultation.", approved: true },
    { id: "d3", firmName: "Capital Region Immigration LLC",     phone: "+1 (518) 555-0303", address: "789 Washington Ave, Albany, NY 12203", website: "https://example.com", notes: "L1, O1 visa specialists. Reasonable fees, good with RFE responses.", approved: true },
  ],
  [DALLAS]: [
    { id: "d4", firmName: "Sharma Immigration Services",       phone: "+1 (972) 555-0401", address: "1001 Main St, Dallas, TX 75201", website: "https://example.com", notes: "H1B transfers, GC processing. Telugu & Hindi speaking. Highly recommended.", approved: true },
  ],
};

export const DUMMY_REALTORS = {
  [ALBANY]: [
    { id: "r1", name: "Priya Mehta",   phone: "+1 (518) 555-1101", agency: "Coldwell Banker",   email: "priya@example.com", notes: "Helped many Indian families find homes near good school districts. Speaks Hindi.", approved: true },
    { id: "r2", name: "James Chen",    phone: "+1 (518) 555-1202", agency: "RE/MAX",             email: "james@example.com", notes: "Familiar with immigrant buyer process. Patient, explains everything clearly.", approved: true },
    { id: "r3", name: "Fatima Hassan", phone: "+1 (518) 555-1303", agency: "Keller Williams",   email: "fatima@example.com", notes: "Specializes in first-time buyers. Arabic & Urdu speaking. Knows halal mortgage options.", approved: true },
  ],
  [DALLAS]: [
    { id: "r4", name: "Raj Kapoor",    phone: "+1 (972) 555-1401", agency: "Compass Realty",    email: "raj@example.com",  notes: "Great for South Asian families. Knows Frisco, Plano, Irving areas well.", approved: true },
  ],
};

export const DUMMY_TEMPLES = {
  [ALBANY]: [
    { id: "t1", placeName: "Albany Hindu Temple",         type: "Hindu Temple", address: "15 Elm St, Albany, NY 12204",     phone: "+1 (518) 555-2101", website: "", notes: "Ganesh, Shiva, Vishnu sanctums. Saturday evening aarti. Telugu & Hindi programs.", approved: true },
    { id: "t2", placeName: "Islamic Center of Albany",    type: "Mosque",       address: "300 Western Ave, Albany, NY 12203", phone: "+1 (518) 555-2202", website: "https://example.com", notes: "Friday Jummah 1:15 PM. Urdu & Arabic khutbah. Community iftar during Ramadan.", approved: true },
    { id: "t3", placeName: "Sikh Cultural Center Albany", type: "Sikh Gurdwara",address: "50 Park Ave, Albany, NY 12206",  phone: "+1 (518) 555-2303", website: "", notes: "Langar every Sunday. Punjabi school for kids. All are welcome.", approved: true },
  ],
  [DALLAS]: [
    { id: "t4", placeName: "DFW Hindu Temple",            type: "Hindu Temple", address: "1445 W Campbell Rd, Richardson, TX 75080", phone: "+1 (972) 555-2401", website: "https://example.com", notes: "Large temple with multiple deities. Classical dance school. Tamil & Telugu events.", approved: true },
  ],
};

export const DUMMY_PRIESTS = {
  [ALBANY]: [
    { id: "p1", name: "Pandit Ramesh Sharma",  phone: "+1 (518) 555-3101", services: "Weddings, Griha Pravesh, Satyanarayan Puja, Last Rites", notes: "Available on weekends. Vedic rituals in Sanskrit. 20+ years experience.", approved: true },
    { id: "p2", name: "Maulana Khalid Ahmed",  phone: "+1 (518) 555-3202", services: "Nikah, Janazah, Quran recitation, Islamic counseling",      notes: "Serves Albany and surrounding areas. Arabic & Urdu. Call ahead for availability.", approved: true },
    { id: "p3", name: "Pandit Suresh Iyer",    phone: "+1 (518) 555-3303", services: "South Indian rituals, Naming ceremony, Upanayanam",         notes: "Tamil Brahmin priest. Specializes in Iyer/Iyengar traditions.", approved: true },
  ],
  [DALLAS]: [
    { id: "p4", name: "Pandit Venkat Rao",     phone: "+1 (972) 555-3401", services: "Telugu rituals, Weddings, Vastu Puja",                      notes: "Telugu priest serving DFW area. Very experienced with traditional ceremonies.", approved: true },
  ],
};

export const DUMMY_PHOTOGRAPHERS = {
  [ALBANY]: [
    { id: "ph1", name: "Arjun Nair Photography",   phone: "+1 (518) 555-4101", website: "https://example.com", notes: "Specializes in Indian weddings, engagements, mehendi. Packages starting $800.", approved: true },
    { id: "ph2", name: "Zara Studios",             phone: "+1 (518) 555-4202", website: "https://example.com", notes: "South Asian weddings & Quinceaneras. Drone photography available. Bilingual team.", approved: true },
    { id: "ph3", name: "Lens & Culture Photography",phone: "+1 (518) 555-4303", website: "https://example.com", notes: "Cultural events, family portraits, citizenship ceremonies. Flexible pricing.", approved: true },
  ],
  [DALLAS]: [
    { id: "ph4", name: "DFW Desi Photography",     phone: "+1 (972) 555-4401", website: "https://example.com", notes: "Known for Bollywood-style wedding shoots. Instagram: @dfwdesiphoto.", approved: true },
  ],
};

export function getDummyData(type, stateSlug, citySlug) {
  const key = `${stateSlug}-${citySlug}`;
  const maps = { lawyers: DUMMY_LAWYERS, realtors: DUMMY_REALTORS, temples: DUMMY_TEMPLES, priests: DUMMY_PRIESTS, photographers: DUMMY_PHOTOGRAPHERS };
  return (maps[type] && maps[type][key]) || [];
}
