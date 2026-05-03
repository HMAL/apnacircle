import { useState } from "react";
import { f, useToast, Toast, formatPhone } from "../formHelpers";
import { ListingSection } from "../ListingSection";
import { submitListing } from "../../lib/db";

export default function Doctors({ stateSlug, citySlug }) {
  return (
    <ListingSection stateSlug={stateSlug} citySlug={citySlug} section="doctors"
      icon="🩺" title="Local Doctors"
      description="Community-recommended doctors, clinics, and specialists in this area."
      FormFields={DoctorForm}
      renderCard={item => (
        <>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
            <span style={f.postAuthor}>{item.name}</span>
            {item.specialty && <span style={f.sub}>{item.specialty}</span>}
            {item.phone && <span style={f.sub}>📞 {formatPhone(item.phone)}</span>}
            {item.address && <span style={f.sub}>📍 {item.address}</span>}
            {item.website && <span style={f.sub}>🌐 <a href={item.website} target="_blank" rel="noreferrer" style={{ color:"var(--orange)" }}>{item.website}</a></span>}
          </div>
        </>
      )}
    />
  );
}

function DoctorForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ name:"", specialty:"", phone:"", address:"", website:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const setPhone = e => setForm(p => ({...p, phone: formatPhone(e.target.value)}));

  const submit = async () => {
    if (!form.name || !form.specialty) { show("Doctor name and specialty are required."); return; }
    const ok = await submitListing(section, stateSlug, citySlug, {
      name:         form.name,
      specialty:    form.specialty,
      phone:        form.phone        || null,
      address:      form.address      || null,
      website:      form.website      || null,
    });
    if (ok) {
      show("✓ Submission successful!");
      setTimeout(onDone, 1500);
    } else {
      show("Error submitting. Please try again.");
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Recommend a Doctor</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Doctor / Clinic Name <span style={f.req}>*</span></label><input style={f.input} value={form.name} onChange={set("name")} /></div>
        <div style={f.group}><label style={f.label}>Specialty <span style={f.req}>*</span></label><input style={f.input} value={form.specialty} onChange={set("specialty")} placeholder="Primary care, pediatrics, dentist..." /></div>
        <div style={f.group}><label style={f.label}>Phone</label><input style={f.input} value={form.phone} onChange={setPhone} placeholder="123-456-7890" /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Address</label><input style={f.input} value={form.address} onChange={set("address")} placeholder="123 Main St..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Website</label><input style={f.input} value={form.website} onChange={set("website")} placeholder="https://" /></div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      <Toast msg={msg} />
    </>
  );
}
