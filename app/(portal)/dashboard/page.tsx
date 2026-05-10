import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth/profile";
import { getDashboardStats } from "@/lib/dashboard/getDashboardStats";
import { getRecentActivity } from "@/lib/dashboard/getRecentActivity";
import { getRecommendations } from "@/lib/dashboard/getRecommendations";
import { getActivityHeatmap } from "@/lib/dashboard/getActivityHeatmap";
import { DashboardClient } from "./DashboardClient";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default async function DashboardPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  // Parallel fetching of all dashboard data
  const [stats, activities, recommendations, heatmapData] = await Promise.all([
    getDashboardStats(profile.id),
    getRecentActivity(profile.id),
    getRecommendations(profile.id),
    getActivityHeatmap(profile.id)
  ]);

  const firstName = profile.full_name?.split(" ")[0] || "Engineer";

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient
        userId={profile.id}
        firstName={firstName}
        stats={stats}
        activities={activities}
        recommendation={recommendations}
        heatmapData={heatmapData}
      />
    </Suspense>
  );
}