import { supabase } from "./supabase";
import { getCountrySlug } from "./country";

const country = () => getCountrySlug();
const scopedKey = key => `${key}_${country()}`;

const FIELD_LIMITS = {
  address: 300,
  business_name: 160,
  email: 254,
  entry_fee: 80,
  experience: 5000,
  firm_name: 160,
  hours: 120,
  location: 300,
  message: 5000,
  name: 160,
  notes: 5000,
  phone: 40,
  place_name: 160,
  submitted_by: 160,
  ticket_url: 500,
  website: 500,
};

const LINK_BLOCK_MESSAGE = "Links are not allowed in descriptions. Please remove the link and submit again.";
const LINK_BLOCKED_CONTENT_FIELDS = new Set(["message", "notes", "tip", "experience"]);

let _lastSubmitError = "";

export function getSubmitError(fallback = "Error submitting. Please try again.") {
  return _lastSubmitError || fallback;
}

function sanitizeText(value, key = "") {
  if (typeof value !== "string") return value;
  const limit = FIELD_LIMITS[key] || 1000;
  return value
    .normalize("NFC")
    .replace(/\u0000/g, "")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, limit);
}

function cleanDbValue(value, key = "") {
  if (Array.isArray(value)) return value.map(item => cleanDbValue(item, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, cleanDbValue(childValue, childKey)]));
  }
  return sanitizeText(value, key);
}

function cleanPayload(payload) {
  return cleanDbValue(payload);
}

function setSubmitError(message = "") {
  _lastSubmitError = message;
  return false;
}

