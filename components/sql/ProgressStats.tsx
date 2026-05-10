import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Target, Sparkles } from "lucide-react";

interface ProgressStatsProps {
  total: number;
  completed: number;
}

export function ProgressStats({ total, completed }: ProgressStatsProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-900">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Target className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-zinc-500 dark:text-zinc-400">
              Total Questions
            </p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-900">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-zinc-500 dark:text-zinc-400">
              Completed
            </p>
            <p className="text-2xl font-bold">{completed}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-1 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-900">
        <CardContent className="flex flex-col justify-center h-full p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Progress</span>
            </div>
            <span className="text-sm font-bold">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
