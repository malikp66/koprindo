"use client";

import * as React from "react";
import {
  Crown,
  Flame,
  MoreHorizontal,
  PackageCheck,
  ReceiptText,
  UsersRound,
  Zap,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import {
  buildProvinceCityRanking,
  buildProvinceMetric,
  IndonesiaMap,
} from "@/components/dashboard/indonesia-map";
import { PageHeader } from "@/components/dashboard/page-header";
import { SelloutChartPanel } from "@/components/dashboard/chart-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { demoScenario } from "@/lib/mock-data";

// Metric cards — data berbasis PRD Koprindo FOX 2026
const cards = [
  {
    label: "Total Sell-out",
    value: demoScenario.totalSellOutShort,
    delta: "+11.3%",
    tone: "info" as const,
    trend: [3.2, 3.4, 3.5, 3.7, 3.8, 4.18],
  },
  {
    label: "Outlet Aktif",
    value: demoScenario.activeOutletCount,
    delta: "+4.8%",
    tone: "success" as const,
    trend: [28000, 29500, 31000, 32000, 33000, 34001],
  },
  {
    label: "Total Pendapatan",
    value: demoScenario.totalRevenue,
    delta: "+8.4%",
    tone: "success" as const,
    trend: [28, 30, 31, 30, 32, 33],
  },
  {
    label: "Total Retur",
    value: demoScenario.returnQty,
    delta: "-0.6%",
    tone: "warning" as const,
    trend: [20000, 19500, 18500, 18200, 17800, 17420],
  },
];

// SKU prioritas FOX untuk ritel modern nasional
const topProducts = [
  {
    value: "FOX Premium",
    title: "FOX Premium",
    subtitle: "Core SKU entry / volume driver",
    price: "840 - 1.020",
    icon: Flame,
    iconColor: "bg-primary/14 text-primary",
  },
  {
    value: "FOX Borobudur",
    title: "FOX Borobudur",
    subtitle: "Disposable lighter untuk rotasi cepat",
    price: "840",
    icon: PackageCheck,
    iconColor: "bg-primary/14 text-primary",
  },
  {
    value: "FOX Rocket",
    title: "FOX Rocket",
    subtitle: "Entry line dengan step-up ringan",
    price: "1.350",
    icon: Zap,
    iconColor: "bg-sky-500/14 text-sky-300",
  },
  {
    value: "FOX Zenith 905 Slim",
    title: "FOX Zenith 905 Slim",
    subtitle: "Test trade-up SKU modern retail",
    price: "2.400 - 3.000",
    icon: ReceiptText,
    iconColor: "text-primary",
  },
  {
    value: "FOX Zenith Alpha",
    title: "FOX Zenith Alpha",
    subtitle: "Selective premium accessible",
    price: "3.000",
    icon: Crown,
    iconColor: "bg-amber-500/14 text-amber-300",
  },
];

const ALL_PRODUCTS_VALUE = "all-products";

export default function DashboardPage() {
  const defaultProvince = React.useMemo(() => buildProvinceMetric("Jawa Barat"), []);
  const [activeProvince, setActiveProvince] = React.useState(defaultProvince);
  const [selectedProduct, setSelectedProduct] = React.useState(ALL_PRODUCTS_VALUE);
  const activeProduct = React.useMemo(
    () => topProducts.find((product) => product.value === selectedProduct) ?? null,
    [selectedProduct],
  );
  const activeProductLabel = activeProduct?.title ?? "Semua Produk";
  const rankingLabel =
    activeProductLabel === "Semua Produk" ? "semua produk" : activeProductLabel;
  const topCityRanking = React.useMemo(
    () => buildProvinceCityRanking(activeProvince.label, activeProductLabel),
    [activeProductLabel, activeProvince.label],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Portal Operasional"
        title="Ringkasan Operasional"
        description="Ringkasan utama untuk memantau penjualan keluar, cakupan wilayah, kualitas distribusi, dan indikator risiko yang merangkum kondisi operasional aktif."
      />

      {/* Row 1 — Metric Cards */}
      <section className="grid gap-4 xl:grid-cols-4">
        {cards.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      {/* Row 2 — Bar Chart + Top Products */}
      <section className="grid gap-4 xl:grid-cols-[1.9fr_0.98fr]">
        <SelloutChartPanel />
        <Card className="flex h-full flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-xl tracking-tight">SKU Prioritas FOX</CardTitle>
              <CardDescription>Susunan SKU yang paling relevan untuk ritel modern nasional</CardDescription>
            </div>
            <button
              type="button"
              className="rounded-2xl border border-border/70 bg-card p-2 text-muted-foreground shadow-soft transition-colors hover:bg-accent/70"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2">
            {topProducts.map((item) => (
              <div
                key={item.title}
                className={`flex min-h-[64px] flex-1 items-center gap-4 rounded-xl border px-3 py-2.5 transition-colors ${
                  activeProduct?.value === item.value
                    ? "border-primary/20 bg-primary/10"
                    : "border-transparent hover:bg-accent/70"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconColor}`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">
                    {item.title}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">{item.subtitle}</div>
                </div>
                <div className="tabular text-sm font-semibold text-foreground">
                  Rp{item.price}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Row 3 — Sales by Regions */}
      <section>
        <Card>
          <CardHeader className="flex flex-col gap-4 pb-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="text-xl tracking-tight">Penjualan per Provinsi</CardTitle>
              <CardDescription>Pantau penjualan pada tiap provinsi distribusi</CardDescription>
            </div>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="h-12 w-full rounded-2xl border-border/70 bg-card px-4 text-base shadow-soft sm:w-[220px]">
                <SelectValue placeholder="Pilih produk FOX" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_PRODUCTS_VALUE}>Semua Produk</SelectItem>
                {topProducts.map((product) => (
                  <SelectItem key={product.value} value={product.value}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="grid gap-6 xl:grid-cols-[minmax(220px,0.58fr)_minmax(0,1.3fr)_minmax(300px,0.76fr)] xl:gap-7">
            <div className="space-y-4 xl:max-w-[280px]">
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  Provinsi dengan kinerja terbaik
                </div>
                <div className="mt-2 text-2xl tracking-tight tabular font-semibold text-foreground">
                  {activeProvince.revenue}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{activeProvince.label}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  Pertumbuhan penjualan
                </div>
                <div className="mt-2 text-2xl tracking-tight tabular font-semibold text-foreground">
                  {activeProvince.growth}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{activeProvince.label} vs bulan sebelumnya</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-accent/70 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/14">
                    <UsersRound className="h-3.5 w-3.5 text-sky-300" />
                  </span>
                  Cakupan outlet
                </div>
                <div className="mt-3 text-xl tabular font-semibold text-foreground">{activeProvince.coverage}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-accent/70 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/14">
                    <ReceiptText className="h-3.5 w-3.5 text-primary" />
                  </span>
                  Dampak retur
                </div>
                <div className="mt-3 text-xl tabular font-semibold text-foreground">{activeProvince.returns}</div>
              </div>
            </div>
            <IndonesiaMap activeProvince={activeProvince} onProvinceSelect={setActiveProvince} />
            <div className="flex min-h-0 flex-col xl:max-h-[468px] xl:self-start">
              <div className="border-b border-border/20 pb-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Kota dan cabang teratas
                </div>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                  {activeProvince.label}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ranking {rankingLabel} dari penjualan tertinggi ke terendah.
                </p>
              </div>
              <div className="mt-4 flex-1 overflow-y-auto pr-2 xl:max-h-[372px]">
                <div className="space-y-3">
                  {topCityRanking.map((item, index) => (
                    <div
                      key={`${item.city}-${item.branch}`}
                      className="border-b border-border/15 pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary/14 px-2 text-xs font-semibold text-primary">
                              #{index + 1}
                            </span>
                            <div className="truncate text-sm font-semibold text-foreground">{item.city}</div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">{item.branch}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold tabular text-foreground">{item.sellOut}</div>
                          <div className="mt-1 text-xs text-emerald-300">{item.growth}</div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          Outlet aktif
                          <div className="mt-1 text-sm font-medium text-foreground">{item.activeOutlets}</div>
                        </div>
                        <div>
                          Catatan
                          <div className="mt-1 text-sm font-medium text-foreground">{item.note}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
