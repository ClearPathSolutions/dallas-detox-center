import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays } from "lucide-react";
import type { PostContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { approvedHero } from "@/lib/media";
import { BlockFlow } from "@/components/content/BlockRenderer";
import { PostCard, formatDate, type PostCardData } from "@/components/content/PostCard";
import { CtaBand } from "@/components/sections/CtaBand";

export function PostTemplate({
  post,
  related,
}: {
  post: PostContent;
  related: PostCardData[];
}) {
  const body = post.blocks.filter((b) => !(b.type === "heading" && b.level === 1));

  return (
    <>
      <article>
        <header className="relative overflow-hidden bg-navy-900 py-16 lg:py-20">
          {post.featured?.src && (
            <>
              <Image
                src={approvedHero(post.featured.src, post.slug)}
                alt=""
                fill
                sizes="100vw"
                priority
                className="object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-900/85 to-navy-900/70" />
            </>
          )}
          <Container className="relative">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-brand-300 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> All Articles
            </Link>
            <div className="mt-6 max-w-3xl">
              {post.category && (
                <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-200 ring-1 ring-brand-400/30">
                  {post.category}
                </span>
              )}
              <h1 className="mt-4 text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-navy-300">
                <CalendarDays className="h-4 w-4" /> {formatDate(post.date)}
              </p>
            </div>
          </Container>
        </header>

        <div className="bg-white py-14 lg:py-16">
          <Container>
            <div className="mx-auto max-w-3xl">
              <BlockFlow blocks={body} />
            </div>
          </Container>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-sand-50 py-16">
          <Container>
            <h2 className="text-center font-display text-3xl text-navy-800">Continue Reading</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <PostCard key={r.slug} post={r} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}
