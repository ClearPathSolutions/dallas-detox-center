import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site";
import { getClarionPost, getClarionPosts } from "@/lib/clarion";
import { Container } from "@/components/ui/Container";
import { clarionCover } from "@/lib/media";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd, breadcrumbSchema, organisationId } from "@/lib/schema";

// New posts should appear without a redeploy, so unknown slugs are rendered on
// demand rather than 404'd.
export const dynamicParams = true;
// Matches the Clarion data cache in lib/clarion.ts: an edit in Clarion should
// not take an hour to show up here either.
export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getClarionPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getClarionPost(slug);
  if (!post) return {};
  return {
    title: post.seoTitle ? { absolute: post.seoTitle } : post.title,
    description: post.seoDescription ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? undefined,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? null
    : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function ClarionPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getClarionPost(slug);
  if (!post) notFound();

  const date = formatDate(post.publishedAt);
  const url = `${site.url}/blog/${post.slug}`;
  // Absolute, so it matches the @id personSchema gives a bio page on this site.
  const reviewerUrl = post.reviewer?.url ? new URL(post.reviewer.url, site.url).href.replace(/\/$/, "") : null;

  return (
    <>
      <JsonLd
        data={[
          // templates/clinical-article.jsonld: a MedicalWebPage carrying the
          // review, with the BlogPosting as its main entity.
          //
          // Departure from the template, agreed 2026-09-28: it emits reviewedBy
          // only alongside lastReviewed, but Clarion has no review-date field,
          // so reviewedBy is output whenever a reviewer is set and lastReviewed
          // is omitted. Never a default reviewer — no reviewer, no reviewedBy.
          {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "MedicalWebPage",
                "@id": `${url}#webpage`,
                url,
                name: post.title,
                ...(post.reviewer
                  ? {
                      reviewedBy: {
                        "@type": "Person",
                        ...(reviewerUrl ? { "@id": `${reviewerUrl}#person`, url: reviewerUrl } : {}),
                        name: post.reviewer.name,
                        honorificSuffix: post.reviewer.credentials ?? undefined,
                      },
                    }
                  : {}),
                publisher: { "@id": organisationId },
              },
              {
                "@type": "BlogPosting",
                "@id": `${url}#article`,
                headline: post.title,
                description: post.seoDescription ?? undefined,
                mainEntityOfPage: { "@id": `${url}#webpage` },
                datePublished: post.publishedAt ?? undefined,
                dateModified: post.publishedAt ?? undefined,
                image: post.coverImage ?? `${site.url}/images/logo.png`,
                // Clarion gives an author name but no bio page to point at.
                author: post.author
                  ? { "@type": "Organization", name: post.author }
                  : { "@id": organisationId },
                publisher: { "@id": organisationId },
              },
            ],
          },
          breadcrumbSchema([
            { name: "Recovery Resources", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article>
        <header className="bg-navy-900 py-14 lg:py-16">
          <Container>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> All articles
            </Link>
            <h1 className="mt-5 max-w-3xl text-3xl text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-navy-300">
              {date && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" aria-hidden /> {date}
                </span>
              )}
              {post.author && <span>By {post.author}</span>}
              {post.reviewer && (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent-400" aria-hidden />
                  Medically reviewed by{" "}
                  {post.reviewer.url ? (
                    <a
                      href={post.reviewer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-white"
                    >
                      {post.reviewer.name}
                    </a>
                  ) : (
                    post.reviewer.name
                  )}
                  {post.reviewer.credentials ? `, ${post.reviewer.credentials}` : ""}
                </span>
              )}
            </div>
          </Container>
        </header>

        {post.coverImage && (
          <div className="bg-navy-900">
            <Container className="pb-14">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src={clarionCover(post.coverImage, post.slug).src}
                  alt=""
                  fill
                  sizes="(min-width:1280px) 76rem, 100vw"
                  className="object-cover"
                />
              </div>
            </Container>
          </div>
        )}

        <div className="bg-white py-14 lg:py-16">
          <Container>
            <div className="prose-ddc mx-auto max-w-3xl">
              {post.bodyHtml ? (
                <div dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />
              ) : (
                <p>{post.excerpt}</p>
              )}
            </div>
          </Container>
        </div>
      </article>

      <CtaBand />
    </>
  );
}
