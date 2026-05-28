import { useState } from "react";
import { Link } from "react-router-dom";
import { getFormsResource, getVisaStartPath } from "../lib/country";

const FLAGS = [
  { code: "jp", label: "Japan" },
  { code: "kr", label: "Korea" },
  { code: "in", label: "India" },
  { code: "cn", label: "China" },
  { code: "mx", label: "Mexico" },
  { code: "ph", label: "Philippines" },
  { code: "lk", label: "Sri Lanka" },
  { code: "bd", label: "Bangladesh" },
  { code: "pk", label: "Pakistan" },
];

export default function Navbar() {
  const formsResource = getFormsResource();
  const visaStartPath = getVisaStartPath();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: visaStartPath, label: "Visa Experiences" },
    { to: "/immigration", label: "Immigration Tips" },
    { to: "/ds160", label: formsResource.label },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header>
      <nav style={s.nav}>
        <Link to="/" style={s.brand} translate="no">
          <img src="/favicon.svg" alt="" style={s.brandLogo} />
          Apnacircle
        </Link>

        <div className="nav-flags" style={s.flags}>
          {FLAGS.map(({ code, label }) => (
            <img
              key={code}
              src={`https://flagcdn.com/w40/${code}.png`}
              alt={label}
              title={label}
              style={s.flagImg}
            />
          ))}
        </div>

        <div className="nav-links-desktop" style={s.links}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} style={s.link}>{link.label}</Link>
          ))}
        </div>

        <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks.map(link => (
          <Link key={link.to} to={link.to} style={s.mobileLink} onClick={() => setMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}

const s = {
  nav: {
    background: "#FFFFFF",
    borderBottom: "1px solid #D8EDE7",
    padding: "0 1rem",
    height: 56,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 100,
  },
  brand: { color: "#B84E00", fontWeight: 700, fontSize: 20, letterSpacing: -0.5, flexShrink: 0, display: "flex", alignItems: "center", gap: 8, textDecoration: "none" },
  brandLogo: { width: 28, height: 28, flexShrink: 0 },
  flags: { display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "center" },
  flagImg: { width: 26, height: "auto", borderRadius: 3, opacity: 0.88 },
  links: { display: "flex", gap: 20, alignItems: "center", flexShrink: 0 },
  link: { color: "#4A3728", fontSize: 13, fontWeight: 600, letterSpacing: 0.1 },
  mobileLink: { color: "#4A3728", fontSize: 15, fontWeight: 600, padding: "0.6rem 0", borderBottom: "0.5px solid #E0D4C5", textDecoration: "none" },
};
