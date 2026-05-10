"use client";

import { motion } from "framer-motion";
import { BookOpen, Database, Flame, Target, Trophy, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { UpNextCard } from "@/components/dashboard/UpNextCard";
import dynamic from "next/dynamic";

const ActivityHeatmap = dynamic(
  () => import("@/components/dashboard/ActivityHeatmap").then((mod) => mod.ActivityHeatmap),
  { ssr: false, loading: () => <div className="h-[200px] w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" /> }
);
import { useRealtimeProgress } from "@/hooks/dashboard/useRealtimeProgress";
import type { DashboardStats, ActivityItem, Recommendation } from "@/types/dashboard";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

interface DashboardClientProps {
  userId: string;
  firstName: string;
  stats: DashboardStats;
  activities: ActivityItem[];
  heatmapData: any[];
  recommendation: Recommendation | null;
}

export function DashboardClient({ 
  userId, 
  firstName, 
  stats, 
  activities, 
  heatmapData, 
  recommendation 
}: DashboardClientProps) {
  
  // Hook up realtime subscriptions so the server component automatically re-fetches
  useRealtimeProgress(userId);

  return (
    <div className="space-y-8 pb-10">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 p-8 sm:p-12 shadow-2xl"
      >
        {/* Background gradient (optimized without heavy CSS blur filters) */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-emerald-500/10 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm font-medium mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Interview Season Ready
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">{firstName}.</span>
          </h1>
          <p className="text-lg text-zinc-400 mb-8 max-w-xl leading-relaxed">
            You're on a {stats.currentStreak}-day streak. Keep pushing through the DSA roadmap and tackle the next challenge to stay sharp.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="gradient" size="lg" className="rounded-full font-semibold gap-2" asChild>
              <Link href="/dsa">
                Continue DSA <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white/10 gap-2" asChild>
              <Link href="/sql">
                <Database className="w-4 h-4 text-blue-400" /> Practice SQL
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={item}>
          <Card className="h-full group hover:border-violet-500/50 hover:shadow-lg overflow-hidden relative transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Flame className="h-5 w-5" />
                </div>
                {stats.currentStreak > 0 && (
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10">Active</Badge>
                )}
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.currentStreak} Days</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Current Streak</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full group hover:border-emerald-500/50 hover:shadow-lg overflow-hidden relative transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-zinc-500">
                  {Math.round((stats.dsaSolved / Math.max(1, stats.dsaTotal)) * 100)}%
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.dsaSolved} / {stats.dsaTotal}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">DSA Problems Solved</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full group hover:border-blue-500/50 hover:shadow-lg overflow-hidden relative transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Database className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-zinc-500">
                  {Math.round((stats.sqlSolved / Math.max(1, stats.sqlTotal)) * 100)}%
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.sqlSolved} / {stats.sqlTotal}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">SQL Queries Mastered</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full group hover:border-violet-500/50 hover:shadow-lg overflow-hidden relative transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                  <Trophy className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.xp.toLocaleString()}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Total XP Earned</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Activity Map */}
      <ActivityHeatmap data={heatmapData} />

      {/* Feed & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <ActivityFeed activities={activities} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <UpNextCard recommendation={recommendation} />
        </motion.div>
      </div>
    </div>
  );
}
