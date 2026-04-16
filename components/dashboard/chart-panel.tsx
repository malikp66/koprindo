"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { MoreHorizontal } from "lucide-react";
import { ChannelLogo } from "@/components/dashboard/channel-logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const chartConfig = {
  alfamart: { label: "Alfamart", color: "#B7EB76" },
  aksesmu: { label: "AksesMu", color: "#FF8730" },
  indomaret: { label: "Indomaret", color: "#715DE3" },
} satisfies ChartConfig;

const revenueSeries = [
  { month: "Jan", alfamart: 14000, aksesmu: 8000, indomaret: 12000 },
  { month: "Feb", alfamart: 32000, aksesmu: 21000, indomaret: 29000 },
  { month: "Mar", alfamart: 25000, aksesmu: 15000, indomaret: 21000 },
  { month: "Apr", alfamart: 18000, aksesmu: 11000, indomaret: 15000 },
  { month: "Mei", alfamart: 42643.24, aksesmu: 24000, indomaret: 32000 },
  { month: "Jun", alfamart: 38000, aksesmu: 26000, indomaret: 34000 },
  { month: "Jul", alfamart: 15000, aksesmu: 9000, indomaret: 12000 },
  { month: "Agu", alfamart: 30000, aksesmu: 18000, indomaret: 26000 },
  { month: "Sep", alfamart: 17000, aksesmu: 11000, indomaret: 15000 },
  { month: "Okt", alfamart: 31000, aksesmu: 19000, indomaret: 27000 },
  { month: "Nov", alfamart: 13000, aksesmu: 8000, indomaret: 11000 },
  { month: "Des", alfamart: 19000, aksesmu: 12000, indomaret: 17000 },
];

const channelContext = {
  alfamart: {
    label: "Alfamart",
    detail: "206 outlet aktif",
    color: "#B7EB76",
  },
  aksesmu: {
    label: "AksesMu",
    detail: "400 pembayaran tervalidasi",
    color: "#FF8730",
  },
  indomaret: {
    label: "Indomaret",
    detail: "312 outlet aktif",
    color: "#715DE3",
  },
} as const;

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function SelloutChartPanel() {
  const [activeMonth, setActiveMonth] = React.useState("Mei");

  return (
    <Card>
      <CardHeader className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="pr-12 lg:pr-0">
          <CardTitle className="text-xl tracking-tight text-foreground">Ringkasan Penjualan dan Pendapatan</CardTitle>
          <div className="mt-4 flex items-center gap-3">
            <div className="text-[2rem] leading-none tabular tracking-tight text-foreground">Rp98,643.24</div>
            <div className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">+8.4%</div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              Total Penjualan
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF8730]" />
              Total Pendapatan
            </span>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-col items-start gap-5 lg:mt-0 lg:w-auto lg:items-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="absolute right-6 top-6 lg:static rounded-2xl border border-border/30 bg-white p-2.5 text-muted-foreground shadow-soft transition-colors hover:bg-accent/40 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Opsi Grafik</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.success("Export PNG sedang disiapkan")}>
                Unduh sebagai PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Export CSV sedang didownload", { description: "Data mencakup seluruh channel terpilih."})}>
                Unduh sebagai CSV
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info("Menampilkan raw data dalam view tabel")}>
                Lihat data mentah
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="grid w-full grid-cols-1 gap-4 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3 lg:justify-items-end">
            <div className="flex min-w-0 items-center gap-3">
              <ChannelLogo channel="alfamart" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/30 bg-white p-2 shadow-soft" />
              <div className="min-w-0">
                <div className="font-medium text-foreground leading-none">Alfamart</div>
                <div className="mt-1 text-xs">206 outlet aktif</div>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <ChannelLogo channel="aksesmu" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/30 bg-white p-2 shadow-soft" />
              <div className="min-w-0">
                <div className="font-medium text-foreground leading-none">AksesMu</div>
                <div className="mt-1 text-xs">400 pembayaran</div>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <ChannelLogo channel="indomaret" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/30 bg-white p-2 shadow-soft" />
              <div className="min-w-0">
                <div className="font-medium text-foreground leading-none">Indomaret</div>
                <div className="mt-1 text-xs">312 outlet aktif</div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[340px] w-full">
          <BarChart
            data={revenueSeries}
            margin={{ top: 24, right: 10, left: -8, bottom: 0 }}
            barGap={2}
            className="focus:outline-none [&_path]:outline-none [&_rect]:outline-none"
          >
            <CartesianGrid vertical={false} stroke="hsl(160 10% 92%)" strokeDasharray="3 3" />
            <YAxis
              domain={[0, 45000]}
              tickCount={6}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
              style={{ fontSize: "12px", fill: "hsl(220 6% 50%)" }}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              style={{ fontSize: "12px", fill: "hsl(220 6% 50%)" }}
            />
            <ChartTooltip
              cursor={{ fill: "hsla(198, 50%, 88%, 0.38)", radius: 12 }}
              content={
                <ChartTooltipContent
                  className="min-w-[16rem]"
                  hideIndicator
                  labelFormatter={(value, payload) => {
                    const total = payload?.reduce((sum, item) => sum + Number(item.value ?? 0), 0) ?? 0;

                    return (
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            {value}
                          </div>
                          <div className="mt-1 text-sm font-semibold text-foreground">Ringkasan per channel</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            Total
                          </div>
                          <div className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                            {currencyFormatter.format(total)}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                  formatter={(value, name) => {
                    const channel = channelContext[name as keyof typeof channelContext];

                    return (
                      <div className="flex w-full items-center justify-between gap-4 rounded-lg bg-accent/35 px-2.5 py-2">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: channel.color }}
                          />
                          <div className="grid gap-0.5">
                            <span className="text-sm font-medium text-foreground">{channel.label}</span>
                            <span className="text-[11px] text-muted-foreground">{channel.detail}</span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold tabular-nums text-foreground">
                          {currencyFormatter.format(Number(value))}
                        </span>
                      </div>
                    );
                  }}
                />
              }
              trigger="click"
            />
            <Bar dataKey="alfamart" radius={[6, 6, 0, 0]} barSize={12} fill="var(--color-alfamart)" style={{ outline: "none" }}>
                {revenueSeries.map((entry) => (
                  <Cell key={`alfa-${entry.month}`} cursor="pointer" opacity={entry.month === activeMonth ? 1 : 0.3} onClick={() => setActiveMonth(entry.month)} style={{ outline: "none" }} />
                ))}
            </Bar>
            <Bar dataKey="aksesmu" radius={[6, 6, 0, 0]} barSize={12} fill="var(--color-aksesmu)" style={{ outline: "none" }}>
                {revenueSeries.map((entry) => (
                  <Cell key={`akses-${entry.month}`} cursor="pointer" opacity={entry.month === activeMonth ? 1 : 0.3} onClick={() => setActiveMonth(entry.month)} style={{ outline: "none" }} />
                ))}
            </Bar>
            <Bar dataKey="indomaret" radius={[6, 6, 0, 0]} barSize={12} fill="var(--color-indomaret)" style={{ outline: "none" }}>
                {revenueSeries.map((entry) => (
                  <Cell key={`indo-${entry.month}`} cursor="pointer" opacity={entry.month === activeMonth ? 1 : 0.3} onClick={() => setActiveMonth(entry.month)} style={{ outline: "none" }} />
                ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
