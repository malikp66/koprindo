"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  FileSpreadsheet,
  FileUp,
  History,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { DetailSheet } from "@/components/dashboard/detail-sheet";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { toneToBadge } from "@/components/dashboard/tone";
import { WorkflowStateCard } from "@/components/dashboard/workflow-state-card";
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
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  batchRegistryDetailed,
  batchWorkflowSteps,
  canonicalBatchStatusSummary,
  demoScenario,
  reconciliationCheckpoints,
  sourceIntakeContracts,
  uploadStatus,
} from "@/lib/mock-data";

type UploadRow = (typeof batchRegistryDetailed)[number];

function batchStatusTone(status: UploadRow["status"]) {
  if (status === "published") return "success";
  if (status === "rejected") return "danger";
  if (status === "exception_review") return "warning";
  return "info";
}

const intakeMetrics = [
  { label: "Batch Published", value: demoScenario.qualityPublishedCount, note: "Lolos quality gate bulan aktif" },
  { label: "Batch Provisional", value: demoScenario.qualityProvisionalCount, note: "Menunggu review manual" },
  { label: "Schema Match Rate", value: demoScenario.schemaMatchRate, note: "Kolom wajib tervalidasi" },
  { label: "Freshness", value: demoScenario.refreshTimestamp, note: "Sinkron terakhir control tower" },
];

