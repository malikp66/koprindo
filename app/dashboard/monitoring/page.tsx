"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Download,
  Radar,
  RefreshCcw,
} from "lucide-react";
import { useDemoConsole } from "@/components/dashboard/demo-console-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { AnomalyFeedCard } from "@/components/dashboard/feed-card";
import { SelloutChartPanel } from "@/components/dashboard/chart-panel";
import { toneToBadge } from "@/components/dashboard/tone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { branchRanking, demoScenario, invoiceLedger, pksEvaluation, riskEventQueue } from "@/lib/mock-data";

type BranchRow = (typeof branchRanking)[number];
type IssueRow = (typeof riskEventQueue)[number];
type InvoiceRow = (typeof invoiceLedger)[number];

const summaryCards = [
  { label: "Penjualan bulan ini", value: demoScenario.totalSellOutUnits, note: "+11.3% dibanding bulan lalu" },
  { label: "Outlet aktif", value: demoScenario.activeOutletCount, note: "Jaga outlet yang masih produktif" },
  { label: "Retur berjalan", value: demoScenario.returnQty, note: "Perlu dijaga agar tidak menekan penjualan" },
  { label: "Piutang >45 hari", value: demoScenario.aging45Plus, note: "7 invoice perlu follow-up" },
  { label: "Cabang butuh perhatian", value: "3 cabang", note: "Jawa Barat dan Jawa Timur paling tertekan" },
  { label: "Pencapaian target", value: demoScenario.targetProgress, note: "Masih perlu dorongan tambahan" },
];

function branchStatusTone(tone: BranchRow["tone"]) {
  return toneToBadge(tone);
}

function branchStatusLabel(tone: BranchRow["tone"]) {
  if (tone === "danger") return "Perlu tindakan cepat";
  if (tone === "warning") return "Perlu dipantau";
  return "Stabil";
}

function invoiceTone(status: InvoiceRow["compliance"]) {
  if (status === "Tinggi") return "danger";
  if (status === "Perlu perhatian") return "warning";
  return "success";
}

function issueTone(level: IssueRow["severity"]) {
  if (level === "Kritis") return "danger";
  if (level === "Tinggi") return "warning";
  return "info";
}

