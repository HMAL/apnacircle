export const BLOG_CATEGORIES = [
  { slug: "immigration", label: "Immigration",  icon: "🏛️", color: "#fff7ed", textColor: "#c2410c", border: "1px solid #fed7aa" },
  { slug: "family",      label: "Family",        icon: "👶", color: "#fdf4ff", textColor: "#7e22ce", border: "1px solid #e9d5ff" },
  { slug: "finance",     label: "Finance",       icon: "💰", color: "#f0fdf4", textColor: "#166534", border: "1px solid #bbf7d0" },
];

export const BLOGS = [
  // ─── Immigration ──────────────────────────────────────────────────────────────
  {
    slug: "things-immigrants-should-not-do",
    category: "immigration",
    title: "Things New Immigrants Should NOT Do in the US",
    metaDesc: "Common but costly mistakes new immigrants make in the US — covering immigration status, credit, legal help, and documentation.",
    date: "May 2026",
    readMin: 7,
    intro: "Moving to the US is an enormous transition, and most advice focuses on what you should do. But the mistakes people make early on can cost thousands of dollars, create legal complications, or delay the path to a green card. Here's what to avoid.",
    sections: [
      {
        heading: "Don't Travel Without Checking Your Visa Status",
        text: "Traveling outside the US with a pending I-485 (adjustment of status) application and no Advance Parole document can be treated as abandonment of your application. Always consult an immigration attorney before booking international travel while any USCIS petition is pending.",
      },
      {
        heading: "Don't Miss Your OPT or H-1B Deadlines",
        text: "F-1 students must apply for OPT up to 90 days before graduation. H-1B registrations open in March each year for a narrow window. Missing these windows by even one day can set you back an entire year. Put these dates in your calendar the moment you arrive.",
      },
      {
        heading: "Don't Skip Building Credit",
        text: "Many immigrants avoid credit cards out of habit or caution. But without a US credit history, you'll pay higher rates on car loans, mortgages, and even apartment rentals. Open a secured credit card your first month, charge a small amount, and pay it in full monthly. This one habit builds credit faster than almost anything else.",
      },
      {
        heading: "Don't Use Unlicensed Immigration Help",
        text: "\"Notarios\" and immigration consultants who are not licensed attorneys can take your money and file your paperwork incorrectly. USCIS holds you responsible for errors, not your preparer. Only work with licensed immigration attorneys or accredited representatives recognized by the Board of Immigration Appeals.",
      },
      {
        heading: "Don't Confuse Your Visa Stamp with Your I-94",
        text: "Your I-94 record controls how long you can legally stay in the US — not your visa stamp. Many immigrants confuse these. Check your I-94 at i94.cbp.dhs.gov after every entry. Your visa stamp is only needed to re-enter the US from abroad.",
      },
      {
        heading: "Don't Forget to Update Your Address with USCIS",
        text: "Federal law requires you to notify USCIS of any address change within 10 days using Form AR-11 (available free at uscis.gov). Failing to do this means missed notices for pending applications — some of which have hard deadlines for response.",
      },
    ],
    callout: { type: "tip", text: "Keep a dedicated folder — physical or digital — with all your immigration documents: passport, visa stamps, I-94 printout, approval notices, EADs, and travel documents. You'll need these more often than you expect, and having them organized saves serious stress." },
    relatedTo: "/immigration",
  },
  {
    slug: "us-healthcare-what-nobody-tells-you",
    category: "immigration",
    title: "What Nobody Tells You About US Healthcare",
    metaDesc: "US healthcare surprises that shock immigrants — in-network rules, surprise bills, ER costs, and how to negotiate your medical bills.",
    date: "May 2026",
    readMin: 6,
    intro: "US healthcare is expensive, confusing, and full of surprises. If you're coming from a country with national healthcare, the system here will feel like a foreign language. Here's what most people figure out the hard way — and what you can do about it.",
    sections: [
      {
        heading: "Your Insurance Card Is Not Enough",
        text: "Having health insurance doesn't mean every doctor will accept it. You must verify each provider is \"in-network\" before your appointment. Seeing an out-of-network provider — even for the same procedure — can result in bills 3–5x higher than expected. Always call and confirm before your visit.",
      },
      {
        heading: "Even In-Network Hospitals Have Out-of-Network Surprises",
        text: "You can go to an in-network hospital and still receive a bill from an out-of-network anesthesiologist, radiologist, or specialist who was called in during your procedure. This is legal in many states. Before any planned procedure, ask your hospital to confirm that every provider involved in your care is in-network with your insurance.",
      },
      {
        heading: "Emergency Rooms Are the Most Expensive Option",
        text: "US emergency rooms are legally required to treat you, but the bill will be substantial. For non-life-threatening situations — sprained ankle, ear infection, minor cuts — use an urgent care center. They cost a fraction of the ER and are faster for non-emergencies.",
      },
      {
        heading: "Your Deductible Resets on January 1",
        text: "If you have a high-deductible plan, schedule any planned procedures in the second half of the year after you've met your deductible. Doing the same procedure in January means paying from zero. This timing can save hundreds or thousands of dollars.",
      },
      {
        heading: "Negotiate Your Bills — It Works",
        text: "Medical bills in the US are almost always negotiable. All nonprofit hospitals and many for-profit ones have financial assistance or charity care programs. Call the billing department, ask for a \"financial assistance application,\" and explain your situation. Income-qualified patients regularly receive 50–100% reductions. Even without financial assistance, asking for a prompt-pay discount or settlement offer often reduces bills by 20–40%.",
      },
      {
        heading: "Mental Health Coverage Is Required",
        text: "Under the Affordable Care Act, most insurance plans must cover mental health services at the same cost-sharing level as physical health. Many immigrants pay out of pocket for therapy unnecessarily — check your benefits summary before assuming it isn't covered.",
      },
    ],
    callout: { type: "tip", text: "Use goodrx.com to compare prescription prices before filling at the pharmacy. Sometimes paying out of pocket with a GoodRx coupon is cheaper than your insurance copay — especially for generic medications." },
    relatedTo: "/health",
  },
  {
    slug: "avoid-immigration-paperwork-errors",
    category: "immigration",
    title: "Avoid These Immigration Paperwork Errors",
    metaDesc: "The most common and costly USCIS paperwork mistakes — wrong form versions, missing signatures, inconsistent dates, and wrong addresses.",
    date: "Apr 2026",
    readMin: 5,
    intro: "USCIS processes millions of applications each year and is notoriously unforgiving with errors. Mistakes don't just delay your application — they can result in denials, Requests for Evidence (RFEs), and in some cases, serious legal consequences. These are the mistakes people make most often.",
    sections: [
      {
        heading: "Submitting an Outdated Form Version",
        text: "USCIS updates forms regularly, and submitting an older version — even one that was valid a few weeks ago — will get your application rejected outright. Always download each form directly from uscis.gov immediately before filing, not from a saved copy or third-party site.",
      },
      {
        heading: "Missing Signatures",
        text: "Unsigned forms are among the most common rejection reasons — and the most frustrating, because the fix is simple but the delay is not. Read every line carefully. Some forms require multiple signatures (petitioner AND beneficiary). Some USCIS forms require original wet ink signatures, not digital.",
      },
      {
        heading: "Inconsistent Names, Dates, or Spellings",
        text: "Your name spelling, date of birth, and entry dates must match exactly across your passport, application forms, and all supporting documents. Any inconsistency — even a middle name included in one document but not another — triggers an RFE and delays your case.",
      },
      {
        heading: "Sending the Wrong Filing Fee",
        text: "USCIS updates fee amounts periodically. Sending even a few dollars less than the current fee results in rejection. Always verify the current fee at uscis.gov/forms before each application, and double-check your check amount before mailing.",
      },
      {
        heading: "Incomplete Supporting Documents",
        text: "Every USCIS form has specific required supporting documents listed in its instructions. Read the instructions for your specific form and petition type carefully. Missing a single required document is the #1 cause of RFEs, which add months to processing times.",
      },
      {
        heading: "Not Making Copies Before Mailing",
        text: "Before mailing anything to USCIS, make complete copies of everything — every form, every document, every check, both sides. USCIS does lose applications. If that happens, you need to be able to reproduce exactly what you sent.",
      },
      {
        heading: "Using the Wrong Lockbox or Service Center Address",
        text: "USCIS has multiple service centers and lockbox addresses. The correct one depends on your state, petition type, and sometimes your income level. Sending to the wrong location causes delays or rejection. Use the address lookup on uscis.gov for your specific form before mailing.",
      },
    ],
    callout: { type: "warning", text: "USCIS does not make exceptions for \"honest mistakes.\" An error on your application is your responsibility regardless of how it happened. For important filings — green card, citizenship — seriously consider working with a licensed immigration attorney." },
    relatedTo: "/immigration",
  },
  {
    slug: "truth-about-h1b-visas",
    category: "immigration",
    title: "The Truth About H-1B Visas Nobody Mentions",
    metaDesc: "What the official sources don't tell you about the H-1B lottery, cap-exempt employers, wage levels, and H-4 EAD risks.",
    date: "Apr 2026",
    readMin: 6,
    intro: "The H-1B lottery dominates conversations in the Indian tech community every March. But there's a lot the official sources don't emphasize — things that could significantly change your strategy or expectations if you knew them earlier.",
    sections: [
      {
        heading: "The Lottery Is Genuinely Random",
        text: "USCIS changed H-1B selection to a pure electronic random lottery. Submitting on March 1 vs March 20 makes no difference. There is no advantage to being first. If you've been told otherwise, that information is outdated.",
      },
      {
        heading: "Cap-Exempt Employers Are Heavily Overlooked",
        text: "Universities, government research institutions, and qualifying nonprofits are H-1B cap-exempt. They can file H-1B petitions year-round with no lottery competition. Academic medical centers, national labs, and research-focused nonprofits regularly hire engineers, scientists, and IT professionals — and most applicants never consider them.",
      },
      {
        heading: "Premium Processing Doesn't Improve Lottery Odds",
        text: "Premium processing ($2,805) gets you a faster USCIS decision after being selected. It does not help you get selected in the lottery. Paying premium processing before selection is money spent on certainty of speed, not certainty of selection.",
      },
      {
        heading: "Your Employer Owns Your H-1B",
        text: "Your H-1B status is tied to your employer. If they lay you off, you have a 60-day grace period to find a new employer and file a transfer, change to another status (H-4, B-2), or depart the US. Document your employment authorization carefully and contact an attorney within days of any job loss.",
      },
      {
        heading: "Wage Level Affects RFE Rates Significantly",
        text: "H-1B applications require employers to pay prevailing wages set by the Department of Labor. USCIS scrutinizes Level 1 (entry-level) wage petitions much more heavily than Level 2 or above. If your employer is paying you at Level 1 for a role that looks like senior work, expect an RFE.",
      },
      {
        heading: "H-4 EAD Has Been Legally Contested",
        text: "H-4 spouses can apply for work authorization (H-4 EAD) only if the H-1B holder has an approved I-140. But this rule has faced legal challenges in courts and political pressure to eliminate it. Don't build long-term career plans around H-4 EAD remaining available indefinitely.",
      },
    ],
    callout: { type: "tip", text: "The best H-1B strategy involves diversification: file with your current employer AND, if you qualify, a cap-exempt employer. Having a backup path significantly reduces the anxiety of the annual lottery." },
    relatedTo: "/immigration",
  },

  // ─── Family ───────────────────────────────────────────────────────────────────
  {
    slug: "raising-baby-in-america",
    category: "family",
    title: "What Nobody Tells You About Raising a Baby in America",
    metaDesc: "What immigrant parents need to know about having a baby in the US — pediatrician selection, maternity leave, childcare costs, and postpartum support.",
    date: "May 2026",
    readMin: 7,
    intro: "Having a baby in the US as an immigrant is a wonderful and overwhelming experience. The system here is very different from what most immigrant families grew up with. Here's what we wish someone had told us before the baby arrived.",
    sections: [
      {
        heading: "You Choose a Pediatrician Before Birth",
        text: "In the US, you need to select a pediatrician before your baby is born. The hospital will ask for your baby's doctor's name before discharge. Research and call pediatricians in your third trimester — popular ones have waiting lists, and you need to confirm they accept your insurance.",
      },
      {
        heading: "Maternity Leave Varies Wildly by State",
        text: "Federal FMLA guarantees 12 weeks of unpaid leave only if you've been employed 12+ months at a company with 50+ employees. Some states add paid leave on top. California, New York, and New Jersey have the most generous policies. Check your specific state's rules and your employer's policy early in pregnancy.",
      },
      {
        heading: "Childcare Costs Will Shock You",
        text: "Infant daycare in major US metro areas costs $1,500–$3,500 per month — sometimes more than rent. Research and get on waitlists during your second trimester. Some daycares have 12–18 month waitlists. Factor this into your finances before the baby arrives, not after.",
      },
      {
        heading: "WIC Is Available Regardless of Immigration Status",
        text: "The WIC program (Women, Infants, and Children) provides free formula, food vouchers, and nutrition support. Eligibility is based on income, and it's available to immigrant families regardless of immigration status for most beneficiary categories. Many immigrant families don't apply simply because they don't know it's available to them.",
      },
      {
        heading: "The Fourth Trimester Is Real",
        text: "American postpartum care focuses on the baby more than the mother. Many immigrant mothers miss the extended postpartum support systems — family nearby, community practices, traditional foods and rest protocols — from their home countries. Plan deliberately for how you'll have support in the first 3 months after birth.",
      },
      {
        heading: "First-Year Paperwork Is Time-Sensitive",
        text: "Your baby's first month involves critical deadlines: applying for the birth certificate, the Social Security number, and adding the baby to your health insurance (you have 30 days from birth, after which you must wait for open enrollment). The SSN can take 4–6 weeks to arrive and you'll need it for tax purposes.",
      },
    ],
    callout: { type: "tip", text: "Car seat laws in the US are strict and specific. Babies must use federally approved seats appropriate for their age, height, and weight. Many fire stations offer free car seat installation checks — find yours at seatcheck.org." },
    relatedTo: null,
  },
  {
    slug: "baby-products-scam",
    category: "family",
    title: "Baby Products That Are Basically a Scam",
    metaDesc: "Baby products you can safely skip — wipe warmers, diaper pails, baby food makers, and other items that cost money without adding value.",
    date: "Apr 2026",
    readMin: 5,
    intro: "The baby product industry is worth billions and is built on selling anxious new parents things they don't need. Here's what you can safely skip — and why the cheaper or simpler alternative works just as well.",
    sections: [
      {
        heading: "Wipe Warmers",
        text: "Babies adjust to room-temperature wipes immediately. Wipe warmers add something to clean and maintain, and can promote bacterial growth if wipes sit too long in humid conditions. Every pediatrician will tell you this one is unnecessary.",
      },
      {
        heading: "Diaper Pails with Proprietary Cartridges",
        text: "Dedicated diaper pails with brand-specific refill cartridges run $25–40 per refill. A regular trash can with a lid and a sprinkling of baking soda works just as well. This one choice saves $100+ per year for something that performs identically.",
      },
      {
        heading: "Baby Shoes for Non-Walking Infants",
        text: "Babies don't need shoes until they walk outdoors, and even then only for protection from terrain. Soft-sole infant \"shoes\" are decorative accessories for adults. Skip until your child is pulling up and walking.",
      },
      {
        heading: "Dedicated Baby Food Makers",
        text: "A standard blender or food processor makes the exact same purees as a $50–150 dedicated baby food maker. The results are identical. The only difference is a smaller bowl and a higher price.",
      },
      {
        heading: "Changing Tables",
        text: "A changing pad placed on a sturdy dresser top is functionally identical to a changing table, safer (lower to the ground), and gives you a piece of furniture that remains useful for years after the diaper stage ends.",
      },
      {
        heading: "Consumer Breathing Monitors",
        text: "Products like the Owlet have been pulled from sale by the FDA multiple times for making medical claims without clearance. The AAP and most pediatricians do not recommend pulse oximetry monitors for healthy full-term babies at home. A basic audio monitor is typically all you need.",
      },
    ],
    callout: { type: "tip", text: "Before buying any baby item, check Facebook Marketplace and Buy Nothing groups in your area. Baby gear is used for months, not years, and high-quality second-hand items are almost always available at 20–30% of retail price." },
    relatedTo: null,
  },
  {
    slug: "baby-items-i-regret-buying",
    category: "family",
    title: "7 Baby Items I Regret Buying",
    metaDesc: "Seven baby purchases that weren't worth it — expensive strollers, Dockatots, bottle warmers, Baby Brezza, and more with honest alternatives.",
    date: "Mar 2026",
    readMin: 5,
    intro: "As first-time parents, we bought all of it. The registry was enormous. Boxes arrived for weeks. Then reality hit — most of it either didn't work for our baby, was redundant with something cheaper, or was used twice and forgotten. Here are seven I'd skip completely the second time around.",
    sections: [
      {
        heading: "The Expensive Stroller System",
        text: "Travel stroller \"systems\" with matching infant car seat, bassinet, and accessories can run $800–$1,500. Our infant car seat clicked out of the stroller at 5 months when our baby outgrew the weight limit. A $200 travel system does the same job for most families. Save the $600 for something you'll use for years.",
      },
      {
        heading: "The DockATot and Similar Infant Loungers",
        text: "Soft infant loungers are everywhere on social media. The Consumer Product Safety Commission has pulled some from sale. The AAP does not recommend them for unsupervised sleep. We bought one, used it twice with full supervision, and it sat in a closet. If you want one, borrow it first.",
      },
      {
        heading: "The High-End Bottle Warmer",
        text: "We bought the $60 model. Our baby took cold bottles straight from the fridge equally well. Bottles warmed in a bowl of hot tap water work identically for $0. This is one of the most skippable items on every registry.",
      },
      {
        heading: "The Baby Brezza Formula Maker",
        text: "The concept — formula on demand like a coffee machine — is appealing at 3am. The reality: the cleaning is time-consuming, portion consistency has been questioned, and formula safety during a recall requires precise measurement that the machine can't easily accommodate. We returned to a scoop and a measured bottle.",
      },
      {
        heading: "The Premium Motorized Swing",
        text: "We bought an expensive motorized swing for our newborn. He hated it. The $35 bouncer he loved. Swings, bouncers, and rockers are highly individual — some babies love them, some refuse them. Borrow or buy second-hand before spending $150–300 on something your specific baby may reject entirely.",
      },
      {
        heading: "The Designer Diaper Bag ($80+)",
        text: "A well-reviewed $30 backpack from Amazon carries everything identically. You will wash this bag frequently. The inside gets messy the first week. Save the money — the only person who cares about the brand is not the one doing the diaper changes.",
      },
      {
        heading: "The Monthly Baby Food Subscription",
        text: "Monthly baby food subscription boxes were $40–60/month for pouches and jars that cost 2–3x more per serving than equivalent products at any grocery store. The convenience was real; the value was not. We cancelled after two months.",
      },
    ],
    callout: { type: "tip", text: "Ask to borrow any large-ticket item from friends or family for a trial month before buying. Swings, bouncers, rockers, and even strollers are highly baby-specific. What worked perfectly for someone else's baby may be completely rejected by yours." },
    relatedTo: null,
  },
  {
    slug: "first-time-parent-mistakes",
    category: "family",
    title: "Don't Make These First-Time Parent Mistakes",
    metaDesc: "Common first-time parent mistakes on sleep safety, well-baby visits, postpartum mental health, and US-specific systems like FSA accounts.",
    date: "Mar 2026",
    readMin: 6,
    intro: "Every first-time parent makes mistakes — that's expected and fine. But some mistakes are avoidable with information, and a few have real consequences. Here's what pediatricians and experienced parents wish first-timers knew.",
    sections: [
      {
        heading: "Sleep Safety Cannot Be Compromised",
        text: "The AAP safe sleep guidelines exist because of preventable infant deaths. Babies should sleep on their back, alone, in a crib or bassinet, on a firm flat surface — no soft bedding, no bed-sharing with infants, no inclined sleepers. At 3am when you're exhausted, this feels like a lot. It's non-negotiable.",
      },
      {
        heading: "Don't Skip Well-Baby Visits",
        text: "The well-baby schedule — at 2, 4, 6, 9, 12 months and beyond — exists for vaccinations on schedule, developmental screening, and catching issues early. Missing even one visit means falling behind on vaccines that protect your baby from serious illness. Your pediatrician's schedule is the schedule.",
      },
      {
        heading: "Call the Nurse Line, Don't Google",
        text: "Your baby has a rash. You Google it. Thirty minutes later you're convinced it's something life-threatening. Every pediatric practice has an after-hours nurse line. Call them — they answer at midnight and will tell you whether this warrants a visit or can wait until morning. Use it instead of symptom-searching.",
      },
      {
        heading: "Stop Comparing Milestones",
        text: "Baby development has wide normal ranges. Walking happens anywhere between 9–15 months. First words between 10–18 months. Comparing your baby's milestones to someone else's on social media will cause real anxiety for no good reason. Trust what your pediatrician says at each well visit.",
      },
      {
        heading: "Set Up Your FSA or HSA Before the Baby Arrives",
        text: "If your employer offers a Flexible Spending Account (FSA) or Health Savings Account (HSA), a baby dramatically increases the value of these accounts. Pediatrician copays, prescriptions, and medical supplies are all eligible. Enroll during your open enrollment period before the baby arrives — you can't enroll mid-year except at qualified life events.",
      },
      {
        heading: "Take Postpartum Mental Health Seriously",
        text: "Postpartum depression affects roughly 1 in 8 new mothers — and fathers experience it too. It is not weakness, not a personal failing, and does not resolve reliably on its own. If either parent feels persistently sad, disconnected, or overwhelmed in the weeks after birth, tell your OB immediately. It responds well to treatment.",
      },
    ],
    callout: { type: "warning", text: "If your baby has a fever above 100.4°F (38°C) in the first 2 months of life, go to the emergency room immediately. Do not wait for a callback. This is a medical emergency for newborns." },
    relatedTo: null,
  },

  // ─── Finance ──────────────────────────────────────────────────────────────────
  {
    slug: "financial-mistakes-young-families",
    category: "finance",
    title: "The Biggest Financial Mistakes Young Immigrant Families Make",
    metaDesc: "Financial mistakes that cost immigrant families the most — skipping retirement savings, carrying credit card debt, underinsuring, and bad remittance habits.",
    date: "May 2026",
    readMin: 7,
    intro: "The first few years in the US are financially chaotic — you're earning in dollars for the first time, navigating a new tax system, building credit from scratch, and often supporting family abroad. The mistakes made in this period can cost tens of thousands of dollars over the next decade.",
    sections: [
      {
        heading: "Not Starting Retirement Savings at Your First Job",
        text: "Many immigrants plan to \"start saving later when things settle down.\" But compound growth means $200/month invested at 25 is worth dramatically more than the same amount at 35. At absolute minimum, contribute enough to capture your employer's full 401(k) match — that's a 50–100% instant return that you cannot get anywhere else.",
      },
      {
        heading: "Carrying Credit Card Balances",
        text: "US credit cards charge 20–29% APR. Carrying a $3,000 balance costs $600–870 per year in interest alone. For immigrants working hard to build credit, this habit can become extremely costly quickly. Always pay your balance in full every month — use your credit card as a debit card, not as credit.",
      },
      {
        heading: "Overpaying for Health Insurance (or Skipping It)",
        text: "If your employer offers health insurance, take it. If not, compare plans at healthcare.gov. Many immigrants earning below the ACA income thresholds qualify for heavily subsidized plans — sometimes as low as $0/month in premiums. Many eligible families simply don't check and either overpay for direct-purchase plans or go uninsured.",
      },
      {
        heading: "No Life Insurance with Dependents",
        text: "Once you have dependents, term life insurance matters. A healthy 30-year-old can get $500,000 of coverage for $20–40/month. Many immigrant families go years without it because no one sells it to them aggressively (unlike whole life). Online term life providers like Term4Sale or Policygenius make comparison easy.",
      },
      {
        heading: "No Emergency Fund",
        text: "Standard guidance is 3–6 months of living expenses in a high-yield savings account. Without this buffer, any setback — layoff, medical bill, car repair — goes onto a credit card at 25% APR. Build this before you invest in anything else.",
      },
      {
        heading: "Sending Money Home via Bank Wire",
        text: "Bank wire fees run $25–45 per transfer regardless of amount. Using Wise (0.3–0.6%) or Remitly on a $3,000 transfer saves $20–35 per transaction. For families sending $2,000–3,000 monthly, this adds up to $300–400 saved per year for five minutes of setup.",
      },
      {
        heading: "Not Tracking Spending",
        text: "Many immigrant families are frugal by nature, but \"being careful\" is not the same as knowing exactly where money goes. Most families who think they're saving well find $400–600/month in forgotten subscriptions, food delivery, and recurring charges when they do their first real audit. Review your credit card statements monthly.",
      },
    ],
    callout: { type: "tip", text: "Open a 529 college savings account when your child is born. Contributions grow tax-free when used for qualified education expenses. Many states offer additional state income tax deductions. Starting at birth versus age 5 can mean a $40,000+ difference in college savings." },
    relatedTo: "/finance",
  },
  {
    slug: "subscription-services-draining-money",
    category: "finance",
    title: "Subscription Services Quietly Draining Your Money",
    metaDesc: "How subscription creep costs American households $200-400 per month — streaming, gym memberships, food boxes, and how to audit them.",
    date: "Apr 2026",
    readMin: 5,
    intro: "The average American household pays for 4.5 streaming services. Add software subscriptions, fitness apps, cloud storage, food boxes, and premium app upgrades — and it's easy to have $200–400/month disappearing in small charges that never feel like a \"real\" expense.",
    sections: [
      {
        heading: "Streaming Stack Creep",
        text: "Netflix, Hulu, Disney+, Prime, Peacock, Paramount+, Apple TV+ — each is $8–18/month. Having all of them costs $65–100/month for content you watch 20% of. Pick two you actively use and rotate quarterly. You'll rarely miss what you paused.",
      },
      {
        heading: "Free Trials That Become Paid Subscriptions",
        text: "Every SaaS company has mastered the \"start free, forget to cancel\" funnel. Before entering your card for a free trial, set a calendar reminder for day 10 to decide or cancel. Or use Privacy.com virtual card numbers with a $1 spending limit — the trial never converts to paid.",
      },
      {
        heading: "Gym Memberships Used for Two Weeks in January",
        text: "The average gym member uses their membership fewer than twice per week. A $50/month gym visited once a week costs $25 per visit. Evaluate your actual gym attendance in March — after the resolution wave — and cancel honestly if the math doesn't work.",
      },
      {
        heading: "Food and Meal Delivery Subscriptions",
        text: "DoorDash DashPass, Instacart+, Grubhub+ — each runs ~$10/month. These feel like they save money on delivery fees, but the subscriptions only pay off if you order frequently enough. Calculate your actual usage before renewing.",
      },
      {
        heading: "Automatic Annual Renewals Nobody Notices",
        text: "Antivirus software, domain registrations, Adobe plans, app subscriptions — many auto-renew annually at full price. Check your credit card statements for annual charges and set calendar reminders 30 days before each renewal date to decide whether to keep them.",
      },
      {
        heading: "Cloud Storage Upgrade Creep",
        text: "Google, Apple, and Microsoft all push storage upgrades at $2–10/month. Before upgrading, delete duplicate photos, clear downloads, and offload old files to an external drive. A one-time $60 external hard drive is better economics than a perpetual monthly fee.",
      },
    ],
    callout: { type: "tip", text: "Do a quarterly subscription audit. Export your credit card transactions, filter by recurring charges, and categorize everything. Most people find $50–100/month in subscriptions they've forgotten about or no longer actively use." },
    relatedTo: "/finance",
  },
  {
    slug: "avoid-hospital-billing-mistakes",
    category: "finance",
    title: "Avoid These Hospital Billing Mistakes",
    metaDesc: "How to protect yourself from US hospital billing errors — itemized bills, EOBs, financial assistance programs, and the No Surprises Act.",
    date: "Apr 2026",
    readMin: 6,
    intro: "Medical debt is the leading cause of personal bankruptcy in the US. For immigrants unfamiliar with the billing system, confusion around insurance Explanations of Benefits, balance billing, and financial assistance programs can be extremely costly. Here's how to protect yourself.",
    sections: [
      {
        heading: "Don't Pay the First Bill You Receive",
        text: "The initial bill from a hospital is almost never final. Wait for the Explanation of Benefits (EOB) from your insurance company first. The EOB shows what you actually owe after insurance processes the claim — which is often dramatically lower than the initial bill amount.",
      },
      {
        heading: "Verify Your Insurance Processed the Claim",
        text: "Call your insurance company to confirm the claim was submitted correctly and processed before paying anything. Billing errors — including claims submitted to the wrong insurance ID or plan — are common and can result in inflated bills that your insurance would have reduced.",
      },
      {
        heading: "Always Request an Itemized Bill",
        text: "Ask for an itemized bill that lists every individual charge. Catch-all line items like \"room and board\" often conceal duplicate charges, charges for other patients, or services that were never delivered. Hospital billing error rates are estimated at 80% or higher by independent auditors.",
      },
      {
        heading: "Know Your Rights Under the No Surprises Act",
        text: "If an out-of-network provider treated you at an in-network facility without your knowledge, the No Surprises Act (effective January 2022) limits your liability to your in-network cost-sharing amount. File a complaint at cms.gov if you're billed more. This law has real teeth.",
      },
      {
        heading: "Ask About Financial Assistance Before Paying",
        text: "All nonprofit hospitals are legally required to have charity care programs, and many for-profit hospitals do too. Ask the billing department specifically for a \"financial assistance application\" or \"charity care application.\" Income-qualified patients regularly receive 50–100% bill reductions. This conversation costs nothing.",
      },
      {
        heading: "Don't Let Bills Go to Collections",
        text: "Medical bills sent to collections can appear on your credit report after 180 days under current rules. If you cannot pay, call the billing department and set up a payment plan. Hospitals generally prefer $50/month payments to sending you to a collection agency.",
      },
    ],
    callout: { type: "tip", text: "Medical billing advocates work on contingency — they keep 20–30% of what they save you. For bills over $5,000, hiring one can recover thousands. Search \"medical billing advocate\" in your area or use services like CoPatient." },
    relatedTo: "/health",
  },
  {
    slug: "things-that-look-cheap-cost-more",
    category: "finance",
    title: "Things That Look Cheap But Cost More Later",
    metaDesc: "Products where buying cheap costs more over time — mattresses, tires, furniture, appliances, and car maintenance you should never defer.",
    date: "Mar 2026",
    readMin: 5,
    intro: "The cheapest option upfront is rarely the cheapest option over time. These are the categories where \"saving money\" by buying cheap reliably ends up costing more — and where quality actually makes a meaningful difference.",
    sections: [
      {
        heading: "Mattresses",
        text: "Budget mattresses ($200–400) typically sag within 3–5 years. A mid-range mattress ($800–1,200) from a reputable brand lasts 8–12 years. The cost-per-year on the cheap option is often higher, and poor sleep quality has real consequences for health and productivity.",
      },
      {
        heading: "Tires",
        text: "Tires are one area where cheap means dangerous, not just low quality. Budget tires from unknown brands have measurably longer stopping distances in wet conditions and higher failure rates. Mid-tier brands like Cooper, Kumho, and Falken offer genuine value without compromising safety.",
      },
      {
        heading: "Budget Furniture",
        text: "Particle board furniture warps in humid climates, doesn't survive a move, and needs replacement in 2–3 years. IKEA has improved significantly — their solid wood and steel lines are exceptions. For everything else, solid wood or metal furniture that lasts decades is better economics.",
      },
      {
        heading: "Deferred Car Maintenance",
        text: "Skipping oil changes, ignoring warning lights, and delaying tire rotations to \"save money now\" leads to engine damage and repairs that cost 10–50x what the deferred maintenance would have. A $50 oil change today is preferable to a $3,000 engine repair in 18 months.",
      },
      {
        heading: "No-Name Electronics and Cables",
        text: "Cheap chargers, USB-C cables, and power banks from unverified sellers have documented cases of damaging devices and causing electrical hazards. For anything that connects to an expensive phone or laptop, spend the extra $10 for a known brand or MFi-certified accessory.",
      },
      {
        heading: "Work Clothing",
        text: "Cheap work clothing looks worn out quickly and needs frequent replacement. Two high-quality shirts that hold their shape for 3 years cost less in total than six cheap shirts bought and replaced over the same period — plus you look more professional the entire time.",
      },
    ],
    callout: { type: "tip", text: "Apply the cost-per-use framework before any purchase. A $200 pan used 5x per week for 10 years costs $0.07 per use. A $20 pan that lasts one year costs $0.08 per use and performs worse. Quality in high-frequency items almost always wins on total cost." },
    relatedTo: "/finance",
  },
  {
    slug: "buying-first-home-in-the-us",
    category: "finance",
    title: "What Nobody Tells You About Buying Your First Home in the US",
    metaDesc: "What immigrant first-time homebuyers need to know — mortgage eligibility, closing costs, property tax, HOA fees, and the inspection you should never waive.",
    date: "Mar 2026",
    readMin: 7,
    intro: "Buying a home in the US as an immigrant feels like deciphering a legal document in a foreign language. The process is opaque, expensive, and full of decisions that affect your finances for decades. Here's what most first-time homebuyer guides skip over.",
    sections: [
      {
        heading: "You Can Buy Without Citizenship",
        text: "Non-citizen legal residents — H-1B, L-1, O-1, green card holders — can obtain conventional mortgages. There is no citizenship requirement for property ownership in the US. What lenders evaluate is your income, credit score, and visa validity (most lenders want to see 2+ years remaining on your current authorized stay).",
      },
      {
        heading: "Closing Costs Are Separate from the Down Payment",
        text: "Beyond the down payment (3–20% of purchase price), you'll pay closing costs of 2–5% of the loan amount. On a $500,000 home, that's $10,000–25,000 in addition to your down payment. This surprises most first-time buyers. Budget for both before you start looking.",
      },
      {
        heading: "Get Pre-Approved Before Touring Homes",
        text: "In a competitive market, sellers won't take offers seriously without a strong pre-approval letter. Get pre-approved (not just pre-qualified — there's a difference) from a lender before engaging a buyer's agent. Note: your pre-approval amount is the ceiling, not the target. What you qualify for and what you can comfortably afford are different numbers.",
      },
      {
        heading: "Property Tax Is Ongoing and Can Increase",
        text: "Monthly mortgage quotes from lenders often show only principal and interest. Property tax and homeowners insurance are additional and can add $500–1,500/month to your payment in high-tax states like New Jersey, Illinois, and Texas. Always calculate PITI — Principal, Interest, Taxes, Insurance — before deciding what you can afford.",
      },
      {
        heading: "HOA Fees Are a Second Recurring Bill",
        text: "Many communities, especially condos and planned developments, charge HOA fees of $200–600/month. HOAs can also levy special assessments — sudden large bills for building repairs or improvements you didn't anticipate. Read HOA financials and meeting minutes before buying in any HOA community.",
      },
      {
        heading: "Never Waive the Home Inspection",
        text: "In a hot market, some buyers waive inspections to win bidding wars. This is a serious mistake. A $400–600 home inspection that reveals $30,000 in foundation issues or an aging roof saves you from a catastrophic purchase. If you lose a bidding war because you insisted on an inspection, you made the right call.",
      },
    ],
    callout: { type: "tip", text: "Tell every lender you speak with that you're a first-time homebuyer. Many states have programs offering down payment assistance, reduced interest rates, or grants specifically for first-time buyers — and some are available to legal permanent residents and visa holders." },
    relatedTo: "/finance",
  },
];

export function getBlogBySlug(slug) {
  return BLOGS.find(b => b.slug === slug) || null;
}

export function getBlogsByCategory(category) {
  return category ? BLOGS.filter(b => b.category === category) : BLOGS;
}

export function getCategoryMeta(slug) {
  return BLOG_CATEGORIES.find(c => c.slug === slug) || null;
}
