export function getCountrySlug() {
  if (typeof window === "undefined") return "us";
  return window.location.hostname.toLowerCase().startsWith("ca.") ? "ca" : "us";
}

export function getCountryName() {
  return getCountrySlug() === "ca" ? "Canada" : "United States";
}

export function getVisaStartPath() {
  return getCountrySlug() === "ca" ? "/visa/visitor" : "/visa/h1b";
}

export function getFormsResource() {
  return getCountrySlug() === "ca"
    ? {
        label: "IRCC Forms",
        title: "IRCC Application Form Tips",
        addLabel: "+ Your IRCC Form Tip",
        empty: "Be the first to share an IRCC application form tip!",
        description: "Tips from community members who have completed Canadian immigration, visa, permit, and PR application forms.",
        placeholder: "E.g., IMM forms, travel history, employment history, proof of funds, family information, uploading documents...",
      }
    : {
        label: "DS-160",
        title: "DS-160 Tips",
        addLabel: "+ Your DS-160 Tip",
        empty: "Be the first to share a DS-160 tip!",
        description: "Tips from community members who have successfully completed the DS-160 application form.",
        placeholder: "E.g., Always double-check travel history dates. Use exact passport address. Save frequently...",
      };
}
