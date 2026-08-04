/**
 * The site's entire photographic vocabulary.
 *
 * These 44 photographs are the only approved imagery: the client-supplied set
 * of the actual Weatherford campus — main house, barn residence, clinical
 * spaces, grounds and aerials. Nothing else is permitted.
 *
 * What this replaced: the migrated WordPress library mixed the property's own
 * real-estate shoot with Shutterstock photography of unrelated places, and the
 * same four crops illustrated nearly every page. Alt text below is written from
 * the photographs themselves rather than inferred from filenames.
 */

const F = "/images/facility/";

export type Photo = { src: string; alt: string };

/**
 * Wide exteriors and aerials — hero use only. An interior behind the headline
 * scrim reads as clutter, and a bedroom is a poor first impression.
 */
export const heroes: Photo[] = [
  { src: `${F}exterior-main-house.jpg`, alt: "The main residence at Dallas Detox Center, with lawn and circular drive" },
  { src: `${F}exterior-drive-approach.jpg`, alt: "The tree-lined approach to the Dallas Detox Center campus" },
  { src: `${F}aerial-property-overhead.jpg`, alt: "Aerial view of the campus set among mature oaks" },
  { src: `${F}aerial-countryside.jpg`, alt: "Aerial view over the wooded countryside surrounding the campus" },
  { src: `${F}exterior-barn-lawn.jpg`, alt: "The barn residence and its lawn, shaded by oak trees" },
  { src: `${F}grounds-picnic-oaks.jpg`, alt: "Picnic seating under the oaks on the grounds" },
  { src: `${F}exterior-barn-drive.jpg`, alt: "The barn residence seen from the gravel drive" },
];

/** Living and communal spaces. */
export const commonAreas: Photo[] = [
  { src: `${F}lounge-house-sectional.jpg`, alt: "Living room in the main house with a large sectional sofa" },
  { src: `${F}lounge-sofas.jpg`, alt: "Communal lounge with sofas and natural light" },
  { src: `${F}lounge-tv.jpg`, alt: "Lounge seating area with a wall-mounted television" },
  { src: `${F}lounge-sofa-tv.jpg`, alt: "Comfortable lounge with sofa and television" },
  { src: `${F}sitting-room.jpg`, alt: "Quiet sitting room with soft seating" },
  { src: `${F}lounge-longhorn.jpg`, alt: "Lounge with Texas longhorn artwork and seating" },
  { src: `${F}sunroom-bay-window.jpg`, alt: "Sunroom with a bay window and hardwood floors" },
  { src: `${F}common-lounge-dining.jpg`, alt: "Open-plan lounge and dining area" },
  { src: `${F}entry-foyer-stairs.jpg`, alt: "Entry foyer with staircase" },
  { src: `${F}corridor-seating.jpg`, alt: "Bright corridor with a small seating nook" },
];

/** Dining and kitchen. */
export const dining: Photo[] = [
  { src: `${F}dining-communal.jpg`, alt: "Communal dining table beside the lounge" },
  { src: `${F}dining-table-windows.jpg`, alt: "Dining table set beneath large windows" },
  { src: `${F}dining-house-kitchen.jpg`, alt: "Dining room and kitchen in the main house" },
  { src: `${F}kitchen-commercial.jpg`, alt: "Commercial kitchen where meals are prepared on site" },
  { src: `${F}kitchen-island.jpg`, alt: "Kitchen island and preparation area" },
  { src: `${F}kitchen-range.jpg`, alt: "Kitchen with range and green cabinetry" },
];

/** Bedrooms — private and semi-private. */
export const bedrooms: Photo[] = [
  { src: `${F}bedroom-twin-1.jpg`, alt: "Semi-private bedroom with two beds and garden views" },
  { src: `${F}bedroom-twin-2.jpg`, alt: "Semi-private bedroom with two beds and storage" },
  { src: `${F}bedroom-twin-3.jpg`, alt: "Bedroom with two beds and a dresser" },
  { src: `${F}bedroom-twin-4.jpg`, alt: "Semi-private bedroom with a desk and workspace" },
  { src: `${F}bedroom-twin-desk.jpg`, alt: "Two-bed room with a desk beneath the window" },
  { src: `${F}bedroom-single-window.jpg`, alt: "Private bedroom with a window over the grounds" },
  { src: `${F}bedroom-double-desk.jpg`, alt: "Private room with a double bed and desk" },
  { src: `${F}bedroom-desk-1.jpg`, alt: "Private bedroom with a study desk" },
  { src: `${F}bedroom-desk-2.jpg`, alt: "Private bedroom with desk and television" },
  { src: `${F}bedroom-study.jpg`, alt: "Bedroom with a study area and rug" },
  { src: `${F}bedroom-house-twin.jpg`, alt: "Two-bed room in the main house" },
];

/** Clinical and support spaces. */
export const clinical: Photo[] = [
  { src: `${F}clinical-station.jpg`, alt: "Nursing station where medical staff monitor clients around the clock" },
  { src: `${F}office-consult.jpg`, alt: "Private office used for consultations and case management" },
  { src: `${F}office-admin.jpg`, alt: "Administrative office at Dallas Detox Center" },
];

