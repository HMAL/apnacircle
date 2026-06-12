import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ResourceNav from "../../components/ResourceNav";
import { useIsMobile } from "../../lib/useIsMobile";
import { getCountrySlug } from "../../lib/country";
import { BLOGS, BLOG_CATEGORIES, getBlogBySlug, getBlogsByCategory, getCategoryMeta } from "../../data/blogs";

// ─── Blog Hub ─────────────────────────────────────────────────────────────────

export default function BlogHubPage() {
  const [activeCategory, setActiveCategory] = useState(null);
  const isMobile = useIsMobile();
  const isCA = getCountrySlug() === "ca";
  const siteBase = isCA ? "https://ca.apnacircle.org" : "https://apnacircle.org";
  const visible = getBlogsByCategory(activeCategory);

  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>Guides & Tips for Immigrants — Apnacircle</title>
        <meta name="description" content="Honest guides for immigrants — what to avoid, what nobody tells you, and the mistakes that cost the most. Immigration, family, and finance topics." />
        <link rel="canonical" href={`${siteBase}/blog/`} />
        <meta property="og:title" content="Guides & Tips for Immigrants | Apnacircle" />
        <meta property="og:description" content="Honest guides for immigrants — immigration mistakes, family tips, and financial pitfalls." />
        <meta property="og:url" content={`${siteBase}/blog/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {!isMobile && <ResourceNav />}

      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>

        <div style={s.hubHero}>
          <span style={{ fontSize: 40 }}>📖</span>
          <div>
            <h1 style={s.heroTitle}>Guides & Tips</h1>
            <p style={s.heroDesc}>
              Honest, no-fluff guides for immigrants — what to avoid, what nobody tells you,
              and the mistakes that cost the most. Immigration, family, and finance.
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div style={s.catRow}>
          <button
            style={{ ...s.catBtn, ...(activeCategory === null ? s.catBtnActive : {}) }}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {BLOG_CATEGORIES.map(c => (
            <button
              key={c.slug}
              style={{ ...s.catBtn, ...(activeCategory === c.slug ? s.catBtnActive : {}) }}
              onClick={() => setActiveCategory(c.slug)}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Post list */}
        <div style={s.postList}>
          {visible.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Blog Post Page ───────────────────────────────────────────────────────────

export function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogBySlug(slug);
  const isMobile = useIsMobile();
  const isCA = getCountrySlug() === "ca";
  const siteBase = isCA ? "https://ca.apnacircle.org" : "https://apnacircle.org";

  if (!post) {
    return (
      <div style={s.outer}>
        {!isMobile && <ResourceNav />}
        <div style={s.content}>
          <Link to="/blog" style={s.back}>← Guides</Link>
          <p style={{ color: "#999", fontSize: 14, marginTop: 32 }}>Post not found.</p>
        </div>
      </div>
    );
  }

  const catMeta = getCategoryMeta(post.category);
  const related = BLOGS.filter(b => b.category === post.category && b.slug !== post.slug).slice(0, 3);

  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>{post.title} — Apnacircle</title>
        <meta name="description" content={post.metaDesc} />
        <link rel="canonical" href={`${siteBase}/blog/${post.slug}/`} />
        <meta property="og:title" content={`${post.title} | Apnacircle`} />
        <meta property="og:description" content={post.metaDesc} />
        <meta property="og:url" content={`${siteBase}/blog/${post.slug}/`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.metaDesc,
          "datePublished": post.date,
          "publisher": { "@type": "Organization", "name": "Apnacircle", "url": siteBase },
          "url": `${siteBase}/blog/${post.slug}/`,
        })}</script>
      </Helmet>

      {!isMobile && <ResourceNav />}

      <article style={s.content}>
        <Link to="/blog" style={s.back}>← Guides</Link>

        {/* Header */}
        <div style={s.postHeader}>
          <div style={s.postMeta}>
            <span style={{ ...s.catChip, background: catMeta?.color, color: catMeta?.textColor, border: catMeta?.border }}>
              {catMeta?.icon} {catMeta?.label}
            </span>
            <span style={s.postDate}>{post.date}</span>
            <span style={s.readTime}>{post.readMin} min read</span>
          </div>
          <h1 style={s.postTitle}>{post.title}</h1>
          <p style={s.postIntro}>{post.intro}</p>
        </div>

        {/* Sections */}
        <div style={s.sections}>
          {post.sections.map((sec, i) => (
            <div key={i} style={s.section}>
              {sec.heading && <h2 style={s.secHeading}>{sec.heading}</h2>}
              {sec.text && <p style={s.secText}>{sec.text}</p>}
              {sec.items && (
                <ul style={s.secList}>
                  {sec.items.map((item, j) => <li key={j} style={s.secListItem}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}

          {/* Callout */}
          {post.callout && (
            <div style={post.callout.type === "warning" ? s.warningBox : s.tipBox}>
              <span style={s.calloutIcon}>{post.callout.type === "warning" ? "⚠️" : "💡"}</span>
              <p style={s.calloutText}>{post.callout.text}</p>
            </div>
          )}
        </div>

        {/* Related resource link */}
        {post.relatedTo && (
          <div style={s.resourceLink}>
            <Link to={post.relatedTo} style={s.resourceLinkAnchor}>
              Explore our {post.relatedTo.replace("/", "")} resources on Apnacircle →
            </Link>
          </div>
        )}

        {/* Related posts */}
        {related.length > 0 && (
          <div style={s.relatedSection}>
            <p style={s.relatedLabel}>More {catMeta?.label} Guides</p>
            <div style={s.relatedGrid}>
              {related.map(r => (
                <Link key={r.slug} to={`/blog/${r.slug}`} style={s.relatedCard}>
                  <span style={s.relatedTitle}>{r.title}</span>
                  <span style={s.relatedArrow}>→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

// ─── Blog Card (used in hub) ──────────────────────────────────────────────────

function BlogCard({ post }) {
  const catMeta = getCategoryMeta(post.category);
  return (
    <Link to={`/blog/${post.slug}`} style={s.card}>
      <div style={s.cardTop}>
        <span style={{ ...s.catChip, background: catMeta?.color, color: catMeta?.textColor, border: catMeta?.border }}>
          {catMeta?.icon} {catMeta?.label}
        </span>
        <span style={s.cardDate}>{post.date} · {post.readMin} min</span>
      </div>
      <h2 style={s.cardTitle}>{post.title}</h2>
      <p style={s.cardExcerpt}>{post.intro.slice(0, 120)}…</p>
      <span style={s.cardRead}>Read →</span>
    </Link>
  );
}

// ─── Rail Tile (used in HomePage right rail) ─────────────────────────────────

export function BlogRailTile({ post }) {
  const catMeta = getCategoryMeta(post.category);
  return (
    <Link to={`/blog/${post.slug}`} style={s.railTile}>
      <span style={{ ...s.railChip, background: catMeta?.color, color: catMeta?.textColor, border: catMeta?.border }}>
        {catMeta?.icon} {catMeta?.label}
      </span>
      <p style={s.railTitle}>{post.title}</p>
      <span style={s.railRead}>Read →</span>
    </Link>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  outer:   { padding: "1.5rem 1.5rem 3rem", display: "flex", gap: 24, alignItems: "flex-start" },
  content: { flex: 1, minWidth: 0 },
  back:    { color: "var(--orange)", fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 16, textDecoration: "none" },

  // Hub
  hubHero:  { display: "flex", gap: 20, alignItems: "center", background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.75rem", marginBottom: 20, flexWrap: "wrap" },
  heroTitle:{ fontSize: 26, fontWeight: 800, color: "#111", marginBottom: 6 },
  heroDesc: { fontSize: 14, color: "#555", lineHeight: 1.6, margin: 0 },

  catRow:    { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  catBtn:    { padding: "7px 14px", fontSize: 13, fontWeight: 600, background: "#fff", border: "0.5px solid var(--border)", borderRadius: 20, cursor: "pointer", color: "#444" },
  catBtnActive: { background: "var(--orange)", color: "#fff", border: "0.5px solid var(--orange)" },

  postList: { display: "flex", flexDirection: "column", gap: 12 },

  // Card
  card:        { display: "block", background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem 1.5rem", textDecoration: "none", color: "#111" },
  cardTop:     { display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" },
  catChip:     { fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20 },
  cardDate:    { fontSize: 12, color: "#999", fontWeight: 600 },
  cardTitle:   { fontSize: 16, fontWeight: 800, color: "#111", marginBottom: 8, lineHeight: 1.4 },
  cardExcerpt: { fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 10 },
  cardRead:    { fontSize: 13, fontWeight: 700, color: "var(--orange)" },

  // Post
  postHeader:  { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.75rem", marginBottom: 20 },
  postMeta:    { display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" },
  postDate:    { fontSize: 12, color: "#999", fontWeight: 600 },
  readTime:    { fontSize: 12, color: "#bbb", fontWeight: 600 },
  postTitle:   { fontSize: 28, fontWeight: 800, color: "#111", lineHeight: 1.25, marginBottom: 16 },
  postIntro:   { fontSize: 15, color: "#444", lineHeight: 1.75, margin: 0, borderLeft: "3px solid var(--orange)", paddingLeft: 16 },

  sections:    { display: "flex", flexDirection: "column", gap: 0 },
  section:     { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.25rem 1.5rem", marginBottom: 12 },
  secHeading:  { fontSize: 17, fontWeight: 800, color: "#111", marginBottom: 10, lineHeight: 1.3 },
  secText:     { fontSize: 14, color: "#444", lineHeight: 1.8, margin: 0 },
  secList:     { paddingLeft: 20, margin: 0, display: "flex", flexDirection: "column", gap: 8 },
  secListItem: { fontSize: 14, color: "#444", lineHeight: 1.7 },

  tipBox:     { display: "flex", gap: 14, alignItems: "flex-start", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: "var(--radius)", padding: "1rem 1.25rem", marginBottom: 12 },
  warningBox: { display: "flex", gap: 14, alignItems: "flex-start", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--radius)", padding: "1rem 1.25rem", marginBottom: 12 },
  calloutIcon: { fontSize: 20, flexShrink: 0, marginTop: 2 },
  calloutText: { fontSize: 14, color: "#444", lineHeight: 1.75, margin: 0 },

  resourceLink:       { marginBottom: 24 },
  resourceLinkAnchor: { fontSize: 13, fontWeight: 700, color: "var(--orange)", textDecoration: "none" },

  relatedSection: { marginTop: 8 },
  relatedLabel:   { fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 },
  relatedGrid:    { display: "flex", flexDirection: "column", gap: 8 },
  relatedCard:    { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 16px", textDecoration: "none", color: "#111" },
  relatedTitle:   { fontSize: 13, fontWeight: 700, color: "#333", lineHeight: 1.4, flex: 1, marginRight: 12 },
  relatedArrow:   { fontSize: 16, color: "#bbb", flexShrink: 0 },

  // Rail tile
  railTile:  { display: "block", background: "#fff", border: "0.5px solid var(--border)", borderRadius: 10, padding: "12px 14px", textDecoration: "none", color: "#111" },
  railChip:  { fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, display: "inline-block", marginBottom: 8 },
  railTitle: { fontSize: 13, fontWeight: 700, color: "#222", lineHeight: 1.4, margin: "0 0 8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  railRead:  { fontSize: 12, fontWeight: 700, color: "var(--orange)" },
};
