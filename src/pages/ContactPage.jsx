import { useState } from "react";
import { Link } from "react-router-dom";
import { f, Toast, useToast } from "../components/formHelpers";
import { submitContactMessage } from "../lib/db";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const { msg, show } = useToast();

  const set = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const submit = async e => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      show("Please fill in your name, email, and message.");
      return;
    }

    setSending(true);
    const ok = await submitContactMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setSending(false);

    if (!ok) {
      show("Message could not be sent. Please try again.");
      return;
    }

    setForm({ name: "", email: "", message: "" });
    show("Thanks. Your message has been sent.");
  };

  return (
    <main style={s.page}>
      <Link to="/" style={s.back}>Back to home</Link>
      <section style={s.panel}>
        <h1 style={s.title}>Contact Us</h1>
        <p style={s.copy}>Send a note to the Apnacircle team. We will review it from the admin dashboard.</p>

        <form onSubmit={submit}>
          <div style={f.grid2}>
            <div style={f.group}>
              <label style={f.label}>Name <span style={f.req}>*</span></label>
              <input style={f.input} value={form.name} onChange={set("name")} placeholder="Your name" />
            </div>
            <div style={f.group}>
              <label style={f.label}>Email <span style={f.req}>*</span></label>
              <input style={f.input} type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
            </div>
            <div style={{ ...f.group, ...f.span2 }}>
              <label style={f.label}>Message <span style={f.req}>*</span></label>
              <textarea style={{ ...f.textarea, minHeight: 160 }} value={form.message} onChange={set("message")} placeholder="How can we help?" />
            </div>
          </div>

          <button style={f.btn} type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
      <Toast msg={msg} />
    </main>
  );
}

const s = {
  page: { maxWidth: 760, margin: "0 auto", padding: "2rem 1.5rem 4rem" },
  back: { color: "var(--orange)", fontSize: 13, fontWeight: 700 },
  panel: { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1.5rem", marginTop: "1rem" },
  title: { fontSize: 28, fontWeight: 800, color: "#111", marginBottom: 8 },
  copy: { fontSize: 14, color: "#555", lineHeight: 1.6, marginBottom: "1.5rem" },
};
