"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts";
import {
  AlertTriangle,
  PackageOpen,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  Warehouse,
  Waves,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { DetailSheet } from "@/components/dashboard/detail-sheet";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { returnLedger, returnReasons, returnSummary } from "@/lib/mock-data";

type ReturnRow = (typeof returnLedger)[number];

const trendData = [
  { month: "Apr", qty: 940 },
  { month: "Mei", qty: 1240 },
  { month: "Jun", qty: 1110 },
  { month: "Jul", qty: 1580 },
  { month: "Agu", qty: 1495 },
  { month: "Sep", qty: 1742 },
];

const chartConfig = {
  qty: { label: "Qty Retur", color: "hsl(var(--primary))" },
  bocor: { label: "Bocor", color: "#f59e0b" },
  rusak: { label: "Rusak Fisik", color: "#f97316" },
  salah: { label: "Salah Kirim", color: "#84cc16" },
  kemasan: { label: "Kemasan Cacat", color: "#14b8a6" },
  lainnya: { label: "Lainnya", color: "#38bdf8" },
} satisfies ChartConfig;

const returnReasonFills = [
  "url(#retur-reason-bocor)",
  "url(#retur-reason-rusak)",
  "url(#retur-reason-salah)",
  "url(#retur-reason-kemasan)",
  "url(#retur-reason-lainnya)",
];

const returnSummaryIcons = [
  { icon: Waves, iconClassName: "border border-sky-200/70 bg-sky-50 text-slate-900" },
  { icon: PackageOpen, iconClassName: "border border-sky-200/70 bg-sky-50 text-slate-900" },
  { icon: Warehouse, iconClassName: "border border-sky-200/70 bg-sky-50 text-slate-900" },
  { icon: ShieldCheck, iconClassName: "border border-sky-200/70 bg-sky-50 text-slate-900" },
] as const;

function returnStatusTone(status: ReturnRow["status"]) {
  if (status === "Selesai") return "success";
  if (status === "Menunggu") return "warning";
  return "info";
}

export default function ReturPage() {
  const [selectedReturn, setSelectedReturn] = React.useState<ReturnRow>(returnLedger[0]);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const columns: ColumnDef<ReturnRow>[] = [
    { accessorKey: "date", header: () => <SortableHeader label="Tanggal" /> },
    { accessorKey: "id", header: "ID Retur" },
    { accessorKey: "channel", header: "Channel" },
    { accessorKey: "branch", header: () => <SortableHeader label="Cabang" /> },
    { accessorKey: "outlet", header: "Outlet" },
    { accessorKey: "qty", header: () => <SortableHeader label="Qty" />, cell: ({ row }) => <span className="tabular">{row.original.qty}</span> },
    { accessorKey: "reason", header: "Alasan" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={returnStatusTone(row.original.status)}>{row.original.status}</Badge> },
    { accessorKey: "impact", header: "Dampak" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Retur"
        title="Catat, Pantau, dan Selesaikan Kasus Retur"
        description="Halaman kerja untuk mencatat retur, melihat pola kasus, dan memastikan dampaknya ke penjualan bisa segera ditangani oleh tim terkait."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success("Data retur sedang disiapkan")}>Export Data</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Input Retur</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Catat retur baru</DialogTitle>
                  <DialogDescription>Masukkan detail retur agar tim operasional bisa segera menindaklanjuti kasusnya.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select defaultValue="indomaret">
                    <SelectTrigger><SelectValue placeholder="Pilih channel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alfamart">Alfamart</SelectItem>
                      <SelectItem value="indomaret">Indomaret</SelectItem>
                      <SelectItem value="aksesmu">AksesMu</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Nama cabang" defaultValue="Surabaya Timur" />
                  <Input placeholder="ID outlet" defaultValue="IDM-230144" />
                  <Input placeholder="Qty retur" defaultValue="180" />
                  <Input placeholder="Alasan retur" defaultValue="Bocor" />
                  <Input placeholder="Nama operator" defaultValue="Gudang Koprindo" />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => toast.info("Input retur dibatalkan")}>Batal</Button>
                  <Button onClick={() => toast.success("Retur berhasil dicatat")}>Simpan Retur</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {returnSummary.map((item, index) => {
          const summaryIcon = returnSummaryIcons[index];
          const SummaryIcon = summaryIcon.icon;

          return (
            <Card key={item.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
                  <div className={`flex size-9 items-center justify-center rounded-full ${summaryIcon.iconClassName}`}>
                    <SummaryIcon className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="mt-3 text-2xl tracking-tight tabular text-foreground">{item.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{item.note}</div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="surface-noise">
          <CardHeader>
            <CardTitle>Tren dan alasan retur</CardTitle>
            <CardDescription>Lihat kenaikan volume retur dan alasan dominan agar tim cepat tahu sumber masalah yang paling sering muncul.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trend" className="space-y-4">
              <TabsList>
                <TabsTrigger value="trend">Tren</TabsTrigger>
                <TabsTrigger value="composition">Komposisi</TabsTrigger>
              </TabsList>
              <TabsContent value="trend" className="rounded-3xl border border-border/30 bg-gradient-to-br from-white via-lime-50/50 to-sky-50/70 p-5 shadow-soft">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCcw className="h-4 w-4" />
                  Perubahan qty retur per bulan
                </div>
                <div className="mt-4 rounded-[1.6rem] border border-white/70 bg-white/85 p-4 shadow-[0_24px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur-sm">
                  <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
                    <BarChart data={trendData} barCategoryGap={18} margin={{ top: 12, right: 8, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="retur-trend-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.95} />
                          <stop offset="50%" stopColor="#84cc16" stopOpacity={0.85} />
                          <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.35} />
                        </linearGradient>
                        <linearGradient id="retur-trend-stroke" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="4 4" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                      <ChartTooltip
                        cursor={{ fill: "rgba(191, 219, 254, 0.2)" }}
                        content={<ChartTooltipContent indicator="line" />}
                      />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar
                        dataKey="qty"
                        fill="url(#retur-trend-fill)"
                        stroke="url(#retur-trend-stroke)"
                        strokeWidth={1.2}
                        radius={[12, 12, 6, 6]}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </TabsContent>
              <TabsContent value="composition" className="rounded-3xl border border-border/30 bg-gradient-to-br from-white via-orange-50/50 to-sky-50/60 p-5 shadow-soft">
                <div className="text-sm text-muted-foreground">Alasan retur yang paling sering muncul</div>
                <div className="mt-4 rounded-[1.6rem] border border-white/70 bg-white/85 p-4 shadow-[0_24px_50px_-34px_rgba(15,23,42,0.28)] backdrop-blur-sm">
                  <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
                    <PieChart>
                      <defs>
                        <linearGradient id="retur-reason-bocor" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#fbbf24" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                        <linearGradient id="retur-reason-rusak" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#fb923c" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                        <linearGradient id="retur-reason-salah" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#bef264" />
                          <stop offset="100%" stopColor="#84cc16" />
                        </linearGradient>
                        <linearGradient id="retur-reason-kemasan" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#5eead4" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                        <linearGradient id="retur-reason-lainnya" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#7dd3fc" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                      <ChartTooltip
                        content={<ChartTooltipContent nameKey="label" indicator="dot" />}
                      />
                      <ChartLegend
                        content={<ChartLegendContent nameKey="label" className="flex-wrap gap-3 pt-0" />}
                        verticalAlign="top"
                      />
                      <Pie
                        data={returnReasons}
                        dataKey="value"
                        nameKey="label"
                        innerRadius={62}
                        outerRadius={90}
                        paddingAngle={4}
                        cornerRadius={10}
                        stroke="rgba(255,255,255,0.95)"
                        strokeWidth={3}
                      >
                        {returnReasons.map((entry, index) => (
                          <Cell key={entry.label} fill={returnReasonFills[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kasus yang perlu ditindak</CardTitle>
            <CardDescription>Pilih kasus yang paling mendesak untuk melihat ringkasan dampak dan langkah tindak lanjutnya.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {returnLedger.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedReturn(item)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  selectedReturn.id === item.id ? "border-primary/30 bg-primary/5" : "border-border/25 bg-accent/20 hover:bg-accent/30"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">{item.branch}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{item.outlet} • {item.reason}</div>
                  </div>
                  <Badge variant={returnStatusTone(item.status)}>{item.status}</Badge>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">Qty {item.qty} unit • Dampak {item.impact}</div>
              </button>
            ))}

            <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
              <div className="text-sm font-medium text-foreground">Ringkasan kasus terpilih</div>
              <div className="mt-3 space-y-3">
                {[
                  ["ID retur", selectedReturn.id],
                  ["Cabang", selectedReturn.branch],
                  ["Outlet", selectedReturn.outlet],
                  ["Qty", `${selectedReturn.qty} unit`],
                  ["Status", selectedReturn.status],
                  ["Langkah berikutnya", selectedReturn.status === "Menunggu" ? "Segera cek kondisi outlet dan pastikan retur diproses hari ini." : selectedReturn.status === "Ditinjau" ? "Pantau progres tim yang sedang memeriksa kasus ini." : "Pastikan koreksi penjualan sudah tercatat penuh."],
                ].map(([label, value]) => (
                  <div key={label} className="kv-row">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="max-w-[56%] text-right text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-4 w-full" onClick={() => setDetailOpen(true)}>Lihat detail kasus</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Daftar Retur"
          title="Buku retur"
          description="Cari retur per outlet, lihat status penyelesaiannya, dan buka detail item untuk tindak lanjut yang lebih jelas."
        />
        <Card>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={returnLedger}
              searchPlaceholder="Cari retur, cabang, atau outlet..."
              onRowClick={(row) => {
                setSelectedReturn(row);
                setDetailOpen(true);
              }}
              toolbar={
                <>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="Channel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Channel</SelectItem>
                      <SelectItem value="alfamart">Alfamart</SelectItem>
                      <SelectItem value="indomaret">Indomaret</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-status">
                    <SelectTrigger className="w-[170px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-status">Semua Status</SelectItem>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="review">Ditinjau</SelectItem>
                      <SelectItem value="resolved">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              }
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {[
          { icon: AlertTriangle, title: "Masalah outlet berulang", note: "11 outlet perlu dipantau lebih ketat karena kasus retur muncul berulang." },
          { icon: Warehouse, title: "Cabang paling terdampak", note: "Surabaya Timur dan Bandung Inti masih mendominasi volume retur." },
          { icon: ShieldAlert, title: "Dampak ke penjualan", note: "Retur yang belum selesai akan menahan koreksi penjualan periode aktif." },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="p-5">
              <div className="flex size-9 items-center justify-center rounded-full border border-sky-200/70 bg-sky-50 text-slate-900">
                <item.icon className="h-4.5 w-4.5" />
              </div>
              <h3 className="mt-3 text-base font-medium tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <DetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={selectedReturn.id}
        description="Detail kasus retur untuk membantu tindak lanjut tim."
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Status kasus</div>
                <div className="mt-2 text-xl tracking-tight text-foreground">{selectedReturn.status}</div>
              </div>
              <Badge variant={returnStatusTone(selectedReturn.status)}>{selectedReturn.channel}</Badge>
            </div>
          </div>
          {[
            ["Cabang", selectedReturn.branch],
            ["Outlet", selectedReturn.outlet],
            ["Qty", `${selectedReturn.qty} unit`],
            ["Alasan", selectedReturn.reason],
            ["Dampak", selectedReturn.impact],
          ].map(([label, value]) => (
            <div key={label} className="kv-row">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-medium text-foreground">{value}</span>
            </div>
          ))}
          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="text-xs font-medium text-muted-foreground">Kronologi singkat</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Retur dicatat saat pengecekan outlet. Item ini perlu dipastikan selesai agar koreksi penjualan masuk dengan benar ke ringkasan periode aktif.
            </p>
          </div>
          <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
            <div className="text-xs font-medium text-muted-foreground">Langkah berikutnya</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {selectedReturn.status === "Menunggu" ? "Hubungi cabang dan outlet terkait hari ini, lalu pastikan retur benar-benar diproses." : selectedReturn.status === "Ditinjau" ? "Tunggu hasil pengecekan lapangan dan pastikan update status masuk ke sistem." : "Kasus sudah selesai. Pastikan tim penjualan memakai angka koreksi terbaru."}
            </p>
          </div>
        </div>
      </DetailSheet>
    </div>
  );
}
