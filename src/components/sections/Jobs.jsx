import { useState, useEffect } from "react";
import { f, useToast, Toast, SectionWrapper, fmtDate } from "../formHelpers";
import { fetchJobs, submitJob } from "../../lib/db";

const HOURS = ["Full-time","Part-time","Weekends only","Evenings only","Flexible","Temporary"];

export default function Jobs({ stateSlug, citySlug }) {
  const [tab, setTab] = useState("offering");
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const reload = () => fetchJobs(stateSlug, citySlug).then(setJobs);
  useEffect(() => { reload(); }, [stateSlug, citySlug]);

  const offerPosts = jobs.filter(p => p.job_type === "offering");
  const seekPosts  = jobs.filter(p => p.job_type === "seeking");

  // When on "Offering a Job" tab → show seekers; when on "Looking for Job" tab → show openings
  const listLabel  = tab === "offering" ? "🙋 Job Seekers" : "💼 Job Openings";
  const listPosts  = tab === "offering" ? seekPosts : offerPosts;

  const filteredList = search
    ? listPosts.filter(p => [p.name, p.business_name, p.message, p.hours, p.phone].some(v => v?.toLowerCase().includes(search.toLowerCase())))
    : listPosts;

  return (
    <SectionWrapper icon="💼" title="Local Jobs" description="Community job board — offering positions and job seekers in your area.">
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        <button onClick={() => { setTab("offering"); setSearch(""); }} style={tab==="offering" ? f.btnSm : f.btnOutline}>💼 Offering a Job</button>
        <button onClick={() => { setTab("seeking");  setSearch(""); }} style={tab==="seeking"  ? f.btnSm : f.btnOutline}>🙋 Looking for Job</button>
      </div>

      {tab === "offering" ? (
        <OfferForm stateSlug={stateSlug} citySlug={citySlug} onSuccess={reload} />
      ) : (
        <SeekForm stateSlug={stateSlug} citySlug={citySlug} onSuccess={reload} />
      )}

      <hr style={f.divider} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, flexWrap:"wrap", gap:10 }}>
        <h4 style={{ fontSize:14, fontWeight:700, color:"#111", margin:0 }}>{listLabel}</h4>
        <input style={{ ...f.input, width:200, margin:0 }} placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filteredList.length > 0 ? (
        filteredList.map(p => (
          <div key={p.id} style={f.card}>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:8 }}>
              <span style={f.postAuthor}>{p.business_name || p.name || "Anonymous"}</span>
              {p.hours && <span style={f.sub}>⏰ {p.hours}</span>}
              {p.phone && <span style={f.sub}>📞 {p.phone}</span>}
              <span style={f.postDate}>{fmtDate(p.created_at)}</span>
            </div>
            <p style={f.text}>{p.message}</p>
          </div>
        ))
      ) : (
        <p style={f.empty}>{search ? `No results for "${search}".` : `No ${tab === "offering" ? "job seekers" : "job openings"} yet.`}</p>
      )}
    </SectionWrapper>
  );
}

function OfferForm({ stateSlug, citySlug, onSuccess }) {
  const [form, setForm] = useState({ businessName:"", hours:"", phone:"", message:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const submit = async () => {
    if (!form.businessName || !form.message) { show("Business name and message are required."); return; }
    const ok = await submitJob(stateSlug, citySlug, form, "offering");
    if (ok) {
      setForm({ businessName:"", hours:"", phone:"", message:"" });
      show("✓ Job posted!");
      onSuccess();
    } else {
      show("Error posting. Please try again.");
    }
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

function SeekForm({ stateSlug, citySlug, onSuccess }) {
  const [form, setForm] = useState({ name:"", phone:"", hours:"", message:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const submit = async () => {
    if (!form.message) { show("Please describe what you're looking for."); return; }
    const ok = await submitJob(stateSlug, citySlug, form, "seeking");
    if (ok) {
      setForm({ name:"", phone:"", hours:"", message:"" });
      show("✓ Post submitted!");
      onSuccess();
    } else {
      show("Error submitting. Please try again.");
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Looking for a Job</h3>
      <div style={f.grid2}>
        <div style={f.group}><label style={f.label}>Your Name</label><input style={f.input} value={form.name} onChange={set("name")} placeholder="Anonymous" /></div>
        <div style={f.group}><label style={f.label}>Phone Number</label><input style={f.input} value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" /></div>
        <div style={f.group}><label style={f.label}>Days & Hours Available</label>
          <select style={f.select} value={form.hours} onChange={set("hours")}>
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
