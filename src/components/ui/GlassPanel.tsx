"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlassPanel({ 
  children, 
  className, 
  delay = 0,
  ...props 
}: GlassPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.23, 1, 0.32, 1] 
      }}
      className={cn("glass-panel overflow-hidden", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
