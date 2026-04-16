import type { ComponentType } from "react";
import Link from "next/link";
import { CheckCircle2, FileSpreadsheet, Gauge, ClipboardList, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";

type ProcessStage = "intake" | "monitoring" | "exceptions" | "reports";

const processStages: Array<{
  id: ProcessStage;
  label: string;
  note: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    id: "intake",
    label: "Data Intake",
    note: "Batch diterima, divalidasi, dan dipublish",
    href: "/dashboard/upload",
    icon: FileSpreadsheet,
  },
  {
    id: "monitoring",
    label: "Monitoring",
    note: "Sell-in, sell-out, stok, dan payment dipantau",
    href: "/dashboard/monitoring",
    icon: Gauge,
  },
  {
    id: "exceptions",
    label: "Exception Control",
    note: "Koreksi exception dan dampak operasional dicatat",
    href: "/dashboard/retur",
    icon: ReceiptText,
  },
  {
    id: "reports",
    label: "Reports",
    note: "Output eksekutif dan audit trail difinalkan",
    href: "/dashboard/laporan",
    icon: ClipboardList,
  },
];

export function ProcessFlowBar({
  current,
  title = "Operational Cycle",
  description = "Siklus operasional utama yang menghubungkan intake data, monitoring, exception handling, dan pelaporan.",
}: {
  current?: ProcessStage;
  title?: string;
  description?: string;
}) {
  return (
    <section className="rounded-[1.6rem] border border-border/30 bg-white/90 p-4 shadow-soft">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 xl:grid-cols-4">
        {processStages.map((stage, index) => {
          const Icon = stage.icon;
          const active = current === stage.id;
          const completed = current ? processStages.findIndex((item) => item.id === current) > index : false;

          return (
            <Link
              key={stage.id}
              href={stage.href}
              className={cn(
                "rounded-[1.3rem] border p-4 transition-all duration-200",
                active
                  ? "border-primary/45 bg-primary/12"
                  : completed
                    ? "border-emerald-200/80 bg-emerald-50/80"
                    : "border-border/25 bg-accent/15 hover:bg-accent/25"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className={cn("flex size-10 items-center justify-center rounded-2xl", active ? "bg-primary/20 text-foreground" : completed ? "bg-emerald-100 text-emerald-700" : "bg-white text-muted-foreground")}>
                  <Icon className="h-4 w-4" />
                </div>
                {completed ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : null}
              </div>
              <h3 className="mt-4 text-base font-medium tracking-tight text-foreground">{stage.label}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{stage.note}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
