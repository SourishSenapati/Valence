"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Target, 
  CheckCircle2, 
  BarChart3, 
  LogOut,
  ShieldCheck
} from "lucide-react";
import { signOut } from "next-auth/react";

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "My Goals",
      icon: Target,
      href: "/dashboard/goals/new",
      active: pathname === "/dashboard/goals/new",
    },
    {
      label: "Check-ins",
      icon: CheckCircle2,
      href: "/dashboard/check-ins",
      active: pathname === "/dashboard/check-ins",
    },
  ];

  if (["SHIFT_MANAGER", "PLANT_HEAD", "HR_ADMIN"].includes(user.role)) {
    routes.push({
      label: "Approvals",
      icon: ShieldCheck,
      href: "/dashboard/manager/approvals",
      active: pathname === "/dashboard/manager/approvals",
    });
  }

  if (user.role === "HR_ADMIN") {
    routes.push({
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/admin/analytics",
      active: pathname === "/dashboard/admin/analytics",
    });
  }

  return (
    <div className="w-72 border-r border-white/5 bg-industrial-900/50 backdrop-blur-3xl flex flex-col sticky top-0 h-screen overflow-hidden">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-indigo-500/20">
            V
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Valence</span>
        </div>

        <nav className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group",
                route.active 
                  ? "bg-white/10 text-white border border-white/10 shadow-lg" 
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              )}
            >
              <route.icon className={cn("w-5 h-5", route.active ? "text-accent-blue" : "text-gray-500 group-hover:text-white")} />
              <span className="font-semibold text-sm">{route.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-white/5 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 flex items-center justify-center text-xs font-bold">
            {user.name?.[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate text-white">{user.name}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black truncate">{user.role}</p>
          </div>
        </div>
        
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-accent-red hover:bg-accent-red/5 rounded-2xl transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
