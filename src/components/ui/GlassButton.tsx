"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function GlassButton({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}: GlassButtonProps) {
  const variants = {
    primary: "bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]",
    secondary: "bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20",
    danger: "bg-accent-red/10 text-accent-red border-accent-red/20 hover:bg-accent-red/20",
    ghost: "bg-transparent text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm font-semibold",
    lg: "px-8 py-4 text-base font-bold",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border outline-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || disabled}
      {...(props as Record<string, unknown>)}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
}
