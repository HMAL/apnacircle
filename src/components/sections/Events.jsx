import { useState, useEffect } from "react";
import { f, useToast, Toast, SectionWrapper, fmtEventDate, daysUntilBadge } from "../formHelpers";
import { fetchEvents, submitEvent } from "../../lib/db";

export default function Events({ stateSlug, citySlug }) {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);

  const reload = () => fetchEvents(stateSlug, citySlug).then(setEvents);
  useEffect(() => { reload(); }, [stateSlug, citySlug]);

  return (
    <SectionWrapper icon="📅" title="Local Events" description="Community events in your area — cultural programs, meetups, festivals and more.">
      <button onClick={() => setShowForm(v => !v)} style={{ ...f.btnSm, marginBottom: 20 }}>
        {showForm ? "✕ Cancel" : "+ Post an Event"}
      </button>

      {showForm && (
        <EventForm stateSlug={stateSlug} citySlug={citySlug}
          onSuccess={() => { setShowForm(false); reload(); }} />
      )}

      {events.length > 0 ? (
        events.map(e => <EventCard key={e.id} event={e} />)
      ) : (
        <p style={f.empty}>No upcoming events. Be the first to post one!</p>
      )}
    </SectionWrapper>
  );
}

function EventCard({ event }) {
  const badge = daysUntilBadge(event.event_date);
  return (
    <div style={f.card}>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", alignItems:"center", marginBottom:6 }}>
        <span style={f.postAuthor}>{event.name}</span>
        <span style={{ fontSize:11, fontWeight:700, color:"#fff", background:badge.color, padding:"2px 8px", borderRadius:20, flexShrink:0 }}>
          {badge.label}
        </span>
        <span style={f.postDate}>{fmtEventDate(event.event_date)}{event.event_time ? ` · ${event.event_time}` : ""}</span>
      </div>
      <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom: event.notes ? 6 : 0 }}>
        {event.location  && <span style={f.sub}>📍 {event.location}</span>}
        {event.entry_fee && <span style={f.sub}>🎟️ {event.entry_fee}</span>}
      </div>
      {event.notes && <p style={{ ...f.text, marginTop:4 }}>{event.notes}</p>}
      {event.ticket_url && (
        <a href={event.ticket_url} target="_blank" rel="noopener noreferrer"
          style={{ display:"inline-block", marginTop:8, fontSize:13, fontWeight:700, color:"var(--orange)" }}>
          Get Tickets →
        </a>
      )}
    </div>
  );
}

function EventForm({ stateSlug, citySlug, onSuccess }) {
  const [form, setForm] = useState({ name:"", location:"", entryFee:"", eventDate:"", eventTime:"", ticketUrl:"", notes:"" });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({...p,[k]:e.target.value}));

  const submit = async () => {
    if (!form.name.trim() || !form.eventDate) { show("Event name and date are required."); return; }
    const ok = await submitEvent(stateSlug, citySlug, form);
    if (ok) {
      setForm({ name:"", location:"", entryFee:"", eventDate:"", eventTime:"", ticketUrl:"", notes:"" });
      show("✓ Hooray!");
      setTimeout(() => onSuccess?.(), 1500);
    } else {
      show("Error submitting. Please try again.");
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Post an Event</h3>
      <div style={f.grid2}>
        <div style={{...f.group,...f.span2}}>
          <label style={f.label}>Event Name <span style={f.req}>*</span></label>
          <input style={f.input} value={form.name} onChange={set("name")} placeholder="e.g. Diwali Celebration, Community Meetup" />
        </div>
        <div style={f.group}>
          <label style={f.label}>Event Date <span style={f.req}>*</span></label>
          <input style={f.input} type="date" value={form.eventDate} onChange={set("eventDate")} />
        </div>
        <div style={f.group}>
          <label style={f.label}>Event Time</label>
          <input style={f.input} value={form.eventTime} onChange={set("eventTime")} placeholder="e.g. 6:00 PM – 10:00 PM" />
        </div>
        <div style={f.group}>
          <label style={f.label}>Location / Venue</label>
          <input style={f.input} value={form.location} onChange={set("location")} placeholder="Venue name and address" />
        </div>
        <div style={f.group}>
          <label style={f.label}>Entry Fee</label>
          <input style={f.input} value={form.entryFee} onChange={set("entryFee")} placeholder="Free / $10 / $20–$30" />
        </div>
        <div style={{...f.group,...f.span2}}>
          <label style={f.label}>Ticket / Info URL</label>
          <input style={f.input} type="url" value={form.ticketUrl} onChange={set("ticketUrl")} placeholder="https://..." />
        </div>
        <div style={{...f.group,...f.span2}}>
          <label style={f.label}>Additional Notes</label>
          <textarea style={f.textarea} value={form.notes} onChange={set("notes")}
            placeholder="Dress code, parking, what to bring, contact info..." />
        </div>
      </div>
      <button style={f.btn} onClick={submit}>Submit Event</button>
      <Toast msg={msg} />
    </>
  );
}
