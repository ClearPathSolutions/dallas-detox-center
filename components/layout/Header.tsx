"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, ShieldCheck, X, Clock } from "lucide-react";
import { nav, site, type NavItem } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Lock scroll when the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-navy-900 text-navy-100 md:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <span className="inline-flex items-center gap-2 tracking-wide">
            <Clock className="h-3.5 w-3.5 text-brand-400" />
            24/7 Confidential Admissions
          </span>
          <div className="flex items-center gap-6">
            <span className="text-navy-300">{site.address.full}</span>
            <a href={site.phone.href} className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-brand-300">
              <Phone className="h-3.5 w-3.5" />
              {site.phone.display}
            </a>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <div
        className={cn(
          "bg-white transition-shadow duration-300",
          scrolled ? "shadow-md" : "shadow-sm",
        )}
      >
        <Container className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center" aria-label={site.name}>
            <Image
              src="/images/logo.png"
              alt={site.name}
              width={550}
              height={200}
              priority
              className="h-11 w-auto lg:h-12"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <DesktopNavItem
                key={item.label}
                item={item}
                open={openMenu === item.label}
                onOpen={() => setOpenMenu(item.label)}
                onClose={() => setOpenMenu((cur) => (cur === item.label ? null : cur))}
                pathname={pathname}
              />
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 xl:flex">
            <a
              href={site.phone.href}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-navy-200 px-4 py-2.5 text-sm font-semibold text-navy-800 transition hover:border-brand-400 hover:text-brand-700"
            >
              <Phone className="h-4 w-4 text-brand-500" />
              {site.phone.display}
            </a>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-md"
            >
              <ShieldCheck className="h-4 w-4" />
              Verify Insurance
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 xl:hidden">
            <a
              href={site.phone.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3.5 py-2 text-sm font-semibold text-white"
              aria-label={`Call ${site.phone.display}`}
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Call</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-navy-800 hover:bg-sand-100"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </Container>
      </div>

      {mobileOpen && <MobileDrawer onClose={() => setMobileOpen(false)} pathname={pathname} />}
    </header>
  );
}

function DesktopNavItem({
  item,
  open,
  onOpen,
  onClose,
  pathname,
}: {
  item: NavItem;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  pathname: string;
}) {
  const hasMenu = !!(item.children || item.columns);
  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

  if (!hasMenu) {
    return (
      <Link
        href={item.href}
        className={cn(
          "whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
          active ? "text-brand-700" : "text-navy-700 hover:text-brand-700",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Link
        href={item.href}
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
          active || open ? "text-brand-700" : "text-navy-700 hover:text-brand-700",
        )}
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </Link>

      {open && (
        <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
          <div className="animate-fade-up rounded-2xl border border-sand-200 bg-white p-2 shadow-xl shadow-navy-900/10">
            {item.columns ? (
              <div className="flex gap-2">
                {item.columns.map((col) => (
                  <div key={col.heading} className="min-w-[13rem] p-2">
                    <p className="eyebrow px-3 pb-2 text-navy-400">{col.heading}</p>
                    <ul>
                      {col.items.map((child) => (
                        <MenuLink key={child.href} item={child} pathname={pathname} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="min-w-[15rem] p-1">
                {item.children!.map((child) => (
                  <MenuLink key={child.href} item={child} pathname={pathname} />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = pathname === item.href;
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "block rounded-xl px-3 py-2 text-sm transition-colors",
          active ? "bg-brand-50 text-brand-700" : "text-navy-700 hover:bg-sand-100 hover:text-brand-700",
        )}
      >
        {item.label}
      </Link>
    </li>
  );
}

function MobileDrawer({ onClose, pathname }: { onClose: () => void; pathname: string }) {
  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-2xl">
        <div className="flex h-20 items-center justify-between border-b border-sand-200 px-5">
          <Image src="/images/logo.png" alt={site.name} width={550} height={200} className="h-9 w-auto" />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-navy-800 hover:bg-sand-100"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile">
          {nav.map((item) => (
            <MobileNavItem key={item.label} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="space-y-2 border-t border-sand-200 p-4">
          <Link
            href="/contact-us"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 px-5 py-3.5 text-sm font-semibold text-white"
          >
            <ShieldCheck className="h-4 w-4" /> Verify Insurance
          </Link>
          <a
            href={site.phone.href}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-5 py-3.5 text-sm font-semibold text-white"
          >
            <Phone className="h-4 w-4" /> Call {site.phone.display}
          </a>
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const groups = item.columns
    ? item.columns.flatMap((c) => c.items)
    : item.children ?? null;

  if (!groups) {
    return (
      <Link
        href={item.href}
        className={cn(
          "block rounded-xl px-3 py-3 text-base font-semibold",
          pathname === item.href ? "text-brand-700" : "text-navy-800",
        )}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-sand-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-navy-800"
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown className={cn("h-4 w-4 text-navy-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="pb-2">
          <li>
            <Link href={item.href} className="block rounded-lg px-6 py-2 text-sm font-medium text-brand-700">
              View all
            </Link>
          </li>
          {groups.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className={cn(
                  "block rounded-lg px-6 py-2 text-sm",
                  pathname === child.href ? "text-brand-700" : "text-navy-600",
                )}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
