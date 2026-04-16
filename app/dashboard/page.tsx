"use client";

import * as React from "react";
import {
  ChevronDown,
  Flame,
  Headphones,
  MoreHorizontal,
  PackageCheck,
  ReceiptText,
  UsersRound,
  Zap,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { CustomerOrdersChart } from "@/components/dashboard/customer-orders-chart";
import { buildProvinceMetric, IndonesiaMap } from "@/components/dashboard/indonesia-map";
import { PageHeader } from "@/components/dashboard/page-header";
import { SelloutChartPanel } from "@/components/dashboard/chart-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    label: "Total Revenue",
    value: "Rp33,4M",
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

// Top SKU FOX berdasarkan PRD — sell-out tertinggi bulan September 2026
const topProducts = [
  {
    title: "FOX Crystal Value Pack",
    subtitle: "Pocket Lighter",
    price: "180K",
    icon: Flame,
    iconColor: "bg-[#FF8730]/15 text-[#FF8730]",
  },
  {
    title: "FOX Slim Pocket",
    subtitle: "Retail Match",
    price: "299K",
    icon: PackageCheck,
    iconColor: "bg-[#715DE3]/12 text-[#715DE3]",
  },
  {
    title: "FOX Turbo Torch",
    subtitle: "Butane Canister",
    price: "399K",
    icon: Headphones,
    iconColor: "bg-sky-100 text-sky-700",
  },
  {
    title: "FOX Mini Refill",
    subtitle: "Gas Refill Pack",
    price: "240K",
    icon: Zap,
    iconColor: "bg-primary/15 text-foreground",
  },
  {
    title: "FOX Classic Match",
    subtitle: "Bulk Retail Box",
    price: "210K",
    icon: Flame,
    iconColor: "bg-[#FF8730]/12 text-[#FF8730]",
  },
];

export default function DashboardPage() {
  const defaultProvince = React.useMemo(() => buildProvinceMetric("Jawa Barat"), []);
  const [activeProvince, setActiveProvince] = React.useState(defaultProvince);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operational Portal"
        title="Operational Overview"
        description="Ringkasan manajemen untuk control tower distribusi FOX: performa sell-out, coverage wilayah, kualitas distribusi, dan indikator risiko yang merangkum siklus operasional aktif."
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
              <CardTitle className="text-xl tracking-tight">Top Products</CardTitle>
              <CardDescription>SKU terbaik bulan berjalan</CardDescription>
            </div>
            <button
              type="button"
              className="rounded-2xl border border-border/30 bg-white p-2 text-muted-foreground shadow-soft transition-colors hover:bg-accent/50"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2">
            {topProducts.map((item) => (
              <div
                key={item.title}
                className="flex min-h-[64px] flex-1 items-center gap-4 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/30"
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

      {/* Row 3 — Customer Orders + Sales by Regions */}
      <section className="grid gap-4 xl:grid-cols-[0.78fr_1.82fr]">
        {/* Customer Orders */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div>
              <CardTitle className="text-xl tracking-tight">Customer Orders</CardTitle>
              <CardDescription>1 Jan – 31 Des 2026</CardDescription>
            </div>
            <button
              type="button"
              className="rounded-2xl border border-border/30 bg-white p-2 text-muted-foreground shadow-soft transition-colors hover:bg-accent/50"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="text-3xl leading-none tracking-tight tabular text-foreground">45.637</div>
            <div className="flex items-center gap-3">
              <Badge
                variant="info"
                className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
              >
                +9.4%
              </Badge>
              <span className="text-sm text-muted-foreground">+245 outlet baru</span>
            </div>
            <CustomerOrdersChart />
          </CardContent>
        </Card>

        {/* Sales by Regions */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between pb-4">
            <div>
              <CardTitle className="text-xl tracking-tight">Sales by Province</CardTitle>
              <CardDescription>Pantau penjualan per provinsi distribusi</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-border/30 bg-white px-3 py-2 text-sm text-foreground/80 shadow-soft transition-colors hover:bg-accent/50">
                All Products <ChevronDown className="h-3.5 w-3.5" />
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-border/30 bg-white px-3 py-2 text-sm text-foreground/80 shadow-soft transition-colors hover:bg-accent/50">
                Top Provinces <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  Top Performing Province
                </div>
                <div className="mt-2 text-2xl tracking-tight tabular font-semibold text-foreground">
                  {activeProvince.revenue}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{activeProvince.label}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">
                  Revenue Growth
                </div>
                <div className="mt-2 text-2xl tracking-tight tabular font-semibold text-foreground">
                  {activeProvince.growth}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">{activeProvince.label} vs bulan sebelumnya</div>
              </div>
              <div className="rounded-2xl border border-border/25 bg-accent/20 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                    <UsersRound className="h-3.5 w-3.5 text-emerald-600" />
                  </span>
                  Coverage outlet
                </div>
                <div className="mt-3 text-xl tabular font-semibold text-foreground">{activeProvince.coverage}</div>
              </div>
              <div className="rounded-2xl border border-border/25 bg-accent/20 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                    <ReceiptText className="h-3.5 w-3.5 text-amber-600" />
                  </span>
                  Return impact
                </div>
                <div className="mt-3 text-xl tabular font-semibold text-foreground">{activeProvince.returns}</div>
              </div>
            </div>
            <IndonesiaMap activeProvince={activeProvince} onProvinceSelect={setActiveProvince} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
