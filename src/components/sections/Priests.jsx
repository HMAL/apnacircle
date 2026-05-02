import { useState } from "react";
import { f, savePost, useToast, Toast } from "../formHelpers";
import { ListingSection } from "../ListingSection";

export default function Priests({ stateSlug, citySlug }) {
  return (
    <ListingSection stateSlug={stateSlug} citySlug={citySlug} section="priests"
      icon="🙏" title="Local Priest Services"
      description="Community-recommended priests and religious service providers in this area."
      FormFields={PriestForm}
      renderCard={item => (
        <>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={f.postAuthor}>{item.name}</span>
          </div>
          {item.services && <span style={f.tag}>{item.services}</span>}
          {item.phone    && <p style={f.sub}>📞 {item.phone}</p>}
          {item.notes    && <p style={{ ...f.text, marginTop:8 }}>{item.notes}</p>}
        </>
      )}
    />
  );
}

function PriestForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ name:"", phone:"", services:"", notes:"", submittedBy:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = () => {
    if (!form.name) { show("Name is required."); return; }
    savePost(stateSlug, citySlug, section, form, false);
    show("✓ Submitted for review!"); setTimeout(onDone, 1500);
  };
  return (
    <>
      <h3 style={f.sectionTitle}>Add a Priest / Religious Service</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Name <span style={f.req}>*</span></label><input style={f.input} value={form.name} onChange={set("name")} /></div>
        <div style={f.group}><label style={f.label}>Phone</label><input style={f.input} value={form.phone} onChange={set("phone")} /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Services Offered</label><input style={f.input} value={form.services} onChange={set("services")} placeholder="Weddings, Puja, Namaz, Nikah..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Notes</label><textarea style={f.textarea} value={form.notes} onChange={set("notes")} placeholder="Languages spoken, experience, availability..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.submittedBy} onChange={set("submittedBy")} placeholder="Anonymous" /></div>
      </div>
      <button style={f.btn} onClick={submit}>Submit for Review</button>
      <Toast msg={msg} />
    </>
  );
}
