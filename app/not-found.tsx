import Link from "next/link";
import { Phone, Home } from "lucide-react";
import { site } from "@/lib/site";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="bg-navy-900 py-28">
      <Container className="text-center">
        <p className="eyebrow text-brand-400">Page Not Found</p>
        <h1 className="mt-3 font-display text-5xl text-white">We couldn&apos;t find that page</h1>
        <p className="mx-auto mt-5 max-w-lg text-navy-200">
          The page you&apos;re looking for may have moved. Help is still available —
          reach our admissions team 24/7, or head back home.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-navy-800 transition hover:bg-sand-100">
            <Home className="h-5 w-5" /> Back Home
          </Link>
          <a href={site.phone.href} className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-4 font-semibold text-white transition hover:bg-brand-600">
            <Phone className="h-5 w-5" /> {site.phone.display}
          </a>
        </div>
      </Container>
    </section>
  );
}
