import { useState } from "react";
import { f, loadPosts, savePost, useToast, Toast, SectionWrapper } from "../formHelpers";

export default function Accommodation({ stateSlug, citySlug }) {
  const [tab, setTab] = useState("looking");
  const lookPosts    = loadPosts(stateSlug, citySlug, "acc_looking").filter(p => p.status === "approved");
  const providePosts = loadPosts(stateSlug, citySlug, "acc_providing").filter(p => p.status === "approved");

  return (
    <SectionWrapper icon="🏠" title="Local Accommodation" description="Find or offer housing in your area. Connect directly with the community.">
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        <button onClick={() => setTab("looking")}   style={tab==="looking"   ? f.btnSm : f.btnOutline}>🔍 Looking for Accommodation</button>
        <button onClick={() => setTab("providing")} style={tab==="providing" ? f.btnSm : f.btnOutline}>🏠 Providing Accommodation</button>
      </div>

      {tab === "looking" ? (
        <AccForm stateSlug={stateSlug} citySlug={citySlug} type="looking" />
      ) : (
        <AccForm stateSlug={stateSlug} citySlug={citySlug} type="providing" />
      )}

      <hr style={f.divider} />

      {providePosts.length > 0 && (
        <>
          <h4 style={{ fontSize:14, fontWeight:700, marginBottom:10, color:"#111" }}>🏠 Available Accommodation</h4>
          {providePosts.map(p => <AccCard key={p.id} post={p} />)}
        </>
      )}
      {lookPosts.length > 0 && (
        <>
          <h4 style={{ fontSize:14, fontWeight:700, margin:"16px 0 10px", color:"#111" }}>🔍 Looking for Accommodation</h4>
          {lookPosts.map(p => <AccCard key={p.id} post={p} />)}
        </>
      )}
      {providePosts.length === 0 && lookPosts.length === 0 && <p style={f.empty}>No listings yet.</p>}
    </SectionWrapper>
  );
}

function AccForm({ stateSlug, citySlug, type }) {
  const [form, setForm] = useState({ name:"", phone:"", email:"", message:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const submit = () => {
    if (!form.message) { show("Please fill in a message."); return; }
    savePost(stateSlug, citySlug, type === "looking" ? "acc_looking" : "acc_providing", { ...form, type }, true);
    setForm({ name:"", phone:"", email:"", message:"" });
    show("✓ Post submitted!");
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

function AccCard({ post }) {
  return (
    <div style={f.card}>
      <div style={f.postMeta}><span style={f.postAuthor}>{post.name || "Anonymous"}</span><span style={f.postDate}>{post.createdAt}</span></div>
      <p style={f.text}>{post.message}</p>
      {post.phone && <p style={f.sub}>📞 {post.phone}</p>}
      {post.email && <p style={f.sub}>✉️ {post.email}</p>}
    </div>
  );
}
