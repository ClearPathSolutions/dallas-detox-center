import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndex, getPageByPath, getPost } from "@/lib/content";
import { metaFor } from "@/lib/seo";
import { PageTemplate } from "@/components/content/PageTemplate";
import { TeamTemplate } from "@/components/content/TeamTemplate";
import { PostTemplate } from "@/components/content/PostTemplate";
import {
  JsonLd,
  breadcrumbSchema,
  areaServedSchema,
  serviceSchema,
  personSchema,
  articleSchema,
} from "@/lib/schema";

export const dynamicParams = false;

// Pages with their own bespoke routes — excluded from this catch-all.
const BESPOKE = new Set(["blog", "faq-page", "tour", "contact-us"]);

const BREADCRUMB: Record<string, string> = {
  detox: "Medical Detox",
  location: "Local Resources",
  audience: "Who We Help",
  service: "Treatment Services",
  team: "Our Team",
  page: "Dallas Detox Center",
};

type Params = { slug: string[] };

function toPath(slug: string[]) {
  return "/" + slug.map((s) => decodeURIComponent(s)).join("/");
}

export function generateStaticParams() {
  const index = getIndex();
  const pageParams = index.pages
    .filter((p) => p.path !== "/")
    .filter((p) => !(p.path.split("/").filter(Boolean).length === 1 && BESPOKE.has(p.path.slice(1))))
    .map((p) => ({ slug: p.path.split("/").filter(Boolean) }));
  const postParams = index.posts.map((p) => ({ slug: p.path.split("/").filter(Boolean) }));
  return [...pageParams, ...postParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = toPath(slug);
  const page = getPageByPath(path);
  if (page) return metaFor(page);
  const post = getPost(slug[slug.length - 1]);
  return post ? metaFor(post) : {};
}

/** Breadcrumb trail for a page, mirroring the on-page breadcrumb label. */
function trailFor(page: { template: string; title: string; path: string }) {
  const parents: Record<string, { name: string; path: string }> = {
    detox: { name: "Treatment Services", path: "/treatment-services" },
    service: { name: "Treatment Services", path: "/treatment-services" },
    audience: { name: "Who We Help", path: "/who-we-help" },
    team: { name: "About Us", path: "/about-us" },
    location: { name: "Areas We Serve", path: "/areas-we-serve" },
  };
  const parent = parents[page.template];
  const self = { name: page.title, path: page.path };
  return parent && parent.path !== page.path ? [parent, self] : [self];
}

export default async function CatchAll({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const path = toPath(slug);

  const page = getPageByPath(path);
  if (page) {
    const graphs: object[] = [breadcrumbSchema(trailFor(page))];
    if (page.template === "location") {
      // City name is the page title's locality, e.g. "Drug Rehab Near Plano".
      const city =
        page.title.replace(/^.*?\b(?:near|in)\b\s*/i, "").replace(/,?\s*(TX|Texas)\b.*$/i, "").trim() ||
        page.title;
      graphs.push(areaServedSchema(page, city));
    } else if (page.template === "detox" || page.template === "service") {
      graphs.push(serviceSchema(page));
    } else if (page.template === "team") {
      graphs.push(personSchema(page));
    }

    return (
      <>
        <JsonLd data={graphs} />
        {page.template === "team" ? (
          <TeamTemplate page={page} />
        ) : (
          <PageTemplate page={page} breadcrumb={BREADCRUMB[page.template]} />
        )}
      </>
    );
  }

  // Date-based blog post: /YYYY/MM/DD/slug
  const post = getPost(slug[slug.length - 1]);
  if (post && post.path === path) {
    const related = getIndex()
      .posts.filter((p) => p.slug !== post.slug)
      .slice(0, 3)
      .map((p) => {
        const full = getPost(p.slug)!;
        return {
          slug: full.slug,
          path: full.path,
          title: full.title,
          date: full.date,
          category: full.category,
          excerpt: full.excerpt,
          image: full.featured?.src ?? null,
        };
      });
    return (
      <>
        <JsonLd
          data={[
            articleSchema(post),
            breadcrumbSchema([
              { name: "Blog", path: "/blog" },
              { name: post.title, path: post.path },
            ]),
          ]}
        />
        <PostTemplate post={post} related={related} />
      </>
    );
  }

  notFound();
}
