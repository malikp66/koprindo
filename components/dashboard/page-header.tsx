import { Badge } from "@/components/ui/badge";

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  actions
}: {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="pt-1">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          {(eyebrow || meta) && (
            <div className="flex flex-wrap items-center gap-2">
              {eyebrow ? <Badge variant="neutral" className="backdrop-blur-sm">{eyebrow}</Badge> : null}
              {meta}
            </div>
          )}
          <h1 className="mt-3 text-[1.85rem] leading-tight text-balance text-foreground sm:text-[2.15rem] xl:text-[2.35rem]">{title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-3 xl:justify-end">{actions}</div> : null}
      </div>
    </div>
  );
}
