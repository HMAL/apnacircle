import { useState } from "react";
import { f, savePost, useToast, Toast } from "../formHelpers";
import { ListingSection } from "../ListingSection";

export default function Photographers({ stateSlug, citySlug }) {
  return (
    <ListingSection stateSlug={stateSlug} citySlug={citySlug} section="photographers"
      icon="📸" title="Local Photographers"
      description="Community-recommended photographers specializing in cultural events, weddings, and family portraits."
      FormFields={PhotoForm}
      renderCard={item => (
        <>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={f.postAuthor}>{item.name}</span>
          </div>
          {item.phone   && <p style={f.sub}>📞 {item.phone}</p>}
          {item.website && <p style={f.sub}>🌐 <a href={item.website} target="_blank" rel="noreferrer" style={{ color:"var(--orange)" }}>{item.website}</a></p>}
          {item.notes   && <p style={{ ...f.text, marginTop:8 }}>{item.notes}</p>}
        </>
      )}
    />
  );
}

function PhotoForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ name:"", phone:"", website:"", notes:"", submittedBy:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = () => {
    if (!form.name) { show("Name is required."); return; }
    savePost(stateSlug, citySlug, section, form, false);
    show("✓ Submitted for review!"); setTimeout(onDone, 1500);
  };
  return (
    <>
      <h3 style={f.sectionTitle}>Add a Photographer</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Name / Studio <span style={f.req}>*</span></label><input style={f.input} value={form.name} onChange={set("name")} /></div>
        <div style={f.group}><label style={f.label}>Phone</label><input style={f.input} value={form.phone} onChange={set("phone")} /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Website / Instagram URL</label><input style={f.input} value={form.website} onChange={set("website")} placeholder="https://" /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Notes / Specialties</label><textarea style={f.textarea} value={form.notes} onChange={set("notes")} placeholder="Wedding, mehendi, cultural events, pricing..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.submittedBy} onChange={set("submittedBy")} placeholder="Anonymous" /></div>
      </div>
      <button style={f.btn} onClick={submit}>Submit for Review</button>
      <Toast msg={msg} />
    </>
  );
}
