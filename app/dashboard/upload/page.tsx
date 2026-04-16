"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  FileUp,
  UploadCloud,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { DetailSheet } from "@/components/dashboard/detail-sheet";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { toneToBadge } from "@/components/dashboard/tone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { batchRegistryDetailed, foxAcceptedSkus, uploadStatus } from "@/lib/mock-data";

type UploadRow = (typeof batchRegistryDetailed)[number];

const uploadSummary = [
  { label: "Unggahan hari ini", value: "3 file", note: "2 sudah lengkap, 1 masih perlu revisi" },
  { label: "Siap dipakai", value: "2 file", note: "Data bisa langsung masuk ke monitoring" },
  { label: "Perlu revisi", value: "1 file", note: "Masih ada isi yang tidak sesuai template" },
  { label: "Belum upload", value: "1 channel", note: "AksesMu belum kirim periode aktif" },
];

const intakePriorityItems = [
  {
    title: "Indomaret perlu kirim ulang file",
    detail: "Masih ada 14 baris yang tidak sesuai portofolio SKU FOX inti dan perlu dirapikan sebelum dipakai.",
    tone: "warning" as const,
  },
  {
    title: "AksesMu belum unggah periode aktif",
    detail: "Pengingat kedua perlu dikirim hari ini agar siklus laporan tidak tertunda.",
    tone: "danger" as const,
  },
  {
    title: "Finance perlu cek data pembayaran",
    detail: "Satu batch pembayaran sudah masuk, tetapi masih perlu konfirmasi status invoice yang belum lunas.",
    tone: "info" as const,
  },
];

const uploadSamples = {
  siap: {
    fileName: "alfamart_sep_2026.csv",
    fileSize: "2.4 MB",
    rows: "1.284 baris",
    checks: [
      { label: "Format file sesuai", detail: "File terbaca sebagai CSV dan struktur kolom lengkap.", tone: "success" as const },
      { label: "Periode sudah cocok", detail: "Periode September 2026 sesuai dengan siklus aktif.", tone: "success" as const },
      { label: "Tidak ada duplikasi", detail: "Baris transaksi tidak ditemukan ganda.", tone: "success" as const },
      { label: "Siap dipakai", detail: "Data bisa lanjut dipakai untuk monitoring bulan berjalan.", tone: "success" as const },
    ],
  },
  revisi: {
    fileName: "indomaret_sep_2026.xlsx",
    fileSize: "1.8 MB",
    rows: "1.130 baris",
    checks: [
      { label: "Format file sesuai", detail: "File berhasil dibaca dan kolom utama tersedia.", tone: "success" as const },
      { label: "Periode sudah cocok", detail: "Periode September 2026 sudah sesuai.", tone: "success" as const },
      { label: "Isi masih perlu dirapikan", detail: "14 baris masih memuat SKU di luar portofolio FOX yang dipakai sistem ini.", tone: "warning" as const },
      { label: "Perlu kirim ulang", detail: "File belum bisa dipakai penuh sebelum revisi selesai.", tone: "warning" as const },
    ],
  },
} as const;

function uploadStatusLabel(status: UploadRow["status"]) {
  if (status === "terbit") return "Siap dipakai";
  if (status === "tinjau pengecualian") return "Perlu revisi";
  if (status === "direkonsiliasi") return "Perlu konfirmasi";
  if (status === "ditolak") return "Ditolak";
  return "Sedang dicek";
}

function uploadStatusTone(status: UploadRow["status"]) {
  if (status === "terbit") return "success";
  if (status === "tinjau pengecualian") return "warning";
  if (status === "ditolak") return "danger";
  return "info";
}

function uploadIssueSummary(row: UploadRow) {
  if (row.status === "terbit") {
    return "Tidak ada masalah berarti. Data siap dipakai untuk halaman monitoring dan laporan.";
  }

  if (row.status === "tinjau pengecualian") {
    return `${row.issueCount} baris masih perlu dibersihkan sebelum file dipakai penuh.`;
  }

  if (row.status === "direkonsiliasi") {
    return "Isi file sudah terbaca, tetapi masih ada catatan yang perlu dipastikan oleh tim terkait.";
  }

  return "File masih diperiksa agar isinya aman dipakai pada periode aktif.";
}

