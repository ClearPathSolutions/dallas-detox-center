"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Phone, ShieldCheck, X, Clock } from "lucide-react";
import { nav, site, type NavItem } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

/**
 * Primary navigation.
 *
 * Two things this deliberately does NOT do, because the previous version did
 * and both were bugs:
 *
 *  1. It does not mount submenu links conditionally. They are always in the
 *     server HTML and hidden with CSS, so the 14 city pages and the team bios
 *     are crawlable and internally linked. Rendering them only on hover left
 *     all 25 with zero inbound links.
 *  2. It does not open on hover alone. Each submenu is toggled by a real
 *     <button> with aria-expanded/aria-haspopup, opens on hover OR focus OR
 *     click, and closes on Escape — so the ~40 submenu destinations are
 *     reachable without a mouse.
 */
export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Escape closes whatever is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Menus close on navigation via the links' own handlers rather than a
  // pathname effect, which would set state during render-commit.
  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-navy-900 text-navy-100 md:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <span className="inline-flex items-center gap-2 tracking-wide">
            <Clock className="h-3.5 w-3.5 text-brand-400" aria-hidden />
            24/7 Confidential Admissions
          </span>
          <div className="flex items-center gap-6">
            <span className="text-navy-300">{site.address.full}</span>
            <a
              href={site.phone.href}
              className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-brand-300"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden />
              {site.phone.display}
            </a>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <div className="border-b border-sand-200 bg-white shadow-sm">
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
                onToggle={() =>
                  setOpenMenu((cur) => (cur === item.label ? null : item.label))
                }
                onOpen={() => setOpenMenu(item.label)}
                onClose={() =>
                  setOpenMenu((cur) => (cur === item.label ? null : cur))
                }
                onNavigate={closeAll}
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
              <Phone className="h-4 w-4 text-brand-600" aria-hidden />
              {site.phone.display}
            </a>
            <Link
              href="/verify-insurance"
              className="inline-flex items-center gap-2 rounded-full bg-accent-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-accent-800 hover:shadow-md"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Verify Insurance
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 xl:hidden">
            <a
              href={site.phone.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-accent-700 px-3.5 py-2 text-sm font-semibold text-white"
              aria-label={`Call ${site.phone.display}`}
            >
              <Phone className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Call</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-navy-800 hover:bg-sand-100"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </Container>
      </div>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={closeAll}
        pathname={pathname}
      />
    </header>
  );
}

function DesktopNavItem({
  item,
  open,
  onToggle,
  onOpen,
  onClose,
  onNavigate,
  pathname,
}: {
  item: NavItem;
  open: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onClose: () => void;
  onNavigate: () => void;
  pathname: string;
}) {
  const hasMenu = !!(item.children || item.columns);
  const active =
    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
  const panelId = `nav-${item.label.replace(/\s+/g, "-").toLowerCase()}`;

  if (!hasMenu) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
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
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
      }}
    >
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "whitespace-nowrap rounded-full pl-3.5 pr-1 py-2 text-sm font-semibold transition-colors",
            active || open ? "text-brand-700" : "text-navy-700 hover:text-brand-700",
          )}
        >
          {item.label}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          aria-haspopup="true"
          aria-label={`${item.label} submenu`}
          className={cn(
            "mr-1.5 rounded-full p-1.5 transition-colors",
            active || open ? "text-brand-700" : "text-navy-700 hover:text-brand-700",
          )}
        >
          <ChevronDown
            className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>

      {/*
        Always rendered so the links are in the HTML for crawlers; visibility is
        CSS-only. `invisible` keeps it out of the tab order without removing it
        from the document.
      */}
      <div
        id={panelId}
        className={cn(
          "absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-opacity duration-150",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="rounded-2xl border border-sand-200 bg-white p-2 shadow-xl shadow-navy-900/10">
          {item.columns ? (
            <div className="flex gap-2">
              {item.columns.map((col) => (
                <div key={col.heading} className="min-w-[13rem] p-2">
                  <p className="eyebrow px-3 pb-2 text-navy-500">{col.heading}</p>
                  <ul>
                    {col.items.map((child) => (
                      <MenuLink
                        key={child.href}
                        item={child}
                        pathname={pathname}
                        onNavigate={onNavigate}
                        tabbable={open}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="min-w-[15rem] p-1">
              {item.children!.map((child) => (
                <MenuLink
                  key={child.href}
                  item={child}
                  pathname={pathname}
                  onNavigate={onNavigate}
                  tabbable={open}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuLink({
  item,
  pathname,
  onNavigate,
  tabbable,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
  tabbable: boolean;
}) {
  const active = pathname === item.href;
  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        tabIndex={tabbable ? undefined : -1}
        className={cn(
          "block rounded-xl px-3 py-2 text-sm transition-colors",
          active
            ? "bg-brand-50 text-brand-700"
            : "text-navy-700 hover:bg-sand-100 hover:text-brand-700",
        )}
      >
        {item.label}
      </Link>
    </li>
  );
}

function MobileDrawer({
  open,
  onClose,
  onNavigate,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: () => void;
  pathname: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Move focus into the dialog and keep Tab inside it while it is open.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener("keydown", onKey);
    return () => panel.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-white shadow-2xl"
      >
        <div className="flex h-20 items-center justify-between border-b border-sand-200 px-5">
          <Image
            src="/images/logo.png"
            alt={site.name}
            width={550}
            height={200}
            className="h-9 w-auto"
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-navy-800 hover:bg-sand-100"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" aria-hidden />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobile">
          {nav.map((item) => (
            <MobileNavItem
              key={item.label}
              item={item}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </nav>

        <div className="space-y-2 border-t border-sand-200 p-4">
          <Link
            href="/verify-insurance"
            onClick={onNavigate}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-700 px-5 py-3.5 text-sm font-semibold text-white"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden /> Verify Insurance
          </Link>
          <a
            href={site.phone.href}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-5 py-3.5 text-sm font-semibold text-white"
          >
            <Phone className="h-4 w-4" aria-hidden /> Call {site.phone.display}
          </a>
        </div>
      </div>
    </div>
  );
}

function MobileNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const groups = item.columns
    ? item.columns.flatMap((c) => c.items)
    : item.children ?? null;

  if (!groups) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "block rounded-xl px-3 py-3 text-base font-semibold",
          pathname === item.href ? "text-brand-700" : "text-navy-800",
        )}
      >
        {item.label}
      </Link>
    );
  }

  const panelId = `m-${item.label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="border-b border-sand-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-navy-800"
      >
        {item.label}
        <ChevronDown
          className={cn("h-4 w-4 text-navy-500 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>
      {open && (
        <ul id={panelId} className="pb-2">
          <li>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block rounded-lg px-6 py-2 text-sm font-medium text-brand-700"
            >
              View all
            </Link>
          </li>
          {groups.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
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
