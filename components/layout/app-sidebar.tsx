"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Brain,
  Database,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Mic,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const items = (isAdmin: boolean) =>
  [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dsa", label: "DSA Tracker", icon: BookOpen },
    { href: "/sql", label: "SQL Practice", icon: Database },
    { href: "/resume", label: "Resume AI", icon: FileText },
    { href: "/mock-interview", label: "Mock Interviews", icon: Mic },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/recommendations", label: "Smart picks", icon: Sparkles },
    { href: "/contest", label: "Contest mode", icon: Zap },
    { href: "/chat", label: "AI Coach", icon: MessageSquare },
    { href: "/settings", label: "Settings", icon: Settings },
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin", icon: Shield }]
      : []),
  ] as const;

export function AppSidebar({ role }: { role: "student" | "admin" }) {
  const pathname = usePathname();
  const isAdmin = role === "admin";

  return (
    <div className="hidden lg:block shrink-0 p-4 w-72">
      <aside className="relative flex flex-col h-[calc(100vh-2rem)] w-full rounded-2xl border border-zinc-200/50 bg-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-zinc-800/50 dark:bg-zinc-950/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden">
        
        {/* Logo Area */}
        <div className="flex h-16 items-center gap-3 px-6 shrink-0 border-b border-zinc-200/50 dark:border-zinc-800/50 relative z-10">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-emerald-500 text-white shadow-lg shadow-violet-500/20 group">
            <div className="absolute inset-0 rounded-xl bg-white/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400">
              Placement AI
            </p>
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">
              Preparation portal
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto z-10 custom-scrollbar">
          {items(isAdmin).map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all group"
              >
                {active && (
                  <motion.div
                    layoutId="active-sidebar-tab"
                    className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-emerald-500/5 dark:from-violet-500/20 dark:to-emerald-500/10 rounded-xl border border-violet-500/10 dark:border-violet-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon 
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-all duration-300 relative z-10",
                    active 
                      ? "text-violet-600 dark:text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]" 
                      : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                  )} 
                />
                
                <span className={cn(
                  "relative z-10 transition-colors duration-300",
                  active 
                    ? "text-violet-900 dark:text-violet-200 font-semibold" 
                    : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200"
                )}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Card */}
        <div className="shrink-0 p-4 z-10">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-900 dark:to-zinc-900/50 p-4 border border-zinc-200/50 dark:border-zinc-800/50">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
            <p className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
              <Users className="h-4 w-4 text-violet-500" /> Campus Ready
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">
              Built for top-tier screening and DSA rounds — stay consistent.
            </p>
          </div>
        </div>

      </aside>
    </div>
  );
}
