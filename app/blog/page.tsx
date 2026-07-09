import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/content/PostCard";
import { CtaBand } from "@/components/sections/CtaBand";

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

      <section className="bg-sand-50 py-16 lg:py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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

      <CtaBand />
    </>
  );
}
