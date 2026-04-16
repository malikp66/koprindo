"use client";

import { BrainCircuit, Database, GitBranch, ShieldCheck } from "lucide-react";
import { DetailSheet } from "@/components/dashboard/detail-sheet";
import { Badge } from "@/components/ui/badge";

export function SignalExplainSheet({
  open,
  onOpenChange,
  title,
  summary,
  confidence,
  status,
  reasoning,
  sources,
  decisionRule,
  recommendedAction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  summary: string;
  confidence: string;
  status: string;
  reasoning: string[];
  sources: string[];
  decisionRule: string;
  recommendedAction: string;
}) {
  return (
    <DetailSheet
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="Transparansi indikator untuk menelusuri penalaran AI, sumber data, dan aturan keputusan yang dipakai."
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Ringkasan indikator</div>
              <div className="mt-2 text-base font-medium leading-relaxed text-foreground">{summary}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="ai" className="gap-1.5">
                <BrainCircuit className="h-3.5 w-3.5" />
                {confidence}
              </Badge>
              <Badge variant="outline">{status}</Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/25 bg-white/75 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <GitBranch className="h-4 w-4 text-sky-600" />
            Jalur penalaran
          </div>
          <div className="mt-3 grid gap-2">
            {reasoning.map((item) => (
              <div key={item} className="rounded-xl border border-border/20 bg-accent/20 p-3 text-sm leading-relaxed text-muted-foreground">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/25 bg-white/75 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Database className="h-4 w-4 text-sky-600" />
            Sumber data
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {sources.map((item) => (
              <Badge key={item} variant="neutral">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/25 bg-white/75 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            Kendali keputusan
          </div>
          <div className="mt-3 grid gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Aturan yang dipakai</div>
              <div className="mt-1.5 text-sm leading-relaxed text-foreground">{decisionRule}</div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Tindakan yang disarankan</div>
              <div className="mt-1.5 text-sm leading-relaxed text-foreground">{recommendedAction}</div>
            </div>
          </div>
        </div>
      </div>
    </DetailSheet>
  );
}
