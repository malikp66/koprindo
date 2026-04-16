"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  Download,
  Radar,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { AiInsightRail } from "@/components/dashboard/ai-insight-rail";
import { useDemoConsole } from "@/components/dashboard/demo-console-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { DetailSheet } from "@/components/dashboard/detail-sheet";
import { AnomalyFeedCard } from "@/components/dashboard/feed-card";
import { SelloutChartPanel } from "@/components/dashboard/chart-panel";
import { SignalExplainSheet } from "@/components/dashboard/signal-explain-sheet";
import { toneToBadge } from "@/components/dashboard/tone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  branchDetailMoments,
  branchRanking,
  demoScenario,
  invoiceLedger,
  pksEvaluation,
  riskEventQueue,
} from "@/lib/mock-data";

type BranchRow = (typeof branchRanking)[number];
type RiskEventRow = (typeof riskEventQueue)[number];
type InvoiceRow = (typeof invoiceLedger)[number];
type MonitoringTab = "overview" | "branches" | "payment" | "events" | "pks";

const controlMetrics = [
  { label: "Sell-in Published", value: demoScenario.sellInPublished, note: "96.8% batch lolos quality gate" },
  { label: "Sell-out Confirmed", value: demoScenario.totalSellOutUnits, note: "+11.3% vs bulan lalu" },
  { label: "Variance Sell-in vs Sell-out", value: demoScenario.sellInSellOutVariance, note: "Dalam ambang kontrol nasional" },
  { label: "Aging >45 Hari", value: demoScenario.aging45Plus, note: "7 invoice perlu follow-up" },
  { label: "Stock Risk Outlet", value: demoScenario.riskOutletCount, note: "95 stockout risk, 47 overstock" },
  { label: "Target Nasional", value: demoScenario.targetProgress, note: "4.18 juta dari target 25 juta unit" },
];

const decisionCards = [
  {
    label: "Operational upside",
    detail: "Alfamart tetap menjadi penggerak utama pertumbuhan dan berhasil menjaga coverage Jawa Barat di atas target.",
    icon: TrendingUp,
  },
  {
    label: "Branch pressure",
    detail: "Cabang Cirebon Raya dan Surabaya Timur membutuhkan rebalancing stok dan intervensi outlet aktif.",
    icon: TrendingDown,
  },
  {
    label: "Payment watch",
    detail: "Tiga invoice retail mendekati bucket 46-60 hari dan perlu eskalasi ke finance serta principal.",
    icon: WalletCards,
  },
  {
    label: "Governance",
    detail: "Dashboard eksekutif masih menandai 1 channel sebagai provisional karena batch belum dipublish final.",
    icon: ShieldAlert,
  },
];

const paymentMetrics = [
  { label: "Invoice Open", value: "24", note: "Retail dan principal" },
  { label: "Current DSO", value: demoScenario.dso, note: "Masih di bawah ambang 45 hari" },
  { label: "Aging 46-60 Hari", value: "Rp780 Jt", note: "Perlu reminder terjadwal" },
  { label: "Cash Exposure", value: demoScenario.invoiceExposure, note: "Belum settled penuh" },
];

const paymentEvents = [
  {
    title: "Invoice ALF-SEP-2026-112 mendekati bucket 46-60 hari",
    detail: "Nilai Rp320 juta, due date 19 Apr 2026, status partial payment.",
    tone: "warning" as const,
  },
  {
    title: "Koprindo -> Gunawan Elektro batch Maret masih open",
    detail: "Arus kas masih aman, tetapi exposure perlu dipantau sebelum masuk critical.",
    tone: "info" as const,
  },
  {
    title: "AksesMu belum final publish data payment pendukung",
    detail: "Panel executive tetap ditandai provisional sampai dokumen lengkap diterima.",
    tone: "danger" as const,
  },
];

