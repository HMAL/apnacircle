import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { f, useToast, Toast, fmtDate } from "../../components/formHelpers";
import { fetchTips, getSubmitError, submitTip } from "../../lib/db";
import AdBlock from "../../components/AdBlock";
import { useIsMobile } from "../../lib/useIsMobile";
import { getCountrySlug } from "../../lib/country";
import ResourceNav from "../../components/ResourceNav";

// ─── Canada Immigration Interview Guide ───────────────────────────────────────
const CA_IMMIGRATION_GUIDE = [
  {
    section: "General Background Questions",
    rows: [
      { q: "Please introduce yourself and tell us why you want to immigrate to Canada.", a: "Be concise: mention your professional background, what draws you to Canada, and your long-term plans. Officers want to see a clear, genuine motivation — not a rehearsed speech." },
      { q: "Have you ever visited Canada before?", a: "Answer factually. If yes, briefly describe when and why. If no, explain how you have researched Canadian life, culture, and your intended city." },
      { q: "Why did you choose Canada over other countries?", a: "Speak to specific qualities — job market, quality of life, multicultural environment, or existing community ties. Be specific rather than generic." },
    ],
  },
  {
    section: "Educational and Work Background Questions",
    rows: [
      { q: "Can you describe your educational qualifications?", a: "State your highest degree, field of study, and institution. If you have an Educational Credential Assessment (ECA), mention it. Bring transcripts and any accreditation documents." },
      { q: "What is your current employment status?", a: "Describe your role, employer, and how long you have held the position. Employment letters and recent pay stubs support your answer." },
      { q: "How does your work experience relate to your application?", a: "Connect your NOC code or job offer to your actual duties. Be prepared to walk the officer through your day-to-day responsibilities if asked." },
    ],
  },
  {
    section: "Intent and Eligibility Questions",
    rows: [
      { q: "What are your plans after arriving in Canada?", a: "Describe your housing plan, job search strategy (or confirmed employer), and how you intend to become self-sufficient. Concrete plans reassure the officer." },
      { q: "Do you have any relatives or friends in Canada?", a: "If yes, provide names and their status. If no, explain your independent settlement plan — savings, community organizations, online resources." },
      { q: "How will you support yourself financially in Canada?", a: "Reference your proof of funds — bank statements, a job offer letter, or settlement savings. Know the minimum required amount for your application type." },
    ],
  },
  {
    section: "Permanent Resident (PR) Questions",
    rows: [
      { q: "What do you know about your rights and responsibilities as a permanent resident?", a: "Key points: you must be physically present in Canada at least 730 days in every 5-year period to maintain PR status; you can work for any employer; you have access to most publicly funded health care; you must pay taxes and obey all laws." },
      { q: "Have you ever been refused a visa or entry to Canada or another country?", a: "Answer honestly. Disclose all refusals and bring supporting documents. Misrepresenting a refusal is grounds for a finding against you." },
      { q: "Why do you want to become a permanent resident of Canada?", a: "Focus on long-term commitment: career goals, family plans, contribution to your community. This should align with the rest of your application." },
    ],
  },
  {
    section: "Spousal Sponsorship Questions",
    rows: [
      { q: "How did you meet your spouse?", a: "Give a specific, chronological account. Bring supporting evidence: photos with dates, communication records, travel history together." },
      { q: "When did you get married, and who attended your wedding?", a: "Provide exact dates, location, and the names of key guests. Your marriage certificate and wedding photos should be readily accessible." },
      { q: "How do you and your spouse communicate?", a: "Describe your typical week — daily calls, messages, video chats. Be specific about frequency and platform. Communication logs can be submitted." },
      { q: "What are your spouse's hobbies, job, and daily routine?", a: "Demonstrate genuine familiarity. Officers ask this to assess whether the relationship is authentic. Know details only a close partner would know." },
      { q: "What are your future plans as a couple in Canada?", a: "Describe where you plan to settle, each partner's work plans, housing arrangements, and longer-term family plans." },
    ],
  },
  {
    section: "Study Permit Questions",
    rows: [
      { q: "Why did you choose this course and institution in Canada?", a: "Be specific about the program, the institution's strengths, and how it advances your career. Vague answers ('it's a good school') raise flags." },
      { q: "How will this program benefit your career?", a: "Describe the skills or credentials you will gain and how they apply to your career goals — in Canada or back home." },
      { q: "Who is funding your studies?", a: "State your funding source clearly (family, savings, scholarship) and have documentation ready. Officers want to confirm funds cover tuition and living costs for the full program." },
      { q: "What are your plans after graduation?", a: "If pursuing a Post-Graduation Work Permit (PGWP), explain how it fits your path. If returning home, demonstrate clear ties to your home country." },
    ],
  },
  {
    section: "Work Permit Questions",
    rows: [
      { q: "Can you describe your job offer in Canada?", a: "Cover role title, employer, start date, salary, and key duties. Have your employment contract and LMIA (if applicable) ready to show." },
      { q: "Why did your employer choose you for this role?", a: "Explain the specific qualifications, experience, or skills that made you the right candidate — especially any that are hard to fill locally." },
      { q: "Do you plan to stay in Canada after your work permit expires?", a: "Be honest. If you intend to pursue PR, say so and name the pathway (e.g., Express Entry, PNP). If you plan to return home, explain why." },
    ],
  },
  {
    section: "Visitor Visa Questions",
    rows: [
      { q: "What is the purpose of your visit to Canada?", a: "State clearly: tourism, visiting family/friends, or business. Bring supporting documents matching your stated purpose — hotel bookings, invitation letter, conference registration." },
      { q: "How long do you plan to stay in Canada?", a: "Give specific dates. A return ticket and a defined itinerary show the officer you intend to leave within your authorized period." },
      { q: "Do you have ties to your home country?", a: "Ties mean reasons to return: employment, family, property, business. The stronger your ties, the more convincing your case that you will not overstay." },
    ],
  },
  {
    section: "Border Entry Questions",
    rows: [
      { q: "What is the purpose of your visit to Canada?", a: "Identify your status clearly (visitor, worker, student, or PR) and have all relevant documents out before approaching the officer." },
      { q: "How much money are you bringing to Canada?", a: "Declare all currency. Amounts of CAD $10,000 or more must be reported to CBSA. Failure to declare can result in seizure and penalties." },
      { q: "Do you have any goods to declare?", a: "Disclose all applicable items including food, plants, animal products, and commercial goods. When in doubt, declare — officers appreciate honesty." },
    ],
  },
];

