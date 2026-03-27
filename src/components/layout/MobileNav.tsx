"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { navLinks, socialLinks } from "@/data/navigation";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-cream"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2"
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-charcoal"
            >
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>

          {/* Nav Links */}
          <div className="flex h-full flex-col items-center justify-center gap-8">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-serif text-2xl tracking-[0.15em] text-charcoal">
                Fork & Flower
              </span>
            </motion.div>

            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-sans text-sm tracking-[0.25em] uppercase text-charcoal hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + navLinks.length * 0.08 }}
              className="mt-4 inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-charcoal hover:text-gold transition-colors duration-300"
              aria-label="Follow us on Instagram"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              <span>Instagram</span>
            </motion.a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
