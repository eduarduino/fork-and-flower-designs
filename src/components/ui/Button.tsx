import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
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
}: ButtonProps) {
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

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
