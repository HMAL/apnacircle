export function getCountrySlug() {
  if (typeof window === "undefined") return "us";
  return window.location.hostname.toLowerCase().startsWith("ca.") ? "ca" : "us";
}

export function getCountryName() {
  return getCountrySlug() === "ca" ? "Canada" : "United States";
}
