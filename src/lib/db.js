import { supabase } from "./supabase";

// ─────────────────────────────────────────────────────────────
// SETTINGS — per-section auto-approve config
// ─────────────────────────────────────────────────────────────
let _settings = null;

// ─────────────────────────────────────────────────────────────
// ADS SETTINGS — global toggle + per-state toggles
// ─────────────────────────────────────────────────────────────
let _adsSettings = null;

export async function fetchAdsSettings() {
  if (_adsSettings) return _adsSettings;
  const { data } = await supabase.from("settings").select("value").eq("key", "ads").single();
  _adsSettings = data?.value || { global: false, states: {} };
  return _adsSettings;
}

export async function updateAdsSettings(newSettings) {
  const { error } = await supabase
    .from("settings")
    .upsert({ key: "ads", value: newSettings });
  if (!error) _adsSettings = newSettings;
  return !error;
}

async function getAutoApprove(section) {
  if (!_settings) {
    const { data } = await supabase.from("settings").select("value").eq("key", "auto_approve").single();
    _settings = data?.value || {};
  }
  return _settings[section] === true;
}

export async function fetchSettings() {
  const { data } = await supabase.from("settings").select("value").eq("key", "auto_approve").single();
  _settings = data?.value || {};
  return _settings;
}

export async function updateSetting(section, autoApprove) {
  if (!_settings) await fetchSettings();
  const updated = { ..._settings, [section]: autoApprove };
  const { error } = await supabase.from("settings").update({ value: updated }).eq("key", "auto_approve");
  if (!error) _settings = updated;
  return !error;
}

// ─────────────────────────────────────────────────────────────
// CONSULATES
// ─────────────────────────────────────────────────────────────
let _consulates = null;

export async function fetchConsulates() {
  if (_consulates) return _consulates;
  const { data, error } = await supabase
    .from("consulates")
    .select("country, location")
    .order("country", { ascending: true })
    .order("location", { ascending: true });
  if (error) console.error("fetchConsulates:", error);
  _consulates = data || [];
  return _consulates;
}

// ─────────────────────────────────────────────────────────────
// STATES & CITIES
// ─────────────────────────────────────────────────────────────
export async function fetchStates() {
  const { data, error } = await supabase
    .from("states")
    .select("*, cities(*)")
    .order("name", { ascending: true });
  if (error) console.error("fetchStates:", error);
  return data || [];
}

export async function fetchStateBySlug(slug) {
  const { data, error } = await supabase
    .from("states")
    .select("*, cities(*)")
    .eq("slug", slug)
    .single();
  if (error) console.error("fetchStateBySlug:", error);
  return data || null;
}

// ─────────────────────────────────────────────────────────────
// JOBS
// ─────────────────────────────────────────────────────────────
export async function fetchJobs(stateSlug, citySlug) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("state_slug", stateSlug)
    .eq("city_slug", citySlug)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function submitJob(stateSlug, citySlug, form, jobType) {
  const status = (await getAutoApprove("jobs")) ? "approved" : "pending";
  const { error } = await supabase.from("jobs").insert({
    state_slug:    stateSlug,
    city_slug:     citySlug,
    job_type:      jobType,
    business_name: form.businessName || null,
    name:          form.name || null,
    phone:         form.phone || null,
    hours:         form.hours || null,
    message:       form.message,
    status,
  });
  return !error;
}

