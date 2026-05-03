import { useState } from "react";
import { f, useToast, Toast, formatPhone } from "../formHelpers";
import { ListingSection } from "../ListingSection";
import { submitListing } from "../../lib/db";

export default function Tutors({ stateSlug, citySlug }) {
  return (
    <ListingSection stateSlug={stateSlug} citySlug={citySlug} section="tutors"
      icon="📚" title="Tutors"
      description="Community-recommended tutors for school subjects, test prep, music, language, and more."
      FormFields={TutorForm}
      renderCard={item => (
        <>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
            <span style={f.postAuthor}>{item.name}</span>
            {item.subjects && <span style={f.sub}>{item.subjects}</span>}
            {item.phone && <span style={f.sub}>📞 {formatPhone(item.phone)}</span>}
            {item.email && <span style={f.sub}>✉️ {item.email}</span>}
            {item.website && <span style={f.sub}>🌐 <a href={item.website} target="_blank" rel="noreferrer" style={{ color:"var(--orange)" }}>{item.website}</a></span>}
          </div>
          {item.notes && <p style={f.text}>{item.notes}</p>}
        </>
      )}
    />
  );
}

function TutorForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ name:"", subjects:"", phone:"", email:"", website:"", notes:"", submittedBy:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const setPhone = e => setForm(p => ({...p, phone: formatPhone(e.target.value)}));

  const submit = async () => {
    if (!form.name || !form.subjects) { show("Name and subjects are required."); return; }
    const ok = await submitListing(section, stateSlug, citySlug, {
      name:         form.name,
      subjects:     form.subjects,
      phone:        form.phone       || null,
      email:        form.email       || null,
      website:      form.website     || null,
      notes:        form.notes       || null,
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
      <h3 style={f.sectionTitle}>Recommend a Tutor</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Tutor / Center Name <span style={f.req}>*</span></label><input style={f.input} value={form.name} onChange={set("name")} /></div>
        <div style={f.group}><label style={f.label}>Subjects <span style={f.req}>*</span></label><input style={f.input} value={form.subjects} onChange={set("subjects")} placeholder="Math, SAT, music, Hindi..." /></div>
        <div style={f.group}><label style={f.label}>Phone</label><input style={f.input} value={form.phone} onChange={setPhone} placeholder="123-456-7890" /></div>
        <div style={f.group}><label style={f.label}>Email</label><input style={f.input} type="email" value={form.email} onChange={set("email")} /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Website</label><input style={f.input} value={form.website} onChange={set("website")} placeholder="https://" /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Notes</label><textarea style={f.textarea} value={form.notes} onChange={set("notes")} placeholder="Grades, experience, online/in-person, pricing..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.submittedBy} onChange={set("submittedBy")} placeholder="Anonymous" /></div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      <Toast msg={msg} />
    </>
  );
}
