import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/content/PostCard";
import { CtaBand } from "@/components/sections/CtaBand";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays } from "lucide-react";
import { getClarionPosts } from "@/lib/clarion";
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Recovery Resources & Latest Articles",
  description:
    "Insights, guidance, and education on detox, addiction treatment, mental health, and lasting recovery from the team at Dallas Detox Center.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const posts = getAllPosts();
  const clarionPosts = await getClarionPosts();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Recovery Resources", path: "/blog" }])} />
      <section className="bg-navy-900 py-16 lg:py-20">
        <Container className="text-center">
          <p className="eyebrow text-brand-400">Recovery Resources</p>
          <h1 className="mx-auto mt-3 max-w-3xl text-4xl text-white sm:text-5xl">
            Insights & Education for Your Recovery Journey
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-navy-200">
            Guidance on detox, treatment, mental health, and building a life in
            recovery — written by our clinical team.
          </p>
        </Container>
      </section>

      {/*
        Clarion-managed posts, server-rendered. They were previously injected by
        a client-side embed, which left them invisible to crawlers and reachable
        only at /blog?post=<slug> with the index's own title and canonical.
      */}
      {clarionPosts.length > 0 && (
        <section className="bg-sand-50 py-16 lg:py-20">
          <Container>
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {clarionPosts.map((post) => {
                const d = post.publishedAt ? new Date(post.publishedAt) : null;
                const date =
                  d && !Number.isNaN(d.getTime())
                    ? d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                    : null;
                return (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      {post.coverImage && (
                        <div className="relative aspect-[16/10] overflow-hidden bg-sand-100">
                          <Image
                            src={post.coverImage}
                            alt=""
                            fill
                            sizes="(min-width:1024px) 24rem, (min-width:640px) 50vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        {date && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-navy-500">
                            <CalendarDays className="h-3.5 w-3.5" aria-hidden /> {date}
                          </span>
                        )}
                        <h2 className="mt-2 font-display text-xl leading-snug text-navy-800 group-hover:text-brand-700">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-600">
                            {post.excerpt.length > 170
                              ? post.excerpt.slice(0, 167).replace(/[,;:\s]+\S*$/, "") + "\u2026"
                              : post.excerpt}
                          </p>
                        )}
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5">
                          Read more <ArrowRight className="h-4 w-4 transition-all" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      )}

      {/* Pre-existing articles migrated with the site rebuild. */}
      {posts.length > 0 && (
        <section className="bg-white py-16 lg:py-20">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow text-brand-600">From the Archive</p>
              <h2 className="mt-3 text-3xl text-navy-800 sm:text-4xl">
                More Recovery Articles
              </h2>
              <p className="mt-4 text-lg text-navy-500">
                Earlier guidance from our clinical team, preserved from our
                previous library.
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard
                  key={post.slug}
                  post={{
                    slug: post.slug,
                    path: post.path,
                    title: post.title,
                    date: post.date,
                    category: post.category,
                    excerpt: post.excerpt,
                    image: post.featured?.src ?? null,
                  }}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBand />
    </>
  );
}
