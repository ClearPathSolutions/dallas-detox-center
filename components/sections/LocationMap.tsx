import { MapPin, ExternalLink } from "lucide-react";
import { site } from "@/lib/site";

const EMBED = `https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`;

/**
 * Google Maps embed for the campus. Used on /contact-us and appended to any
 * migrated section that tells people how to find us — /admissions had a "How to
 * Find Us" heading with no map under it.
 */
export function LocationMap({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl ring-1 ring-navy-900/5">
        <iframe
          title={`${site.name} location`}
          src={EMBED}
          loading="lazy"
          className="h-72 w-full border-0"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-navy-600">
        <MapPin className="h-4 w-4 shrink-0 text-brand-700" aria-hidden />
        {site.address.full}
        <a
          href={site.google.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
        >
          Get directions
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </p>
    </div>
  );
}
