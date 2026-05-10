"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Target } from "lucide-react";
import Link from "next/link";
import type { Recommendation } from "@/types/dashboard";

interface UpNextCardProps {
  recommendation: Recommendation | null;
}

import React from "react";

export const UpNextCard = React.memo(function UpNextCard({ recommendation }: UpNextCardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Zap className="h-5 w-5 text-amber-500" />
        Up Next
      </h2>
      
      {recommendation ? (
        <Card className="bg-gradient-to-br from-violet-500/5 to-emerald-500/5 border-violet-500/20 group">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-3 text-violet-500 border-violet-500/30">
                  {recommendation.topic}
                </Badge>
                <h3 className="font-bold text-lg leading-tight">{recommendation.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                  {recommendation.description}
                </p>
              </div>
              <Button variant="glow" className="w-full justify-between group" asChild>
                <Link href={recommendation.url}>
                  Start Learning
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 bg-transparent">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">All Caught Up!</h3>
              <p className="text-xs text-zinc-500 mt-1">You've finished your current roadmap.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});
