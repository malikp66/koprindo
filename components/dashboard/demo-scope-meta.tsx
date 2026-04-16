"use client";

import { Badge } from "@/components/ui/badge";
import { useDemoConsole } from "@/components/dashboard/demo-console-provider";

export function DemoScopeMeta() {
  const { roleLabel, periodLabel, channelLabel } = useDemoConsole();

  return (
    <>
      <Badge variant="outline">{roleLabel}</Badge>
      <Badge variant="outline">{periodLabel}</Badge>
      <Badge variant="outline">{channelLabel}</Badge>
    </>
  );
}
