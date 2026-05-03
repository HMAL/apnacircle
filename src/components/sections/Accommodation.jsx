import { useState, useEffect } from "react";
import { f, useToast, Toast, SectionWrapper, fmtDate, formatPhone, isValidEmail, isValidPhone, PhoneLink, EmailLink } from "../formHelpers";
import { fetchAccommodation, getSubmitError, submitAccommodation } from "../../lib/db";

export default function Accommodation({ stateSlug, citySlug }) {
  const [formType, setFormType] = useState(null);
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");

  const reload = () => fetchAccommodation(stateSlug, citySlug).then(setListings);
  useEffect(() => { reload(); }, [stateSlug, citySlug]);

  const lookPosts = listings.filter(p => p.acc_type === "looking");
  const providePosts = listings.filter(p => p.acc_type === "providing");
  const listLabel = formType === "looking" ? "🏠 Available Accommodation" : formType === "providing" ? "🔍 Looking for Accommodation" : "🏠 Accommodation";
  const listPosts = formType === "looking" ? providePosts : formType === "providing" ? lookPosts : listings;

  const filteredList = search
    ? listPosts.filter(p => [p.name, p.message, p.phone, p.email].some(v => v?.toLowerCase().includes(search.toLowerCase())))
    : listPosts;

  return (
    <SectionWrapper icon="🏠" title="Local Accommodation" description="Find or offer housing in your area. Connect directly with the community.">
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        <button onClick={() => setFormType("looking")} style={formType==="looking" ? f.btnSm : f.btnOutline}>🔍 Looking for Accommodation</button>
        <button onClick={() => setFormType("providing")} style={formType==="providing" ? f.btnSm : f.btnOutline}>🏠 Providing Accommodation</button>
      </div>

      {formType && (
        <AccForm stateSlug={stateSlug} citySlug={citySlug} type={formType} onSuccess={reload} onCancel={() => setFormType(null)} />
      )}

      {formType && <hr style={f.divider} />}

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:10 }}>
        <h4 style={{ fontSize:14, fontWeight:700, color:"#111", margin:0 }}>{listLabel}</h4>
        <input style={{ ...f.input, width:200, margin:0 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filteredList.length > 0 ? (
        filteredList.map(p => (
          <div key={p.id} style={f.card}>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
              <span style={f.tag}>{p.acc_type === "providing" ? "🏠 Available" : "🔍 Looking"}</span>
              <span style={f.postAuthor}>{p.name || "Anonymous"}</span>
              <PhoneLink phone={p.phone} />
              <EmailLink email={p.email} />
              <span style={f.postDate}>{fmtDate(p.created_at)}</span>
            </div>
            <p style={f.text}>{p.message}</p>
          </div>
        ))
      ) : (
        <p style={f.empty}>{search ? `No results for "${search}".` : `No ${formType === "looking" ? "accommodation listings" : formType === "providing" ? "seekers" : "accommodation posts"} yet.`}</p>
      )}
    </SectionWrapper>
  );
}

function AccForm({ stateSlug, citySlug, type, onSuccess, onCancel }) {
  const [form, setForm] = useState({ name:"", phone:"", email:"", message:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));
  const setPhone = e => setForm(p => ({...p, phone: formatPhone(e.target.value)}));

  const submit = async () => {
    if (!form.message) { show("Please fill in a message."); return; }
    if (!isValidPhone(form.phone) && !isValidEmail(form.email)) {
      show("Please enter a valid phone number (10 digits) or email address.");
      return;
    }
    if (form.email && !isValidEmail(form.email)) { show("Please enter a valid email address (e.g. you@example.com)."); return; }
    const ok = await submitAccommodation(stateSlug, citySlug, form, type);
    if (ok) {
      setForm({ name:"", phone:"", email:"", message:"" });
      show("Post submitted!");
      onSuccess();
    } else {
      show(getSubmitError("Error submitting. Please try again."));
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>{type === "looking" ? "Looking for Accommodation" : "Offering Accommodation"}</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Name</label><input style={f.input} value={form.name} onChange={set("name")} placeholder="Anonymous" /></div>
        <div style={f.group}><label style={f.label}>Phone Number</label><input style={f.input} value={form.phone} onChange={setPhone} placeholder="123-456-7890" /></div>
        <div style={{...f.group, ...f.span2}}><label style={f.label}>Email</label><input style={f.input} type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" /></div>
        <div style={{...f.group, ...f.span2}}>
          <label style={f.label}>Message <span style={f.req}>*</span></label>
          <textarea style={f.textarea} value={form.message} onChange={set("message")}
            placeholder={type === "looking" ? "Describe what you're looking for - budget, area, # of people..." : "Describe what you're offering - type, rent, availability, rules..."} />
        </div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        <button style={f.btn} onClick={submit}>Submit</button>
        <button style={{ ...f.btnOutline, marginTop:"1.25rem" }} onClick={onCancel}>Cancel</button>
      </div>
      <Toast msg={msg} />
    </>
  );
}
