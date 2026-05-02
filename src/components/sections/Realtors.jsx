import { useState } from "react";
import { f, savePost, useToast, Toast } from "../formHelpers";
import { ListingSection } from "../ListingSection";

export default function Realtors({ stateSlug, citySlug }) {
  return (
    <ListingSection stateSlug={stateSlug} citySlug={citySlug} section="realtors"
      icon="🏡" title="Local Realtors"
      description="Community-recommended real estate agents familiar with immigrant buyer needs."
      FormFields={RealtorForm}
      renderCard={item => (
        <>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={f.postAuthor}>{item.name}</span>
            <span style={f.postDate}>{item.agency || ""}</span>
          </div>
          {item.phone && <p style={f.sub}>📞 {item.phone}</p>}
          {item.email && <p style={f.sub}>✉️ {item.email}</p>}
          {item.notes && <p style={{ ...f.text, marginTop:8 }}>{item.notes}</p>}
        </>
      )}
    />
  );
}

function RealtorForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ name:"", agency:"", phone:"", email:"", notes:"", submittedBy:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = () => {
    if (!form.name || !form.notes) { show("Name and notes required."); return; }
    savePost(stateSlug, citySlug, section, form, false);
    show("✓ Submitted for review!"); setTimeout(onDone, 1500);
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
