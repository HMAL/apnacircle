export default function TermsOfServicePage() {
  return (
    <main style={s.page}>
      <div style={s.container}>
        <h1 style={s.h1}>Terms of Service</h1>
        <p style={s.meta}>Last updated: May 2025</p>

        <Section title="Acceptance of Terms">
          By accessing or using Apnacircle ("we," "our," or "us") at apnacircle.com or
          ca.apnacircle.com, you agree to be bound by these Terms of Service. If you do not
          agree, please do not use the site.
        </Section>

        <Section title="Minimum Age">
          You must be at least 13 years of age to submit content to this site. By submitting
          a listing, visa tip, or any other content, you confirm that you are 13 or older.
        </Section>

        <Section title="User-Submitted Content">
          <p style={s.p}>
            You may submit listings, visa experiences, job posts, and other community content
            ("Submissions"). By submitting content, you grant Apnacircle a non-exclusive,
            royalty-free, worldwide license to display, moderate, and distribute that content
            on the site and in any related communications.
          </p>
          <p style={s.p}>
            You represent that your Submissions are accurate, that you have the right to
            submit them, and that they do not infringe any third-party rights. You remain
            responsible for the accuracy and legality of any contact information, business
            details, or advice you submit.
          </p>
          <p style={s.p}>
            <strong>Public display:</strong> Approved listings — including your name, phone
            number, and other contact details you provide — will be publicly visible on the
            site and may be indexed by search engines.
          </p>
        </Section>

        <Section title="Prohibited Content">
          You may not submit content that:
          <ul style={s.list}>
            <li>Is false, misleading, or fraudulent.</li>
            <li>Infringes any copyright, trademark, or other intellectual property right.</li>
            <li>Contains spam, unsolicited advertising, or affiliate links.</li>
            <li>Is harassing, threatening, defamatory, or discriminatory.</li>
            <li>Violates any applicable law or regulation.</li>
          </ul>
          We reserve the right to remove any Submission at our discretion without notice.
        </Section>

        <Section title="Content Moderation">
          All Submissions are subject to review and approval before publication. We reserve
          the right to edit, reject, or remove any content for any reason, including but not
          limited to violations of these Terms.
        </Section>

        <Section title="Intellectual Property">
          The site design, original text, and compilation of directory content are owned by
          Apnacircle or its licensors and are protected by applicable copyright law. You may
          not reproduce, distribute, or create derivative works from site content without
          express written permission.
        </Section>

        <Section title="DMCA — Copyright Takedown">
          <p style={s.p}>
            If you believe content on this site infringes your copyright, please send a
            written notice to:{" "}
            <a href="mailto:privacy@apnacircle.com" style={s.a}>privacy@apnacircle.com</a>
          </p>
          <p style={s.p}>Your notice must include:</p>
          <ul style={s.list}>
            <li>Your name, address, and contact information.</li>
            <li>A description of the copyrighted work you claim has been infringed.</li>
            <li>A description of the infringing material and its location on the site.</li>
            <li>A statement that you have a good-faith belief the use is not authorized.</li>
            <li>
              A statement, under penalty of perjury, that the information is accurate and
              that you are the copyright owner or authorized to act on the owner's behalf.
            </li>
            <li>Your electronic or physical signature.</li>
          </ul>
          <p style={s.p}>
            We will respond to valid DMCA notices promptly and remove infringing content
            as required by law.
          </p>
        </Section>

        <Section title="Third-Party Links and Services">
          The site may contain links to third-party websites or use third-party services
          (such as Google Analytics). We are not responsible for the content or practices
          of third-party sites. Your use of third-party services is governed by their
          respective terms and privacy policies.
        </Section>

        <Section title="Disclaimer of Warranties">
          The site and its content are provided "as is" without warranty of any kind.
          Information on this site — including immigration guides, financial summaries, and
          community listings — is for general informational purposes only and does not
          constitute legal, financial, or professional advice. Consult a qualified
          professional for advice specific to your situation.
        </Section>

        <Section title="Limitation of Liability">
          To the fullest extent permitted by law, Apnacircle shall not be liable for any
          indirect, incidental, special, or consequential damages arising from your use of
          the site or reliance on any content published on it.
        </Section>

        <Section title="Changes to These Terms">
          We may update these Terms from time to time. Changes will be posted on this page
          with an updated date. Continued use of the site after changes constitutes
          acceptance of the revised Terms.
        </Section>

        <Section title="Governing Law">
          These Terms are governed by the laws of the State of Texas, United States,
          without regard to conflict-of-law principles.
        </Section>

        <Section title="Contact">
          For questions about these Terms, please email{" "}
          <a href="mailto:privacy@apnacircle.com" style={s.a}>privacy@apnacircle.com</a>{" "}
          or use the{" "}
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
  p: { marginTop: 0, marginBottom: "0.75rem" },
  list: { paddingLeft: "1.25rem", margin: "0.5rem 0" },
  a: { color: "#B85C38", fontWeight: 600 },
};
