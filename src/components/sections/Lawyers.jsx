import { useState } from "react";
import { f, savePost, useToast, Toast } from "../formHelpers";
import { ListingSection } from "../ListingSection";

// ── LAWYERS ──────────────────────────────────────────────────
export default function Lawyers({ stateSlug, citySlug }) {
  return (
    <ListingSection stateSlug={stateSlug} citySlug={citySlug} section="lawyers"
      icon="⚖️" title="Local Asian Immigration Lawyers"
      description="Community-recommended immigration attorneys. Always verify credentials before hiring."
      FormFields={LawyerForm}
      renderCard={item => (
        <>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={f.postAuthor}>{item.firmName}</span>
            <span style={f.postDate}>{item.createdAt || ""}</span>
          </div>
          {item.phone   && <p style={f.sub}>📞 {item.phone}</p>}
          {item.address && <p style={f.sub}>📍 {item.address}</p>}
          {item.website && <p style={f.sub}>🌐 <a href={item.website} target="_blank" rel="noreferrer" style={{ color:"var(--orange)" }}>{item.website}</a></p>}
          {item.notes   && <p style={{ ...f.text, marginTop:8 }}>{item.notes}</p>}
        </>
      )}
    />
  );
}

function LawyerForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ firmName:"", phone:"", address:"", website:"", notes:"", submittedBy:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));
  const submit = () => {
    if (!form.firmName || !form.notes) { show("Firm name and notes are required."); return; }
    savePost(stateSlug, citySlug, section, form, false);
    show("✓ Submitted for review!"); setTimeout(onDone, 1500);
  };
  return (
    <>
      <h3 style={f.sectionTitle}>Recommend a Lawyer</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Lawyer / Firm Name <span style={f.req}>*</span></label><input style={f.input} value={form.firmName} onChange={set("firmName")} /></div>
        <div style={f.group}><label style={f.label}>Phone</label><input style={f.input} value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Address</label><input style={f.input} value={form.address} onChange={set("address")} placeholder="123 Main St..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Website</label><input style={f.input} value={form.website} onChange={set("website")} placeholder="https://" /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Why you recommend them <span style={f.req}>*</span></label><textarea style={f.textarea} value={form.notes} onChange={set("notes")} placeholder="Specializes in H1B, very responsive..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.submittedBy} onChange={set("submittedBy")} placeholder="Anonymous" /></div>
      </div>
      <button style={f.btn} onClick={submit}>Submit for Review</button>
      <p style={{ fontSize:12, color:"var(--muted)", marginTop:8 }}>⏳ Reviewed before publishing.</p>
      <Toast msg={msg} />
    </>
  );
}
