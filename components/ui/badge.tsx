import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
        secondary:
          "border-transparent bg-zinc-100 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700/50",
        outline: "text-zinc-950 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800/80",
        destructive:
          "border-transparent bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
        success:
          "border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
