"use client";

import { ActivityCalendar, ThemeInput } from "react-activity-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { Activity } from "lucide-react";

interface ActivityHeatmapProps {
  data: { date: string; count: number; level: number }[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const explicitTheme: ThemeInput = {
    light: ['#f4f4f5', '#d1fae5', '#6ee7b7', '#10b981', '#047857'],
    dark: ['#18181b', '#064e3b', '#047857', '#10b981', '#34d399'],
  };

  return (
    <Card className="col-span-1 lg:col-span-3 border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          Contribution Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[700px] pt-4">
          <ActivityCalendar 
            data={data.length > 0 ? data : [{ date: new Date().toISOString().split('T')[0], count: 0, level: 0 }]}
            theme={explicitTheme}
            colorScheme={isDark ? "dark" : "light"}
            blockSize={12}
            blockRadius={4}
            blockMargin={4}
            fontSize={12}
            hideTotalCount
          />
        </div>
      </CardContent>
    </Card>
  );
}
