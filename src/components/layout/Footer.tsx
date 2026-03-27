import Link from "next/link";
import { navLinks, socialLinks } from "@/data/navigation";

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        {/* Top: Logo + Nav */}
        <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between md:items-start">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link href="/">
              <span className="font-serif text-2xl tracking-[0.15em] text-cream">
                Fork & Flower
              </span>
              <span className="block text-[9px] tracking-[0.35em] uppercase text-cream/50 font-sans">
                Designs
              </span>
            </Link>
            <p className="mt-4 font-sans text-xs tracking-wider text-cream/40 max-w-xs">
              Floral-forward event styling for intimate at-home gatherings.
              A traveling service — no storefront.
            </p>
            <p className="mt-2 font-sans text-[10px] tracking-wider text-cream/30">
              events@forkandflowerdesigns.com
            </p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/60 hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-cream/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-cream/30">
            &copy; {new Date().getFullYear()} Fork & Flower Designs. All rights
            reserved.
          </p>

          {/* Social */}
          <a
            href={socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/40 hover:text-gold transition-colors duration-300"
            aria-label="Follow us on Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
