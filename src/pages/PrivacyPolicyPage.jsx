export default function PrivacyPolicyPage() {
  return (
    <main style={s.page}>
      <div style={s.container}>
        <h1 style={s.h1}>Privacy Policy</h1>
        <p style={s.meta}>Last updated: May 2025</p>

        <Section title="Overview">
          Apnacircle ("we," "our," or "us") operates apnacircle.com, a community directory
          connecting immigrant communities across the US and Canada with local resources. This
          Privacy Policy explains how we collect, use, and protect information when you use our
          website.
        </Section>

        <Section title="Information We Collect">
          <ul style={s.list}>
            <li><strong>Submitted listings:</strong> When you submit a business or service listing
              (name, phone, email, website, description), we store that information in our database
              to display publicly on the site.</li>
            <li><strong>Contact form:</strong> Messages you send via our Contact page are stored so
              we can respond to you.</li>
            <li><strong>Usage data:</strong> We use Google Analytics to collect anonymized data
              about how visitors interact with our site (pages visited, general location, device
              type). This data does not identify you personally.</li>
            <li><strong>Cookies:</strong> Google Analytics sets cookies to distinguish users and
              sessions. We do not set any additional tracking cookies.</li>
          </ul>
        </Section>

        <Section title="How We Use Your Information">
          <ul style={s.list}>
            <li>To display community listings in the directory.</li>
            <li>To respond to your inquiries and contact form messages.</li>
            <li>To moderate and approve submitted listings before publication.</li>
            <li>To understand how our site is used and improve it.</li>
          </ul>
        </Section>

        <Section title="Sharing of Information">
          We do not sell, rent, or trade your personal information. Listing information you
          submit is displayed publicly on the site as intended. We use Google Analytics (Google
          LLC) as a third-party analytics provider; their privacy policy governs how they handle
          data collected through their service.
        </Section>

        <Section title="Data Retention">
          Listing and contact form data is retained as long as it remains relevant to the
          directory. You may request removal of your information by contacting us at the email
          on our Contact page.
        </Section>

        <Section title="Your Rights">
          You may request access to, correction of, or deletion of personal information you
          have submitted to us. To do so, please contact us through the Contact page.
        </Section>

        <Section title="Children's Privacy">
          Our site is not directed to children under 13. We do not knowingly collect personal
          information from children.
        </Section>

        <Section title="Changes to This Policy">
          We may update this policy from time to time. Changes will be posted on this page with
          an updated date. Continued use of the site after changes constitutes acceptance of
          the revised policy.
        </Section>

        <Section title="Contact Us">
          For privacy-related questions, please use the{" "}
          <a href="/contact" style={s.a}>Contact page</a>.
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: "1.75rem" }}>
      <h2 style={s.h2}>{title}</h2>
      <div style={s.body}>{children}</div>
    </section>
  );
}

const s = {
  page: { background: "#FDFAF5", minHeight: "80vh", padding: "2rem 1rem" },
  container: { maxWidth: 720, margin: "0 auto" },
  h1: { color: "#3A2718", fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.25rem" },
  h2: { color: "#5C4A32", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" },
  meta: { color: "#8A7560", fontSize: 13, marginBottom: "2rem" },
  body: { color: "#3A2718", fontSize: 15, lineHeight: 1.7 },
  list: { paddingLeft: "1.25rem", margin: "0.5rem 0" },
  a: { color: "#B85C38", fontWeight: 600 },
};
