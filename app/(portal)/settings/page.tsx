import { getProfile } from "@/lib/auth/profile";
import { LeetcodeSettingsForm } from "@/components/settings/leetcode-settings-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
  const profile = await getProfile();
  if (!profile) return null;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Connect external tooling to your workspace. Accounts always use Supabase —
          third-party OAuth (e.g. “Sign in with LeetCode”) is not publicly available from
          LeetCode for custom apps.
        </p>
      </div>

      <Card className="border-zinc-200/80 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>LeetCode username</CardTitle>
          <CardDescription>
            We deep-link your public profile (<code className="text-xs">leetcode.com/u/…</code>
            ). Practice problems open on LeetCode in a separate tab when you tap{" "}
            <strong>Open on LeetCode</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeetcodeSettingsForm initial={profile.leetcode_username ?? ""} />
        </CardContent>
      </Card>
    </div>
  );
}
