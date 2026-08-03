import Image from "next/image";
import { Star, ExternalLink, PenLine } from "lucide-react";
import { site } from "@/lib/site";
import { getGoogleReviews, type GoogleReview } from "@/lib/reviews";
import { Container } from "@/components/ui/Container";

/**
 * Live Google reviews. Renders nothing when GOOGLE_PLACES_API_KEY is unset or
 * the Places call fails, so the page degrades to its previous layout instead of
 * showing an empty shell.
 *
 * Deliberately ships no Review/aggregateRating JSON-LD — see lib/reviews.ts.
 */
export async function GoogleReviews({
  heading = "Reviews From Our Community",
  eyebrow = "What Families Say",
  intro,
  tone = "bg-sand-50",
}: {
  heading?: string;
  eyebrow?: string;
  intro?: string | null;
  tone?: string;
} = {}) {
  const data = await getGoogleReviews();
  if (!data) return null;

  const { rating, total, profileUrl, reviews } = data;

  return (
    <section className={`py-16 lg:py-24 ${tone}`}>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-brand-600">{eyebrow}</p>
          <h2 className="mt-3 text-3xl text-navy-800 sm:text-4xl">{heading}</h2>
          {intro && <p className="mt-4 text-navy-600">{intro}</p>}

          <div className="mt-5 flex flex-col items-center gap-2">
            <Stars rating={rating} />
            <p className="text-navy-600">
              <span className="font-semibold text-navy-800">
                {rating.toFixed(1)} out of 5
              </span>{" "}
              from {total.toLocaleString()} Google {total === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-4 font-semibold text-white transition hover:bg-navy-800"
          >
            Read all reviews on Google
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
          <a
            href={site.google.writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-navy-200 px-7 py-4 font-semibold text-navy-800 transition hover:border-brand-400 hover:text-brand-700"
          >
            <PenLine className="h-4 w-4" aria-hidden />
            Leave us a review
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-navy-500">
          Reviews are pulled directly from our Google Business Profile and shown
          unedited. Google displays up to five at a time.
        </p>
      </Container>
    </section>
  );
}

function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <li className="flex flex-col rounded-2xl border border-sand-200 bg-white p-6 shadow-sm">
      <Stars rating={review.rating} />
      {/* Clamped for layout only — the text itself is never altered, and the
          full review is one click away on Google. */}
      <blockquote className="mt-4 line-clamp-[10] flex-1 text-navy-700">
        {review.text}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-sand-200 pt-4">
        {review.photoUrl ? (
          <Image
            src={review.photoUrl}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-800"
          >
            {review.author.charAt(0).toUpperCase()}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-navy-800">
            {review.authorUrl ? (
              <a
                href={review.authorUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="hover:text-brand-700 hover:underline"
              >
                {review.author}
              </a>
            ) : (
              review.author
            )}
          </span>
          {review.relativeTime && (
            <span className="block text-xs text-navy-500">{review.relativeTime}</span>
          )}
        </span>
      </figcaption>
    </li>
  );
}

/**
 * Star row. The glyphs are decorative — the rating is always also present as
 * text (either the visible "x out of 5" line or this element's label), so the
 * value never depends on colour alone.
 */
function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span
      className="inline-flex items-center gap-0.5"
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden
          className={
            i <= rounded
              ? "h-4 w-4 fill-amber-600 text-amber-600"
              : "h-4 w-4 fill-none text-navy-400"
          }
        />
      ))}
    </span>
  );
}
