import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFoundPage() {
  return (
    <div style={s.outer}>
      <Helmet>
        <title>Page Not Found — Apnacircle</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <span style={s.icon}>🧭</span>
      <h1 style={s.title}>Page not found</h1>
      <p style={s.desc}>
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div style={s.links}>
        <Link to="/" style={s.primary}>← Back to Home</Link>
        <Link to="/lawyers" style={s.secondary}>Immigration Lawyers</Link>
        <Link to="/blog" style={s.secondary}>Guides & Tips</Link>
        <Link to="/events" style={s.secondary}>Community Events</Link>
      </div>
    </div>
  );
}

const s = {
  outer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "80px 24px",
    minHeight: "50vh",
  },
  icon: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 800, margin: "0 0 8px" },
  desc: { color: "#666", fontSize: 15, margin: "0 0 28px" },
  links: { display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" },
  primary: {
    background: "#1a1a1a",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
  },
  secondary: {
    border: "1px solid #ddd",
    color: "#333",
    padding: "10px 20px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
  },
};
