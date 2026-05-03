import { useState } from "react";
import { f, useToast, Toast, formatPhone } from "../formHelpers";
import { ListingSection } from "../ListingSection";
import { submitListing } from "../../lib/db";

export default function Realtors({ stateSlug, citySlug }) {
  return (
    <ListingSection
      stateSlug={stateSlug}
      citySlug={citySlug}
      section="realtors"
      icon="🏡"
      title="Local Realtors"
      description="Community-recommended real estate agents familiar with immigrant buyer needs."
      FormFields={RealtorForm}
      renderCard={item => {
        const details = parseRealtorNotes(item.notes);
        return (
          <>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 8 }}>
              <span style={f.postAuthor}>{item.name}</span>
              {item.agency && <span style={f.sub}>{item.agency}</span>}
              {item.phone && <span style={f.sub}>Phone: {formatPhone(item.phone)}</span>}
              {item.email && <span style={f.sub}>Email: {item.email}</span>}
            </div>
            {details.languages && <div style={s.languages}>{details.languages}</div>}
            {details.background && <p style={{ ...f.text, marginTop: 6 }}>{details.background}</p>}
            {details.source && (
              <a href={details.source} target="_blank" rel="noreferrer" style={s.source}>
                Source
              </a>
            )}
          </>
        );
      }}
    />
  );
}

function parseRealtorNotes(notes = "") {
  const [body = "", source = ""] = notes.split(/\s+Source:\s+/);
  const match = body.trim().match(/^(Languages?:\s*[^.]+)\.\s*(.*)$/i);

  if (!match) {
    return { languages: "", background: body.trim(), source: source.trim() };
  }

  return {
    languages: match[1],
    background: match[2],
    source: source.trim(),
  };
}

function RealtorForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ name: "", agency: "", phone: "", email: "", notes: "", submittedBy: "" });
  const { msg, show } = useToast();
  const set = key => event => setForm(prev => ({ ...prev, [key]: event.target.value }));
  const setPhone = event => setForm(prev => ({ ...prev, phone: formatPhone(event.target.value) }));

  const submit = async () => {
    if (!form.name || !form.notes) {
      show("Name and notes required.");
      return;
    }

    const ok = await submitListing(section, stateSlug, citySlug, {
      name: form.name,
      agency: form.agency || null,
      phone: form.phone || null,
      email: form.email || null,
      notes: form.notes,
      submitted_by: form.submittedBy || null,
    });

    if (ok) {
      show("Submitted for review!");
      setTimeout(onDone, 1500);
    } else {
      show("Error submitting. Please try again.");
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Recommend a Realtor</h3>
      <div style={f.grid2}>
        <div style={f.group}>
          <label style={f.label}>Realtor Name <span style={f.req}>*</span></label>
          <input style={f.input} value={form.name} onChange={set("name")} />
        </div>
        <div style={f.group}>
          <label style={f.label}>Agency</label>
          <input style={f.input} value={form.agency} onChange={set("agency")} placeholder="RE/MAX, Coldwell..." />
        </div>
        <div style={f.group}>
          <label style={f.label}>Phone</label>
          <input style={f.input} value={form.phone} onChange={setPhone} placeholder="123-456-7890" />
        </div>
        <div style={f.group}>
          <label style={f.label}>Email</label>
          <input style={f.input} type="email" value={form.email} onChange={set("email")} />
        </div>
        <div style={{ ...f.group, ...f.span2 }}>
          <label style={f.label}>Why recommend them <span style={f.req}>*</span></label>
          <textarea
            style={f.textarea}
            value={form.notes}
            onChange={set("notes")}
            placeholder="Languages: Hindi, Punjabi, Urdu. Background: first-time buyers, immigrant community, relocation, mortgage-aware guidance..."
          />
        </div>
        <div style={{ ...f.group, ...f.span2 }}>
          <label style={f.label}>Your Name (optional)</label>
          <input style={f.input} value={form.submittedBy} onChange={set("submittedBy")} placeholder="Anonymous" />
        </div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      <Toast msg={msg} />
    </>
  );
}

const s = {
  languages: {
    display: "inline-block",
    background: "var(--orange-light)",
    color: "var(--orange)",
    fontSize: 12,
    fontWeight: 800,
    padding: "4px 10px",
    borderRadius: 999,
    marginTop: 2,
  },
  source: {
    display: "inline-block",
    marginTop: 4,
    fontSize: 12,
    fontWeight: 700,
    color: "var(--muted)",
    textDecoration: "none",
  },
};
