import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export function StatusBadge({ label, variant = "neutral", className }: StatusBadgeProps) {
  const variants = {
    success: "bg-accent-green/10 text-accent-green border-accent-green/20",
    warning: "bg-accent-orange/10 text-accent-orange border-accent-orange/20",
    error: "bg-accent-red/10 text-accent-red border-accent-red/20",
    info: "bg-accent-blue/10 text-accent-blue border-accent-blue/20",
    neutral: "bg-white/5 text-gray-400 border-white/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border",
        variants[variant],
        className
      )}
    >
      <span className={cn("w-1 h-1 rounded-full mr-1.5 animate-pulse", 
        variant === "success" ? "bg-accent-green" : 
        variant === "warning" ? "bg-accent-orange" : 
        variant === "error" ? "bg-accent-red" : 
        variant === "info" ? "bg-accent-blue" : "bg-gray-400"
      )} />
      {label}
    </span>
  );
}
