import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toneToBadge } from "@/components/dashboard/tone";
import { anomalyFeed } from "@/lib/mock-data";

export function AnomalyFeedCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly & Action Center</CardTitle>
        <CardDescription>Daftar anomaly prioritas untuk ditindaklanjuti hari ini.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {anomalyFeed.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <Badge variant={toneToBadge(item.tone)}>{item.severity}</Badge>
                <h3 className="text-base font-medium">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                {item.action}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