function urlsInText(text) {
  return String(text || "").match(/\b(?:https?:\/\/|www\.)[^\s<>"']+/gi) || [];
}

function hasBlockedLink(payload) {
  return Object.entries(payload || {}).some(([key, value]) => {
    if (!LINK_BLOCKED_CONTENT_FIELDS.has(key) || typeof value !== "string") return false;
    return urlsInText(value).length > 0;
  });
}

function validatePublicPayload(payload) {
  if (hasBlockedLink(payload)) return setSubmitError(LINK_BLOCK_MESSAGE);
  _lastSubmitError = "";
  return true;
}

function cleanRows(rows) {
  return (rows || []).map(row => cleanDbValue(row));
}

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
  let { data } = await supabase.from("settings").select("value").eq("key", scopedKey("ads")).maybeSingle();
  if (!data && country() === "us") {
    const fallback = await supabase.from("settings").select("value").eq("key", "ads").maybeSingle();
    data = fallback.data;
  }
  _adsSettings = data?.value || { global: false, states: {} };
  return _adsSettings;
}

export async function updateAdsSettings(newSettings) {
  const { error } = await supabase
    .from("settings")
    .upsert({ key: scopedKey("ads"), value: newSettings });
  if (!error) _adsSettings = newSettings;
  return !error;
}

async function getAutoApprove(section) {
  if (!_settings) {
    let { data } = await supabase.from("settings").select("value").eq("key", scopedKey("auto_approve")).maybeSingle();
    if (!data && country() === "us") {
      const fallback = await supabase.from("settings").select("value").eq("key", "auto_approve").maybeSingle();
      data = fallback.data;
    }
    _settings = data?.value || {};
  }
  return _settings[section] === true;
}

export async function fetchSettings() {
  let { data } = await supabase.from("settings").select("value").eq("key", scopedKey("auto_approve")).maybeSingle();
  if (!data && country() === "us") {
    const fallback = await supabase.from("settings").select("value").eq("key", "auto_approve").maybeSingle();
    data = fallback.data;
  }
  _settings = data?.value || {};
  return _settings;
}

export async function updateSetting(section, autoApprove) {
  if (!_settings) await fetchSettings();
  const updated = { ..._settings, [section]: autoApprove };
  const { error } = await supabase.from("settings").upsert({ key: scopedKey("auto_approve"), value: updated });
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
    .eq("country_slug", country())
    .eq("is_active", true)
    .order("name", { ascending: true });
  if (error) console.error("fetchStates:", error);
  const rows = cleanRows(data);
  return rows.map(state => ({
    ...state,
    cities: (state.cities || []).filter(c => c.is_active),
  }));
}

export async function fetchStateBySlug(slug) {
  const { data, error } = await supabase
    .from("states")
    .select("*, cities(*)")
    .eq("slug", slug)
    .eq("country_slug", country())
    .single();
  if (error) console.error("fetchStateBySlug:", error);
  if (!data) return null;
  const state = cleanDbValue(data);
  return {
    ...state,
    cities: (state.cities || []).filter(c => c.is_active),
  };
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
    .eq("country_slug", country())
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return cleanRows(data);
}

export async function submitJob(stateSlug, citySlug, form, jobType) {
  const status = (await getAutoApprove("jobs")) ? "approved" : "pending";
  const payload = cleanPayload({
    country_slug:   country(),
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
  if (!validatePublicPayload(payload)) return false;
  const { error } = await supabase.from("jobs").insert(payload);
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
    .eq("country_slug", country())
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return cleanRows(data);
}

export async function submitAccommodation(stateSlug, citySlug, form, accType) {
  const status = (await getAutoApprove("accommodation")) ? "approved" : "pending";
  const payload = cleanPayload({
    country_slug: country(),
    state_slug: stateSlug,
    city_slug:  citySlug,
    acc_type:   accType,
    name:       form.name   || null,
    phone:      form.phone  || null,
    email:      form.email  || null,
    gender:     form.gender || null,
    message:    form.message,
    status,
  });
  if (!validatePublicPayload(payload)) return false;
  const { error } = await supabase.from("accommodation").insert(payload);
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
    .eq("country_slug", country())
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return cleanRows(data);
}

export async function submitListing(table, stateSlug, citySlug, form) {
  const status = (await getAutoApprove(table)) ? "approved" : "pending";
  const payload = cleanPayload({
    country_slug: country(),
    state_slug: stateSlug,
    city_slug:  citySlug,
    status,
    ...form,
  });
  if (!validatePublicPayload(payload)) return false;
  const { error } = await supabase.from(table).insert(payload);
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
    .eq("country_slug", country())
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return cleanRows(data);
}

export async function submitVisaExperience(form, visaType) {
  const status = (await getAutoApprove("visa_experiences")) ? "approved" : "pending";
  const payload = cleanPayload({
    country_slug:    country(),
    visa_type:      visaType,
    name:           form.name          || null,
    location:       form.location      || null,
    interview_date: form.interviewDate || null,
    experience:     form.experience,
    status,
  });
  if (!validatePublicPayload(payload)) return false;
  const { error } = await supabase.from("visa_experiences").insert(payload);
  return !error;
}

// ─────────────────────────────────────────────────────────────
// TIPS (immigration_tips, ds160_tips)
// ─────────────────────────────────────────────────────────────
export async function fetchTips(table) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("country_slug", country())
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return cleanRows(data);
}

export async function submitTip(table, form) {
  const status = (await getAutoApprove(table)) ? "approved" : "pending";
  const payload = cleanPayload({
    country_slug: country(),
    status,
    ...form,
  });
  if (!validatePublicPayload(payload)) return false;
  const { error } = await supabase.from(table).insert(payload);
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
    .eq("country_slug", country())
    .eq("status", "approved")
    .gte("event_date", today())
    .order("event_date", { ascending: true });
  if (error) console.error("fetchEvents:", error);
  return cleanRows(data);
}

export async function fetchAllEvents() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("country_slug", country())
    .eq("status", "approved")
    .gte("event_date", today())
    .order("event_date", { ascending: true })
    .limit(12);
  if (error) console.error("fetchAllEvents:", error);
  return cleanRows(data);
}

export async function fetchFilteredEvents(stateSlug) {
  let query = supabase
    .from("events")
    .select("*")
    .eq("country_slug", country())
    .eq("status", "approved")
    .gte("event_date", today())
    .order("event_date", { ascending: true });
  if (stateSlug) query = query.eq("state_slug", stateSlug);
  const { data, error } = await query;
  if (error) console.error("fetchFilteredEvents:", error);
  return cleanRows(data);
}

export async function submitEvent(stateSlug, citySlug, form) {
  const status = (await getAutoApprove("events")) ? "approved" : "pending";
  setSubmitError("");
  const payload = cleanPayload({
    country_slug: country(),
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
  const { error } = await supabase.from("events").insert(payload);
  return !error;
}

// ─────────────────────────────────────────────────────────────
// GLOBAL LAWYERS DIRECTORY
// ─────────────────────────────────────────────────────────────
export async function fetchAllLawyers() {
  const { data, error } = await supabase
    .from("lawyers")
    .select("*")
    .eq("country_slug", country())
    .eq("status", "approved")
    .order("state_slug", { ascending: true })
    .order("city_slug", { ascending: true });
  if (error) console.error("fetchAllLawyers:", error);
  return cleanRows(data);
}

// ─────────────────────────────────────────────────────────────
// ADMIN — reads ALL rows regardless of status
// ─────────────────────────────────────────────────────────────
export async function submitContactMessage(form) {
  const payload = cleanPayload({
    country_slug: country(),
    name: form.name,
    email: form.email,
    message: form.message,
  });
  if (!validatePublicPayload(payload)) return false;
  const { error } = await supabase.from("contact_messages").insert(payload);
  if (error) console.error("submitContactMessage:", error);
  return !error;
}

export async function fetchContactMessages() {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .eq("country_slug", country())
    .order("created_at", { ascending: false });
  if (error) console.error("fetchContactMessages:", error);
  return cleanRows(data);
}

const ALL_TABLES = [
  "jobs", "accommodation", "temples", "lawyers",
  "doctors", "babysitters", "tutors",
  "realtors", "priests", "photographers",
  "visa_experiences", "immigration_tips", "ds160_tips", "events",
];

export async function fetchAllSubmissions() {
  const results = await Promise.all(
    ALL_TABLES.map(async (table) => {
      const { data } = await supabase
        .from(table)
        .select("*")
        .eq("country_slug", country())
        .order("created_at", { ascending: false });
      return cleanRows(data).map(row => ({ ...row, _table: table }));
    })
  );
  return results
    .flat()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

// ─────────────────────────────────────────────────────────────
// SITE STATS — cached 24 hrs in localStorage
// ─────────────────────────────────────────────────────────────
export async function fetchSiteStats() {
  const cacheKey = `apna_stats_${country()}`;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts < 24 * 60 * 60 * 1000) return data;
    }
  } catch (_) {}

  const [visaRes, tipsRes] = await Promise.all([
    supabase.from("visa_experiences").select("*", { count: "exact", head: true }).eq("country_slug", country()).eq("status", "approved"),
    supabase.from("immigration_tips").select("*", { count: "exact", head: true }).eq("country_slug", country()).eq("status", "approved"),
  ]);

  const data = {
    visaExperiences: visaRes.count || 0,
    tips:            tipsRes.count || 0,
  };
  try { localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() })); } catch (_) {}
  return data;
}

