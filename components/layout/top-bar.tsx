"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-[18px] w-[18px] dark:hidden text-zinc-600" />
      <Moon className="hidden h-[18px] w-[18px] dark:inline text-zinc-400" />
    </Button>
  );
}

const mobileLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dsa", label: "DSA Tracker" },
  { href: "/sql", label: "SQL Practice" },
  { href: "/resume", label: "Resume AI" },
  { href: "/mock-interview", label: "Mock Interviews" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/chat", label: "AI Coach" },
  { href: "/settings", label: "Settings" },
];

export function TopBar({ profile }: { profile: Profile }) {
  const router = useRouter();
  const initials =
    profile.full_name?.slice(0, 2).toUpperCase() ??
    profile.email?.slice(0, 2).toUpperCase() ??
    "YO";

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white/40 px-4 backdrop-blur-2xl dark:bg-zinc-950/40 lg:px-12 border-b border-zinc-200/50 dark:border-zinc-800/50 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-3 lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Open menu" className="rounded-xl border-zinc-200 dark:border-zinc-800 bg-transparent">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-xl border-zinc-200 dark:border-zinc-800 backdrop-blur-xl bg-white/90 dark:bg-zinc-950/90">
            <DropdownMenuLabel className="font-semibold text-zinc-900 dark:text-zinc-100">Navigate</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            {mobileLinks.map((l) => (
              <DropdownMenuItem key={l.href} asChild className="rounded-lg focus:bg-violet-50 dark:focus:bg-violet-500/10 focus:text-violet-600 dark:focus:text-violet-400">
                <Link href={l.href} className="font-medium">{l.label}</Link>
              </DropdownMenuItem>
            ))}
            {profile.role === "admin" && (
              <DropdownMenuItem asChild className="rounded-lg focus:bg-violet-50 dark:focus:bg-violet-500/10">
                <Link href="/admin" className="font-medium">Admin</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-emerald-500 text-white shadow-lg">
          <span className="font-bold text-xs tracking-tighter">PAI</span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="group flex items-center gap-3 rounded-full outline-none transition-all hover:opacity-80 focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-md group-hover:bg-violet-500/40 transition-colors" />
                <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 relative z-10">
                  <AvatarFallback className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-zinc-200 dark:border-zinc-800 backdrop-blur-xl bg-white/90 dark:bg-zinc-950/90 mt-2 p-2">
            <DropdownMenuLabel className="font-semibold truncate">
              {profile.full_name ?? "Student Account"}
              <p className="text-xs font-normal text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{profile.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            <DropdownMenuItem asChild className="rounded-lg focus:bg-zinc-100 dark:focus:bg-zinc-800 cursor-pointer">
              <Link href="/dashboard" className="font-medium">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg focus:bg-zinc-100 dark:focus:bg-zinc-800 cursor-pointer">
              <Link href="/settings" className="font-medium">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
            <DropdownMenuItem onClick={() => logout()} className="rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-500/10 dark:focus:text-red-300 cursor-pointer font-medium">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
