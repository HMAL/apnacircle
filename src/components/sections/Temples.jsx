import { useState } from "react";
import { f, useToast, Toast, formatPhone, MapLink } from "../formHelpers";
import { ListingSection } from "../ListingSection";
import { submitListing } from "../../lib/db";

const TYPES = ["Hindu Temple","Mosque","Sikh Gurdwara","Jain Temple","Buddhist Temple","Church","Other"];

export default function Temples({ stateSlug, citySlug }) {
  return (
    <ListingSection
      stateSlug={stateSlug} citySlug={citySlug} section="temples"
      icon="🛕" title="Hindu Temples & Mosques"
      description="Places of worship recommended by community members in this city."
      FormFields={TemplesForm}
      renderCard={item => (
        <>
          <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
            <span style={f.postAuthor}>{item.place_name}</span>
            {item.type && <span style={f.sub}>{item.type}</span>}
            {item.phone && <span style={f.sub}>📞 {formatPhone(item.phone)}</span>}
            {item.address && <span style={f.sub}>📍 <MapLink query={item.address}>{item.address}</MapLink></span>}
            {item.website && <span style={f.sub}>🌐 <a href={item.website} target="_blank" rel="noreferrer" style={{ color:"var(--orange)" }}>{item.website}</a></span>}
          </div>
          {item.notes && <p style={f.text}>{item.notes}</p>}
        </>
      )}
    />
  );
}

function TemplesForm({ stateSlug, citySlug, section, onDone }) {
  const [form, setForm] = useState({ placeName:"", type:"", address:"", phone:"", website:"", notes:"", submittedBy:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const setPhone = e => setForm(p => ({...p, phone: formatPhone(e.target.value)}));

  const submit = async () => {
    if (!form.placeName || !form.type) { show("Place name and type are required."); return; }
    const ok = await submitListing(section, stateSlug, citySlug, {
      place_name:   form.placeName,
      type:         form.type,
      address:      form.address     || null,
      phone:        form.phone       || null,
      website:      form.website     || null,
      notes:        form.notes       || null,
      submitted_by: form.submittedBy || null,
    });
    if (ok) {
      show("✓ God Bless!");
      setTimeout(onDone, 1500);
    } else {
      show("Error submitting. Please try again.");
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Add a Place of Worship</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Place Name <span style={f.req}>*</span></label><input style={f.input} value={form.placeName} onChange={set("placeName")} /></div>
        <div style={f.group}><label style={f.label}>Type <span style={f.req}>*</span></label>
          <select style={f.select} value={form.type} onChange={set("type")}><option value="">Select...</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select>
        </div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Address</label><input style={f.input} value={form.address} onChange={set("address")} placeholder="123 Main St, City, State ZIP" /></div>
        <div style={f.group}><label style={f.label}>Phone</label><input style={f.input} value={form.phone} onChange={setPhone} placeholder="123-456-7890" /></div>
        <div style={f.group}><label style={f.label}>Website</label><input style={f.input} value={form.website} onChange={set("website")} placeholder="https://" /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Community Notes</label><textarea style={f.textarea} value={form.notes} onChange={set("notes")} placeholder="Services, languages, events..." /></div>
        <div style={{...f.group,...f.span2}}><label style={f.label}>Your Name (optional)</label><input style={f.input} value={form.submittedBy} onChange={set("submittedBy")} placeholder="Anonymous" /></div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      {/* <p style={{ fontSize:12, color:"var(--muted)", marginTop:8 }}>⏳ Submissions are reviewed before publishing.</p> */}
      <Toast msg={msg} />
    </>
  );
}
