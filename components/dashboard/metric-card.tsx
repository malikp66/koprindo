"use client";

import * as React from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Minus,
  ShieldCheck,
  UsersRound,
  Waves,
} from "lucide-react";
import { SignalExplainSheet } from "@/components/dashboard/signal-explain-sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type StatusTone } from "@/lib/mock-data";

function MetricDelta({ delta }: { delta: string }) {
  const negative = delta.trim().startsWith("-");
  const positive = delta.trim().startsWith("+");

  if (positive) return <ArrowUpRight className="h-3.5 w-3.5" />;
  if (negative) return <ArrowDownRight className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
}

function MetricIcon({ label, tone }: { label: string; tone: StatusTone }) {
  if (label.toLowerCase().includes("revenue")) return <CircleDollarSign className="h-4.5 w-4.5" />;
  if (label.toLowerCase().includes("outlet") || label.toLowerCase().includes("aktif")) return <UsersRound className="h-4.5 w-4.5" />;
  if (tone === "danger") return <AlertTriangle className="h-4.5 w-4.5" />;
  if (tone === "warning") return <Waves className="h-4.5 w-4.5" />;
  if (tone === "info") return <Activity className="h-4.5 w-4.5" />;
  return <ShieldCheck className="h-4.5 w-4.5" />;
}

function iconBgColor(tone: StatusTone, label: string): string {
  if (label.toLowerCase().includes("revenue")) return "border border-sky-200/70 bg-sky-50 text-slate-900";
  if (label.toLowerCase().includes("outlet") || label.toLowerCase().includes("aktif")) return "border border-sky-200/70 bg-sky-50 text-slate-900";
  if (tone === "danger") return "border border-rose-200/80 bg-rose-50 text-rose-500";
  if (tone === "warning") return "border border-amber-200/80 bg-amber-50 text-amber-600";
  if (tone === "info") return "border border-sky-200/70 bg-sky-50 text-slate-900";
  return "border border-border/40 bg-white text-muted-foreground";
}

function metricSignal(label: string, value: string, delta: string) {
  if (label.toLowerCase().includes("sell-out")) {
    return {
      summary: `Sell-out aktif berada di ${value} dengan perubahan ${delta} terhadap minggu sebelumnya.`,
      confidence: "94% confidence",
      status: "Published data",
      reasoning: [
        "AI membaca akselerasi outlet aktif di kanal modern dan mendeteksi momentum pertumbuhan yang konsisten pada batch terpublikasi.",
        "Perubahan minggu ini tetap selaras dengan tren distribusi wilayah dan tidak menunjukkan deviasi besar terhadap target periodik.",
      ],
      sources: ["sell_out_record", "master_distribusi", "report_job"],
      decisionRule: "Signal dinaikkan bila sell-out tumbuh dan batch sumber berstatus published tanpa blocking issue.",
      recommendedAction: "Pertahankan coverage channel aktif dan pantau cabang dengan velocity di bawah median nasional.",
    };
  }

  if (label.toLowerCase().includes("outlet") || label.toLowerCase().includes("aktif")) {
    return {
      summary: `Outlet aktif tercatat ${value} dengan perubahan ${delta}, menunjukkan ekspansi coverage yang masih stabil.`,
      confidence: "91% confidence",
      status: "Coverage verified",
      reasoning: [
        "AI memadankan master outlet dengan sell-out terbaru untuk memisahkan outlet aktif riil dari outlet registered tetapi tidak bergerak.",
        "Signal coverage ditahan bila ada mismatch cabang, sehingga hanya outlet tervalidasi yang masuk ke headline metric.",
      ],
      sources: ["master_distribusi", "sell_out_record", "inventory_position"],
      decisionRule: "Outlet aktif dihitung hanya bila outlet punya pergerakan penjualan valid dan mapping cabang lolos quality gate.",
      recommendedAction: "Gunakan angka ini untuk prioritas ekspansi, lalu audit outlet baru yang belum menunjukkan velocity normal.",
    };
  }

  if (label.toLowerCase().includes("revenue")) {
    return {
      summary: `Revenue aktif berada di ${value} dengan perubahan ${delta}, masih sejalan dengan posture sell-out dan mix channel.`,
      confidence: "92% confidence",
      status: "Financial view synced",
      reasoning: [
        "AI mengaitkan revenue dengan profit mix channel dan batch payment yang sudah tervalidasi agar tidak terjadi headline yang menyesatkan.",
        "Anomali minor pada payment evidence tidak memblokir headline revenue, tetapi tetap dicatat di control layer.",
      ],
      sources: ["sell_out_record", "payment_record", "executive_report"],
      decisionRule: "Revenue headline hanya ditampilkan dari batch published atau provisional yang sudah diberi flag jelas.",
      recommendedAction: "Bandingkan revenue ini dengan aging exposure untuk memastikan pertumbuhan tidak menambah risiko arus kas.",
    };
  }

  return {
    summary: `Retur saat ini berada di ${value} dengan perubahan ${delta}; signal dipakai untuk memotret tekanan exception pada distribusi aktif.`,
    confidence: "89% confidence",
    status: "Exception monitored",
    reasoning: [
      "AI menilai korelasi antara retur, stock imbalance, dan outlet bermasalah untuk menandai cabang yang perlu intervensi lebih cepat.",
      "Signal retur tidak langsung menurunkan headline performa, tetapi menjadi indikator risiko operasional di exception lane.",
    ],
    sources: ["exception_record", "sell_out_record", "risk_event"],
    decisionRule: "Retur dianggap signifikan bila tren negatif berulang dan berdampak ke sell-out efektif atau kualitas outlet.",
    recommendedAction: "Prioritaskan investigasi cabang dengan retur tinggi dan cek apakah ada mismatch pengiriman atau kualitas produk.",
  };
}

export function MetricCard({
  label,
  value,
  delta,
  trend: _trend,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  trend: number[];
  tone: StatusTone;
}) {
  const [detailOpen, setDetailOpen] = React.useState(false);
  const negative = delta.trim().startsWith("-");
  const signal = metricSignal(label, value, delta);

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className={`flex size-9 shrink-0 items-center justify-center rounded-full ${iconBgColor(tone, label)}`}>
            <MetricIcon label={label} tone={tone} />
          </div>
        </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-[2rem] tabular leading-none tracking-tight text-foreground">{value}</CardTitle>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1.5 text-sm">
              <span className={negative ? "text-rose-500" : "text-emerald-500"}>
                <MetricDelta delta={delta} />
              </span>
              <span className={negative ? "font-medium text-rose-500" : "font-medium text-emerald-500"}>{delta}</span>
              <span className="text-muted-foreground">vs Last Week</span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setDetailOpen(true)}
            >
              <span>Explain Signal</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardContent>
      </Card>
      <SignalExplainSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={label}
        summary={signal.summary}
        confidence={signal.confidence}
        status={signal.status}
        reasoning={signal.reasoning}
        sources={signal.sources}
        decisionRule={signal.decisionRule}
        recommendedAction={signal.recommendedAction}
      />
    </>
  );
}
