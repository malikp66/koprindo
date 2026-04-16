import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        success: "border-transparent bg-emerald-100/70 text-emerald-700",
        warning: "border-transparent bg-amber-100/70 text-amber-700",
        danger: "border-transparent bg-rose-100/70 text-rose-700",
        info: "border border-sky-200/70 bg-sky-100/75 text-sky-800",
        ai: "border border-sky-200/80 bg-sky-50/90 text-sky-900 shadow-sm",
        neutral: "border border-sky-200/70 bg-white/85 text-slate-700 shadow-sm",
        outline: "border-border/70 bg-white/70 text-foreground"
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
