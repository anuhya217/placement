"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Database, Target, Zap, Activity } from "lucide-react";
import type { ActivityItem } from "@/types/dashboard";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

import React from "react";

export const ActivityFeed = React.memo(function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5 text-violet-500" />
          Recent Activity
        </h2>
      </div>
      
      <Card>
        <div className="divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
          {activities.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
              <Zap className="h-8 w-8 mx-auto mb-3 opacity-20" />
              <p>No recent activity. Start solving problems to see your progress here!</p>
            </div>
          ) : (
            activities.map((activity, i) => (
              <div key={activity.id || i} className="p-4 sm:p-6 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === 'SOLVED_DSA' ? 'bg-emerald-500/10 text-emerald-500' : 
                    activity.type === 'SOLVED_SQL' ? 'bg-blue-500/10 text-blue-500' :
                    activity.type === 'COMPLETED_WEEK' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-violet-500/10 text-violet-500'
                  }`}>
                    {activity.type === 'SOLVED_DSA' && <BookOpen className="h-4 w-4" />}
                    {activity.type === 'SOLVED_SQL' && <Database className="h-4 w-4" />}
                    {activity.type === 'COMPLETED_WEEK' && <Target className="h-4 w-4" />}
                    {activity.type === 'BOOKMARKED' && <Zap className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{activity.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="hidden sm:inline-flex">+{activity.points} XP</Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
});
