import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { fetchFilteredEvents, fetchStates, submitEvent, getSubmitError } from "../lib/db";
import { f, useToast, Toast, fmtEventDate, daysUntilBadge, MapLink } from "../components/formHelpers";
import AdBlock from "../components/AdBlock";
import { useIsMobile } from "../lib/useIsMobile";
import ResourceNav from "../components/ResourceNav";
import { citySlug as makeCitySlug, getCountrySlug } from "../lib/country";

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stateFilter, setStateFilter] = useState(searchParams.get("state") || "");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [states, setStates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => { fetchStates().then(setStates); }, []);

  useEffect(() => {
    fetchFilteredEvents(stateFilter || null).then(setEvents);
  }, [stateFilter]);

  const handleStateChange = slug => {
    setStateFilter(slug);
    if (slug) setSearchParams({ state: slug }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  const filtered = search.trim()
    ? events.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.location || "").toLowerCase().includes(search.toLowerCase())
      )
    : events;

  const selectedState = states.find(s => s.slug === stateFilter);

  const reload = () => fetchFilteredEvents(stateFilter || null).then(setEvents);

  const siteBase = getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org";
  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>Upcoming Events — Indian & South Asian Community | Apnacircle</title>
        <meta name="description" content="Community events across the US and Canada — cultural programs, festivals, concerts and meetups for Indians, Pakistanis, Koreans, Chinese and more." />
        <link rel="canonical" href={`${siteBase}/events/`} />
        <meta property="og:title" content="Upcoming Events — Indian & South Asian Community | Apnacircle" />
        <meta property="og:description" content="Community events across the US and Canada — cultural programs, festivals, concerts and meetups." />
        <meta property="og:url" content={`${siteBase}/events/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${siteBase}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {!isMobile && <ResourceNav />}

      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>
        <h1 style={s.title}>📅 Upcoming Events</h1>
        <p style={s.desc}>Cultural programs, concerts, meetups and festivals across the community.</p>

        {/* Filters */}
        <div style={s.filters}>
          <input
            style={{ ...f.input, flex: 1, minWidth: 180 }}
            placeholder="Search by event name or venue…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            style={{ ...f.select, width: "auto", minWidth: 190, flexShrink: 0 }}
            value={stateFilter}
            onChange={e => handleStateChange(e.target.value)}
          >
            <option value="">All States / Provinces</option>
            {states.map(st => (
              <option key={st.slug} value={st.slug}>{st.name}</option>
            ))}
          </select>
          {(stateFilter || search) && (
            <button
              style={s.clearBtn}
              onClick={() => { setSearch(""); handleStateChange(""); }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Result count + post button row */}
        <div style={s.actionRow}>
          <span style={s.resultCount}>
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
            {selectedState ? ` in ${selectedState.name}` : ""}
            {search ? ` matching "${search}"` : ""}
          </span>
          <button onClick={() => setShowForm(v => !v)} style={f.btnSm}>
            {showForm ? "✕ Cancel" : "+ Post an Event"}
          </button>
        </div>

        {/* Post form */}
        {showForm && (
          <div style={s.card}>
            <GlobalEventForm
              states={states}
              initStateSlug={stateFilter}
              onSuccess={() => { setShowForm(false); reload(); }}
            />
          </div>
        )}

        {/* Events list */}
        {filtered.length > 0 ? (
          <div style={s.list}>
            {filtered.map(e => <EventCard key={e.id} event={e} states={states} />)}
          </div>
        ) : (
          <p style={f.empty}>
            {stateFilter || search
              ? "No events found. Try adjusting your filters."
              : "No upcoming events yet."}
          </p>
        )}
      </div>

      {!isMobile && (
        <aside style={s.rail}>
          <AdBlock />
          <AdBlock />
        </aside>
      )}
    </div>
  );
}

function EventCard({ event, states }) {
  const badge = daysUntilBadge(event.event_date);
  const stateName = states.find(s => s.slug === event.state_slug)?.name;
  return (
    <div style={s.card}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 6 }}>
        <span style={s.eventName}>{event.name}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: badge.color, padding: "2px 8px", borderRadius: 20, flexShrink: 0 }}>
          {badge.label}
        </span>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: event.notes ? 6 : 0 }}>
        <span style={f.sub}>📅 {fmtEventDate(event.event_date)}{event.event_time ? ` · ${event.event_time}` : ""}</span>
        {event.location  && <span style={f.sub}>📍 <MapLink query={event.location}>{event.location}</MapLink></span>}
        {event.entry_fee && <span style={f.sub}>🎟️ {event.entry_fee}</span>}
        {stateName && (
          <Link
            to={`/states/${event.state_slug}/${event.city_slug}`}
            style={{ ...f.sub, color: "var(--orange)", fontWeight: 600, marginLeft: "auto" }}>
            {stateName} →
          </Link>
        )}
      </div>
      {event.notes && <p style={{ ...f.text, marginTop: 4 }}>{event.notes}</p>}
      {event.ticket_url && (
        <a href={event.ticket_url} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", marginTop: 8, fontSize: 13, fontWeight: 700, color: "var(--orange)" }}>
          Get Tickets →
        </a>
      )}
    </div>
  );
}

function GlobalEventForm({ states, initStateSlug, onSuccess }) {
  const [form, setForm] = useState({
    stateSlug: initStateSlug || "",
    citySlug: "",
    name: "", location: "", entryFee: "", eventDate: "", eventTime: "", ticketUrl: "", notes: "",
  });
  const { msg, show } = useToast();
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const selectedState = states.find(s => s.slug === form.stateSlug);
  const cities = selectedState?.cities || [];

  const submit = async () => {
    if (!form.stateSlug || !form.citySlug) { show("Please select a state and city."); return; }
    if (!form.name.trim() || !form.eventDate) { show("Event name and date are required."); return; }
    const ok = await submitEvent(form.stateSlug, makeCitySlug(
      cities.find(c => makeCitySlug(c.name) === form.citySlug)?.name || form.citySlug
    ), form);
    if (ok) {
      setForm({ stateSlug: form.stateSlug, citySlug: "", name: "", location: "", entryFee: "", eventDate: "", eventTime: "", ticketUrl: "", notes: "" });
      show("✓ Submitted! Thank you.");
      setTimeout(() => onSuccess?.(), 1500);
    } else {
      show(getSubmitError("Error submitting. Please try again."));
    }
  };

  return (
    <>
      <h3 style={f.sectionTitle}>Post an Event</h3>
      <div style={f.grid2}>
        <div style={f.group}>
          <label style={f.label}>State / Province <span style={f.req}>*</span></label>
          <select style={f.select} value={form.stateSlug} onChange={e => setForm(p => ({ ...p, stateSlug: e.target.value, citySlug: "" }))}>
            <option value="">Select state…</option>
            {states.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </div>
        <div style={f.group}>
          <label style={f.label}>City <span style={f.req}>*</span></label>
          <select style={f.select} value={form.citySlug} onChange={set("citySlug")} disabled={!form.stateSlug}>
            <option value="">Select city…</option>
            {cities.map(c => <option key={c.id} value={makeCitySlug(c.name)}>{c.name}</option>)}
          </select>
        </div>
        <div style={{ ...f.group, ...f.span2 }}>
          <label style={f.label}>Event Name <span style={f.req}>*</span></label>
          <input style={f.input} value={form.name} onChange={set("name")} placeholder="e.g. Diwali Celebration, Ram Miriyala Live" />
        </div>
        <div style={f.group}>
          <label style={f.label}>Event Date <span style={f.req}>*</span></label>
          <input style={f.input} type="date" value={form.eventDate} onChange={set("eventDate")} />
        </div>
        <div style={f.group}>
          <label style={f.label}>Event Time</label>
          <input style={f.input} value={form.eventTime} onChange={set("eventTime")} placeholder="e.g. 7:00 PM – 11:00 PM" />
        </div>
        <div style={f.group}>
          <label style={f.label}>Location / Venue</label>
          <input style={f.input} value={form.location} onChange={set("location")} placeholder="Venue name and address" />
        </div>
        <div style={f.group}>
          <label style={f.label}>Entry Fee</label>
          <input style={f.input} value={form.entryFee} onChange={set("entryFee")} placeholder="Free / $10 / $20–$30" />
        </div>
        <div style={{ ...f.group, ...f.span2 }}>
          <label style={f.label}>Ticket / Info URL</label>
          <input style={f.input} type="url" value={form.ticketUrl} onChange={set("ticketUrl")} placeholder="https://…" />
        </div>
        <div style={{ ...f.group, ...f.span2 }}>
          <label style={f.label}>Additional Notes</label>
          <textarea style={f.textarea} value={form.notes} onChange={set("notes")}
            placeholder="Dress code, parking, what to bring, age restrictions…" />
        </div>
      </div>
      <button style={f.btn} onClick={submit}>Submit Event</button>
      <Toast msg={msg} />
    </>
  );
}

const s = {
  outer:       { padding: "1.5rem 1.5rem 3rem", display: "flex", gap: 24, alignItems: "flex-start" },
  content:     { flex: 1, minWidth: 0 },
  rail:        { width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 72 },
  back:        { color: "var(--orange)", fontSize: 13, fontWeight: 600, display: "inline-block", marginBottom: 8 },
  title:       { fontSize: 32, fontWeight: 800, color: "#111", marginBottom: 6 },
  desc:        { fontSize: 14, color: "#555", marginBottom: "1.25rem" },
  filters:     { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 14 },
  clearBtn:    { padding: "8px 14px", background: "none", border: "0.5px solid var(--border)", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "#888", cursor: "pointer" },
  actionRow:   { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  resultCount: { fontSize: 13, color: "#888", fontWeight: 600 },
  list:        { display: "flex", flexDirection: "column", gap: 10 },
  card:        { background: "#fff", border: "0.5px solid var(--border)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", marginBottom: 0 },
  eventName:   { fontSize: 15, fontWeight: 700, color: "#111" },
};
