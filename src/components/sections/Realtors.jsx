import { useState } from "react";
import { f, useToast, Toast } from "../formHelpers";
import { ListingSection } from "../ListingSection";
import { submitListing } from "../../lib/db";

export default function Realtors({ stateSlug, citySlug }) {
  return (
    <ListingSection stateSlug={stateSlug} citySlug={citySlug} section="realtors"
      icon="🏡" title="Local Realtors"
      description="Community-recommended real estate agents familiar with immigrant buyer needs."
      FormFields={RealtorForm}
      renderCard={item => (
        <>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
            <span style={f.postAuthor}>{item.name}</span>
            {item.agency && <span style={f.sub}>{item.agency}</span>}
            {item.phone  && <span style={f.sub}>📞 {item.phone}</span>}
            {item.email  && <span style={f.sub}>✉️ {item.email}</span>}
          </div>
          {item.notes && <p style={f.text}>{item.notes}</p>}
        </>
      )}
    />
  );
}

function RealtorForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ name:"", agency:"", phone:"", email:"", notes:"", submittedBy:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));

  const submit = async () => {
    if (!form.name || !form.notes) { show("Name and notes required."); return; }
    const ok = await submitListing(section, stateSlug, citySlug, {
      name:         form.name,
      agency:       form.agency      || null,
      phone:        form.phone       || null,
      email:        form.email       || null,
      notes:        form.notes,
      submitted_by: form.submittedBy || null,
    });
    if (ok) {
      show("✓ Submitted for review!");
      setTimeout(onDone, 1500);
    } else {
      show("Error submitting. Please try again.");
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Recommend a Realtor</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Realtor Name <span style={f.req}>*</span></label><input style={f.input} value={form.name} onChange={set("name")} /></div>
        <div style={f.group}><label style={f.label}>Agency</label><input style={f.input} value={form.agency} onChange={set("agency")} placeholder="RE/MAX, Coldwell..." /></div>
        <div style={f.group}><label style={f.label}>Phone</label><input style={f.input} value={form.phone} onChange={set("phone")} /></div>
        <div style={f.group}><label style={f.label}>Email</label><input style={f.input} type="email" value={form.email} onChange={set("email")} /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Why recommend them <span style={f.req}>*</span></label><textarea style={f.textarea} value={form.notes} onChange={set("notes")} /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.submittedBy} onChange={set("submittedBy")} placeholder="Anonymous" /></div>
      </div>
      <button style={f.btn} onClick={submit}>Submit for Review</button>
      <Toast msg={msg} />
    </>
  );
}
