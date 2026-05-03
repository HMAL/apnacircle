import { useState } from "react";
import { f, useToast, Toast, formatPhone, PhoneLink } from "../formHelpers";
import { ListingSection } from "../ListingSection";
import { getSubmitError, submitListing } from "../../lib/db";

export default function Priests({ stateSlug, citySlug }) {
  return (
    <ListingSection stateSlug={stateSlug} citySlug={citySlug} section="priests"
      icon="🙏" title="Local Priest Services"
      description="Community-recommended priests and religious service providers in this area."
      FormFields={PriestForm}
      renderCard={item => (
        <>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
            <span style={f.postAuthor}>{item.name}</span>
            {item.services && <span style={f.sub}>{item.services}</span>}
            <PhoneLink phone={item.phone} />
          </div>
          {item.notes && <p style={f.text}>{item.notes}</p>}
        </>
      )}
    />
  );
}

function PriestForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ name:"", phone:"", services:"", notes:"", submittedBy:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const setPhone = e => setForm(p => ({...p, phone: formatPhone(e.target.value)}));

  const submit = async () => {
    if (!form.name) { show("Name is required."); return; }
    const ok = await submitListing(section, stateSlug, citySlug, {
      name:         form.name,
      phone:        form.phone       || null,
      services:     form.services    || null,
      notes:        form.notes       || null,
      submitted_by: form.submittedBy || null,
    });
    if (ok) {
      show("✓ Submission successful!");
      setTimeout(onDone, 1500);
    } else {
      show(getSubmitError("Error submitting. Please try again."));
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Add a Priest / Religious Service</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Name <span style={f.req}>*</span></label><input style={f.input} value={form.name} onChange={set("name")} /></div>
        <div style={f.group}><label style={f.label}>Phone</label><input style={f.input} value={form.phone} onChange={setPhone} placeholder="123-456-7890" /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Services Offered</label><input style={f.input} value={form.services} onChange={set("services")} placeholder="Weddings, Puja, Namaz, Nikah..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Notes</label><textarea style={f.textarea} value={form.notes} onChange={set("notes")} placeholder="Languages spoken, experience, availability..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.submittedBy} onChange={set("submittedBy")} placeholder="Anonymous" /></div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      <Toast msg={msg} />
    </>
  );
}
