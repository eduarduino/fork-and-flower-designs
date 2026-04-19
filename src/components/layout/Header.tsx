"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, socialLinks } from "@/data/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { MobileNav } from "./MobileNav";
import { useForkStab } from "@/hooks/useForkStab";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { onPointerDown, onClick: onStabClick } = useForkStab();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/95 backdrop-blur-sm shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <BrandLogo preset="header" context="onLight" priority />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onPointerDown={onPointerDown}
                onClick={onStabClick}
                className={`font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 hover:text-gold ${
                  pathname === link.href ? "text-gold" : "text-charcoal"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal hover:text-gold transition-colors duration-300"
              aria-label="Follow us on Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="block h-px w-6 bg-charcoal transition-all" />
            <span className="block h-px w-6 bg-charcoal transition-all" />
            <span className="block h-px w-4 bg-charcoal transition-all ml-auto" />
          </button>
        </div>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