function uploadNextStep(row: UploadRow) {
  if (row.status === "terbit") return "Lanjutkan ke monitoring atau susun laporan dari data yang sudah siap.";
  if (row.status === "tinjau pengecualian") return "Minta pengirim memperbaiki file lalu unggah ulang versi yang sudah bersih.";
  if (row.status === "direkonsiliasi") return "Koordinasikan dengan finance untuk memastikan catatan pembayaran yang masih terbuka.";
  return "Tunggu pemeriksaan selesai atau hubungi PIC bila ada kebutuhan perbaikan tambahan.";
}

export default function UploadPage() {
  const [selectedUpload, setSelectedUpload] = React.useState<UploadRow>(batchRegistryDetailed[0]);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [sampleMode, setSampleMode] = React.useState<keyof typeof uploadSamples>("siap");
  const selectedSample = uploadSamples[sampleMode];

  const columns: ColumnDef<UploadRow>[] = [
    {
      accessorKey: "batchId",
      header: () => <SortableHeader label="Batch" />,
      cell: ({ row }) => <span className="font-medium">{row.original.batchId}</span>,
    },
    { accessorKey: "channel", header: () => <SortableHeader label="Channel" /> },
    { accessorKey: "period", header: "Periode" },
    { accessorKey: "owner", header: "PIC" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={toneToBadge(uploadStatusTone(row.original.status))}>
          {uploadStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: "reconciliation",
      header: "Catatan",
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[320px] text-sm text-muted-foreground">
          {row.original.reconciliation}
        </span>
      ),
    },
    { accessorKey: "updatedAt", header: () => <SortableHeader label="Diperbarui" /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Data Intake"
        title="Unggah dan Cek Data Masuk"
        description="Halaman kerja untuk menerima file, melihat hasil pengecekan, dan menindaklanjuti unggahan yang masih bermasalah sebelum dipakai tim operasional."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() =>
                toast.success("Template siap diunduh", {
                  description: "File contoh akan membantu PIC memakai format yang benar.",
                })
              }
            >
              <FileSpreadsheet data-icon="inline-start" />
              Unduh Template
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <FileUp data-icon="inline-start" />
                  Upload File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload data periode aktif</DialogTitle>
                  <DialogDescription>
                    Isi channel, periode, dan PIC pengirim. Setelah file masuk, halaman ini langsung menampilkan hasil pengecekan yang perlu kamu lihat.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select defaultValue="alfamart">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alfamart">Alfamart</SelectItem>
                      <SelectItem value="indomaret">Indomaret</SelectItem>
                      <SelectItem value="aksesmu">AksesMu</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="sep-2026">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sep-2026">September 2026</SelectItem>
                      <SelectItem value="agu-2026">Agustus 2026</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Nama PIC" defaultValue="Rina Prameswari" />
                  <Input placeholder="Nomor WA / kode PIC" defaultValue="PIC-ALF-001" />
                </div>
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Drop file di sini atau pilih file dari perangkat.
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => toast.info("Upload dibatalkan")}>
                    Batal
                  </Button>
                  <Button
                    onClick={() =>
                      toast.promise(new Promise((resolve) => setTimeout(resolve, 1400)), {
                        loading: "Memeriksa file...",
                        success: "File berhasil diterima. Hasil pengecekan akan muncul di halaman ini.",
                      })
                    }
                  >
                    Kirim File
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {uploadSummary.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
              <div className="mt-3 text-2xl tracking-tight tabular text-foreground">{item.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{item.note}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="surface-noise">
          <CardHeader>
            <CardTitle>Area upload dan hasil pengecekan</CardTitle>
            <CardDescription>
              Gunakan panel ini untuk mensimulasikan file yang siap dipakai atau file yang masih perlu revisi sebelum diproses lebih lanjut.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <Select defaultValue="alfamart">
                <SelectTrigger>
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alfamart">Alfamart</SelectItem>
                  <SelectItem value="indomaret">Indomaret</SelectItem>
                  <SelectItem value="aksesmu">AksesMu</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="sep-2026">
                <SelectTrigger>
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sep-2026">September 2026</SelectItem>
                  <SelectItem value="agu-2026">Agustus 2026</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Nama PIC" defaultValue="Rina Prameswari" />
              <Input placeholder="Nomor WA / kode PIC" defaultValue="PIC-ALF-001" />
            </div>

            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center">
              <UploadCloud className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-4 text-lg font-medium tracking-tight text-foreground">
                Drop CSV / XLSX di sini
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Halaman ini akan langsung memberitahu apakah file sudah aman dipakai atau masih perlu kamu perbaiki.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={() => toast.info("Dialog penelusuran file dibuka")}>
                  Pilih File
                </Button>
                <Button
                  variant={sampleMode === "siap" ? "default" : "secondary"}
                  onClick={() => setSampleMode("siap")}
                >
                  Contoh File Siap
                </Button>
                <Button
                  variant={sampleMode === "revisi" ? "default" : "secondary"}
                  onClick={() => setSampleMode("revisi")}
                >
                  Contoh File Perlu Revisi
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[
                ["Nama file", selectedSample.fileName],
                ["Ukuran", selectedSample.fileSize],
                ["Perkiraan isi", selectedSample.rows],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-accent/20 p-4">
                  <div className="text-xs font-medium text-muted-foreground">{label}</div>
                  <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {selectedSample.checks.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-2xl border border-border/25 bg-white/80 p-4"
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      item.tone === "success"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {item.tone === "success" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.label}</div>
                    <div className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prioritas hari ini</CardTitle>
            <CardDescription>
              Fokus ke item yang benar-benar perlu ditindak agar data bulan berjalan cepat siap dipakai.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {intakePriorityItems.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.title}</div>
                    <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.detail}
                    </div>
                  </div>
                  <Badge variant={toneToBadge(item.tone)}>
                    {item.tone === "danger"
                      ? "Urgent"
                      : item.tone === "warning"
                        ? "Hari ini"
                        : "Perlu cek"}
                  </Badge>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                Yang perlu dicek sebelum file dipakai
              </div>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p>Pastikan periode dan channel sudah benar.</p>
                <p>Pastikan tidak ada produk atau outlet yang salah mapping.</p>
                <p>Pastikan PIC tahu bagian mana yang harus diperbaiki jika file ditolak.</p>
              </div>
            </div>

            <div className="space-y-3">
              {uploadStatus.map((item) => (
                <div key={item.channel} className="rounded-2xl border border-border/25 bg-white/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.channel}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{item.pic}</div>
                    </div>
                    <Badge variant={toneToBadge(item.tone)}>{item.status}</Badge>
                  </div>
                  <div className="mt-3">
                    <Progress value={item.progress} />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Progress pengecekan {item.progress}% • Upload terakhir {item.uploadedAt}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Riwayat"
          title="Riwayat upload"
          description="Lihat file yang sudah masuk, statusnya saat ini, dan catatan yang perlu dibawa kembali ke PIC bila ada revisi."
          actions={
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="ready">Siap dipakai</SelectItem>
                <SelectItem value="review">Perlu revisi</SelectItem>
                <SelectItem value="check">Sedang dicek</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        <Card>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={batchRegistryDetailed}
              searchPlaceholder="Cari channel, PIC, atau batch..."
              onRowClick={(row) => {
                setSelectedUpload(row);
                setDetailOpen(true);
              }}
            />
          </CardContent>
        </Card>
      </section>

      <DetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={selectedUpload.batchId}
        description="Ringkasan hasil pengecekan file yang dipilih."
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Status file</div>
                <div className="mt-2 text-xl tracking-tight text-foreground">
                  {uploadStatusLabel(selectedUpload.status)}
                </div>
              </div>
              <Badge variant={toneToBadge(uploadStatusTone(selectedUpload.status))}>
                {selectedUpload.channel}
              </Badge>
            </div>
          </div>

          {[
            ["Channel", selectedUpload.channel],
            ["Periode", selectedUpload.period],
            ["PIC", selectedUpload.owner],
            ["Catatan file", selectedUpload.reconciliation],
            ["Diperbarui", selectedUpload.updatedAt],
          ].map(([label, value]) => (
            <div key={label} className="kv-row">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="max-w-[58%] text-right text-sm font-medium text-foreground">
                {value}
              </span>
            </div>
          ))}

          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="text-xs font-medium text-muted-foreground">Masalah yang ditemukan</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {uploadIssueSummary(selectedUpload)}
            </p>
          </div>

          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="text-xs font-medium text-muted-foreground">Langkah berikutnya</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {uploadNextStep(selectedUpload)}
            </p>
          </div>

          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="text-xs font-medium text-muted-foreground">Daftar SKU acuan FOX</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {foxAcceptedSkus.join(", ")}
            </p>
          </div>
        </div>
      </DetailSheet>
    </div>
  );
}
