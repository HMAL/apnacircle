import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={s.footer}>
      <div style={s.links}>
        <Link to="/privacy" style={s.link}>Privacy Policy</Link>
        <span style={s.sep}>·</span>
        <Link to="/terms" style={s.link}>Terms of Service</Link>
        <span style={s.sep}>·</span>
        <Link to="/disclaimer" style={s.link}>Disclaimer</Link>
        <span style={s.sep}>·</span>
        <Link to="/contact" style={s.link}>Contact</Link>
      </div>
      <p style={s.copy}>© {year} Apnacircle. All rights reserved.</p>
    </footer>
  );
}

const s = {
  footer: {
    background: "#F4EFE6",
    borderTop: "1px solid #D9D0C3",
    padding: "1.5rem 1rem",
    textAlign: "center",
    marginTop: "auto",
  },
  links: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: "0.5rem",
    flexWrap: "wrap",
  },
  link: { color: "#5C4A32", fontSize: 13, fontWeight: 600 },
  sep: { color: "#A89880", fontSize: 13 },
  copy: { color: "#8A7560", fontSize: 12, margin: 0 },
};