const monitoringInsights = [
  {
    id: "sellout-lift",
    title: "Sell-out masih sehat di channel modern",
    detail: "Model membaca momentum tertinggi tetap datang dari Alfamart dan mendorong headline pertumbuhan tanpa menambah risiko nasional.",
    confidence: "94%",
    action: "Fokuskan replenishment ke cabang dengan velocity tertinggi.",
    tone: "ai" as const,
  },
  {
    id: "payment-alert",
    title: "Aging payment butuh follow-up sebelum critical",
    detail: "Tiga invoice menunjukkan pola keterlambatan yang mulai berulang, terutama pada batch partial payment yang belum ditutup penuh.",
    confidence: "91%",
    action: "Kirim reminder dan lock invoice lane prioritas.",
    tone: "warning" as const,
  },
  {
    id: "quality-gate",
    title: "Satu channel masih provisional",
    detail: "AI mendeteksi kualitas batch Indomaret belum cukup aman untuk executive layer sampai review manual selesai.",
    confidence: "89%",
    action: "Selesaikan review exception sebelum publish final.",
    tone: "info" as const,
  },
];

const tabLabels: Record<MonitoringTab, string> = {
  overview: "Overview",
  branches: "Branch Risk",
  payment: "Payment Control",
  events: "Risk Events",
  pks: "PKS Scorecard",
};

const roleTabMap = {
  executive: ["overview", "payment", "events", "pks"],
  operations: ["overview", "branches", "events"],
  finance: ["payment", "events", "pks"],
  consultant: ["overview", "payment", "events", "pks"],
  principal: ["overview", "payment", "events"],
  retail: ["overview", "events"],
} satisfies Record<
  "executive" | "operations" | "finance" | "consultant" | "principal" | "retail",
  MonitoringTab[]
>;

function severityTone(severity: string) {
  if (severity === "Critical") return "danger" as const;
  if (severity === "High") return "warning" as const;
  if (severity === "Warning") return "info" as const;
  return "neutral" as const;
}

function eventStatusTone(status: string) {
  if (status === "Open") return "danger" as const;
  if (status === "In Progress") return "warning" as const;
  if (status === "Exception Review" || status === "Pending Validation") return "info" as const;
  return "neutral" as const;
}

function complianceTone(compliance: string) {
  if (compliance === "High") return "danger" as const;
  if (compliance === "Warning") return "warning" as const;
  if (compliance === "Current") return "success" as const;
  return "neutral" as const;
}

