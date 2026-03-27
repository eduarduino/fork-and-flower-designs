"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function ForkSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left prong */}
      <path
        d="M6 2 L6 24 Q6 30 12 32"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Center prong */}
      <path
        d="M12 2 L12 30"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Right prong */}
      <path
        d="M18 2 L18 24 Q18 30 12 32"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Handle */}
      <path
        d="M12 32 L12 78"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Handle base */}
      <ellipse cx="12" cy="78" rx="2.5" ry="1.5" fill="currentColor" />
    </svg>
  );
}

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  forkAnimation?: boolean;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  onClick,
  forkAnimation = true,
}: ButtonProps) {
  const [isStabbing, setIsStabbing] = useState(false);

  const handleClick = useCallback(
    (e?: React.MouseEvent) => {
      if (isStabbing || disabled) return;
      setIsStabbing(true);
      if (href && e) e.preventDefault();

      setTimeout(() => {
        setIsStabbing(false);
        if (onClick) onClick();
        if (href) window.location.href = href;
      }, 600);
    },
    [isStabbing, disabled, onClick, href]
  );

  const baseStyles =
    "inline-flex items-center justify-center font-sans tracking-[0.15em] uppercase transition-all duration-300 ease-out";

  const variants = {
    primary:
      "bg-charcoal text-cream hover:bg-gold hover:text-charcoal border border-charcoal hover:border-gold",
    secondary:
      "bg-gold text-charcoal hover:bg-gold-dark border border-gold hover:border-gold-dark",
    outline:
      "bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-cream",
  };

  const sizes = {
    sm: "px-5 py-2 text-[10px]",
    md: "px-8 py-3 text-[11px]",
    lg: "px-10 py-4 text-xs",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {forkAnimation && (
        <AnimatePresence>
          {isStabbing && (
            <motion.div
              className="absolute inset-0 flex justify-center pointer-events-none z-20"
              initial={{ y: "-100%" }}
              animate={{ y: ["-100%", "5%", "-2%", "2%"] }}
              exit={{ y: "-120%", opacity: 0 }}
              transition={{
                y: {
                  duration: 0.35,
                  times: [0, 0.5, 0.7, 1],
                  ease: "easeOut",
                },
                exit: { duration: 0.25, ease: "easeIn" },
              }}
            >
              <ForkSVG className="h-full w-5 text-gold drop-shadow-sm" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <motion.span
        className="relative z-10"
        animate={
          isStabbing
            ? {
                y: [0, 2, -1, 1, 0],
                transition: { duration: 0.3, delay: 0.2 },
              }
            : {}
        }
      >
        {children}
      </motion.span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`relative overflow-hidden ${classes}`}
        onClick={(e) => {
          if (forkAnimation) handleClick(e);
        }}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={`relative overflow-hidden ${classes}`}
      disabled={disabled}
      onClick={() => handleClick()}
    >
      {content}
    </button>
  );
}
