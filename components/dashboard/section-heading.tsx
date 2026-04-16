import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        {eyebrow ? (
          <div className="text-xs font-medium tracking-[0.02em] text-muted-foreground">{eyebrow}</div>
        ) : null}
        <h2 className="mt-1.5 text-[1.35rem] tracking-tight text-foreground md:text-[1.5rem]">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-[1.01rem] leading-[1.72] text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