// ─── Port of Entry guide ──────────────────────────────────────────────────────
const PORT_OF_ENTRY = [
  {
    section: "What to Expect Upon Arrival",
    rows: [
      { q: "Arrival procedure", a: "Follow signs to the CBP primary inspection area. Have your passport and immigration documents in hand. The officer will ask about your purpose of travel and may ask to see supporting documents." },
      { q: "Common officer questions", a: "Officers typically ask where you are going, how long you plan to stay, and about your employer or school. Answer clearly and factually; do not volunteer information that was not asked for." },
      { q: "After primary inspection", a: "The officer will return your documents and may stamp your passport indicating your authorized period of admission. Check the date before you leave." },
      { q: "Secondary inspection", a: "If the officer cannot immediately verify your status or documents, you may be referred to secondary inspection. Stay calm, cooperate, and have your supporting documents ready. Secondary inspection is common and does not automatically mean a problem." },
      { q: "Land border crossings", a: "Travelers entering by land must pre-request an I-94 record online before crossing. Air and sea travelers receive an electronic I-94 automatically." },
    ],
  },
  {
    section: "Required Documents — All Visa Types",
    rows: [
      { q: "Passport", a: "Must be valid for at least six months beyond your intended stay." },
      { q: "Valid U.S. visa stamp", a: "Required for all nationalities except Canadian citizens and those entering under the Visa Waiver Program with a valid ESTA." },
      { q: "Status document", a: "Form I-20 for F-1 students · Form DS-2019 for J-1 exchange visitors · I-797 Approval Notice for H-1B, O-1, and other petition-based workers." },
      { q: "I-94 Arrival/Departure Record", a: "Issued electronically for air and sea arrivals. Land border travelers must pre-request at i94.cbp.dhs.gov before crossing." },
      { q: "SEVIS fee receipt", a: "Required for F-1 and J-1 visa holders only. Print a copy from the SEVP payment portal." },
      { q: "Financial documentation", a: "Bank statements or a financial support letter showing you have sufficient funds for the duration of your stay." },
      { q: "Employment or enrollment confirmation", a: "An offer letter or contract for workers; an acceptance or enrollment letter for students." },
    ],
  },
];

// ─── Common CBP questions by visa type ────────────────────────────────────────
const CBP_QUESTIONS = [
  {
    section: "General Questions (All Travelers)",
    rows: [
      { q: "Where do you live?" },
      { q: "What is the purpose of your travel to the United States?" },
      { q: "Are you traveling alone or with others?" },
      { q: "How long do you plan to stay in the U.S.?" },
      { q: "Where will you be staying?" },
      { q: "Who will you be visiting during your visit?" },
      { q: "Have you traveled to any other countries recently?" },
      { q: "Have you ever been arrested or convicted of a crime?" },
      { q: "Do you have anything to declare?" },
      { q: "Are you carrying any food, plants, or animal products?" },
    ],
  },
  {
    section: "Green Card Holders (Legal Permanent Residents)",
    rows: [
      { q: "Do you have your green card with you?" },
      { q: "Where is your primary residence?" },
      { q: "How long have you been outside the U.S.?" },
      { q: "What was the purpose of your trip?" },
      { q: "Have you worked outside the U.S.?" },
    ],
  },
  {
    section: "Employment Visa Holders (H-1B, L-1, O-1)",
    rows: [
      { q: "Who is your U.S. employer?" },
      { q: "What will your job duties be?" },
      { q: "Where will you be working?" },
      { q: "What is the duration of your assignment?" },
      { q: "Do you have your approved petition?" },
    ],
  },
  {
    section: "Business Visa Holders (B-1)",
    rows: [
      { q: "What do you plan to do during your stay?" },
      { q: "Who will you be meeting with?" },
      { q: "Do you have a return ticket?" },
      { q: "What is your occupation in your home country?" },
      { q: "How are you funding your trip?" },
      { q: "Have you visited the United States before?" },
      { q: "Do you intend to seek work or study while in the U.S.?" },
    ],
  },
  {
    section: "International Students (F-1, M-1, J-1)",
    rows: [
      { q: "Which school are you attending?" },
      { q: "What is your major or course of study?" },
      { q: "Are you returning to resume classes?" },
      { q: "Can you show your Form I-20?" },
      { q: "Do you have proof of SEVIS fee payment?" },
    ],
  },
  {
    section: "Asylees and Refugees",
    rows: [
      { q: "Do you have documentation proving your status?" },
      { q: "What is your current U.S. address?" },
      { q: "Are you returning permanently?" },
      { q: "Where have you been traveling?" },
    ],
  },
  {
    section: "Tourists (B-2 Visa)",
    rows: [
      { q: "What do you plan to do during your stay?" },
      { q: "Do you have a return ticket?" },
      { q: "What is your occupation in your home country?" },
      { q: "How are you funding your trip?" },
      { q: "Have you visited the United States before?" },
      { q: "How often do you come to the United States?" },
      { q: "Do you intend to seek work or study while in the U.S.?" },
    ],
  },
];

