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
          <div className="text-xs font-medium text-muted-foreground">{eyebrow}</div>
        ) : null}
        <h2 className="mt-1.5 text-xl tracking-tight text-foreground md:text-[1.4rem]">{title}</h2>
        {description ? <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
