import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/content/PostCard";
import { CtaBand } from "@/components/sections/CtaBand";
import ClarionBlog from "@/components/ClarionBlog";

export const metadata: Metadata = {
  title: "Recovery Resources & Latest Articles",
  description:
    "Insights, guidance, and education on detox, addiction treatment, mental health, and lasting recovery from the team at Dallas Detox Center.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
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

      {/* Clarion-managed blog posts render here. */}
      <section className="bg-sand-50 py-16 lg:py-20">
        <Container>
          <ClarionBlog />
        </Container>
      </section>

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
