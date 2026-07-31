import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { site, footerNav } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { InstagramIcon, FacebookIcon, LinkedinIcon } from "@/components/ui/SocialIcons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-900 text-navy-200">
      {/* CTA band */}
      <div className="border-b border-white/10 bg-navy-950">
        <Container className="flex flex-col items-center gap-6 py-12 text-center lg:flex-row lg:justify-between lg:text-left">
          <div>
            <p className="eyebrow text-brand-400">Help is available 24/7</p>
            <h2 className="mt-2 text-3xl text-white lg:text-4xl">
              Take the first step toward recovery today
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={site.phone.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-800"
            >
              <Phone className="h-5 w-5" /> {site.phone.display}
            </a>
            <Link
              href="/verify-insurance"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-700 px-7 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent-800"
            >
              Verify Your Insurance
            </Link>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand + contact */}
          <div>
            <Image
              src="/images/logo-light.png"
              alt={site.name}
              width={600}
              height={400}
              className="h-24 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-300">
              Luxury medical detox, residential treatment, and dual diagnosis
              mental health care serving Dallas–Fort Worth and all of Texas.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href={site.phone.href} className="inline-flex items-center gap-3 hover:text-white">
                  <Phone className="h-4 w-4 text-brand-400" /> {site.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-white">
                  <Mail className="h-4 w-4 text-brand-400" /> {site.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {site.address.full}
              </li>
            </ul>
          </div>

          {[footerNav.explore, footerNav.treatment, footerNav.help].map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-navy-300 transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-navy-300">
            © {year} {site.name}. All rights reserved. ·{" "}
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
          </p>
          <div className="flex items-center gap-3">
            <SocialIcon href={site.social.instagram} label="Instagram">
              <InstagramIcon className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href={site.social.facebook} label="Facebook">
              <FacebookIcon className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon href={site.social.linkedin} label="LinkedIn">
              <LinkedinIcon className="h-4 w-4" />
            </SocialIcon>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-700"
    >
      {children}
    </a>
  );
}