export default function UploadPage() {
  const [demoMode, setDemoMode] = React.useState<"beras" | "fox">("fox");
  const [selectedSourceId, setSelectedSourceId] = React.useState<(typeof sourceIntakeContracts)[number]["id"]>("sell-out");
  const [selectedUpload, setSelectedUpload] = React.useState<UploadRow>(batchRegistryDetailed[0]);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const selectedSource = sourceIntakeContracts.find((item) => item.id === selectedSourceId) ?? sourceIntakeContracts[0];

  const sourceValidationRows = [
    ["Source contract", selectedSource.title, "info"],
    ["Required fields", `${selectedSource.requiredFields.length} field minimum`, "success"],
    ["Source owner", selectedSource.owner, "info"],
    ["Quality gate", demoMode === "fox" ? "Masuk jalur publish setelah review selesai" : "Masuk exception review karena konten tidak sesuai kontrak", demoMode === "fox" ? "success" : "warning"],
  ] as const;

  const columns: ColumnDef<UploadRow>[] = [
    { accessorKey: "batchId", header: () => <SortableHeader label="Batch ID" />, cell: ({ row }) => <span className="font-medium">{row.original.batchId}</span> },
    { accessorKey: "sourceType", header: "Source Type" },
    { accessorKey: "channel", header: () => <SortableHeader label="Channel" /> },
    { accessorKey: "period", header: "Periode" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={batchStatusTone(row.original.status)}>{row.original.status}</Badge> },
    { accessorKey: "qualityScore", header: () => <SortableHeader label="Quality" />, cell: ({ row }) => <span className="tabular">{row.original.qualityScore}</span> },
    { accessorKey: "reconciliation", header: "Reconciliation" },
    { accessorKey: "owner", header: "Owner" },
    { accessorKey: "updatedAt", header: () => <SortableHeader label="Updated" /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Data Intake"
        title="Batch Intake and Validation"
        description="Pusat penerimaan batch operasional untuk registrasi file, schema validation, klasifikasi data, quality gate, dan publish decision sebelum data masuk ke monitoring."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2" onClick={() => toast.success("Template disiapkan", { description: "Download file master akan segera dimulai." })}>
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
                  <DialogTitle>Upload Batch Retail</DialogTitle>
                  <DialogDescription>
                    Pilih channel, periode, dan identitas PIC. Workflow validasi batch akan berjalan setelah file diterima.
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
                  <Input placeholder="Kode PIC" defaultValue="PIC-ALF-001" />
                </div>
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Drop file di sini atau pilih file dari perangkat.
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => toast.info("Registrasi dibatalkan")}>Batal</Button>
                  <Button onClick={() => toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), { loading: "Mengunggah data...", success: "Batch berhasil diregistrasikan ke database." })}>Registrasikan Batch</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {intakeMetrics.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
              <div className="mt-3 text-xl tracking-tight tabular text-foreground">{item.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{item.note}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {uploadStatus.map((item) => (
          <Card key={item.channel}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{item.channel}</CardTitle>
                <Badge variant={toneToBadge(item.tone)}>{item.status}</Badge>
              </div>
              <CardDescription>{item.pic}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">Upload terakhir: {item.uploadedAt}</div>
              <Progress value={item.progress} />
              <div className="text-xs font-medium text-muted-foreground">Workflow {item.progress}%</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="surface-noise">
          <CardHeader>
            <CardTitle>Source Intake Contracts</CardTitle>
            <CardDescription>Setiap source type memiliki kontrak intake, owner, cadence, dan output yang berbeda. Ini menjadi dasar kontrak backend intake.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedSourceId} onValueChange={(value) => setSelectedSourceId(value as (typeof sourceIntakeContracts)[number]["id"])} className="space-y-4">
              <TabsList className="flex h-auto flex-wrap justify-start">
                {sourceIntakeContracts.map((source) => (
                  <TabsTrigger key={source.id} value={source.id}>
                    {source.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {sourceIntakeContracts.map((source) => (
                <TabsContent key={source.id} value={source.id} className="space-y-4">
                  <div className="grid gap-3 md:grid-cols-3">
                    {[
                      ["Owner", source.owner],
                      ["Cadence", source.cadence],
                      ["Status", source.status],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                        <div className="text-xs font-medium text-muted-foreground">{label}</div>
                        <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                    <div className="text-sm font-medium text-foreground">Contract note</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{source.note}</p>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    {source.requiredFields.map((field) => (
                      <div key={field} className="rounded-2xl border border-border/25 bg-white/80 px-4 py-3 text-sm text-muted-foreground">
                        {field}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-border/25 bg-accent/20 p-4 text-sm leading-relaxed text-muted-foreground">
                    {source.output}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Canonical Batch Status</CardTitle>
              <CardDescription>Status batch yang perlu disediakan backend agar pipeline intake, reconciliation, dan publish dapat ditelusuri.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {canonicalBatchStatusSummary.map((item) => (
                <div key={item.status} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.status}</div>
                      <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.note}</div>
                    </div>
                    <Badge variant={toneToBadge(item.tone)}>{item.count}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <Card className="surface-noise">
          <CardHeader>
            <CardTitle>Dropzone and Batch Metadata</CardTitle>
            <CardDescription>Area kerja untuk registrasi batch, identitas pengirim, dan metadata sumber sebelum quality gate dijalankan.</CardDescription>
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
                  <SelectValue placeholder="Periode laporan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sep-2026">September 2026</SelectItem>
                  <SelectItem value="agu-2026">Agustus 2026</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Kode PIC" defaultValue="PIC-ALF-001" />
              <Input placeholder="Nama PIC" defaultValue="Rina Prameswari" />
            </div>
            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-8 text-center">
              <UploadCloud className="mx-auto h-10 w-10 text-primary" />
              <h3 className="mt-4 text-lg font-medium tracking-tight text-foreground">Drop CSV / XLSX di sini</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Sistem akan mengecek kolom wajib, periode, duplikasi batch, format angka, dan kontrak source untuk `{selectedSource.title}`.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={() => toast.info("Dialog penelusuran file dibuka.")}>Pilih File</Button>
                <Button variant={demoMode === "beras" ? "default" : "secondary"} onClick={() => { setDemoMode("beras"); toast.success("Batch review termuat"); }}>Muat Batch Review</Button>
                <Button variant={demoMode === "fox" ? "default" : "secondary"} onClick={() => { setDemoMode("fox"); toast.success("Batch operasional termuat"); }}>Muat Batch Publish</Button>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                ["Nama file", demoMode === "fox" ? "alfamart_sep_2026.csv" : "non_fox_sep_2026.csv"],
                ["Ukuran", demoMode === "fox" ? "2.4 MB" : "1.3 MB"],
                ["Estimasi row", demoMode === "fox" ? "1.284" : "814"],
                ["Tipe", "CSV"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-accent/20 p-4">
                  <div className="text-xs font-medium text-muted-foreground">{label}</div>
                  <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publish Decision Panel</CardTitle>
            <CardDescription>Hasil validasi yang menentukan apakah batch dapat dipublish ke control tower atau harus tetap berada di jalur review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {sourceValidationRows.map(([label, value, tone]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-2xl border border-border/25 bg-accent/20 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
                </div>
                <Badge variant={tone === "success" ? "success" : tone === "info" ? "info" : "warning"}>{tone}</Badge>
              </div>
            ))}
            <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Quality gate policy
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Batch dengan quality score di bawah ambang tidak boleh masuk executive view tanpa flag. Manual review tetap menjadi kontrol akhir untuk data finansial dan KPI kritikal.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Audit Trail"
          title="Batch Registry"
          description="Riwayat batch masuk, status proses, jumlah row, dan issue count untuk menjaga lineage data dari file mentah sampai publish decision."
          actions={
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="validating">Validating</SelectItem>
              </SelectContent>
            </Select>
          }
        />
        <Card>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={batchRegistryDetailed}
              searchPlaceholder="Cari batch, source type, atau owner..."
              onRowClick={(row) => {
                setSelectedUpload(row);
                setDetailOpen(true);
              }}
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <WorkflowStateCard
          title="Batch Workflow"
          description="Workflow operasional yang memperlihatkan perjalanan batch dari intake, validasi, review, hingga publish ke control tower."
          steps={batchWorkflowSteps}
        />

        <Card>
          <CardHeader>
            <CardTitle>Reconciliation Checkpoints</CardTitle>
            <CardDescription>Checkpoint yang menegaskan kapan sebuah batch boleh lanjut ke monitoring dan kapan harus dialihkan ke exception review.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {reconciliationCheckpoints.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/25 bg-accent/20 p-4 text-sm leading-relaxed text-muted-foreground">
                <div className="flex items-center justify-between gap-3 font-medium text-foreground">
                  <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                    {item.title}
                  </div>
                  <Badge variant={toneToBadge(item.tone)}>{item.value}</Badge>
                </div>
                <p className="mt-2">{item.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <DetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={selectedUpload.batchId}
        description="Detail batch untuk lineage, review state, dan publish posture dari batch terpilih."
      >
        <div className="space-y-3">
          {[
            ["Source type", selectedUpload.sourceType],
            ["Channel", selectedUpload.channel],
            ["Periode", selectedUpload.period],
            ["Owner", selectedUpload.owner],
            ["Quality score", selectedUpload.qualityScore],
            ["Issue count", `${selectedUpload.issueCount}`],
            ["Status", selectedUpload.status],
            ["Reconciliation", selectedUpload.reconciliation],
            ["Updated", selectedUpload.updatedAt],
          ].map(([label, value]) => (
            <div key={label} className="kv-row">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-medium text-foreground">{value}</span>
            </div>
          ))}
          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="text-xs font-medium text-muted-foreground">Review note</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Batch ini mengikuti refresh control tower {demoScenario.refreshTimestamp}. Angka executive hanya boleh tampil final jika status publish selesai atau sudah diberi flag provisional.
            </p>
          </div>
        </div>
      </DetailSheet>
    </div>
  );
}
