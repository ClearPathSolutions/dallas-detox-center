import { unstable_cache } from "next/cache";
import { site } from "./site";

/**
 * Live Google Business Profile reviews, via the Places API (New).
 *
 * Requires GOOGLE_PLACES_API_KEY (a server-only key with the Places API
 * enabled and billing active). Without it every function here returns null and
 * the review section simply doesn't render — the site still builds and deploys.
 *
 * Two constraints worth knowing before changing this file:
 *
 *  1. Google returns AT MOST 5 reviews and chooses which ones. There is no
 *     pagination and no way to request more. "All reviews" has to be a link out
 *     to the profile.
 *  2. Reviews are rendered as plain content on purpose. Do NOT wrap them in
 *     Review/aggregateRating JSON-LD — Google's structured data policy forbids
 *     marking up reviews sourced from Google, and doing it risks a manual
 *     action against the site.
 *
 * We also show whatever Google returns, unmodified and in Google's order,
 * rather than filtering to the flattering ones: the displayed rating and count
 * are the real ones, so a cherry-picked list would misrepresent them.
 */

export type GoogleReview = {
  id: string;
  author: string;
  authorUrl?: string;
  photoUrl?: string;
  rating: number;
  relativeTime: string;
  text: string;
};

export type GoogleReviewData = {
  /** Overall profile rating, e.g. 4.8 */
  rating: number;
  /** Total number of ratings behind that average */
  total: number;
  /** Canonical Google Maps URL for the profile */
  profileUrl: string;
  /** Up to 5 reviews, as returned by Google */
  reviews: GoogleReview[];
};

const ENDPOINT = "https://places.googleapis.com/v1/places:searchText";

const FIELD_MASK = [
  "places.id",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.reviews",
].join(",");

type PlacesReview = {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
};

async function fetchGoogleReviews(): Promise<GoogleReviewData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      // unstable_cache owns the caching for this call; Next does not cache
      // POST fetches, so leaving this uncached avoids a misleading double layer.
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        textQuery: `${site.name}, ${site.address.full}`,
        maxResultCount: 1,
        languageCode: "en",
      }),
    });

    if (!res.ok) {
      console.error(`[reviews] Places API responded ${res.status}: ${await res.text()}`);
      return null;
    }

    const place = (await res.json())?.places?.[0];
    if (!place) {
      console.error("[reviews] Places API returned no match for the business query");
      return null;
    }

    const reviews: GoogleReview[] = ((place.reviews ?? []) as PlacesReview[])
      .map((r, i) => ({
        id: r.name ?? `review-${i}`,
        author: r.authorAttribution?.displayName ?? "Google user",
        authorUrl: r.authorAttribution?.uri,
        photoUrl: r.authorAttribution?.photoUri,
        rating: r.rating ?? 0,
        relativeTime: r.relativePublishTimeDescription ?? "",
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
      }))
      .filter((r) => r.text.length > 0);

    if (reviews.length === 0) return null;

    return {
      rating: place.rating ?? 0,
      total: place.userRatingCount ?? 0,
      profileUrl: place.googleMapsUri ?? site.google.profileUrl,
      reviews,
    };
  } catch (err) {
    console.error("[reviews] Places API request failed:", err);
    return null;
  }
}

/**
 * Cached wrapper — one upstream call per day. Google's Places policy allows
 * limited caching of place content (place IDs may be stored indefinitely,
 * other fields refreshed within 30 days), so daily is comfortably inside it.
 */
export const getGoogleReviews = unstable_cache(fetchGoogleReviews, ["google-reviews"], {
  revalidate: 86400,
  tags: ["google-reviews"],
});
