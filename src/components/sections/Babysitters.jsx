import { useState } from "react";
import { f, useToast, Toast, formatPhone, isValidEmail, isValidPhone, PhoneLink, EmailLink } from "../formHelpers";
import { ListingSection } from "../ListingSection";
import { getSubmitError, submitListing } from "../../lib/db";

export default function Babysitters({ stateSlug, citySlug }) {
  return (
    <ListingSection stateSlug={stateSlug} citySlug={citySlug} section="babysitters"
      icon="🧸" title="Baby Sitters"
      description="Community-recommended baby sitters, nannies, and child care helpers."
      FormFields={BabysitterForm}
      renderCard={item => (
        <>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
            <span style={f.postAuthor}>{item.name}</span>
            {item.availability && <span style={f.sub}>{item.availability}</span>}
            <PhoneLink phone={item.phone} />
            <EmailLink email={item.email} />
          </div>
          {item.notes && <p style={f.text}>{item.notes}</p>}
        </>
      )}
    />
  );
}

function BabysitterForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ name:"", phone:"", email:"", availability:"", notes:"", submittedBy:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const setPhone = e => setForm(p => ({...p, phone: formatPhone(e.target.value)}));

  const submit = async () => {
    if (!form.name || !form.notes) { show("Name and notes are required."); return; }
    if (!isValidPhone(form.phone) && !isValidEmail(form.email)) {
      show("Please enter a valid phone number (10 digits) or email address.");
      return;
    }
    if (form.email && !isValidEmail(form.email)) { show("Please enter a valid email address (e.g. you@example.com)."); return; }
    const ok = await submitListing(section, stateSlug, citySlug, {
      name:         form.name,
      phone:        form.phone       || null,
      email:        form.email       || null,
      availability: form.availability || null,
      notes:        form.notes,
      submitted_by: form.submittedBy || null,
    });
    if (ok) {
      show("✓ Good luck on your search!");
      setTimeout(onDone, 1500);
    } else {
      show(getSubmitError("Error submitting. Please try again."));
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Recommend a Baby Sitter</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Name <span style={f.req}>*</span></label><input style={f.input} value={form.name} onChange={set("name")} /></div>
        <div style={f.group}><label style={f.label}>Phone</label><input style={f.input} value={form.phone} onChange={setPhone} placeholder="123-456-7890" /></div>
        <div style={f.group}><label style={f.label}>Email</label><input style={f.input} type="email" value={form.email} onChange={set("email")} /></div>
        <div style={f.group}><label style={f.label}>Availability</label><input style={f.input} value={form.availability} onChange={set("availability")} placeholder="Weekends, evenings, full-time..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Notes <span style={f.req}>*</span></label><textarea style={f.textarea} value={form.notes} onChange={set("notes")} placeholder="Experience, ages, languages, references..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.submittedBy} onChange={set("submittedBy")} placeholder="Anonymous" /></div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      <Toast msg={msg} />
    </>
  );
}