export default function MonitoringPage() {
  const { periodLabel, channelLabel } = useDemoConsole();
  const [selectedBranch, setSelectedBranch] = React.useState(branchRanking[branchRanking.length - 1]);
  const [selectedInvoice, setSelectedInvoice] = React.useState(invoiceLedger[0]);
  const [selectedIssue, setSelectedIssue] = React.useState(riskEventQueue[0]);

  const branchColumns: ColumnDef<BranchRow>[] = [
    { accessorKey: "branch", header: () => <SortableHeader label="Cabang" />, cell: ({ row }) => <span className="font-medium">{row.original.branch}</span> },
    { accessorKey: "region", header: "Wilayah" },
    { accessorKey: "sellout", header: () => <SortableHeader label="Penjualan" /> },
    { accessorKey: "growth", header: () => <SortableHeader label="Growth" /> },
    { accessorKey: "activeOutlet", header: "Outlet Aktif" },
    { accessorKey: "stock", header: "Status", cell: ({ row }) => <Badge variant={branchStatusTone(row.original.tone)}>{branchStatusLabel(row.original.tone)}</Badge> },
  ];

  const invoiceColumns: ColumnDef<InvoiceRow>[] = [
    { accessorKey: "invoiceId", header: () => <SortableHeader label="Invoice" />, cell: ({ row }) => <span className="font-medium">{row.original.invoiceId}</span> },
    { accessorKey: "payer", header: "Payer" },
    { accessorKey: "dueDate", header: "Jatuh Tempo" },
    { accessorKey: "amount", header: "Nilai" },
    { accessorKey: "agingBucket", header: "Umur Piutang" },
    { accessorKey: "compliance", header: "Status", cell: ({ row }) => <Badge variant={invoiceTone(row.original.compliance)}>{row.original.compliance}</Badge> },
  ];

  const issueColumns: ColumnDef<IssueRow>[] = [
    { accessorKey: "eventType", header: () => <SortableHeader label="Masalah" />, cell: ({ row }) => <span className="font-medium">{row.original.eventType}</span> },
    { accessorKey: "entityKey", header: "Unit" },
    { accessorKey: "owner", header: "PIC" },
    { accessorKey: "sla", header: "Batas tindak lanjut" },
    { accessorKey: "severity", header: "Level", cell: ({ row }) => <Badge variant={issueTone(row.original.severity)}>{row.original.severity}</Badge> },
    { accessorKey: "status", header: "Status" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Monitoring"
        title="Pantau Kondisi dan Prioritas Tindak Lanjut"
        description={`Ringkasan kondisi operasional untuk ${periodLabel} pada ${channelLabel}. Halaman ini dipakai untuk membaca performa, melihat masalah yang muncul, dan menentukan prioritas tindakan hari ini.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Ringkasan sedang disiapkan")}>
              <Download data-icon="inline-start" />
              Export Ringkasan
            </Button>
            <Button className="gap-2" onClick={() => toast.success("Data monitoring berhasil dimuat ulang")}>
              <RefreshCcw data-icon="inline-start" />
              Refresh Data
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
              <div className="mt-3 text-2xl tracking-tight tabular text-foreground">{item.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{item.note}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs defaultValue="ringkasan" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
          <TabsTrigger value="cabang">Cabang</TabsTrigger>
          <TabsTrigger value="pembayaran">Pembayaran</TabsTrigger>
          <TabsTrigger value="masalah">Masalah Operasional</TabsTrigger>
              <TabsTrigger value="pks">Analisa Menyeluruh</TabsTrigger>
        </TabsList>

        <TabsContent value="ringkasan" className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <SelloutChartPanel />
            <AnomalyFeedCard />
          </section>
        </TabsContent>

        <TabsContent value="cabang">
          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle>Daftar performa cabang</CardTitle>
                <CardDescription>Cari wilayah yang perlu dorongan tambahan atau perlu dijaga momentumnya.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={branchColumns} data={branchRanking} searchPlaceholder="Cari cabang atau wilayah..." onRowClick={setSelectedBranch} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan cabang terpilih</CardTitle>
                <CardDescription>Panel cepat untuk briefing tim lapangan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Cabang", selectedBranch.branch],
                  ["Wilayah", selectedBranch.region],
                  ["Penjualan", `${selectedBranch.sellout} unit`],
                  ["Growth", selectedBranch.growth],
                  ["Outlet aktif", selectedBranch.activeOutlet],
                  ["Catatan", selectedBranch.tone === "danger" ? "Perlu tindakan cepat minggu ini." : "Masih dalam jalur yang cukup aman."],
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

        <TabsContent value="pembayaran">
          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Daftar invoice dan umur piutang</CardTitle>
                <CardDescription>Cari invoice dan lihat mana yang paling perlu di-follow-up dulu.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={invoiceColumns} data={invoiceLedger} searchPlaceholder="Cari invoice, payer, atau PIC..." onRowClick={setSelectedInvoice} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan invoice terpilih</CardTitle>
                <CardDescription>Panel ini membantu tim finance membaca posisi invoice saat ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Invoice", selectedInvoice.invoiceId],
                  ["Payer", selectedInvoice.payer],
                  ["Jatuh tempo", selectedInvoice.dueDate],
                  ["Nilai", selectedInvoice.amount],
                  ["Sudah dibayar", selectedInvoice.paidAmount],
                  ["Status", selectedInvoice.compliance],
                  ["Langkah berikutnya", selectedInvoice.compliance === "Tinggi" ? "Naikkan prioritas follow-up hari ini." : "Kirim reminder dan cek update pembayaran."],
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

        <TabsContent value="masalah">
          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>Daftar masalah operasional</CardTitle>
                <CardDescription>Lihat semua masalah terbuka dalam satu antrian kerja.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={issueColumns} data={riskEventQueue} searchPlaceholder="Cari masalah, unit, atau PIC..." onRowClick={setSelectedIssue} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan masalah terpilih</CardTitle>
                <CardDescription>Baca dampak masalah sebelum follow-up ke owner.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Masalah", selectedIssue.eventType],
                  ["Unit", selectedIssue.entityKey],
                  ["PIC", selectedIssue.owner],
                  ["Level", selectedIssue.severity],
                  ["Status", selectedIssue.status],
                  ["Batas tindak lanjut", selectedIssue.sla],
                  ["Catatan", selectedIssue.observedValue],
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
                  <CardTitle>Analisa Menyeluruh</CardTitle>
              <CardDescription>Ringkasan skor dan catatan penting performa distribusi pada periode aktif.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 text-slate-100">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">Status saat ini</p>
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
                    <div className="mt-3 text-xl tabular font-semibold text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>
                  <Button className="gap-2" onClick={() => toast.success("Analisa menyeluruh diperbarui")}>
                <Radar data-icon="inline-start" />
                Jalankan evaluasi ulang
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
