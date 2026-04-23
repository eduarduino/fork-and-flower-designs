"use client";

import Link from "next/link";
import { navLinks } from "@/data/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useForkAnimatedAction } from "@/hooks/useForkAnimatedAction";

function NavItem({ href, label }: { href: string; label: string }) {
  const handlers = useForkAnimatedAction({ mode: "link", href });
  return (
    <Link
      href={href}
      onPointerDown={handlers.onPointerDown}
      onClick={handlers.onClick}
      className="font-sans text-xs tracking-[0.2em] uppercase text-cream/70 hover:text-gold transition-colors duration-300"
    >
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Top: Logo + Nav */}
        <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between md:items-start">
          {/* Brand */}
          <div className="text-center md:text-left">
            <BrandLogo preset="footer" context="onDark" />
            <p className="mt-4 font-sans text-xs tracking-wider text-cream/60 max-w-xs">
              Floral-forward event styling for intimate at-home gatherings.
              A traveling service — no storefront.
            </p>
            <p className="mt-2 font-sans text-xs tracking-wider text-cream/60">
              events@forkandflowerdesigns.com
            </p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <NavItem key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-cream/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="font-sans text-xs tracking-[0.15em] uppercase text-cream/50">
            &copy; {new Date().getFullYear()} Fork & Flower Designs. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
