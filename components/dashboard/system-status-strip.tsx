import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toneToBadge } from "@/components/dashboard/tone";
import type { StatusTone } from "@/lib/mock-data";

export function SystemStatusStrip({
  items,
}: {
  items: Array<{
    label: string;
    value: string;
    note: string;
    tone: StatusTone;
  }>;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
                <div className="mt-3 text-base font-medium tracking-tight text-foreground">{item.value}</div>
                <div className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.note}</div>
              </div>
              <Badge variant={toneToBadge(item.tone)}>{item.tone}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
