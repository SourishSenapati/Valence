import { cn } from "@/lib/utils";
import React from "react";

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue/50 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-white/10",
              error && "border-accent-red/50 focus:ring-accent-red/30",
              className
            )}
            ref={ref}
            {...props}
          />
          <div className="absolute inset-0 rounded-2xl bg-accent-blue/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
        </div>
        {error && <p className="text-[10px] font-bold text-accent-red ml-1 uppercase">{error}</p>}
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";

export interface GlassSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const GlassSelect = React.forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <select
            className={cn(
              "flex h-12 w-full appearance-none rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue/50 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 group-hover:border-white/10",
              error && "border-accent-red/50 focus:ring-accent-red/30",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className="text-[10px] font-bold text-accent-red ml-1 uppercase">{error}</p>}
      </div>
    );
  }
);
GlassSelect.displayName = "GlassSelect";
