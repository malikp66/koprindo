import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-primary/15", className)}>
      <div className="h-full rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: `${value}%` }} />
    </div>
  );
}
