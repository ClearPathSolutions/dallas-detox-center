// Curated facility imagery (freshest 2026 real-estate photography set).
const C = "/images/content/2026/02/";

export const facility = {
  heroExterior: `${C}1-web-or-mls-DJI_20260206132754_0577_D.jpg`,
  gallery: [
    { src: `${C}8-web-or-mls-DSC04989.jpg`, alt: "Bright communal dining and lounge area" },
    { src: `${C}1-web-or-mls-DSC05075.jpg`, alt: "Modern common space at Dallas Detox Center" },
    { src: `${C}2-web-or-mls-DSC05078.jpg`, alt: "Comfortable interior lounge" },
    { src: `${C}15-web-or-mls-DSC05010.jpg`, alt: "Private, restful bedroom" },
    { src: `${C}20-web-or-mls-DSC05028.jpg`, alt: "Serene treatment space" },
    { src: `${C}31-web-or-mls-DSC05061.jpg`, alt: "Relaxing amenity area" },
    { src: `${C}33-web-or-mls-DSC05067.jpg`, alt: "Outdoor grounds and greenery" },
    { src: `${C}10-web-or-mls-DSC09526.jpg`, alt: "Facility exterior among the trees" },
  ] as { src: string; alt: string }[],
};

export const heroImage = facility.heroExterior;

/**
 * Wider pool of real facility photography for the "A Look Inside Our Campus"
 * galleries.
 *
 * The migration put the same four photos into nearly every page's body, so 36
 * of the galleries showed an identical set — which is what the content
 * walkthrough logged (as "stock images"; they are in fact the property's own
 * real-estate shoot). 33 landscape photos exist; this rotates through them so
 * each page shows a different selection.
 */
const POOL: { src: string; alt: string }[] = [
  { src: "/images/content/2026/02/8-web-or-mls-DSC04989.jpg", alt: "Communal dining and lounge area" },
  { src: "/images/content/2026/02/1-web-or-mls-DSC05075.jpg", alt: "Modern common space" },
  { src: "/images/content/2026/02/2-web-or-mls-DSC05078.jpg", alt: "Comfortable interior lounge" },
  { src: "/images/content/2026/02/15-web-or-mls-DSC05010.jpg", alt: "Private, restful bedroom" },
  { src: "/images/content/2026/02/20-web-or-mls-DSC05028.jpg", alt: "Serene treatment space" },
  { src: "/images/content/2026/02/31-web-or-mls-DSC05061.jpg", alt: "Relaxing amenity area" },
  { src: "/images/content/2026/02/33-web-or-mls-DSC05067.jpg", alt: "Outdoor grounds and greenery" },
  { src: "/images/content/2026/02/10-web-or-mls-DSC09526.jpg", alt: "Facility exterior among the trees" },
  { src: "/images/content/2026/02/15-web-or-mls-DSC09539.jpg", alt: "Grounds at the Weatherford campus" },
  { src: "/images/content/2026/02/1-web-or-mls-DJI_20260206132754_0577_D.jpg", alt: "Aerial view of the private campus" },
  { src: "/images/content/2026/05/34-web-or-mls-DJI_20260505155925_0941_D.jpg", alt: "Aerial view of the grounds" },
  { src: "/images/content/2026/05/38-web-or-mls-DJI_20260505160203_0953_D.jpg", alt: "The campus from above" },
  { src: "/images/content/2026/05/39-web-or-mls-DJI_20260505160314_0956_D.jpg", alt: "Surrounding acreage" },
  { src: "/images/content/2022/06/3-web-or-mls-Dallas-Detox-Center-_-Real-Estate-Photography-Dallas-3.jpg", alt: "Living space at Dallas Detox Center" },
  { src: "/images/content/2022/06/4-web-or-mls-Dallas-Detox-Center-_-Real-Estate-Photography-Dallas-4.jpg", alt: "Shared lounge" },
  { src: "/images/content/2022/06/7-web-or-mls-Dallas-Detox-Center-_-Real-Estate-Photography-Dallas-7.jpg", alt: "Interior common area" },
  { src: "/images/content/2022/06/8-web-or-mls-Dallas-Detox-Center-_-Real-Estate-Photography-Dallas-8.jpg", alt: "Quiet seating area" },
  { src: "/images/content/2022/06/10-web-or-mls-Dallas-Detox-Center-_-Real-Estate-Photography-Dallas-10.jpg", alt: "Dining space" },
  { src: "/images/content/2022/06/13-web-or-mls-Dallas-Detox-Center-_-Real-Estate-Photography-Dallas-13.jpg", alt: "Guest bedroom" },
  { src: "/images/content/2022/06/32-web-or-mls-Dallas-Detox-Center-_-Real-Estate-Photography-Dallas-32.jpg", alt: "Grounds and outdoor space" },
];

/** Simple stable hash so a given slug always gets the same photos. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * `count` photos for `slug`, rotated through POOL. Deterministic, so the build
 * is reproducible and a page's imagery doesn't shuffle between deploys.
 */
/**
 * Wide, full-bleed shots suitable for a page hero. Interiors are excluded — a
 * close bedroom shot behind the headline scrim reads as clutter.
 */
const HERO_POOL: string[] = [
  `${C}1-web-or-mls-DJI_20260206132754_0577_D.jpg`,
  `${C}2-web-or-mls-DJI_20260206132819_0580_D-1024x576.jpg`,
  `${C}3-web-or-mls-DJI_20260206132919_0584_D-1024x576.jpg`,
  `${C}10-web-or-mls-DSC09526.jpg`,
  `${C}33-web-or-mls-DSC05067.jpg`,
  "/images/content/2026/05/33-web-or-mls-DJI_20260505155843_0939_D.jpg",
  "/images/content/2026/05/34-web-or-mls-DJI_20260505155925_0941_D.jpg",
  "/images/content/2026/05/38-web-or-mls-DJI_20260505160203_0953_D.jpg",
  "/images/content/2026/05/39-web-or-mls-DJI_20260505160314_0956_D.jpg",
];

/**
 * Hero for a page that brought no image of its own. 43 of 104 pages were
 * defaulting to the same aerial, which made the site feel like one page
 * repeated; this spreads them deterministically across the wide shots.
 */
export function heroFor(slug: string): string {
  return HERO_POOL[hash(slug) % HERO_POOL.length];
}

export function galleryFor(slug: string, count = 6): { src: string; alt: string }[] {
  const start = hash(slug) % POOL.length;
  return Array.from({ length: Math.min(count, POOL.length) }, (_, i) => POOL[(start + i) % POOL.length]);
}
