"use client";

import { useMagneticHover } from "@/lib/hooks/useMagneticHover";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "gold" | "ghost";
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  href,
  variant = "gold",
  className = "",
  onClick,
}: MagneticButtonProps) {
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticHover({
    strength: 0.25,
  });

  const baseClass = variant === "gold" ? "btn-gold" : "btn-ghost";
  const combined = `${baseClass} ${className}`;

  const Tag = href ? "a" : "button";

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Tag
        ref={ref as React.Ref<HTMLAnchorElement & HTMLButtonElement>}
        href={href}
        onClick={onClick}
        className={combined}
      >
        {children}
      </Tag>
    </div>
  );
}
