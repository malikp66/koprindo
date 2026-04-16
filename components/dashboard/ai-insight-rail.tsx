import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type InsightTone = "ai" | "success" | "warning" | "danger" | "info";

export function AiInsightRail({
  title,
  description,
  insights,
}: {
  title: string;
  description: string;
  insights: Array<{
    id: string;
    title: string;
    detail: string;
    confidence: string;
    action: string;
    tone?: InsightTone;
  }>;
}) {
  return (
    <Card className="surface-noise">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg tracking-tight">{title}</CardTitle>
        <CardDescription className="max-w-3xl">{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 xl:grid-cols-3">
        {insights.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border/25 bg-white/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-foreground">{item.title}</div>
              <div className="text-xs font-medium text-muted-foreground">{item.confidence}</div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-foreground">
              <ArrowRight className="h-3.5 w-3.5 text-sky-600" />
              {item.action}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
