"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Mail, Printer, RefreshCcw } from "lucide-react";
import { useDemoConsole } from "@/components/dashboard/demo-console-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { DetailSheet } from "@/components/dashboard/detail-sheet";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { activityLog, demoScenario, generatedReports, reportCatalog, reportPreviewSections, reportSummary } from "@/lib/mock-data";

const sendChecklist = [
  "Pastikan angka utama sudah sesuai periode aktif.",
  "Periksa kembali cabang prioritas dan isu pembayaran yang wajib dibawa ke manajemen.",
  "Jangan kirim keluar jika masih ada data penting yang belum bersih.",
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = React.useState(reportCatalog[0]);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [previewSection, setPreviewSection] = React.useState<string>(reportPreviewSections[0].id);
  const { periodLabel } = useDemoConsole();

  const columns: ColumnDef<(typeof generatedReports)[number]>[] = [
    { accessorKey: "name", header: () => <SortableHeader label="Nama Laporan" />, cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "type", header: "Jenis" },
    { accessorKey: "period", header: "Periode" },
    { accessorKey: "generated", header: () => <SortableHeader label="Dibuat Pada" /> },
    { accessorKey: "by", header: "Dibuat Oleh" },
    { accessorKey: "format", header: "Format" },
    { accessorKey: "distribution", header: "Status Kirim", cell: ({ row }) => <Badge variant={row.original.distribution === "Terkirim" ? "success" : row.original.distribution === "Draf" ? "warning" : "info"}>{row.original.distribution}</Badge> },
    { accessorKey: "recipient", header: "Penerima" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Laporan"
        title="Siapkan dan Kirim Laporan Operasional"
        description={`Halaman ini dipakai untuk memilih jenis laporan, meninjau isi ringkasnya, lalu mengirimkan laporan periode ${periodLabel} ke pihak yang membutuhkan.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Ringkasan laporan dimuat ulang")}>
              <RefreshCcw data-icon="inline-start" />
              Refresh Data
            </Button>
            <Button className="gap-2" onClick={() => toast.info("Mode pembuatan laporan baru dibuka")}>
              <Printer data-icon="inline-start" />
              Buat Laporan
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reportSummary.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
              <div className="mt-3 text-2xl tracking-tight tabular text-foreground">{item.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{item.note}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs defaultValue="catalog" className="space-y-6">
        <TabsList>
          <TabsTrigger value="catalog">Daftar Laporan</TabsTrigger>
          <TabsTrigger value="generated">Laporan Terbuat</TabsTrigger>
          <TabsTrigger value="history">Riwayat Pengiriman</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
            <div className="space-y-4">
              <SectionHeading
                eyebrow="Pilihan Laporan"
                title="Pilih jenis laporan yang dibutuhkan"
                description="Gunakan katalog ini untuk memilih laporan yang akan kamu susun, cek isinya, lalu teruskan ke proses kirim."
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
                        <Badge variant={item.status === "Siap" ? "success" : item.status === "Draf" ? "warning" : "info"}>{item.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast.info("Membuka pratinjau singkat")}>Pratinjau</Button>
                      <Button size="sm" onClick={(event) => { event.stopPropagation(); setSelectedReport(item); setDetailOpen(true); }}>Buka Detail</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ringkasan laporan terpilih</CardTitle>
                <CardDescription>Ringkasan ini membantu kamu mengecek apakah isi laporan sudah cukup jelas sebelum diunduh atau dikirim.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  ["Laporan", selectedReport.title],
                  ["Target vs realisasi", `${demoScenario.totalSellOutCompact} vs target periode aktif`],
                  ["Cabang terbaik", "Jabodetabek Barat"],
                  ["Cabang prioritas", "Cirebon Raya"],
                  ["Status PKS", "Peringatan awal"],
                  ["Kondisi data", "2 channel siap dipakai, 1 masih perlu revisi"],
                ].map(([label, value]) => (
                  <div key={label} className="kv-row">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="max-w-[56%] text-right text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
                <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                  <div className="text-sm font-medium text-foreground">Yang perlu dicek sebelum kirim</div>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {sendChecklist.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" className="gap-2" onClick={() => toast.success("File laporan sedang diunduh")}><Download data-icon="inline-start" />Unduh</Button>
                  <Button variant="secondary" className="gap-2" onClick={() => toast.success("Laporan dikirim")}><Mail data-icon="inline-start" />Kirim</Button>
                  <Button className="gap-2" onClick={() => toast.success("Laporan difinalkan")}><Printer data-icon="inline-start" />Finalisasi</Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          <section className="space-y-4">
            <SectionHeading
              eyebrow="Arsip"
              title="Laporan yang sudah dibuat"
              description="Cari laporan yang sudah pernah dibuat, lihat status kirimnya, dan cek siapa penerimanya."
            />
            <Card>
              <CardContent className="pt-6">
                <DataTable
                  columns={columns}
                  data={generatedReports}
                  searchPlaceholder="Cari laporan atau penerima..."
                  toolbar={
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]"><SelectValue placeholder="Jenis laporan" /></SelectTrigger>
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

        <TabsContent value="history" className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <Card>
              <CardHeader>
                <CardTitle>Jadwal dan pengingat hari ini</CardTitle>
                <CardDescription>Ringkasan singkat hal yang perlu kamu cek sebelum menutup siklus pelaporan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Rekap bulanan internal siap dikirim ke manajemen.",
                  "Evaluasi PKS masih perlu review manual sebelum dikirim ke pihak luar.",
                  "Satu laporan PO masih menunggu penyegaran data cabang.",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-border/25 bg-accent/20 p-4 text-sm text-muted-foreground">{item}</div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Riwayat pengiriman</CardTitle>
                <CardDescription>Catatan generate dan pengiriman laporan agar tim tahu apa yang sudah terkirim dan mana yang masih tertahan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activityLog.map((item) => (
                  <div key={item} className="rounded-2xl border border-border/25 bg-accent/20 p-3.5 text-sm text-muted-foreground">{item}</div>
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
        description="Pratinjau isi laporan sebelum diunduh atau dikirim."
        className="w-[min(96vw,620px)]"
      >
        <div className="space-y-5">
          <Tabs value={previewSection} onValueChange={setPreviewSection} className="space-y-4">
            <TabsList>
              {reportPreviewSections.map((section) => (
                <TabsTrigger key={section.id} value={section.id}>{section.title}</TabsTrigger>
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
                    <div key={item} className="rounded-2xl border border-border/25 bg-accent/20 p-4 text-sm leading-relaxed text-muted-foreground">{item}</div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => toast.success("PDF sedang disiapkan")}><Download data-icon="inline-start" />PDF</Button>
            <Button variant="secondary" className="gap-2" onClick={() => toast.success("Laporan dikirim")}><Mail data-icon="inline-start" />Kirim</Button>
            <Button className="gap-2" onClick={() => toast.success("Permintaan cetak dikirim")}><Printer data-icon="inline-start" />Cetak</Button>
          </div>
        </div>
      </DetailSheet>
    </div>
  );
}
