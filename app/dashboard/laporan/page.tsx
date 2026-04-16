"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  BrainCircuit,
  Download,
  Mail,
  Printer,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { AiInsightRail } from "@/components/dashboard/ai-insight-rail";
import { useDemoConsole } from "@/components/dashboard/demo-console-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { DetailSheet } from "@/components/dashboard/detail-sheet";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  activityLog,
  demoScenario,
  generatedReports,
  reportCatalog,
  reportPreviewSections,
  reportSummary,
} from "@/lib/mock-data";

const governanceChecks = [
  "Executive pack hanya menarik batch published atau provisional yang sudah diberi flag jelas.",
  "Evaluasi PKS memerlukan approval manual sebelum dibagikan ke pihak eksternal.",
  "Semua laporan menyimpan timestamp, penghasil laporan, dan tujuan distribusi untuk kebutuhan audit.",
  "Semua distribusi laporan harus dapat ditelusuri kembali ke batch sumber, approval, dan status exception yang melatarinya.",
];

const reportingInsights = [
  {
    id: "pack-readiness",
    title: "Executive pack siap difinalkan",
    detail: "AI membaca bahwa batch utama sudah published dan hanya satu channel yang masih provisional dengan flag yang jelas.",
    confidence: "93%",
    action: "Lanjutkan finalisasi pack sambil tahan disclosure channel provisional.",
    tone: "ai" as const,
  },
  {
    id: "risk-priority",
    title: "Exception control wajib ikut ke ringkasan",
    detail: "Risk event cabang dan aging payment yang aktif masih cukup material untuk ditampilkan sebagai perhatian manajemen.",
    confidence: "90%",
    action: "Masukkan 3 risk event prioritas ke halaman awal report.",
    tone: "warning" as const,
  },
  {
    id: "distribution",
    title: "Distribusi eksternal perlu approval manual",
    detail: "AI menandai evaluasi PKS dan report partner sebagai dokumen yang memerlukan review sebelum dikirim keluar.",
    confidence: "95%",
    action: "Pastikan approval log lengkap sebelum distribusi.",
    tone: "info" as const,
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = React.useState(reportCatalog[0]);
  const [reportTab, setReportTab] = React.useState("catalog");
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [previewSection, setPreviewSection] = React.useState<string>(reportPreviewSections[0].id);
  const { periodLabel } = useDemoConsole();

  const columns: ColumnDef<(typeof generatedReports)[number]>[] = [
    { accessorKey: "name", header: () => <SortableHeader label="Nama Laporan" />, cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "type", header: "Jenis" },
    { accessorKey: "period", header: "Periode" },
    { accessorKey: "generated", header: () => <SortableHeader label="Generated" /> },
    { accessorKey: "by", header: "By" },
    { accessorKey: "format", header: "Format" },
    { accessorKey: "distribution", header: "Distribusi", cell: ({ row }) => <Badge variant={row.original.distribution === "Sent" ? "success" : row.original.distribution === "Draft" ? "warning" : "info"}>{row.original.distribution}</Badge> },
    { accessorKey: "recipient", header: "Penerima" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reporting and Governance"
        title="Executive Pack and Audit Reporting"
        description={`Pusat laporan untuk executive summary, evaluasi PKS, rekomendasi operasional, dan jejak distribusi laporan untuk scope ${periodLabel}.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Menyusun ulang scorecard", { description: "Data terbaru control tower sedang diambil." })}>
              <RefreshCcw data-icon="inline-start" />
              Refresh Scorecard
            </Button>
            <Button className="gap-2" onClick={() => toast.info("Modul 'Buat Pack Baru' akan dibuka.")}>
              <Printer data-icon="inline-start" />
              Generate Executive Pack
            </Button>
          </div>
        }
      />

      <AiInsightRail
        title="Reporting Insight Rail"
        description="Insight AI untuk kesiapan executive pack, prioritas konten laporan, dan kontrol distribusi sebelum laporan dibagikan."
        insights={reportingInsights}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportSummary.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
                <div className="flex size-8 items-center justify-center rounded-full border border-sky-200/80 bg-sky-50 text-sky-700">
                  <BrainCircuit className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-3 text-2xl tracking-tight tabular text-foreground">{item.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{item.note}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs value={reportTab} onValueChange={setReportTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="catalog">Executive Pack</TabsTrigger>
          <TabsTrigger value="generated">Generated</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
            <div className="space-y-4">
              <SectionHeading
                eyebrow="Catalog"
                title="Report Catalog"
                description="Jenis laporan utama untuk executive overview, evaluasi PKS, rekomendasi PO, dan ringkasan exception."
              />
              <div className="grid gap-3 md:grid-cols-2">
                {reportCatalog.map((item) => (
                  <Card
                    key={item.title}
                    className={`surface-noise cursor-pointer transition-all duration-200 ${selectedReport.title === item.title ? "ring-2 ring-primary/30" : ""}`}
                    onClick={() => setSelectedReport(item)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-base">{item.title}</CardTitle>
                          <CardDescription className="mt-1.5">{item.detail}</CardDescription>
                        </div>
                        <Badge variant={item.status === "Ready" ? "success" : item.status === "Draft" ? "warning" : "info"}>
                          {item.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast.info("Membuka mode preview dokumen.")}>Preview</Button>
                      <Button
                        size="sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedReport(item);
                          setDetailOpen(true);
                        }}
                      >
                        Buka Detail
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Selected Report Summary</CardTitle>
                <CardDescription>Ringkasan konten inti sebelum file dikirim ke manajemen, principal, atau partner operasional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Report", selectedReport.title],
                  ["Target vs actual", `${demoScenario.totalSellOutCompact} vs target periode aktif`],
                  ["Top branch", "Jabodetabek Barat"],
                  ["Critical branch", "Cirebon Raya"],
                  ["PKS posture", "Early Warning"],
                  ["Data quality", "2 channel published, 1 provisional"],
                ].map(([label, value]) => (
                  <div key={label} className="kv-row">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="max-w-[56%] text-right text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" className="gap-2" onClick={() => toast.success("Unduhan disiapkan", { description: "Menyimpan file laporan lengkap." })}><Download data-icon="inline-start" /> Unduh</Button>
                  <Button variant="secondary" className="gap-2" onClick={() => toast.success("Laporan dikirim", { description: "Status distribusi dikirim melalui email/WA grup operasional." })}><Mail data-icon="inline-start" /> Distribusikan</Button>
                  <Button className="gap-2" onClick={() => toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), { loading: "Memfinalisasi...", success: "Laporan difinalisasi dan ditandai siap presentasi." })}><Printer data-icon="inline-start" /> Finalisasi Pack</Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          <section className="space-y-4">
            <SectionHeading
              eyebrow="Registry"
              title="Generated Reports"
              description="Arsip laporan yang sudah dibuat, status distribusi, dan penerima untuk menjaga disiplin pelaporan yang dapat diaudit."
            />
            <Card>
              <CardContent className="pt-6">
                <DataTable
                  columns={columns}
                  data={generatedReports}
                  searchPlaceholder="Cari report atau penerima..."
                  toolbar={
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Jenis laporan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Jenis</SelectItem>
                        <SelectItem value="bulanan">Bulanan</SelectItem>
                        <SelectItem value="pks">PKS</SelectItem>
                        <SelectItem value="po">PO</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                />
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <CardHeader>
                <CardTitle>Governance Checklist</CardTitle>
                <CardDescription>Prinsip dasar pelaporan agar sesuai dengan requirement auditability di PRD baru.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {governanceChecks.map((item) => (
                  <div key={item} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Governance check
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution Log</CardTitle>
                <CardDescription>Jejak generate dan distribusi laporan untuk memastikan alur pelaporan dapat ditelusuri dan dikendalikan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activityLog.map((item) => (
                  <div key={item} className="rounded-2xl border border-border/25 bg-accent/20 p-3.5 text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>

      <DetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={selectedReport.title}
        description="Panel isi laporan untuk meninjau struktur executive pack sebelum didistribusikan."
        className="w-[min(96vw,620px)]"
      >
        <div className="space-y-5">
          <Tabs value={previewSection} onValueChange={setPreviewSection} className="space-y-4">
            <TabsList>
              {reportPreviewSections.map((section) => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {reportPreviewSections.map((section) => (
              <TabsContent key={section.id} value={section.id} className="space-y-3">
                <div className="rounded-2xl border border-border/25 bg-accent/20 p-5">
                  <div className="text-xs font-medium text-muted-foreground">{section.title}</div>
                  <div className="mt-3 text-lg tracking-tight text-foreground">{section.summary}</div>
                </div>
                <div className="grid gap-2">
                  {section.bullets.map((item) => (
                    <div key={item} className="rounded-2xl border border-border/25 bg-accent/20 p-4 text-sm leading-relaxed text-muted-foreground">
                      {item}
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Proses PDF dimulai", { description: "Menyusun struktur report komprehensif." })}><Download data-icon="inline-start" /> PDF</Button>
            <Button variant="secondary" className="gap-2" onClick={() => toast.info("Modul pengiriman otomatis dibuka")}><Mail data-icon="inline-start" /> Kirim</Button>
            <Button className="gap-2" onClick={() => toast.success("Permintaan cetak dikirim ke printer tim")}><Printer data-icon="inline-start" /> Cetak Pack</Button>
          </div>
        </div>
      </DetailSheet>
    </div>
  );
}
