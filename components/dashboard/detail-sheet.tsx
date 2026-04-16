"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function DetailSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "left-auto right-0 top-0 flex h-screen w-[min(96vw,560px)] translate-x-0 translate-y-0 flex-col rounded-none rounded-l-3xl border-l border-border/30 p-0",
          className
        )}
      >
        <DialogHeader className="border-b border-border/25 px-6 py-5">
          <DialogTitle className="text-lg tracking-tight">{title}</DialogTitle>
          {description ? <DialogDescription className="text-sm">{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