// ─── Document checklists (moved from VisaPage) ───────────────────────────────
const US_CHECKLISTS = {
  h1b:   ["Valid passport (6+ months beyond stay)", "DS-160 confirmation page", "I-797 H-1B approval notice (original)", "Labor Condition Application (LCA)", "Employer offer / employment verification letter", "Recent pay stubs and W-2s (if renewing)", "Educational degrees and transcripts", "Passport photos (2×2 in, white background)", "MRV visa fee receipt"],
  f1:    ["Valid passport (6+ months beyond stay)", "DS-160 confirmation page", "Form I-20 from your school (original)", "SEVIS fee receipt (I-901)", "Acceptance letter from US institution", "Proof of financial support (bank statements)", "Academic transcripts and diplomas", "Test scores (TOEFL, GRE/GMAT if required)", "Passport photos (2×2 in, white background)", "MRV visa fee receipt"],
  b1b2:  ["Valid passport (6+ months beyond stay)", "DS-160 confirmation page", "Bank statements (last 3–6 months)", "Proof of employment / business ownership", "Travel itinerary and hotel bookings", "Ties to home country (property, family, job letter)", "Invitation letter if visiting family", "Passport photos (2×2 in, white background)", "MRV visa fee receipt"],
  h4:    ["Valid passport", "DS-160 confirmation page", "Primary H-1B holder's valid visa and I-797", "Marriage / birth certificate (translated if needed)", "Proof of relationship (photos, communication records)", "Passport photos (2×2 in, white background)", "MRV visa fee receipt"],
  l1:    ["Valid passport", "DS-160 confirmation page", "I-797 L-1 approval notice", "Company support letter explaining role", "Evidence of qualifying relationship between companies", "Proof of employment abroad (pay stubs, letter)", "Org chart showing your position", "Passport photos (2×2 in, white background)", "MRV visa fee receipt"],
  other: ["Valid passport (6+ months beyond stay)", "DS-160 confirmation page", "Petition approval notice (I-797 or equivalent)", "Sponsor / employer support letter", "Evidence of qualifications", "Passport photos (2×2 in, white background)", "MRV visa fee receipt"],
};

const CA_CHECKLISTS = {
  "visitor":       ["Valid passport", "IMM 5257 Visitor Visa application", "Passport photos (IRCC spec)", "Proof of financial support (bank statements)", "Proof of ties to home country", "Travel itinerary and accommodation details", "Invitation letter (if visiting family/friends)", "Biometrics enrollment (if required)"],
  "study-permit":  ["Valid passport", "Acceptance letter from a Designated Learning Institution (DLI)", "Proof of funds (tuition + ~$10,000 CAD living)", "IMM 1294 Study Permit application", "Passport photos (IRCC spec)", "Quebec CAQ certificate (if studying in Quebec)", "Biometrics enrollment", "Medical exam (if required)"],
  "work-permit":   ["Valid passport", "Job offer letter / LMIA from employer", "IMM 1295 Work Permit application", "Proof of qualifications and credentials", "Proof of financial support", "Passport photos (IRCC spec)", "Biometrics enrollment", "Medical exam (if required)"],
  "express-entry": ["Valid passport", "Educational Credential Assessment (ECA) report", "IELTS / CELPIP language test scores", "Reference letters and pay stubs for each job", "Police certificates (all countries lived in 6+ months)", "Medical exam results (upfront medicals recommended)", "Proof of settlement funds", "PNP nomination letter (if applicable)"],
  "pnp":           ["Valid passport", "Provincial nomination certificate", "Educational Credential Assessment (ECA)", "Language test scores (IELTS/CELPIP/TEF)", "Proof of work experience", "Police clearance certificates", "Medical exam results", "Proof of settlement funds"],
  "super-visa":    ["Valid passport", "Invitation letter from Canadian child/grandchild", "Proof of child/grandchild's citizenship or PR", "Canadian private health insurance ($100K+ coverage, 1 yr)", "Proof of Canadian host's income/assets", "IMM 5257 Visitor Visa application", "Proof of ties to home country", "Biometrics enrollment"],
  "other":         ["Valid passport", "Relevant IRCC application forms", "Passport photos (IRCC spec)", "Supporting documents for your specific application", "Biometrics enrollment (if required)", "Medical exam (if required)"],
};

const US_VISA_TYPES_CL = [
  { id: "h1b", label: "H-1B" }, { id: "f1", label: "F-1" }, { id: "b1b2", label: "B-1/B-2" },
  { id: "h4", label: "H-4" }, { id: "l1", label: "L-1" }, { id: "other", label: "Other" },
];
const CA_VISA_TYPES_CL = [
  { id: "visitor", label: "Visitor Visa" }, { id: "study-permit", label: "Study Permit" },
  { id: "work-permit", label: "Work Permit" }, { id: "express-entry", label: "Express Entry" },
  { id: "pnp", label: "PNP" }, { id: "super-visa", label: "Super Visa" }, { id: "other", label: "Other" },
];