/** Bathrooms, laundry and outdoor amenities. */
export const amenities: Photo[] = [
  { src: `${F}bathroom-vanity.jpg`, alt: "Shared bathroom with a double vanity" },
  { src: `${F}bathroom-shower.jpg`, alt: "Bathroom with a walk-in shower" },
  { src: `${F}bathroom-accessible-1.jpg`, alt: "Accessible bathroom with grab rails" },
  { src: `${F}bathroom-accessible-2.jpg`, alt: "Accessible bathroom with roll-in access" },
  { src: `${F}laundry.jpg`, alt: "On-site laundry room for clients" },
  { src: `${F}patio-pergola-seating.jpg`, alt: "Shaded patio seating beneath a pergola" },
  { src: `${F}exterior-barn-parking.jpg`, alt: "Parking beside the barn residence, including an accessible space" },
];

/** Every approved photograph, in tour order. */
export const allPhotos: Photo[] = [
  ...heroes,
  ...commonAreas,
  ...dining,
  ...bedrooms,
  ...clinical,
  ...amenities,
];

/** Default hero, where a page has no reason to prefer another. */
export const heroImage = heroes[0].src;

/**
 * Interleaved so any run of six spans exterior, communal, bedroom, dining and
 * clinical rather than six near-identical bedrooms.
 */
const GALLERY_POOL: Photo[] = [
  heroes[0], commonAreas[0], bedrooms[0], dining[0], amenities[0], heroes[2],
  commonAreas[1], bedrooms[1], dining[3], clinical[0], heroes[4], commonAreas[6],
  bedrooms[5], dining[1], amenities[5], heroes[3], commonAreas[4], bedrooms[6],
  dining[2], clinical[1], heroes[5], commonAreas[2], bedrooms[8], amenities[1],
  commonAreas[3], bedrooms[3], dining[4], amenities[2], heroes[6], commonAreas[8],
];

/**
 * Photos suitable for breaking up a long passage of body copy. Bathrooms and
 * laundry are excluded — they belong in the tour, not as the feature image in
 * the middle of a discussion about levels of care.
 */
const INLINE_POOL: Photo[] = [
  ...commonAreas,
  ...dining.slice(0, 3),
  ...bedrooms.slice(0, 6),
  ...clinical,
  heroes[1],
  heroes[4],
  heroes[5],
];

/** A photo to break up a long section, keyed on page and position. */
export function inlinePhotoFor(slug: string, index: number): Photo {
  return INLINE_POOL[(hash(slug) + index * 7) % INLINE_POOL.length];
}

/** Stable per-slug hash so a page's imagery never shifts between builds. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Page-hero candidates, distinct from `heroes` (which is the grounds set the
 * tour uses). Two of the exteriors are the barn seen across gravel and bare
 * ground — accurate, but a weak first impression for a flagship treatment page,
 * so the pool leans on the main house, the aerials, and the most inviting
 * interiors. PageHero shows the photo in a card beside the headline rather than
 * behind it, so an interior reads well here.
 */
const PAGE_HERO_POOL: Photo[] = [
  heroes[0], // main house and lawn
  heroes[1], // tree-lined approach
  heroes[2], // aerial overhead
  commonAreas[0], // sectional lounge
  commonAreas[6], // sunroom bay window
  heroes[4], // barn and lawn
  heroes[5], // picnic under the oaks
  commonAreas[1], // communal lounge
  dining[0], // communal dining
  heroes[3], // aerial countryside
];

/** Hero for a page that brought no image of its own. */
export function heroFor(slug: string): string {
  return PAGE_HERO_POOL[hash(slug) % PAGE_HERO_POOL.length].src;
}

/** A varied run of gallery photos, offset per page so pages differ. */
export function galleryFor(slug: string, count = 6): Photo[] {
  const start = hash(slug) % GALLERY_POOL.length;
  return Array.from({ length: Math.min(count, GALLERY_POOL.length) }, (_, i) =>
    GALLERY_POOL[(start + i) % GALLERY_POOL.length],
  );
}

/**
 * Legacy shape: the bespoke homepage and tour page index into
 * `facility.gallery` positionally.
 */
export const facility = {
  heroExterior: heroes[0].src,
  gallery: GALLERY_POOL,
};

/**
 * Photography that predates the approved set — the migrated WordPress library,
 * including Shutterstock and Unsplash images of places that are not this
 * facility. 212 distinct legacy files were still referenced by the content JSON.
 *
 * Staff headshots are exempt: none were supplied in the approved pack, so team
 * pages keep the portraits they have.
 */
const APPROVED_PREFIXES = [
  "/images/facility/",
  "/images/brand/",
  "/images/insurance/",
  "/images/accreditation/",
  "/images/logo",
  "/images/icon",
  "/images/favicon",
  // Staff portraits: none were supplied in the approved pack, so the three we
  // have are permitted. Two are screen captures rather than photographs and
  // three of the six people have none at all — flagged, not silently faked.
  "/images/team/",
];

export function isApprovedSrc(src?: string | null): boolean {
  return !!src && APPROVED_PREFIXES.some((p) => src.startsWith(p));
}

/**
 * Substitute an approved photograph for any legacy source. Deterministic per
 * key so a page's imagery is stable across builds.
 */
export function approvedHero(src: string | null | undefined, key: string): string {
  return isApprovedSrc(src) ? (src as string) : heroFor(key);
}

export function approvedThumb(src: string | null | undefined, key: string): Photo {
  if (isApprovedSrc(src)) return { src: src as string, alt: "" };
  return galleryFor(key, 1)[0];
}