export async function updateStatus(table, id, status) {
  const { error } = await supabase
    .from(table)
    .update({ status })
    .eq("id", id);
  return !error;
}

// ─────────────────────────────────────────────────────────────
// CITY STATS — how many sections have at least 1 listing
// ─────────────────────────────────────────────────────────────
const LISTING_TABLES = [
  "jobs","accommodation","temples","lawyers","doctors",
  "babysitters","tutors","realtors","priests","photographers",
];

export async function fetchCityStats(stateSlug, citySlugParam) {
  const counts = await Promise.all(
    LISTING_TABLES.map(t =>
      supabase
        .from(t)
        .select("*", { count: "exact", head: true })
        .eq("state_slug", stateSlug)
        .eq("city_slug", citySlugParam)
        .eq("country_slug", country())
        .eq("status", "approved")
        .then(({ count }) => count || 0)
    )
  );
  return {
    filled: counts.filter(c => c > 0).length,
    total: LISTING_TABLES.length,
  };
}

// ─────────────────────────────────────────────────────────────
// CONFIRM LISTING — increment confirmations via RPC
// ─────────────────────────────────────────────────────────────
export async function confirmListing(table, id) {
  const { error } = await supabase.rpc("increment_confirmations", { p_table: table, p_id: id });
  return !error;
}

// ─────────────────────────────────────────────────────────────
// EMAIL DIGEST — weekly city digest subscriptions
// ─────────────────────────────────────────────────────────────
export async function subscribeDigest(email, stateSlug, citySlug) {
  const { error } = await supabase.from("email_digests").insert({
    email,
    state_slug:   stateSlug,
    city_slug:    citySlug,
    country_slug: country(),
  });
  return !error;
}