function VisaChecklist({ isCA }) {
  const types  = isCA ? CA_VISA_TYPES_CL : US_VISA_TYPES_CL;
  const [visaId, setVisaId] = useState(types[0].id);
  const key    = `apna_checklist_${isCA ? "ca" : "us"}_${visaId}`;
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
  });
  const [open, setOpen] = useState(false);
  const items  = isCA ? (CA_CHECKLISTS[visaId] || CA_CHECKLISTS["other"]) : (US_CHECKLISTS[visaId] || US_CHECKLISTS["other"]);

  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem(key)) || {}); } catch { setChecked({}); }
  }, [key]);

  const toggle = i => {
    const next = { ...checked, [i]: !checked[i] };
    setChecked(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  const done  = items.filter((_, i) => checked[i]).length;
  const total = items.length;

  return (
    <div style={s.checklistCard}>
      <button style={s.checklistToggle} onClick={() => setOpen(v => !v)}>
        <span>📋 Document Checklist</span>
        <span style={s.checklistProgress}>{done}/{total} ready</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#888" }}>{open ? "▲ hide" : "▼ show"}</span>
      </button>
      {open && (
        <div style={s.checklistBody}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {types.map(t => (
              <button key={t.id} onClick={() => setVisaId(t.id)}
                style={{ padding: "5px 14px", border: "0.5px solid var(--border)", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", background: visaId === t.id ? "var(--orange)" : "#fff", color: visaId === t.id ? "#fff" : "#555" }}>
                {t.label}
              </button>
            ))}
          </div>
          {items.map((item, i) => (
            <label key={i} style={s.checkItem}>
              <input type="checkbox" checked={!!checked[i]} onChange={() => toggle(i)}
                style={{ accentColor: "var(--orange)", width: 15, height: 15, flexShrink: 0 }} />
              <span style={{ ...s.checkLabel, textDecoration: checked[i] ? "line-through" : "none", color: checked[i] ? "#aaa" : "#333" }}>{item}</span>
            </label>
          ))}
          {done === total && (
            <div style={s.checkDone}>✓ All documents ready — good luck with your interview!</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── DS-160 Field Guide data (from ILG DS-160 Q&A guide) ──────────────────────
const DS160_GUIDE = [
  {
    section: "Personal Information 1",
    rows: [
      { q: "Surname", a: "Enter your surname as it appears in your passport. Your surname is your last name (or family name). If your surname consists of multiple names, please enter them all. If only one name is listed in your passport, enter that Surname." },
      { q: "Given Names", a: "Enter your given name as it appears in your passport. Given name includes both your first and middle name. Please enter the exact spelling and name in the order indicated in your passport. If your passport does not include a given name, please enter 'FNU' in Given Name." },
      { q: "Full Name in Native Alphabet", a: "Click \"does not apply\" if your native language utilizes the alphabet." },
      { q: "Have you ever used other names? (maiden, religious, professional, alias, etc.)", a: "If not, select 'No'. If you used any other names in the past, select 'Yes' and list them here. If there are different variations of your name in different documents, you can enter those variations here." },
      { q: "Do you have a telecode that represents your name?", a: "If yes (i.e., your native language does not utilize the alphabet), you will need to list it here." },
      { q: "Sex", a: "Self-explanatory." },
      { q: "Marital Status", a: "Self-explanatory." },
      { q: "Date of Birth", a: "Enter in the order of 'day, month, year'. Make sure this date matches your passport." },
      { q: "Place of Birth", a: "Place where you were born. Write down the city (village/town), state/province and country you were born. Use the current city name (e.g., use \"Ho Chi Minh City\" and not \"Saigon\")." },
      { q: "State/Province of Birth", a: "If State/Province is not applicable, check \"does not apply\"." },
      { q: "Country of Birth", a: "Use the current country name." },
    ],
  },
  {
    section: "Personal Information 2",
    rows: [
      { q: "Country/Region of Origin (Nationality)", a: "Your nationality is your citizenship country, which may be different from your birth country." },
      { q: "Do you hold or have held a nationality other than the one indicated above?", a: "Answer \"yes\" or \"no\". If you answer \"yes\", enter the details about each nationality you had." },
      { q: "Other Nationality", a: "Select from list." },
      { q: "Do you hold a passport for the nationality above?", a: "Answer \"yes\" or \"no\". If yes, provide the Passport Number." },
      { q: "National Identification Number", a: "If your country has such a number, write it here. For example, for India, check \"does not apply\"." },
      { q: "US Social Security Number (US SSN)", a: "If you were ever issued a US SSN, enter it here. Otherwise, check \"does not apply\"." },
      { q: "US Taxpayer ID #", a: "If you were issued an ITIN number or any other US taxpayer ID #, enter it here. Otherwise, check \"does not apply\". Do not enter US SSN here." },
    ],
  },
  {
    section: "Address and Phone",
    rows: [
      { q: "Home Address", a: "Please enter complete home address, including apartment #, street, city, state or province, postal code and country. This address should be the one you have been residing for the past six months. It can differ from your permanent address mentioned in the passport. If you currently reside in the US, please list your foreign home address here. Note: the online system does not allow a forward slash \"/\" as part of the address — use a dash \"-\" in its place." },
      { q: "Mailing Address", a: "Is your mailing address the same as your home address? If you answer \"no\" you will be asked to enter your entire mailing address. Your passport with the visa stamp will be sent to this address." },
      { q: "Primary Phone #", a: "You can enter a land line or cell number, whichever you are most likely to be reached." },
      { q: "Secondary Phone #", a: "If you have an additional land line or cell phone number, please list here. If you don't have one, click \"does not apply\"." },
      { q: "Work Phone #", a: "Type in your work phone # if you have one. Otherwise, click \"does not apply\"." },
      { q: "Email Address", a: "Type your email address here. If you do not have one, click \"does not apply\". If you provide one, this email may be used by the consulate to send a confirmation of appointment or other communication." },
    ],
  },
  {
    section: "Passport Information",
    rows: [
      { q: "Passport / Travel Document Type", a: "Select the appropriate document type from the list: regular, official, diplomatic or other." },
      { q: "Passport Number", a: "List the number from your current passport, not from previous passports. This must be the same passport you will be using when traveling to the US. It should be a valid unexpired passport of at least six months or longer. Note: if your passport will expire in less than one year, it is generally advisable to secure a new passport before you apply for a visa." },
      { q: "Passport Book Number", a: "This is also commonly known as the inventory control number. You may or may not have a passport book number on your passport. Please contact your passport issuing authority if you are unable to determine whether your passport contains one. Click \"does not apply\" if not applicable. Indian passports do not have a passport book number." },
      { q: "Country / Authority that Issued Passport", a: "This should be the country you are a citizen of even though you may have received your passport while you were in another country." },
      { q: "Where was the Passport Issued — City", a: "Write in the city name where you applied for your passport. For example, if you applied for your Indian passport in San Francisco, CA, write \"San Francisco\" here." },
      { q: "Where was the Passport Issued — State/Province", a: "For example, if your Indian passport was issued in San Francisco, CA, write \"California\" here." },
      { q: "Where was the Passport Issued — Country", a: "For example, if your Indian passport was issued in the U.S., select \"United States\" here." },
      { q: "Issuance Date", a: "Date the passport was issued." },
      { q: "Expiration Date", a: "Date the passport expires. In most cases, your passport must have at least six months of validity beyond the date of your visa application and/or arrival in the US. Some countries are exempt from this rule." },
      { q: "Have you ever lost a passport or had one stolen?", a: "Answer \"yes\" or \"no\" accordingly. If yes, enter the passport number or \"do not know\", the country/authority that issued the passport, and provide an explanation if needed. If you had more than one passport lost or stolen, click \"add another\" and enter the information." },
      { q: "Note: No First / Last Name on Passport", a: "If your entire name is written in the surname field and the given name field is left blank, the consulate will treat your entire name as your surname and write \"FNU\" (First Name Unknown) in the first name section. If you do not want \"FNU\" or \"LNU\" as part of your visa name, get your passport changed before applying." },
    ],
  },
  {
    section: "Travel Information",
    rows: [
      { q: "Purpose of Trip to the US", a: "Pick the category that is appropriate for you." },
      { q: "Specify", a: "Pick the sub-category that is appropriate for you." },
      { q: "Dependent Visas", a: "You will be asked the surname and given name of the primary applicant." },
      { q: "Application Receipt / Petition Number", a: "Applicable for CW/E2C, H, K, L, O, P, R, T or U visas." },
      { q: "Principal Applicant's Company Name", a: "Only used if applicant is not the Principal applicant and trip purpose is Treaty Trader/Investor (E1, E2)." },
      { q: "Intended Date of Arrival", a: "If unsure of travel plans, provide an estimated date." },
      { q: "Intended Length of Stay in US", a: "Select accordingly." },
      { q: "Address where you will stay in the US", a: "It can be a hotel if you don't know where you will be staying upon arrival. Provide a specific hotel address, not just \"any hotel\". If you are employed in the US and maintain an apartment there, provide that address and telephone number. Note: upon arrival and any change of address, you must complete Form AR-11 change of address form for you and each accompanying family member." },
      { q: "Person / Entity Paying for Your Trip", a: "If you choose \"Self\" or \"U.S. Petitioner\", no further questions will be asked. If you choose \"other person\", you will be asked to provide the name of the person who has agreed to support you financially while you are in the US." },
    ],
  },
  {
    section: "Travel Companions Information",
    rows: [
      { q: "Are there any other persons traveling with you?", a: "Answer \"yes\" if you have family members traveling with you. You will need to know their full names and relationships to you." },
      { q: "Are you traveling as part of a group or organization?", a: "If \"yes\", provide the group or organization's name. If \"no\", provide the surnames, given names and relationship to the person(s) traveling with you. Click \"add another\" if you have more than one companion. You can prepare a family/group application once you are done with the first applicant's application — all of you will be interviewed at the same time." },
    ],
  },
  {
    section: "Previous U.S. Travel Information",
    rows: [
      { q: "Have you ever been in the US?", a: "If \"yes\", provide the date of arrival and length of stay for each of your last five visits. If you are unsure about the dates, provide your best estimate. The consulate will review your answer to see whether you violated any visa terms during prior visits." },
      { q: "Did you ever hold a US driver's license?", a: "If \"yes\", provide the driver's license number or check \"do not know\". Click \"add another\" if you have had more than one US driver's license." },
      { q: "Have you ever been issued a US visa?", a: "If \"yes\", provide the date your last visa was issued and the visa number (click \"do not know\" if appropriate). The visa # is the red number towards the lower right side of the visa stamp. For a lost or stolen visa, select \"do not know\"." },
      { q: "Are you applying for the same type of visa?", a: "Answer \"yes\" or \"no\"." },
      { q: "Are you applying in the same country where the visa above was issued and is this your principal country of residence?", a: "Answer \"yes\" or \"no\"." },
      { q: "Have you been ten-printed?", a: "Answer \"yes\" or \"no\". Ten-printed means that you have provided fingerprints of all your fingers, as opposed to only two fingerprints." },
      { q: "Has your US visa ever been lost or stolen?", a: "If \"yes\", you will need to provide the year it was lost or stolen." },
      { q: "Has your US visa ever been cancelled or revoked?", a: "If \"yes\", provide an explanation." },
      { q: "Have you ever been refused a US visa, refused admission to the US, or withdrawn your application for admission at the point of entry?", a: "If \"yes\", provide an explanation. If your visa was refused under Section 221(g) and you later received the visa, it is nonetheless a refusal — you must respond \"yes\" and explain the reason for the refusal and outcome." },
      { q: "Has anyone ever filed an immigrant petition on your behalf with USCIS?", a: "If a company has filed an I-140 petition on your behalf, select \"yes\". In the explanation box, list the petitioner's name, EB category, and Alien # if applicable." },
    ],
  },
  {
    section: "U.S. Point of Contact Information",
    rows: [
      { q: "Contact Person", a: "Your US point of contact can be any individual in the US who knows you. You can provide last name and given name or enter \"do not know\". If you do not know anyone in the US, you may enter the name of the company or organization you plan to visit." },
      { q: "Organization Name", a: "Specify the organization name or click \"do not know\". If you do not have any contact in the US, enter the name of the hotel where you will be staying." },
      { q: "Relationship to You", a: "Select from the drop-down menu." },
      { q: "Address and Phone # of Point of Contact", a: "Self-explanatory." },
      { q: "Email Address", a: "Provide email address or click \"does not apply\"." },
    ],
  },
  {
    section: "Family Information: Relatives",
    rows: [
      { q: "Immediate Relatives in the US (not including parents)", a: "Choose \"yes\" or \"no\" and indicate that person's status in the US (US legal permanent resident, US Citizen, visiting, studying, working, etc.). If the relative is in the Adjustment of Status process, the legal status selected should be \"non-immigrant\". This includes fiancé/fiancée, spouse, child or sibling. Click \"add another\" to add multiple relatives." },
      { q: "Family Information – Spouse", a: "This section may or may not appear depending on how you answer your marital status in the Personal Information section. Enter your current spouse's information. If divorced, enter your previous spouse's information. This information is required even if your spouse is not traveling with you or applying for a visa with you." },
    ],
  },
  {
    section: "Present Work / Education / Training",
    rows: [
      { q: "Primary Occupation", a: "Choose from the list provided. If you choose \"other\", you will be asked to specify." },
      { q: "Present Employer or School Name", a: "Self-explanatory." },
      { q: "Present Employer or School Address", a: "Self-explanatory." },
      { q: "Monthly Income in Local Currency", a: "List income if employed. If not, check \"does not apply\"." },
      { q: "Briefly Describe Your Duties", a: "Look to the H-1B/L-1 support letter for language to use." },
      { q: "Were you previously employed?", a: "If \"yes\", provide employer name, complete address, telephone number, job title, supervisor's name, date of employment and briefly describe your duties. You can add multiple employers by clicking \"add another\"." },
      { q: "Do you belong to a clan or tribe?", a: "If \"yes\", list the name of the clan or tribe." },
      { q: "Have you traveled to any countries within the last five years?", a: "If \"yes\", list all countries visited in the past five years." },
      { q: "Have you belonged to, contributed to, or worked for any professional, social or charitable organization?", a: "If \"yes\", provide a list of organizations." },
      { q: "Do you have any specialized skills or training (firearms, explosives, nuclear, biological or chemical experience)?", a: "If \"yes\", explain in detail and expect delays as a background check is likely required." },
      { q: "Have you ever served in the military?", a: "If \"yes\", provide the country you served, branch of service, rank/position, military specialty, and date of service." },
      { q: "Have you ever served in or been involved with a paramilitary unit, vigilante unit, rebel group, guerrilla group, or insurgent organization?", a: "If \"yes\", explain in detail and expect delays as a background check is likely required." },
    ],
  },
  {
    section: "Security and Background",
    rows: [
      { q: "Security & Background Questions", a: "If you check \"yes\" to any of these questions, you may be denied the visa. Please seek advice from an immigration attorney should you have questions regarding this section." },
    ],
  },
  {
    section: "Temporary Work Visa Information",
    rows: [
      { q: "Employer Information", a: "If you indicated that the purpose of your trip to the US is to work temporarily, provide the additional information about your employer in this section." },
    ],
  },
  {
    section: "Upload Photo & Submission",
    rows: [
      { q: "Upload Photo", a: "Click on the \"Upload Your Photo\" button. Your photo must be in JPEG image format and the file size should be 240 KB or less. If your photo is accepted, it will indicate so. If you see an \"x\" in the box where the photo should be, the photo upload has failed — you will need to submit one printed photograph along with the confirmation page at the interview." },
      { q: "Preparer of Application", a: "If the application was prepared by another person on your behalf, answer \"yes\" and ask that person to fill out this section. However, you must be the one to click the \"submit\" button since it serves as your electronic signature." },
      { q: "Signature", a: "If the applicant is under 16 or is unable to electronically sign the form for any reason, their parents, guardians or other individuals who have legal custody over them must submit the form on their behalf." },
      { q: "Confirmation Page", a: "Once you complete the online form, carry the printout of the confirmation sheet with a barcode to your interview. You must print it with a laser printer so the barcode can be properly read. You do not need to print the DS-160 form itself. Before closing the application, click on the \"email confirmation\" button to have a copy emailed to you for your records." },
    ],
  },
];

// ─── Visa Application & DS-160 FAQ data (from Harvard HIO FAQ guide) ──────────
const VISA_FAQ = [
  {
    section: "Visa Fee Questions",
    rows: [
      { q: "Am I required to pay the I-901 SEVIS fee?", a: "Yes. All incoming students, scholars, and student interns must pay the I-901 SEVIS fee before applying for the F-1 or J-1 visa. The only exceptions are for individuals transferring an existing F-1 or J-1 visa status or those renewing their visa." },
      { q: "Do I have to pay the SEVIS fee again if I am renewing my visa?", a: "No. You must pay the SEVIS fee when starting your F-1 or J-1 program; your SEVIS ID should remain the same throughout the duration of your program, even if your program has been extended. You will, however, need to pay a new SEVIS fee if your SEVIS ID is changed, for instance for students returning from a leave of absence on a new SEVIS record." },
      { q: "What are the other visa fees I will be required to pay?", a: "All visa applicants are required to pay the Machine Readable Visa (MRV) Fee of $160. Additional visa fees can vary from country to country depending on reciprocity agreements that the U.S. Department of State may have with your home country's government." },
      { q: "Do my F-2 or J-2 dependents have to pay their own SEVIS fees?", a: "No. Only the F-1 or J-1 applicant has to pay the SEVIS fee; dependents are covered by the F-1 or J-1 SEVIS fee. F-2 and J-2 dependents do NOT have to pay a SEVIS fee." },
    ],
  },
  {
    section: "Visa Application Process",
    rows: [
      { q: "What are current wait times for a visa appointment or visa issuance?", a: "Current visa wait times are available on the U.S. Department of State website. Please also allow additional time for your passport to be returned to you; some consulates may notify you of when to pick it up, or your passport may be couriered to you." },
      { q: "Is there a way to expedite my visa appointment or visa issuance?", a: "U.S. Consulates generally prioritize F-1 student and J-1 Exchange Visitor visa applications. If the earliest appointments available are after your arrival date, follow the U.S. Embassy or Consulate's instructions to request an emergency or expedited appointment. You cannot request an expedite until you have scheduled an appointment. Instructions vary among consulates — review the specific website for the post where you will apply." },
      { q: "There are no appointments available to book. What should I do?", a: "Keep checking the calendar for more appointment spots to open. Early in the morning tends to be a good time to check for cancellations and new openings. You may also compare wait times at all U.S. Embassies and Consulates worldwide on the U.S. Department of State website." },
      { q: "Can I apply at a U.S. Embassy that is not in my home country?", a: "It is recommended to apply in your home country or country of residency. If impossible, you may explore appointment wait times for neighboring countries on the U.S. Department of State's Visa Appointment Wait Times database. Ensure the Embassy or Consulate you choose accepts applications from third country nationals (TCNs). Applying in Canada or Mexico is not recommended unless you are a resident of those countries." },
      { q: "There is no U.S. Embassy or Consulate in my country. What should I do?", a: "Consider which neighboring countries you are able to travel to for a visa appointment and check that they will accept appointments from third country nationals. Citizens of some countries may have designated posts where they should apply." },
      { q: "Do I qualify for an interview waiver?", a: "Eligibility for the interview waiver will be determined by the U.S. Embassy or Consulate after you submit your DS-160. If granted a waiver, you will be instructed to mail in or drop off your application materials. In most cases, if you have never traveled to the U.S., you will be called for an in-person interview for biometrics collection." },
      { q: "Do I need to submit a DS-7002 Training/Internship Placement Plan (TIPP) with my visa application?", a: "Only if you are coming as a J-1 Student Intern. This form is required for J-1 student interns ONLY. If you are coming as a J-1 Professor, Research Scholar, Short-Term Scholar, Specialist, or Student, you do NOT need to submit a DS-7002 TIPP." },
    ],
  },
  {
    section: "DS-160 Specific Questions",
    rows: [
      { q: "Where is the code for my field of study on the F-1 I-20?", a: "For F-1 Students, the field of study code is located under the PROGRAM OF STUDY section of the I-20." },
      { q: "Where is the code for my field of study on the J-1 DS-2019?", a: "For J-1 Students and Scholars, the field of study code can be found under #4 Exchange Visitor Category section of the DS-2019." },
      { q: "The name of my major does not match the field of study on my I-20 or DS-2019 — what should I do?", a: "The codes on the I-20 and DS-2019 are government CIP (Classification of Instructional Program) codes established by the U.S. Department of Education. Sometimes the names of these codes do not precisely match program names — this is a common occurrence and is not an error." },
      { q: "How do I find the SEVIS number?", a: "For F-1 Students, the SEVIS Number is found on the upper left-hand corner of the I-20. For J-1 Students and Scholars, the SEVIS Number is found on the upper right-hand corner of the DS-2019." },
      { q: "Whom can I receive a personal reference from if I have not been employed in the past?", a: "Many students, particularly undergraduates, have asked their school counselor, teachers, or family friends for personal references." },
      { q: "Am I required to provide social media usernames on my visa application?", a: "Yes. Visa applicants must provide information about any social media platforms used during the five years before their visa application. You are required to provide any usernames or handles used on platforms including Facebook, Instagram, LinkedIn, Reddit, Twitter, Weibo, YouTube, and more. You can make selections from a pulldown menu on the DS-160 form." },
      { q: "Do my F-2 or J-2 dependents each need to submit their own DS-160?", a: "Yes. Each visa applicant must complete and submit their own DS-160 and pay a visa application fee prior to their visa interviews. If any family member is under the age of 16 or physically unable to complete the application, their parent or guardian may complete and sign the application on their behalf." },
      { q: "Some of my information has changed. May I edit the DS-160 after I have submitted it?", a: "Applicants cannot reopen submitted DS-160 applications. To update: (1) Log into the CEAC system, select \"Retrieve an Application\" using the previous application ID, then select \"Create a New Application\" — the form will auto-populate with prior information. (2) If you saved the DAT file from the original application, you can upload and amend it via \"Upload a Previously Saved Application\". If the original DS-160 was used to book the appointment, you must present confirmation pages from both the new AND original DS-160 at the interview." },
    ],
  },
  {
    section: "Renewing a Visa",
    rows: [
      { q: "Do I need to complete and submit a new DS-160 if I am renewing a visa?", a: "Yes. You will need to complete a new DS-160 and pay a new visa application fee, but you may use information from a previously submitted DS-160 if it has not changed. No new SEVIS fee is required for a renewal under the same SEVIS number. You can retrieve a previous application from the CEAC system or upload a saved DAT file to pre-populate the form. If the original DS-160 was used to book the appointment or pay the MRV fee, you are required to present confirmation pages from both the new AND original DS-160 at the interview." },
    ],
  },
];

export function ImmigrationPage({ embedded = false }) {
  const isMobile = useIsMobile();
  const isCA = getCountrySlug() === "ca";

  const inner = (
    <>
      <div style={{ ...s.header, flexWrap: "wrap" }}>
        <span style={{ fontSize: 32 }}>✈️</span>
        <div style={{ flex: 1 }}>
          <h1 style={s.title}>{isCA ? "Canada Immigration Interview Guide" : "Port of Entry Guide"}</h1>
          <p style={s.desc}>{isCA ? "Common questions IRCC officers ask during immigration interviews — organized by application type with model answers." : "What to expect when entering the U.S. — required documents and common CBP officer questions by visa type."}</p>
        </div>
      </div>

      {isCA ? (
        <div style={s.card}>
          <h2 style={s.docTitle}>Common Canada Immigration Interview Questions</h2>
          <p style={s.docSubtitle}>Questions IRCC officers typically ask — organized by application type. Click any section to expand.</p>
          <AccordionTable data={CA_IMMIGRATION_GUIDE} />
        </div>
      ) : (
        <>
          <div style={s.card}>
            <h2 style={s.docTitle}>Required Documents at Port of Entry</h2>
            <p style={s.docSubtitle}>Click any section to expand. Carry printed copies of all applicable documents.</p>
            <AccordionTable data={PORT_OF_ENTRY} />
          </div>

          <div style={s.card}>
            <h2 style={s.docTitle}>Common CBP Questions by Visa Type</h2>
            <p style={s.docSubtitle}>Questions Customs and Border Protection officers typically ask — organized by immigration category.</p>
            <AccordionTable data={CBP_QUESTIONS} />
          </div>
        </>
      )}
    </>
  );

  if (embedded) return <div style={{ flex: 1, minWidth: 0 }}>{inner}</div>;

  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>Port of Entry Guide — Documents & CBP Questions | Apnacircle</title>
        <meta name="description" content="Required documents at the U.S. port of entry and common CBP officer questions by visa type — F-1, J-1, H-1B, B-1/B-2, green card holders and more." />
        <link rel="canonical" href={`${getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org"}/immigration/`} />
        <meta property="og:title" content="Port of Entry Guide — Documents & CBP Questions | Apnacircle" />
        <meta property="og:description" content="Required documents at the U.S. port of entry and common CBP officer questions by visa type." />
        <meta property="og:url" content={`${getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org"}/immigration/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org"}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {!isMobile && <ResourceNav />}
      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>
        {inner}
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

function AccordionTable({ data }) {
  const [open, setOpen] = useState({});
  const toggle = i => setOpen(prev => ({ ...prev, [i]: !prev[i] }));
  return (
    <div>
      {data.map((section, i) => {
        const isList = section.rows.every(r => !r.a);
        return (
          <div key={i} style={s.accordion}>
            <button style={s.accordionBtn} onClick={() => toggle(i)}>
              <span style={{ fontWeight: 700 }}>{section.section}</span>
              <span style={s.chevron}>{open[i] ? "▲" : "▼"}</span>
            </button>
            {open[i] && (
              <table style={s.table}>
                {!isList && (
                  <colgroup>
                    <col style={{ width: "30%" }} />
                    <col style={{ width: "70%" }} />
                  </colgroup>
                )}
                <tbody>
                  {section.rows.map((row, j) => (
                    <tr key={j} style={{ background: j % 2 === 0 ? "#fafafa" : "#fff" }}>
                      {isList
                        ? <td style={{ ...s.tdA, ...s.tdList }}>{row.q}</td>
                        : <><td style={s.tdQ}>{row.q}</td><td style={s.tdA}>{row.a}</td></>
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DS160Page({ embedded = false }) {
  const isMobile = useIsMobile();
  const isCA = getCountrySlug() === "ca";

  const inner = (
    <>
      <div style={{ ...s.header, flexWrap: "wrap" }}>
        <span style={{ fontSize: 32 }}>📋</span>
        <div style={{ flex: 1 }}>
          <h1 style={s.title}>{isCA ? "IRCC Forms Guide" : "DS-160 Form Guide & FAQ"}</h1>
          <p style={s.desc}>{isCA ? "IRCC application form tips and guidance — coming soon." : "Field-by-field guidance and frequently asked questions for the DS-160 nonimmigrant visa application form."}</p>
        </div>
      </div>

      <VisaChecklist isCA={isCA} />

      {isCA ? (
        <div style={s.card}>
          <p style={s.empty}>IRCC Forms guide is coming soon. Check back later!</p>
        </div>
      ) : (
        <>
          <div style={s.card}>
            <h2 style={s.docTitle}>DS-160 Field Guide</h2>
            <p style={s.docSubtitle}>Click any section to expand explanations for each field on the DS-160 form.</p>
            <AccordionTable data={DS160_GUIDE} />
          </div>

          <div style={s.card}>
            <h2 style={s.docTitle}>Visa Application & DS-160 FAQ</h2>
            <p style={s.docSubtitle}>Common questions about the visa application process, fees, and form submission.</p>
            <AccordionTable data={VISA_FAQ} />
          </div>
        </>
      )}
    </>
  );

  if (embedded) return <div style={{ flex: 1, minWidth: 0 }}>{inner}</div>;

  return (
    <div style={{ ...s.outer, flexDirection: isMobile ? "column" : "row" }}>
      <Helmet>
        <title>DS-160 Form Guide & FAQ | Apnacircle</title>
        <meta name="description" content="Complete field-by-field guide and FAQ for the DS-160 nonimmigrant visa application form." />
        <link rel="canonical" href={`${getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org"}/ds160/`} />
        <meta property="og:title" content="DS-160 Form Guide & FAQ | Apnacircle" />
        <meta property="og:description" content="Complete field-by-field guide and FAQ for the DS-160 nonimmigrant visa application form." />
        <meta property="og:url" content={`${getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org"}/ds160/`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Apnacircle" />
        <meta property="og:image" content={`${getCountrySlug() === "ca" ? "https://ca.apnacircle.org" : "https://apnacircle.org"}/og-image.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {!isMobile && <ResourceNav />}
      <div style={s.content}>
        <Link to="/" style={s.back}>← Home</Link>
        {inner}
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

const s = {
  outer:       { padding:"1.5rem 1.5rem 3rem", display:"flex", gap:24, alignItems:"flex-start" },
  content:     { flex:1, minWidth:0 },
  rail:        { width:260, flexShrink:0, display:"flex", flexDirection:"column", gap:16, position:"sticky", top:72 },
  back:        { color:"var(--orange)", fontSize:13, fontWeight:600, display:"inline-block", marginBottom:8 },
  header:      { display:"flex", alignItems:"center", gap:16, marginBottom:"1.5rem" },
  title:       { fontSize:28, fontWeight:800, color:"#111", marginBottom:4 },
  desc:        { fontSize:14, color:"#555" },
  card:        { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", padding:"1.5rem", marginBottom:20 },
  addBtn:      { marginLeft:"auto", padding:"8px 18px", background:"#555", color:"#fff", border:"none", borderRadius:20, fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" },
  empty:       { fontSize:14, color:"#777", fontStyle:"italic", textAlign:"center", padding:"1.5rem 0" },
  docTitle:    { fontSize:18, fontWeight:800, color:"#111", marginBottom:4, marginTop:0 },
  docSubtitle: { fontSize:13, color:"#666", marginBottom:"1rem", marginTop:0 },
  accordion:   { borderBottom:"0.5px solid var(--border)" },
  accordionBtn:{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.75rem 0", background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#222", textAlign:"left" },
  chevron:     { fontSize:11, color:"#888", flexShrink:0, marginLeft:8 },
  table:       { width:"100%", borderCollapse:"collapse", marginBottom:"0.5rem" },
  tdQ:         { padding:"0.6rem 0.75rem", fontSize:13, fontWeight:600, color:"#333", verticalAlign:"top", borderTop:"0.5px solid var(--border)", width:"30%" },
  tdA:         { padding:"0.6rem 0.75rem", fontSize:13, color:"#444", verticalAlign:"top", borderTop:"0.5px solid var(--border)", lineHeight:1.55 },
  tdList:      { width:"100%", color:"#333" },
  checklistCard:   { background:"#fff", border:"0.5px solid var(--border)", borderRadius:"var(--radius)", marginBottom:16, overflow:"hidden" },
  checklistToggle: { display:"flex", alignItems:"center", gap:10, width:"100%", padding:"12px 16px", background:"none", border:"none", cursor:"pointer", fontSize:14, fontWeight:700, color:"#111", textAlign:"left" },
  checklistProgress:{ fontSize:12, fontWeight:700, background:"var(--orange-light)", color:"var(--orange)", padding:"2px 10px", borderRadius:20 },
  checklistBody:   { padding:"4px 16px 16px", display:"flex", flexDirection:"column", gap:8 },
  checkItem:       { display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" },
  checkLabel:      { fontSize:13, lineHeight:1.5 },
  checkDone:       { marginTop:8, fontSize:13, fontWeight:700, color:"#166534", background:"#dcfce7", borderRadius:6, padding:"8px 12px" },
};
