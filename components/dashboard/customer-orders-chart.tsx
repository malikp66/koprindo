"use client";

import * as React from "react";
import { Area, AreaChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const orderSeries = [
  { month: "May", value: 420 },
  { month: "Jun", value: 520 },
  { month: "Jul", value: 470 },
  { month: "Aug", value: 540 },
  { month: "Sep", value: 720 },
  { month: "Oct", value: 650 },
  { month: "Nov", value: 690 },
  { month: "Dec", value: 780 },
];

function OrdersTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { month: string } }>;
  label?: string;
}) {
  if (!active || !payload?.[0]) return null;
  return (
    <div className="rounded-[0.8rem] border border-[#eef1f5] bg-white px-3.5 py-2.5 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
      <div className="mb-1.5 text-xs font-medium text-muted-foreground">
        {payload[0].payload.month} 2026
      </div>
      <div className="flex items-center gap-2 tabular-nums text-[13px] font-bold text-foreground">
        <div className="h-2 w-2 rounded-full bg-[var(--chart-3)]" />
        {payload[0].value?.toLocaleString("id-ID")} orders
      </div>
    </div>
  );
}

export function CustomerOrdersChart() {
  const [activeIndex, setActiveIndex] = React.useState(5);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-[320px] flex-1 overflow-hidden">
      <div className="absolute inset-0">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={orderSeries}
              margin={{ top: 18, right: 4, left: 4, bottom: 2 }}
              onClick={(state) => {
                if (state && typeof state.activeTooltipIndex === "number") {
                  setActiveIndex(state.activeTooltipIndex);
                }
              }}
            >
              <defs>
                <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.18} />
                  <stop offset="45%" stopColor="var(--chart-3)" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <ReferenceArea
                x1={orderSeries[Math.max(activeIndex - 0.18, 0)]?.month}
                x2={orderSeries[Math.min(activeIndex + 0.18, orderSeries.length - 1)]?.month}
                fill="rgba(182, 156, 255, 0.18)"
                fillOpacity={1}
                ifOverflow="extendDomain"
                radius={14}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(215 10% 54%)" }}
                tickMargin={12}
              />
              <Tooltip
                cursor={false}
                content={<OrdersTooltip />}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--chart-3)"
                strokeWidth={3}
                fill="url(#orderGradient)"
                dot={(props) => {
                  const { cx, cy, index } = props as { cx?: number; cy?: number; index: number };
                  if (typeof cx !== "number" || typeof cy !== "number") return <g key={index} />;
                  const active = index === activeIndex;
                  return (
                    <g key={index}>
                      {active ? <circle cx={cx} cy={cy} r={14} fill="rgba(182, 156, 255, 0.18)" /> : null}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={active ? 5.5 : 0}
                        fill="white"
                        stroke="var(--chart-3)"
                        strokeWidth={2.5}
                      />
                    </g>
                  );
                }}
                activeDot={{ r: 5.5, fill: "white", stroke: "var(--chart-3)", strokeWidth: 2.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
    </div>
  );
}
