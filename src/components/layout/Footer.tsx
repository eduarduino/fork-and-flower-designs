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
              Curated event styling for elevated, intimate moments in the comfort
              of your home.
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
            className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/40 hover:text-gold transition-colors duration-300"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