// ─────────────────────────────────────────────────────────────
// ACCOMMODATION
// ─────────────────────────────────────────────────────────────
export async function fetchAccommodation(stateSlug, citySlug) {
  const { data, error } = await supabase
    .from("accommodation")
    .select("*")
    .eq("state_slug", stateSlug)
    .eq("city_slug", citySlug)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function submitAccommodation(stateSlug, citySlug, form, accType) {
  const status = (await getAutoApprove("accommodation")) ? "approved" : "pending";
  const { error } = await supabase.from("accommodation").insert({
    state_slug: stateSlug,
    city_slug:  citySlug,
    acc_type:   accType,
    name:       form.name  || null,
    phone:      form.phone || null,
    email:      form.email || null,
    message:    form.message,
    status,
  });
  return !error;
}

// ─────────────────────────────────────────────────────────────
// GENERIC LISTINGS (temples, lawyers, realtors, priests, photographers)
// ─────────────────────────────────────────────────────────────
export async function fetchListings(table, stateSlug, citySlug) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("state_slug", stateSlug)
    .eq("city_slug", citySlug)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function submitListing(table, stateSlug, citySlug, form) {
  const status = (await getAutoApprove(table)) ? "approved" : "pending";
  const { error } = await supabase.from(table).insert({
    state_slug: stateSlug,
    city_slug:  citySlug,
    status,
    ...form,
  });
  return !error;
}

// ─────────────────────────────────────────────────────────────
// VISA EXPERIENCES
// ─────────────────────────────────────────────────────────────
export async function fetchVisaExperiences(visaType) {
  const { data, error } = await supabase
    .from("visa_experiences")
    .select("*")
    .eq("visa_type", visaType)
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function submitVisaExperience(form, visaType) {
  const status = (await getAutoApprove("visa_experiences")) ? "approved" : "pending";
  const { error } = await supabase.from("visa_experiences").insert({
    visa_type:      visaType,
    name:           form.name          || null,
    location:       form.location      || null,
    interview_date: form.interviewDate || null,
    experience:     form.experience,
    status,
  });
  return !error;
}

// ─────────────────────────────────────────────────────────────
// TIPS (immigration_tips, ds160_tips)
// ─────────────────────────────────────────────────────────────
export async function fetchTips(table) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return data || [];
}

export async function submitTip(table, form) {
  const status = (await getAutoApprove(table)) ? "approved" : "pending";
  const { error } = await supabase.from(table).insert({
    status,
    ...form,
  });
  return !error;
}

// ─────────────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];

export async function fetchEvents(stateSlug, citySlug) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("state_slug", stateSlug)
    .eq("city_slug", citySlug)
    .eq("status", "approved")
    .gte("event_date", today())
    .order("event_date", { ascending: true });
  if (error) console.error("fetchEvents:", error);
  return data || [];
}

export async function fetchAllEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .gte("event_date", today())
    .order("event_date", { ascending: true })
    .limit(12);
  if (error) console.error("fetchAllEvents:", error);
  return data || [];
}

export async function submitEvent(stateSlug, citySlug, form) {
  const status = (await getAutoApprove("events")) ? "approved" : "pending";
  const { error } = await supabase.from("events").insert({
    state_slug:  stateSlug,
    city_slug:   citySlug,
    name:        form.name,
    location:    form.location   || null,
    entry_fee:   form.entryFee   || null,
    event_date:  form.eventDate,
    event_time:  form.eventTime  || null,
    ticket_url:  form.ticketUrl  || null,
    notes:       form.notes      || null,
    status,
  });
  return !error;
}

// ─────────────────────────────────────────────────────────────
// GLOBAL LAWYERS DIRECTORY
// ─────────────────────────────────────────────────────────────
export async function fetchAllLawyers() {
  const { data, error } = await supabase
    .from("lawyers")
    .select("*")
    .eq("status", "approved")
    .order("state_slug", { ascending: true })
    .order("city_slug", { ascending: true });
  if (error) console.error("fetchAllLawyers:", error);
  return data || [];
}

// ─────────────────────────────────────────────────────────────
// ADMIN — reads ALL rows regardless of status
// ─────────────────────────────────────────────────────────────
const ALL_TABLES = [
  "jobs", "accommodation", "temples", "lawyers",
  "realtors", "priests", "photographers",
  "visa_experiences", "immigration_tips", "ds160_tips", "health_tips", "events",
];

export async function fetchAllSubmissions() {
  const results = await Promise.all(
    ALL_TABLES.map(async (table) => {
      const { data } = await supabase
        .from(table)
        .select("*")
        .order("created_at", { ascending: false });
      return (data || []).map(row => ({ ...row, _table: table }));
    })
  );
  return results
    .flat()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function updateStatus(table, id, status) {
  const { error } = await supabase
    .from(table)
    .update({ status })
    .eq("id", id);
  return !error;
}
