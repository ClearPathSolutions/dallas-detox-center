// Central business + brand configuration for Dallas Detox Center.
// Facts preserved verbatim from the live site (SEO-safe).

export const site = {
  name: "Dallas Detox Center",
  shortName: "DDC",
  url: "https://dallasdetoxcenter.com",
  description:
    "Medical detox, residential treatment, and dual diagnosis mental health care in Dallas, TX. Compassionate, 24/7 supervised recovery support.",
  phone: {
    display: "817-904-2197",
    href: "tel:+18179042197",
  },
  email: "info@dallasdetoxcenter.com",
  address: {
    street: "100 Mariah Drive",
    city: "Weatherford",
    state: "Texas",
    stateAbbr: "TX",
    zip: "76087",
    full: "100 Mariah Drive, Weatherford, Texas 76087",
  },
  // Year the facility opened.
  founded: 2022,
  // Licensed level of care.
  levelOfCare: "Residential",
  // Licensed bed count, split across the two residences on the campus.
  // Surfaced on /tour and /areas-we-serve.
  capacity: {
    total: 32,
    house: 16,
    barn: 16,
  },
  social: {
    instagram: "https://www.instagram.com/dallasdetoxcenter/",
    facebook: "https://www.facebook.com/dallasdetoxcenter",
    linkedin: "https://www.linkedin.com/company/dallas-detox-center/",
  },
  // Google Business Profile. `cid` is the numeric customer ID derived from the
  // profile's feature ID (0x8651e3167eddf8d5:0x9ec6acb5f66f8539) — it gives us
  // stable profile/review links without needing an API call.
  google: {
    cid: "11441021800904885561",
    profileUrl: "https://maps.google.com/?cid=11441021800904885561",
    writeReviewUrl: "https://g.page/r/CTmFb_a1rMaeEAI/review",
  },
  widgets: {
    clarion: {
      siteKey: "cpx_b3ULWMuK13qriOhukW31Cg48wIbMvGN6",
      api: "https://api.clarionlabs.ai",
    },
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
  columns?: { heading: string; items: NavItem[] }[];
};

// Full information architecture. Slugs preserved exactly from the live sitemap.
export const nav: NavItem[] = [
  {
    label: "Who We Are",
    href: "/about-us",
    columns: [
      {
        heading: "About",
        items: [
          { label: "About Dallas Detox", href: "/about-us" },
          { label: "Meet the Team", href: "/about-us/meet-the-team" },
          { label: "Alexandria Grigsby", href: "/about-us/alexandria-grigsby" },
          { label: "Trevor Grigsby", href: "/about-us/trevor-grigsby" },
          { label: "Michael Young", href: "/about-us/michael-young" },
          { label: "Ricki Cochran", href: "/about-us/ricki-cochran" },
          { label: "Sarah Bentley", href: "/about-us/sarah-bentley" },
          { label: "Antoine Gross Sr.", href: "/about-us/antoine-gross" },
          { label: "Latest Articles", href: "/blog" },
        ],
      },
      {
        heading: "Local Resources",
        items: [
          { label: "All Areas We Serve", href: "/areas-we-serve" },
          { label: "Arlington", href: "/arlington" },
          { label: "Fort Worth", href: "/fort-worth-drug-rehab" },
          { label: "Frisco", href: "/frisco" },
          { label: "Plano", href: "/plano" },
          { label: "Garland", href: "/garland" },
          { label: "Richardson", href: "/richardson" },
          { label: "McKinney", href: "/mckinney" },
          { label: "Southlake", href: "/southlake" },
        ],
      },
      {
        heading: "More Cities",
        items: [
          { label: "Highland Park", href: "/highland-park" },
          { label: "University Park", href: "/university-park" },
          { label: "Farmers Branch", href: "/farmers-branch" },
          { label: "Waco", href: "/waco" },
          { label: "Wichita Falls", href: "/wichita-falls" },
          { label: "Abilene", href: "/abilene" },
        ],
      },
    ],
  },
  {
    label: "Treatment",
    href: "/treatment-services",
    columns: [
      {
        heading: "Programs",
        items: [
          { label: "All Treatment Services", href: "/treatment-services" },
          { label: "Medical Detox", href: "/treatment-services/detox" },
          { label: "Residential Inpatient", href: "/treatment-services/residential-inpatient" },
          { label: "Mental Health Residential", href: "/treatment-services/mental-health-residential" },
          { label: "Dual Diagnosis", href: "/treatment-services/dual-diagnosis" },
          { label: "Aftercare Planning", href: "/treatment-services/aftercare-planning" },
          { label: "Luxury Treatment", href: "/luxury-treatment" },
        ],
      },
      {
        heading: "Detox By Substance",
        items: [
          { label: "Alcohol Detox", href: "/alcohol-detox" },
          { label: "Fentanyl Detox", href: "/fentanyl-detox" },
          { label: "Heroin Detox", href: "/heroin-detox" },
          { label: "Benzo Detox", href: "/benzo-detox" },
          { label: "Cocaine Detox", href: "/cocaine-detox" },
          { label: "Meth Detox", href: "/meth-detox" },
          { label: "Prescription Drugs Detox", href: "/prescription-drugs-detox" },
        ],
      },
    ],
  },
  {
    label: "Who We Help",
    href: "/who-we-help",
    children: [
      { label: "Overview", href: "/who-we-help" },
      { label: "Women", href: "/who-we-help/women" },
      { label: "Men", href: "/who-we-help/men" },
      { label: "Young Adults", href: "/who-we-help/young-adults" },
      { label: "Professionals", href: "/who-we-help/professionals" },
      { label: "College Students", href: "/who-we-help/college-students" },
      { label: "First Responders", href: "/who-we-help/first-responders" },
      { label: "Veterans", href: "/who-we-help/veterans" },
    ],
  },
  { label: "Tour", href: "/tour" },
  {
    label: "Admissions",
    href: "/admissions",
    children: [
      { label: "Admissions", href: "/admissions" },
      { label: "Veterans (VA CCN)", href: "/va-ccn" },
    ],
  },
  { label: "Contact", href: "/contact-us" },
];

// Insurance carriers shown on the "We work with most major insurance" strip.
// Files live in /public/images/insurance/ (copied from the source media library).
export const insurers: { name: string; file: string }[] = [
  { name: "Aetna", file: "mcr-aetna-white.png" },
  { name: "Anthem", file: "anthem-white.png" },
  { name: "BlueCross BlueShield", file: "bcbs-empire-2.png" },
  { name: "Highmark", file: "highmark-logo.png" },
  { name: "Horizon BCBS", file: "horizon-bcbs-white.png" },
  { name: "MagnaCare", file: "magnacare-logo-2-white.png" },
  { name: "Beacon", file: "mcr-beacon-white.png" },
  { name: "ComPsych", file: "mcr-compsych-white.png" },
  { name: "Magellan", file: "prc-magellan.png" },
  { name: "AmeriHealth", file: "amerihealth.png" },
];

export const footerNav = {
  explore: {
    heading: "Explore",
    items: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us" },
      { label: "Tour the Facility", href: "/tour" },
      { label: "Admissions", href: "/admissions" },
      { label: "Meet the Team", href: "/about-us/meet-the-team" },
      { label: "Areas We Serve", href: "/areas-we-serve" },
      { label: "Latest Articles", href: "/blog" },
      { label: "Contact", href: "/contact-us" },
    ],
  },
  treatment: {
    heading: "Treatment",
    items: [
      { label: "All Services", href: "/treatment-services" },
      { label: "Medical Detox", href: "/treatment-services/detox" },
      { label: "Residential Inpatient", href: "/treatment-services/residential-inpatient" },
      { label: "Mental Health Residential", href: "/treatment-services/mental-health-residential" },
      { label: "Dual Diagnosis", href: "/treatment-services/dual-diagnosis" },
      { label: "Aftercare Planning", href: "/treatment-services/aftercare-planning" },
    ],
  },
  help: {
    heading: "Who We Help",
    items: [
      { label: "Women", href: "/who-we-help/women" },
      { label: "Men", href: "/who-we-help/men" },
      { label: "Professionals", href: "/who-we-help/professionals" },
      { label: "Veterans", href: "/who-we-help/veterans" },
      { label: "First Responders", href: "/who-we-help/first-responders" },
      { label: "Young Adults", href: "/who-we-help/young-adults" },
    ],
  },
};
