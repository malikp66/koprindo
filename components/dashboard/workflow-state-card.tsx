"use client";

import * as React from "react";
import { CheckCircle2, CircleDot, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type WorkflowStep = {
  id: string;
  title: string;
  status: "done" | "active" | "pending";
  note: string;
};

function stepTone(status: WorkflowStep["status"]) {
  if (status === "done") return "success";
  if (status === "active") return "warning";
  return "neutral";
}

function StepIcon({ status }: { status: WorkflowStep["status"] }) {
  if (status === "done") return <CheckCircle2 className="h-4 w-4" />;
  if (status === "active") return <CircleDot className="h-4 w-4" />;
  return <Clock3 className="h-4 w-4" />;
}

export function WorkflowStateCard({
  title,
  description,
  steps,
}: {
  title: string;
  description: string;
  steps: readonly WorkflowStep[];
}) {
  const [activeStepId, setActiveStepId] = React.useState(
    steps.find((step) => step.status === "active")?.id ?? steps[0]?.id
  );
  const activeStep = steps.find((step) => step.id === activeStepId) ?? steps[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {steps.map((step, index) => (
            <Button
              key={step.id}
              type="button"
              variant="outline"
              className={cn(
                "h-auto justify-between rounded-2xl px-4 py-3 text-left",
                activeStepId === step.id ? "border-primary/30 bg-primary/8" : ""
              )}
              onClick={() => setActiveStepId(step.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-xl bg-accent text-foreground">
                  <StepIcon status={step.status} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Step {index + 1}</div>
                  <div className="mt-0.5 text-sm font-medium text-foreground">{step.title}</div>
                </div>
              </div>
              <Badge variant={stepTone(step.status)}>{step.status}</Badge>
            </Button>
          ))}
        </div>

        <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
          <div className="text-xs font-medium text-muted-foreground">Current state</div>
          <div className="mt-2 text-base font-medium tracking-tight text-foreground">{activeStep.title}</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activeStep.note}</p>
        </div>
      </CardContent>
    </Card>
  );
}
