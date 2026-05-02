import { useState } from "react";
import { f, loadPosts, savePost, useToast, Toast, SectionWrapper } from "../formHelpers";

const HOURS = ["Full-time","Part-time","Weekends only","Evenings only","Flexible","Contract"];

export default function Jobs({ stateSlug, citySlug }) {
  const [tab, setTab] = useState("offering");
  const offerPosts = loadPosts(stateSlug, citySlug, "job_offer").filter(p => p.status === "approved");
  const seekPosts  = loadPosts(stateSlug, citySlug, "job_seek").filter(p => p.status === "approved");

  return (
    <SectionWrapper icon="💼" title="Local Jobs" description="Community job board — offering positions and job seekers in your area.">
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        <button onClick={() => setTab("offering")} style={tab==="offering" ? f.btnSm : f.btnOutline}>💼 Offering a Job</button>
        <button onClick={() => setTab("seeking")}  style={tab==="seeking"  ? f.btnSm : f.btnOutline}>🙋 Looking for Job</button>
      </div>

      {tab === "offering" ? (
        <OfferForm stateSlug={stateSlug} citySlug={citySlug} />
      ) : (
        <SeekForm stateSlug={stateSlug} citySlug={citySlug} />
      )}

      <hr style={f.divider} />

      {/* Job listings */}
      {offerPosts.length > 0 && (
        <>
          <h4 style={{ fontSize:14, fontWeight:700, marginBottom:10, color:"#111" }}>💼 Job Openings</h4>
          {offerPosts.map(p => (
            <div key={p.id} style={f.card}>
              <div style={f.postMeta}><span style={f.postAuthor}>{p.businessName}</span><span style={f.postDate}>{p.createdAt}</span></div>
              <span style={f.tag}>{p.hours}</span>
              <p style={f.text}>{p.message}</p>
              {p.phone && <p style={f.sub}>📞 {p.phone}</p>}
            </div>
          ))}
        </>
      )}
      {seekPosts.length > 0 && (
        <>
          <h4 style={{ fontSize:14, fontWeight:700, margin:"16px 0 10px", color:"#111" }}>🙋 Job Seekers</h4>
          {seekPosts.map(p => (
            <div key={p.id} style={f.card}>
              <div style={f.postMeta}><span style={f.postAuthor}>{p.name || "Anonymous"}</span><span style={f.postDate}>{p.createdAt}</span></div>
              <span style={f.tag}>{p.availability}</span>
              <p style={f.text}>{p.message}</p>
              {p.phone && <p style={f.sub}>📞 {p.phone}</p>}
            </div>
          ))}
        </>
      )}
      {offerPosts.length === 0 && seekPosts.length === 0 && <p style={f.empty}>No job postings yet. Be the first!</p>}
      <Toast msg={useToast().msg} />
    </SectionWrapper>
  );
}

function OfferForm({ stateSlug, citySlug }) {
  const [form, setForm] = useState({ businessName:"", hours:"", phone:"", message:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const submit = () => {
    if (!form.businessName || !form.message) { show("Business name and message are required."); return; }
    savePost(stateSlug, citySlug, "job_offer", form, true); // auto-approve
    setForm({ businessName:"", hours:"", phone:"", message:"" });
    show("✓ Job posted!");
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Post a Job Opening</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Business Name <span style={f.req}>*</span></label><input style={f.input} value={form.businessName} onChange={set("businessName")} placeholder="Your business or name" /></div>
        <div style={f.group}><label style={f.label}>Hours Available</label>
          <select style={f.select} value={form.hours} onChange={set("hours")}>
            <option value="">Select...</option>
            {HOURS.map(h => <option key={h}>{h}</option>)}
          </select>
        </div>
        <div style={f.group}><label style={f.label}>Phone Number</label><input style={f.input} value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" /></div>
        <div style={{...f.group, ...f.span2}}><label style={f.label}>Message / Job Description <span style={f.req}>*</span></label><textarea style={f.textarea} value={form.message} onChange={set("message")} placeholder="Describe the role, pay, requirements..." /></div>
      </div>
      <button style={f.btn} onClick={submit}>Post Job</button>
      <Toast msg={msg} />
    </>
  );
}

function SeekForm({ stateSlug, citySlug }) {
  const [form, setForm] = useState({ name:"", phone:"", availability:"", message:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const submit = () => {
    if (!form.message) { show("Please describe what you're looking for."); return; }
    savePost(stateSlug, citySlug, "job_seek", form, true); // auto-approve
    setForm({ name:"", phone:"", availability:"", message:"" });
    show("✓ Post submitted!");
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Looking for a Job</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Your Name</label><input style={f.input} value={form.name} onChange={set("name")} placeholder="Anonymous" /></div>
        <div style={f.group}><label style={f.label}>Phone Number</label><input style={f.input} value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" /></div>
        <div style={f.group}><label style={f.label}>Days & Hours Available</label>
          <select style={f.select} value={form.availability} onChange={set("availability")}>
            <option value="">Select...</option>
            {HOURS.map(h => <option key={h}>{h}</option>)}
          </select>
        </div>
        <div style={{...f.group, ...f.span2}}><label style={f.label}>About You / What You're Looking For <span style={f.req}>*</span></label><textarea style={f.textarea} value={form.message} onChange={set("message")} placeholder="Skills, experience, type of work you're seeking..." /></div>
      </div>
      <button style={f.btn} onClick={submit}>Submit</button>
      <Toast msg={msg} />
    </>
  );
}
