import { useState, useEffect } from "react";
import { f, useToast, Toast, SectionWrapper, fmtDate } from "../formHelpers";
import { fetchAccommodation, submitAccommodation } from "../../lib/db";

export default function Accommodation({ stateSlug, citySlug }) {
  const [tab, setTab] = useState("looking");
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");

  const reload = () => fetchAccommodation(stateSlug, citySlug).then(setListings);
  useEffect(() => { reload(); }, [stateSlug, citySlug]);

  const lookPosts    = listings.filter(p => p.acc_type === "looking");
  const providePosts = listings.filter(p => p.acc_type === "providing");

  // When on "Looking" tab → show available listings; when on "Providing" tab → show seekers
  const listLabel = tab === "looking" ? "🏠 Available Accommodation" : "🔍 Looking for Accommodation";
  const listPosts = tab === "looking" ? providePosts : lookPosts;

  const filteredList = search
    ? listPosts.filter(p => [p.name, p.message, p.phone, p.email].some(v => v?.toLowerCase().includes(search.toLowerCase())))
    : listPosts;

  return (
    <SectionWrapper icon="🏠" title="Local Accommodation" description="Find or offer housing in your area. Connect directly with the community.">
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        <button onClick={() => { setTab("looking");   setSearch(""); }} style={tab==="looking"   ? f.btnSm : f.btnOutline}>🔍 Looking for Accommodation</button>
        <button onClick={() => { setTab("providing"); setSearch(""); }} style={tab==="providing" ? f.btnSm : f.btnOutline}>🏠 Providing Accommodation</button>
      </div>

      <AccForm stateSlug={stateSlug} citySlug={citySlug} type={tab} onSuccess={reload} />

      <hr style={f.divider} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:10 }}>
        <h4 style={{ fontSize:14, fontWeight:700, color:"#111", margin:0 }}>{listLabel}</h4>
        <input style={{ ...f.input, width:200, margin:0 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filteredList.length > 0 ? (
        filteredList.map(p => (
          <div key={p.id} style={f.card}>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
              <span style={f.postAuthor}>{p.name || "Anonymous"}</span>
              {p.phone && <span style={f.sub}>📞 {p.phone}</span>}
              {p.email && <span style={f.sub}>✉️ {p.email}</span>}
              <span style={f.postDate}>{fmtDate(p.created_at)}</span>
            </div>
            <p style={f.text}>{p.message}</p>
          </div>
        ))
      ) : (
        <p style={f.empty}>{search ? `No results for "${search}".` : `No ${tab === "looking" ? "accommodation listings" : "seekers"} yet.`}</p>
      )}
    </SectionWrapper>
  );
}

function AccForm({ stateSlug, citySlug, type, onSuccess }) {
  const [form, setForm] = useState({ name:"", phone:"", email:"", message:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const submit = async () => {
    if (!form.message) { show("Please fill in a message."); return; }
    const ok = await submitAccommodation(stateSlug, citySlug, form, type);
    if (ok) {
      setForm({ name:"", phone:"", email:"", message:"" });
      show("✓ Post submitted!");
      onSuccess();
    } else {
      show("Error submitting. Please try again.");
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>{type === "looking" ? "Looking for Accommodation" : "Offering Accommodation"}</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Name</label><input style={f.input} value={form.name} onChange={set("name")} placeholder="Anonymous" /></div>
        <div style={f.group}><label style={f.label}>Phone Number</label><input style={f.input} value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" /></div>
        <div style={{...f.group, ...f.span2}}><label style={f.label}>Email</label><input style={f.input} type="email" value={form.email} onChange={set("email")} placeholder="your@email.com" /></div>
        <div style={{...f.group, ...f.span2}}>
          <label style={f.label}>Message <span style={f.req}>*</span></label>
          <textarea style={f.textarea} value={form.message} onChange={set("message")}
            placeholder={type === "looking" ? "Describe what you're looking for — budget, area, # of people..." : "Describe what you're offering — type, rent, availability, rules..."} />
        </div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      <Toast msg={msg} />
    </>
  );
}
