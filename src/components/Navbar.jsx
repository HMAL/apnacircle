import { Link } from "react-router-dom";
import { useIsMobile } from "../lib/useIsMobile";
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
  const isMobile = useIsMobile();
  const formsResource = getFormsResource();
  const visaStartPath = getVisaStartPath();
  const navLinks = [
    { to: visaStartPath, label: "Visa Experiences" },
    { to: "/immigration", label: "Immigration Tips" },
    { to: "/ds160", label: formsResource.label },
  ];

  return (
    <header>
      <nav style={s.nav}>
        <Link to="/" style={s.brand}>Apnacircle</Link>

        {!isMobile && (
          <div style={s.flags}>
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
        )}

        <div style={s.links}>
          {!isMobile && (
            <>
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} style={s.link}>{link.label}</Link>
              ))}
              <Link to="/contact" style={s.link}>Contact</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

const s = {
  nav: {
    background: "#F4EFE6",
    borderBottom: "1px solid #D9D0C3",
    padding: "0 1rem",
    height: 56,
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 100,
  },
  brand: { color: "#3A2718", fontWeight: 800, fontSize: 20, letterSpacing: -0.3, flexShrink: 0 },
  flags: { display: "flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "center" },
  flagImg: { width: 28, height: "auto", borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.25)" },
  links: { display: "flex", gap: 16, alignItems: "center", flexShrink: 0 },
  link: { color: "#5C4A32", fontSize: 13, fontWeight: 600 },
};
