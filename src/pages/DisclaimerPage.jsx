export default function DisclaimerPage() {
  return (
    <main style={s.page}>
      <div style={s.container}>
        <h1 style={s.h1}>Disclaimer</h1>
        <p style={s.meta}>Last updated: May 2025</p>

        <Section title="General Information Only">
          Apnacircle is a community directory intended to help immigrant communities find local
          resources. The listings, articles, and content on this site are provided for general
          informational purposes only and do not constitute professional advice of any kind,
          including legal, medical, financial, or immigration advice.
        </Section>

        <Section title="No Endorsement">
          Listing a business, individual, or organization on Apnacircle does not constitute an
          endorsement, recommendation, or guarantee of their services. We do not verify the
          credentials, licenses, or qualifications of listed providers. Users are responsible
          for conducting their own due diligence before engaging any service provider.
        </Section>

        <Section title="Accuracy of Listings">
          We make reasonable efforts to review submitted listings, but we cannot guarantee that
          all information is accurate, complete, or current. Contact details, business hours,
          and services offered may change without notice. Always verify information directly
          with the service provider.
        </Section>

        <Section title="Third-Party Links">
          Our site may include links to third-party websites. We have no control over the
          content, privacy practices, or accuracy of those sites and accept no responsibility
          for them. Links do not imply any affiliation or endorsement.
        </Section>

        <Section title="Immigration & Legal Information">
          Any immigration-related tips or visa information on this site are community
          experiences shared for informational purposes only. They are not legal advice. Always
          consult a licensed immigration attorney or accredited representative for guidance
          specific to your situation.
        </Section>

        <Section title="Limitation of Liability">
          To the fullest extent permitted by law, Apnacircle and its operators shall not be
          liable for any direct, indirect, incidental, or consequential damages arising from
          your use of, or inability to use, this site or any information obtained from it,
          including damages resulting from reliance on any listed service provider.
        </Section>

        <Section title="Copyright">
          © {new Date().getFullYear()} Apnacircle. All original content on this site —
          including text, graphics, and design — is the property of Apnacircle and may not be
          reproduced without permission. User-submitted listing content remains the
          responsibility of the submitter.
        </Section>

        <Section title="Questions">
          If you have questions about this disclaimer, please reach out via the{" "}
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
  a: { color: "#B85C38", fontWeight: 600 },
};
