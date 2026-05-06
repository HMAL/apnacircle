import { Link, useLocation } from "react-router-dom";
import { getFormsResource, getVisaStartPath } from "../lib/country";
import { ScrollTabBar } from "./ScrollTabBar";

export function getResourceNavItems() {
  const formsResource = getFormsResource();

  return [
    { key: "events", icon: "\u{1F4C5}", label: "Events", to: "/events", match: path => path === "/events" },
    // { key: "visa", icon: "\u{1F6C2}", label: "Visa Experiences", to: getVisaStartPath(), match: path => path.startsWith("/visa/") },
    { key: "immigration", icon: "\u{1F4A1}", label: "Immigration Tips", to: "/immigration" },
    { key: "forms", icon: "\u{1F4CB}", label: `${formsResource.label} Tips`, to: "/ds160" },
    { key: "lawyers", icon: "\u2696\uFE0F", label: "Immigration Lawyers", to: "/lawyers" },
    // { key: "health", icon: "\u{1F3E5}", label: "Health & Wellness", to: "/health" },
  ].sort((a, b) => a.label.localeCompare(b.label));
}

export default function ResourceNav({ style }) {
  const items = getResourceNavItems();
  const location = useLocation();

  return (
    <aside style={{ ...s.leftNav, ...style }}>
      <p style={s.navLabel}>Resources</p>
      {items.map(item => (
        <ResourceLink
          key={item.key}
          item={item}
          location={location}
          style={s.navLink}
          activeStyle={s.navLinkActive}
        />
      ))}
    </aside>
  );
}

export function MobileResourceNav({ style }) {
  const items = getResourceNavItems();
  const location = useLocation();

  return (
    <ScrollTabBar style={style}>
      {items.map(item => (
        <ResourceLink
          key={item.key}
          item={item}
          location={location}
          style={s.mobileNavItem}
          activeStyle={s.mobileNavItemActive}
        >
          <span style={s.mobileIcon}>{item.icon}</span>
          <span style={s.mobileNavLabel}>{item.label}</span>
        </ResourceLink>
      ))}
    </ScrollTabBar>
  );
}

function ResourceLink({ item, location, style, activeStyle, children }) {
  const active = isActive(item, location);
  const linkStyle = { ...style, ...(active ? activeStyle : {}) };
  const content = children || (
    <>
      <span style={s.icon}>{item.icon}</span>
      <span>{item.label}</span>
    </>
  );

  if (item.hash) {
    const href = location.pathname === "/" ? item.hash : `/${item.hash}`;
    return (
      <Link to={href} style={linkStyle} aria-current={active ? "page" : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <Link to={item.to} style={linkStyle} aria-current={active ? "page" : undefined}>
      {content}
    </Link>
  );
}

function isActive(item, location) {
  if (item.hash) return location.pathname === "/" && location.hash === item.hash;
  if (item.match) return item.match(location.pathname);
  return location.pathname === item.to;
}

const s = {
  leftNav: {
    width: 180,
    flexShrink: 0,
    background: "#fff",
    border: "0.5px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "1rem",
    position: "sticky",
    top: 72,
    alignSelf: "flex-start",
  },
  navLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 10px",
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
    borderRadius: 8,
    marginBottom: 2,
    textDecoration: "none",
  },
  navLinkActive: {
    color: "var(--orange)",
    background: "var(--orange-light)",
  },
  icon: {
    width: 18,
    flexShrink: 0,
    textAlign: "center",
  },
  mobileNavItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
    padding: "6px 12px",
    flexShrink: 0,
    textDecoration: "none",
    color: "#444",
  },
  mobileNavItemActive: {
    color: "var(--orange)",
    background: "var(--orange-light)",
  },
  mobileIcon: {
    fontSize: 16,
    lineHeight: 1,
  },
  mobileNavLabel: {
    fontSize: 10,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
};
