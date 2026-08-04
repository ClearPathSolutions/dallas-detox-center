import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SmartImage } from "@/components/ui/SmartImage";
import { approvedThumb } from "@/lib/media";

export type PostCardData = {
  slug: string;
  path: string;
  title: string;
  date: string;
  category?: string | null;
  excerpt?: string;
  image?: string | null;
};

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: { post: PostCardData }) {
  // Blog thumbnails were stock photography and branded graphics outside the
  // approved set; substitute a facility photo, keyed on the slug so it is stable.
  const thumb = approvedThumb(post.image, post.slug);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-navy-900/5 transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={post.path} className="relative block aspect-[16/10] overflow-hidden">
        {thumb.src ? (
          <SmartImage
            src={thumb.src}
            alt={thumb.alt || post.title}
            sizes="(min-width:1024px) 26rem, 100vw"
            className="h-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-navy-100" />
        )}
        {post.category && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-700 shadow">
            {post.category}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <time className="text-xs font-medium uppercase tracking-wide text-navy-400">
          {formatDate(post.date)}
        </time>
        <h3 className="mt-2 font-display text-xl leading-snug text-navy-800 transition group-hover:text-brand-700">
          <Link href={post.path}>{post.title}</Link>
        </h3>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-navy-500">{post.excerpt}</p>
        )}
        <Link
          href={post.path}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5"
        >
          Read Article <ArrowRight className="h-4 w-4 transition-all" />
        </Link>
      </div>
    </article>
  );
}
