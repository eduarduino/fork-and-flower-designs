"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForkStab } from "@/hooks/useForkStab";

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

const STAB_DELAY_MS = 650;

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
  const { onClick: onStabClick } = useForkStab();
  const router = useRouter();

  const handleLinkClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || !href) return;
      if (forkAnimation) {
        e.preventDefault();
        onStabClick(e);
        setTimeout(() => router.push(href), STAB_DELAY_MS);
      }
      if (onClick) onClick();
    },
    [disabled, href, forkAnimation, onClick, onStabClick, router],
  );

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      if (forkAnimation) onStabClick(e);
      if (onClick) onClick();
    },
    [disabled, forkAnimation, onClick, onStabClick],
  );

  const baseStyles =
    "inline-flex min-h-[44px] touch-manipulation items-center justify-center font-sans tracking-[0.15em] uppercase transition-all duration-300 ease-out";

  const variants = {
    primary:
      "bg-charcoal text-cream hover:bg-gold hover:text-charcoal border border-charcoal hover:border-gold",
    secondary:
      "bg-gold text-charcoal hover:bg-gold-dark border border-gold hover:border-gold-dark",
    outline:
      "bg-transparent text-charcoal border border-charcoal hover:bg-gold hover:text-charcoal hover:border-gold",
  };

  const sizes = {
    sm: "px-5 py-2 text-[10px]",
    md: "px-8 py-3 text-[11px]",
    lg: "px-10 py-4 text-xs",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <motion.span
      className="relative z-10"
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`relative overflow-hidden ${classes}`}
        onClick={handleLinkClick}
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
      onClick={handleButtonClick}
    >
      {content}
    </button>
  );
}
