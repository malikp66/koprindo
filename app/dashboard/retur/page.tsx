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
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
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
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  qty: { label: "Qty Retur", color: "var(--chart-4)" },
  value: { label: "Alasan", color: "var(--chart-1)" },
} satisfies ChartConfig;

const returnSummaryIcons = [
  { icon: Waves, iconClassName: "border border-sky-200/70 bg-sky-50 text-slate-900" },
  { icon: PackageOpen, iconClassName: "border border-sky-200/70 bg-sky-50 text-slate-900" },
  { icon: Warehouse, iconClassName: "border border-sky-200/70 bg-sky-50 text-slate-900" },
  { icon: ShieldCheck, iconClassName: "border border-sky-200/70 bg-sky-50 text-slate-900" },
] as const;

export default function ReturPage() {
  const [selectedReturn, setSelectedReturn] = React.useState<ReturnRow>(returnLedger[0]);

  const columns: ColumnDef<ReturnRow>[] = [
    { accessorKey: "date", header: () => <SortableHeader label="Tanggal" /> },
    { accessorKey: "id", header: "ID Retur" },
    { accessorKey: "channel", header: "Channel" },
    { accessorKey: "branch", header: () => <SortableHeader label="Cabang" /> },
    { accessorKey: "outlet", header: "Outlet" },
    { accessorKey: "qty", header: () => <SortableHeader label="Qty" />, cell: ({ row }) => <span className="tabular">{row.original.qty}</span> },
    { accessorKey: "reason", header: "Alasan" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={row.original.status === "Resolved" ? "success" : row.original.status === "Pending" ? "warning" : "info"}>{row.original.status}</Badge> },
    { accessorKey: "impact", header: "Impact" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operational Exceptions"
        title="Exception Control and Sell-out Correction"
        description="Pusat penanganan exception untuk retur, koreksi distribusi, dan kasus outlet bermasalah yang memengaruhi sell-out efektif serta risk event di control tower."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success("Export data retur disiapkan", { description: "Sedang menyusun laporan pengembalian barang." })}>Export Data</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">Input Retur</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Input Retur Manual</DialogTitle>
                  <DialogDescription>Form koreksi manual untuk kasus retur outlet yang perlu dicatat sebelum masuk ke workflow persetujuan.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select defaultValue="indomaret">
                    <SelectTrigger><SelectValue placeholder="Channel" /></SelectTrigger>
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
                  <Input placeholder="Operator" defaultValue="Gudang Koprindo" />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => toast.info("Input retur dibatalkan")}>Batal</Button>
                  <Button onClick={() => toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), { loading: "Menyimpan...", success: "Data retur berhasil disimpan." })}>Simpan Retur</Button>
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
        )})}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="surface-noise">
          <CardHeader>
            <CardTitle>Exception Trend and Composition</CardTitle>
            <CardDescription>Visualisasi untuk membaca volume retur dan alasan dominan sebagai dasar prioritas penanganan exception.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trend" className="space-y-4">
              <TabsList>
                <TabsTrigger value="trend">Trend</TabsTrigger>
                <TabsTrigger value="composition">Composition</TabsTrigger>
              </TabsList>
              <TabsContent value="trend" className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCcw className="h-4 w-4" />
                  Tren qty retur
                </div>
                <ChartContainer config={chartConfig} className="mt-4 min-h-[240px] w-full">
                  <BarChart data={trendData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="qty" fill="var(--color-qty)" radius={8} />
                  </BarChart>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="composition" className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                <div className="text-sm text-muted-foreground">Komposisi alasan retur</div>
                <ChartContainer config={chartConfig} className="mt-4 min-h-[240px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie data={returnReasons} dataKey="value" nameKey="label" innerRadius={55} outerRadius={86}>
                      {returnReasons.map((entry, index) => (
                        <Cell
                          key={entry.label}
                          fill={["var(--chart-4)", "var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-5)"][index]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Selected Exception</CardTitle>
            <CardDescription>Detail kasus terpilih untuk menunjukkan koreksi sell-out efektif dan dampak ke modul risk control.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["ID Retur", selectedReturn.id],
              ["Cabang", selectedReturn.branch],
              ["Outlet", selectedReturn.outlet],
              ["Qty", `${selectedReturn.qty} unit`],
              ["Status", selectedReturn.status],
              ["Impact", selectedReturn.impact],
            ].map(([label, value]) => (
              <div key={label} className="kv-row">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
            <div className="rounded-2xl border border-border/25 bg-accent/20 p-4 text-sm leading-relaxed text-muted-foreground">
              Sell-out efektif akan dikoreksi setelah status retur disetujui. Event exception ini menjadi bagian dari jejak risiko untuk anomaly, stock quality, dan evaluasi cabang.
            </div>
            <Button className="w-full" onClick={() => toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), { loading: "Meneruskan data...", success: "Item retur diteruskan ke tim exception untuk direview." })}>Teruskan ke review exception</Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Exception Ledger"
          title="Return Ledger"
          description="Daftar retur per outlet, alasan, status tindak lanjut, dan dampak ke sell-out untuk menjaga kontrol exception yang konkret."
        />
        <Card>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={returnLedger}
              searchPlaceholder="Cari retur, cabang, atau outlet..."
              onRowClick={setSelectedReturn}
              toolbar={
                <>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Channel</SelectItem>
                      <SelectItem value="alfamart">Alfamart</SelectItem>
                      <SelectItem value="indomaret">Indomaret</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all-status">
                    <SelectTrigger className="w-[170px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-status">Semua Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
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
          {
            icon: AlertTriangle,
            title: "Repeated outlet issues",
            note: "11 outlet membutuhkan review coverage, handling, dan monitoring stok yang lebih ketat.",
          },
          {
            icon: Warehouse,
            title: "Branch concentration",
            note: "Surabaya Timur dan Bandung Inti mendominasi volume retur dan perlu akar masalah yang lebih jelas.",
          },
          {
            icon: ShieldAlert,
            title: "Risk engine linkage",
            note: "Retur periode aktif harus menjadi input untuk sell-out efektif, quality score, dan flag risk lintas modul.",
          },
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
    </div>
  );
}