export default function MonitoringPage() {
  const [activeTab, setActiveTab] = React.useState("overview");
  const [selectedBranch, setSelectedBranch] = React.useState<BranchRow>(branchRanking[branchRanking.length - 1]);
  const [selectedEvent, setSelectedEvent] = React.useState<RiskEventRow>(riskEventQueue[0]);
  const [selectedInvoice, setSelectedInvoice] = React.useState<InvoiceRow>(invoiceLedger[0]);
  const [selectedMetric, setSelectedMetric] = React.useState(controlMetrics[0]);
  const [branchDetailOpen, setBranchDetailOpen] = React.useState(false);
  const [eventDetailOpen, setEventDetailOpen] = React.useState(false);
  const [invoiceDetailOpen, setInvoiceDetailOpen] = React.useState(false);
  const [metricDetailOpen, setMetricDetailOpen] = React.useState(false);
  const { role, periodLabel, channelLabel } = useDemoConsole();

  const visibleTabs = React.useMemo(
    () => roleTabMap[role].map((id) => ({ id, label: tabLabels[id] })),
    [role]
  );

  React.useEffect(() => {
    if (!visibleTabs.some((item) => item.id === activeTab)) {
      setActiveTab(visibleTabs[0]?.id ?? "overview");
    }
  }, [activeTab, visibleTabs]);

  const columns: ColumnDef<BranchRow>[] = [
    { accessorKey: "rank", header: () => <SortableHeader label="Rank" />, cell: ({ row }) => <span className="tabular">{row.original.rank}</span> },
    { accessorKey: "branch", header: () => <SortableHeader label="Cabang" />, cell: ({ row }) => <span className="font-medium">{row.original.branch}</span> },
    { accessorKey: "region", header: () => <SortableHeader label="Wilayah" /> },
    { accessorKey: "sellout", header: () => <SortableHeader label="Sell-out" />, cell: ({ row }) => <span className="tabular">{row.original.sellout}</span> },
    { accessorKey: "growth", header: () => <SortableHeader label="Growth" />, cell: ({ row }) => <span className="tabular">{row.original.growth}</span> },
    { accessorKey: "activeOutlet", header: () => <SortableHeader label="Outlet Aktif" />, cell: ({ row }) => <span className="tabular">{row.original.activeOutlet}</span> },
    { accessorKey: "stock", header: "Status", cell: ({ row }) => <Badge variant={toneToBadge(row.original.tone)}>{row.original.stock}</Badge> },
  ];

  const riskEventColumns: ColumnDef<RiskEventRow>[] = [
    { accessorKey: "eventId", header: () => <SortableHeader label="Event ID" />, cell: ({ row }) => <span className="font-medium">{row.original.eventId}</span> },
    { accessorKey: "eventType", header: () => <SortableHeader label="Event Type" /> },
    { accessorKey: "entityKey", header: "Entity", cell: ({ row }) => <span className="font-medium">{row.original.entityKey}</span> },
    { accessorKey: "workflowState", header: "Workflow" },
    { accessorKey: "owner", header: "Owner" },
    { accessorKey: "sla", header: "SLA" },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }) => <Badge variant={toneToBadge(severityTone(row.original.severity))}>{row.original.severity}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant={toneToBadge(eventStatusTone(row.original.status))}>{row.original.status}</Badge>,
    },
    { accessorKey: "agentAction", header: "Agent Action" },
  ];

  const invoiceColumns: ColumnDef<InvoiceRow>[] = [
    { accessorKey: "invoiceId", header: () => <SortableHeader label="Invoice" />, cell: ({ row }) => <span className="font-medium">{row.original.invoiceId}</span> },
    { accessorKey: "payer", header: "Payer" },
    { accessorKey: "payee", header: "Payee" },
    { accessorKey: "dueDate", header: () => <SortableHeader label="Due Date" /> },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "paidAmount", header: "Paid" },
    { accessorKey: "agingBucket", header: "Aging" },
    {
      accessorKey: "compliance",
      header: "Compliance",
      cell: ({ row }) => <Badge variant={toneToBadge(complianceTone(row.original.compliance))}>{row.original.compliance}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Control Tower"
        title="Monitoring & Risk Control"
        description={`Modul operasional untuk memantau sell-in, sell-out, distribusi wilayah, aging payment, dan risk event untuk scope ${periodLabel} pada ${channelLabel}.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Export disiapkan", { description: "Data Control View sedang diproses menjadi PDF." })}>
              <Download data-icon="inline-start" />
              Export Control View
            </Button>
            <Button className="gap-2" onClick={() => toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), { loading: "Menjalankan Rule PKS", success: "Evaluasi PKS berhasil diperbarui minggu ini." })}>
              <Radar data-icon="inline-start" />
              Jalankan Evaluasi PKS
            </Button>
          </div>
        }
      />

      <AiInsightRail
        title="Monitoring Insight Rail"
        description="Insight singkat dari layer AI untuk membantu tim operasional membaca prioritas, confidence, dan langkah lanjutan tanpa keluar dari control surface."
        insights={monitoringInsights}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {controlMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-medium text-muted-foreground">{metric.label}</div>
                <div className="flex size-8 items-center justify-center rounded-full border border-sky-200/80 bg-sky-50 text-sky-700">
                  <BrainCircuit className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-3 text-2xl tracking-tight tabular text-foreground">{metric.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{metric.note}</div>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => {
                  setSelectedMetric(metric);
                  setMetricDetailOpen(true);
                }}
              >
                Explain signal
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          {visibleTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <SelloutChartPanel />
            <Card>
              <CardHeader>
                <CardTitle>Decision Center</CardTitle>
                <CardDescription>Ringkasan keputusan yang merangkum kondisi operasional, tekanan cabang, dan exposure pembayaran periode aktif.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {decisionCards.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <Card>
              <CardHeader>
                <CardTitle>Branch Action Summary</CardTitle>
                <CardDescription>Ringkasan tindakan untuk cabang prioritas agar monitoring berlanjut ke eksekusi operasional yang jelas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Cabang prioritas", selectedBranch.branch],
                  ["Sell-out saat ini", `${selectedBranch.sellout} unit`],
                  ["Growth MoM", selectedBranch.growth],
                  ["Outlet aktif", selectedBranch.activeOutlet],
                  ["Arah aksi", selectedBranch.tone === "danger" ? "Turunkan alokasi, audit outlet, dan cek coverage stok" : "Pertahankan momentum dan jaga kualitas distribusi"],
                ].map(([label, value]) => (
                  <div key={label} className="kv-row">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="max-w-[52%] text-right text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <AnomalyFeedCard />
          </section>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle>Branch Risk Table</CardTitle>
                <CardDescription>Tabel cabang untuk membaca performa sell-out, outlet aktif, dan status stok dalam satu view kerja operasional.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={branchRanking}
                  searchPlaceholder="Cari cabang atau wilayah..."
                  onRowClick={(row) => {
                    setSelectedBranch(row);
                    setBranchDetailOpen(true);
                  }}
                  toolbar={
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast.info("Filter 'Top Performer' diaplikasikan.")}>Top Performer</Button>
                      <Button variant="outline" size="sm" onClick={() => toast.info("Filter 'Needs Attention' diaplikasikan.")}>Needs Attention</Button>
                    </div>
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Detail Panel</CardTitle>
                <CardDescription>Panel sisi kanan untuk membuktikan bagaimana branch risk diterjemahkan ke keputusan operasional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Cabang terpilih</p>
                      <h3 className="mt-2 text-xl tracking-tight text-foreground">{selectedBranch.branch}</h3>
                    </div>
                    <Badge variant={toneToBadge(selectedBranch.tone)}>{selectedBranch.stock}</Badge>
                  </div>
                </div>
                {[
                  ["Wilayah", selectedBranch.region],
                  ["Sell-out", `${selectedBranch.sellout} unit`],
                  ["Growth MoM", selectedBranch.growth],
                  ["Outlet Aktif", selectedBranch.activeOutlet],
                  ["Rekomendasi", selectedBranch.tone === "danger" ? "Intervensi outlet, audit stok, dan review replenishment" : "Pertahankan momentum distribusi"],
                ].map(([label, value]) => (
                  <div key={label} className="kv-row">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="max-w-[56%] text-right text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
                <Button className="w-full gap-2" onClick={() => toast.success("Memuat profil cabang", { description: "Menyiapkan Action Lane khusus untuk " + selectedBranch.branch })}>
                  Buka action lane cabang
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {paymentMetrics.map((metric) => (
              <Card key={metric.label}>
                <CardContent className="p-5">
                  <div className="text-xs font-medium text-muted-foreground">{metric.label}</div>
                  <div className="mt-3 text-xl tracking-tight tabular text-foreground">{metric.value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{metric.note}</div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <CardHeader>
                <CardTitle>Payment Watchlist</CardTitle>
                <CardDescription>Event list untuk aging payment, overdue risk, dan provisional payment evidence.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentEvents.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <Badge variant={toneToBadge(item.tone)}>{item.tone}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="surface-noise">
              <CardHeader>
                <CardTitle>Risk Logic</CardTitle>
                <CardDescription>Ringkasan rule yang menjadi dasar risk engine untuk stok, pembayaran, kualitas data, dan deviasi target.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {[
                  {
                    icon: Boxes,
                    title: "Stock imbalance",
                    note: "Flag jika sell-in terlalu jauh di atas sell-out dan stok outlet melewati ambang cover.",
                  },
                  {
                    icon: WalletCards,
                    title: "Payment non-compliance",
                    note: "Flag jika due date terlewati atau aging masuk bucket 46-60 hari dan 61+ hari.",
                  },
                  {
                    icon: ShieldAlert,
                    title: "Quality gate block",
                    note: "Executive dashboard tidak publish angka final bila batch masih blocked atau provisional.",
                  },
                  {
                    icon: TrendingDown,
                    title: "Target deviation",
                    note: "Cabang dan channel ditandai bila gap target vs actual melewati toleransi yang ditetapkan.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border/25 bg-white/70 p-4">
                    <item.icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-medium text-foreground">{item.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Aging Ledger</CardTitle>
                <CardDescription>Ledger invoice untuk membaca payer, payee, due date, aging bucket, dan compliance dalam satu control surface.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={invoiceColumns}
                  data={invoiceLedger}
                  searchPlaceholder="Cari invoice, payer, atau owner..."
                  onRowClick={(row) => {
                    setSelectedInvoice(row);
                    setInvoiceDetailOpen(true);
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Invoice Posture</CardTitle>
                <CardDescription>Panel kerja finance untuk membaca status invoice terpilih sebelum follow-up atau eskalasi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Invoice terpilih</p>
                      <h3 className="mt-2 text-xl tracking-tight text-foreground">{selectedInvoice.invoiceId}</h3>
                    </div>
                    <Badge variant={toneToBadge(complianceTone(selectedInvoice.compliance))}>{selectedInvoice.compliance}</Badge>
                  </div>
                </div>
                {[
                  ["Payer", selectedInvoice.payer],
                  ["Payee", selectedInvoice.payee],
                  ["Due date", selectedInvoice.dueDate],
                  ["Amount", selectedInvoice.amount],
                  ["Paid amount", selectedInvoice.paidAmount],
                  ["Aging bucket", selectedInvoice.agingBucket],
                  ["Owner", selectedInvoice.owner],
                ].map(([label, value]) => (
                  <div key={label} className="kv-row">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="max-w-[56%] text-right text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Open events", value: "1", note: "Perlu eskalasi segera", tone: "danger" as const },
              { label: "In progress", value: "1", note: "Sedang ditangani owner", tone: "warning" as const },
              { label: "Exception review", value: "1", note: "Menunggu validasi lanjutan", tone: "info" as const },
              { label: "Pending validation", value: "1", note: "Masih tertahan di quality gate", tone: "warning" as const },
            ].map((metric) => (
              <Card key={metric.label}>
                <CardContent className="p-5">
                  <div className="text-xs font-medium text-muted-foreground">{metric.label}</div>
                  <div className="mt-3 text-xl tracking-tight tabular text-foreground">{metric.value}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{metric.note}</div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle>Risk Event Center</CardTitle>
                <CardDescription>Work queue terpadu untuk event stok, mismatch distribusi, payment non-compliance, dan data quality.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={riskEventColumns}
                  data={riskEventQueue}
                  searchPlaceholder="Cari event, entity, atau owner..."
                  onRowClick={(row) => {
                    setSelectedEvent(row);
                    setEventDetailOpen(true);
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Selected Risk Event</CardTitle>
                <CardDescription>Panel eksekusi untuk membaca rule pemicu, nilai observasi, dan SLA event yang dipilih.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Event terpilih</p>
                      <h3 className="mt-2 text-xl tracking-tight text-foreground">{selectedEvent.eventType}</h3>
                    </div>
                    <Badge variant={toneToBadge(severityTone(selectedEvent.severity))}>{selectedEvent.severity}</Badge>
                  </div>
                </div>
                {[
                  ["Event ID", selectedEvent.eventId],
                  ["Entity", `${selectedEvent.entityType} / ${selectedEvent.entityKey}`],
                  ["Workflow", selectedEvent.workflowState],
                  ["Agent action", selectedEvent.agentAction],
                  ["AI confidence", selectedEvent.confidence],
                  ["Owner", selectedEvent.owner],
                  ["SLA", selectedEvent.sla],
                  ["Status", selectedEvent.status],
                  ["Observed value", selectedEvent.observedValue],
                  ["Rule", selectedEvent.thresholdRule],
                  ["Source", selectedEvent.source],
                ].map(([label, value]) => (
                  <div key={label} className="kv-row">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="max-w-[56%] text-right text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="pks">
          <Card className="surface-noise">
            <CardHeader>
              <CardTitle>Evaluasi PKS</CardTitle>
              <CardDescription>Scorecard KPI PKS untuk menilai performa distributor dan kepatuhan pengelolaan distribusi nasional.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Current Evaluation</p>
                    <h3 className="mt-3 text-xl font-semibold">{pksEvaluation.status}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">{pksEvaluation.summary}</p>
                  </div>
                  <Badge variant="warning">{pksEvaluation.status}</Badge>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {pksEvaluation.scorecards.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <Badge variant={toneToBadge(item.tone)}>{item.target}</Badge>
                    </div>
                    <div className="mt-3 text-xl tabular font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
              <Button className="gap-2" onClick={() => toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), { loading: "Menjalankan Rule PKS", success: "Evaluasi PKS berhasil diperbarui minggu ini." })}>
                Jalankan Evaluasi PKS
                <ArrowRight data-icon="inline-end" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DetailSheet
        open={branchDetailOpen}
        onOpenChange={setBranchDetailOpen}
        title={selectedBranch.branch}
        description="Panel samping untuk meninjau branch risk tanpa berpindah konteks halaman."
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Risk posture</div>
                <div className="mt-2 text-xl tracking-tight text-foreground">{selectedBranch.stock}</div>
              </div>
              <Badge variant={toneToBadge(selectedBranch.tone)}>{selectedBranch.growth}</Badge>
            </div>
          </div>
          {[
            ["Wilayah", selectedBranch.region],
            ["Sell-out", `${selectedBranch.sellout} unit`],
            ["Outlet aktif", selectedBranch.activeOutlet],
            ["Growth", selectedBranch.growth],
          ].map(([label, value]) => (
            <div key={label} className="kv-row">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-medium text-foreground">{value}</span>
            </div>
          ))}
          <div className="grid gap-3">
            {branchDetailMoments.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                <div className="text-xs font-medium text-muted-foreground">{item.title}</div>
                <div className="mt-2 text-base font-medium text-foreground">{item.value}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </DetailSheet>

      <DetailSheet
        open={eventDetailOpen}
        onOpenChange={setEventDetailOpen}
        title={selectedEvent.eventId}
        description="Detail risk event untuk owner, SLA, rule, dan sumber data yang memicu event."
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Risk posture</div>
                <div className="mt-2 text-xl tracking-tight text-foreground">{selectedEvent.eventType}</div>
              </div>
              <Badge variant={toneToBadge(severityTone(selectedEvent.severity))}>{selectedEvent.severity}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="ai">{selectedEvent.confidence} confidence</Badge>
              <Badge variant="outline">{selectedEvent.workflowState}</Badge>
              <Badge variant="outline">{selectedEvent.agentAction}</Badge>
            </div>
          </div>
          {[
            ["Entity", `${selectedEvent.entityType} / ${selectedEvent.entityKey}`],
            ["Owner", selectedEvent.owner],
            ["Status", selectedEvent.status],
            ["SLA", selectedEvent.sla],
            ["Observed value", selectedEvent.observedValue],
            ["Threshold rule", selectedEvent.thresholdRule],
            ["Source", selectedEvent.source],
            ["Updated", selectedEvent.updatedAt],
          ].map(([label, value]) => (
            <div key={label} className="kv-row">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="max-w-[56%] text-right text-sm font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </DetailSheet>

      <SignalExplainSheet
        open={metricDetailOpen}
        onOpenChange={setMetricDetailOpen}
        title={selectedMetric.label}
        summary={`${selectedMetric.label} berada di ${selectedMetric.value} untuk ${channelLabel} pada ${periodLabel}.`}
        confidence="92% confidence"
        status="Control metric"
        reasoning={[
          "AI menelusuri metric ini dari batch yang lolos quality gate, lalu mencocokkannya dengan distribusi cabang aktif dan exception terbuka.",
          "Signal hanya dipromosikan ke headline monitoring bila sumber utama telah published atau minimal provisional dengan flag yang jelas.",
        ]}
        sources={["sell_in_record", "sell_out_record", "risk_event", "master_distribusi"]}
        decisionRule="Metric control dianggap valid bila tidak ada blocking issue pada batch, dan variance nasional masih berada dalam ambang kontrol."
        recommendedAction={`Gunakan ${selectedMetric.label.toLowerCase()} sebagai acuan tindakan operasional, lalu bandingkan dengan risk event yang sedang terbuka.`}
      />

      <DetailSheet
        open={invoiceDetailOpen}
        onOpenChange={setInvoiceDetailOpen}
        title={selectedInvoice.invoiceId}
        description="Detail invoice untuk memverifikasi payer, payee, aging, dan compliance sebelum follow-up."
      >
        <div className="space-y-3">
          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Compliance posture</div>
                <div className="mt-2 text-xl tracking-tight text-foreground">{selectedInvoice.status}</div>
              </div>
              <Badge variant={toneToBadge(complianceTone(selectedInvoice.compliance))}>{selectedInvoice.compliance}</Badge>
            </div>
          </div>
          {[
            ["Payer", selectedInvoice.payer],
            ["Payee", selectedInvoice.payee],
            ["Due date", selectedInvoice.dueDate],
            ["Amount", selectedInvoice.amount],
            ["Paid amount", selectedInvoice.paidAmount],
            ["Aging bucket", selectedInvoice.agingBucket],
            ["Owner", selectedInvoice.owner],
          ].map(([label, value]) => (
            <div key={label} className="kv-row">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </DetailSheet>
    </div>
  );
}
