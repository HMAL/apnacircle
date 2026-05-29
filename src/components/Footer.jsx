import { Link } from "react-router-dom";
import { getCountrySlug } from "../lib/country";

const FLAGS = ["jp","kr","in","cn","mx","ph","lk","bd","pk"];

export default function Footer() {
  const year = new Date().getFullYear();
  const countrySlug = getCountrySlug();

  return (
    <footer style={s.wrap}>
      <div style={s.inner}>

        {/* Brand */}
        <div style={s.brand}>
          <span style={s.brandName}>Apnacircle</span>
          <p style={s.tagline}>Built by immigrants, for immigrants.<br />Free, always. No login, no ads.</p>
          <div style={s.flags}>
            {FLAGS.map(code => (
              <img key={code} src={`https://flagcdn.com/w40/${code}.png`} alt={code} style={s.flag} />
            ))}
          </div>
        </div>

        {/* Community links */}
        <div style={s.col}>
          <p style={s.colTitle}>Community</p>
          <Link to="/visa/h1b" style={s.link}>Visa Experiences</Link>
          <Link to="/immigration" style={s.link}>Immigration Tips</Link>
          <Link to="/events" style={s.link}>Upcoming Events</Link>
          <Link to="/blog" style={s.link}>Guides &amp; Blog</Link>
        </div>

        {/* Resources links */}
        <div style={s.col}>
          <p style={s.colTitle}>Resources</p>
          <Link to="/ds160" style={s.link}>{countrySlug === "ca" ? "IRCC Forms" : "DS-160 Forms"}</Link>
          <Link to="/health" style={s.link}>Health Info</Link>
          <Link to="/lawyers" style={s.link}>Immigration Lawyers</Link>
          <Link to="/" style={s.link}>Find Your City</Link>
        </div>

        {/* About links */}
        <div style={s.col}>
          <p style={s.colTitle}>About</p>
          <Link to="/contact" style={s.link}>Contact Us</Link>
          <Link to="/privacy" style={s.link}>Privacy Policy</Link>
          <Link to="/disclaimer" style={s.link}>Disclaimer</Link>
        </div>

      </div>

      <div style={s.bottom}>
        <span>© {year} Apnacircle · Free community resource</span>
        <div style={s.bottomLinks}>
          <Link to="/privacy" style={s.bottomLink}>Privacy</Link>
          <Link to="/disclaimer" style={s.bottomLink}>Disclaimer</Link>
          <Link to="/contact" style={s.bottomLink}>Contact</Link>
        </div>
      </div>
    </footer>
  );
}

const s = {
  wrap:        { background: "#0F2344", marginTop: "2rem" },
  inner:       { maxWidth: 1100, margin: "0 auto", padding: "3rem 1.5rem 2rem", display: "flex", gap: "2rem 3rem", flexWrap: "wrap", alignItems: "flex-start" },
  brand:       { flex: "1 1 220px", display: "flex", flexDirection: "column", gap: 10 },
  brandName:   { fontSize: 20, fontWeight: 700, color: "#C9973A", letterSpacing: -0.4 },
  tagline:     { fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 },
  flags:       { display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 },
  flag:        { width: 22, height: "auto", borderRadius: 2, opacity: 0.7 },
  col:         { flex: "1 1 130px", display: "flex", flexDirection: "column", gap: 10 },
  colTitle:    { fontSize: 11, fontWeight: 700, color: "#C9973A", textTransform: "uppercase", letterSpacing: 1, margin: 0 },
  link:        { fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none", lineHeight: 1 },
  bottom:      { borderTop: "0.5px solid rgba(255,255,255,0.1)", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.35)" },
  bottomLinks: { display: "flex", gap: 16 },
  bottomLink:  { fontSize: 12, color: "rgba(255,255,255,0.35)", textDecoration: "none" },
};
