import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        success: "border border-emerald-500/20 bg-emerald-500/14 text-emerald-300",
        warning: "border border-amber-500/20 bg-amber-500/14 text-amber-300",
        danger: "border border-rose-500/20 bg-rose-500/14 text-rose-300",
        info: "border border-sky-500/20 bg-sky-500/14 text-sky-300",
        ai: "border border-primary/25 bg-primary/12 text-orange-200 shadow-sm",
        neutral: "border border-border/70 bg-card/85 text-muted-foreground shadow-sm",
        outline: "border-border/70 bg-card/70 text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
