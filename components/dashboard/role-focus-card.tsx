"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoConsole } from "@/components/dashboard/demo-console-provider";

const roleContextMap = {
  dashboard: {
    executive: {
      title: "Executive lens",
      note: "Fokus pada headline metric, posture risiko, dan keputusan lintas channel.",
      access: ["Ringkasan nasional", "Status target", "Major risks"],
    },
    operations: {
      title: "Operations lens",
      note: "Fokus pada cabang prioritas, quality gate, dan tindak lanjut operasional.",
      access: ["Cabang prioritas", "Action lane", "Batch posture"],
    },
    finance: {
      title: "Finance lens",
      note: "Fokus pada exposure payment, aging, dan implikasi arus kas.",
      access: ["Cash exposure", "Aging posture", "Payment watch"],
    },
    consultant: {
      title: "Consultant lens",
      note: "Fokus pada transparansi data, evaluasi performa, dan narasi strategis.",
      access: ["Executive summary", "PKS posture", "Cross-party visibility"],
    },
    principal: {
      title: "Principal lens",
      note: "Fokus pada performa channel dan status pembayaran dari Koprindo.",
      access: ["Read-only KPI", "Payment posture", "Distribution health"],
    },
    retail: {
      title: "Retail lens",
      note: "Fokus pada performa channel sendiri, upload posture, dan exception yang perlu klarifikasi.",
      access: ["Channel scope", "Upload posture", "Exception clarification"],
    },
  },
  upload: {
    executive: {
      title: "Quality oversight",
      note: "Memastikan batch yang masuk ke control tower punya publish posture yang jelas.",
      access: ["Published batch", "Provisional batch", "Quality gate"],
    },
    operations: {
      title: "Intake ownership",
      note: "Memastikan semua source type masuk sesuai jadwal dan siap direkonsiliasi.",
      access: ["Batch registry", "Schema validation", "Reconciliation queue"],
    },
    finance: {
      title: "Financial intake",
      note: "Memastikan `payment_record` dan invoice evidence lengkap sebelum masuk monitoring.",
      access: ["Payment contract", "Due date completeness", "Invoice quality"],
    },
    consultant: {
      title: "Transparency intake",
      note: "Menjaga source visibility dan kualitas data agar laporan strategis tetap objektif.",
      access: ["Source lineage", "Quality posture", "Review notes"],
    },
    principal: {
      title: "Principal visibility",
      note: "Melihat source distribusi dan publish posture tanpa mengubah batch operasional.",
      access: ["Read-only intake", "Batch posture", "Distribution source"],
    },
    retail: {
      title: "Retail submission",
      note: "Memastikan batch sell-out dikirim lengkap dan lolos quality gate tanpa rework berulang.",
      access: ["Upload action", "Required fields", "Validation result"],
    },
  },
  monitoring: {
    executive: {
      title: "Decision control",
      note: "Membaca apakah distribusi, stok, dan pembayaran masih dalam posture yang bisa diterima.",
      access: ["Decision center", "PKS scorecard", "Major risk events"],
    },
    operations: {
      title: "Action control",
      note: "Memilih cabang prioritas dan menurunkan monitoring ke tindakan lapangan.",
      access: ["Branch risk", "Action summary", "Stock alerts"],
    },
    finance: {
      title: "Payment control",
      note: "Memantau invoice, aging, compliance, dan exposure arus kas.",
      access: ["Invoice ledger", "Aging watchlist", "Compliance flags"],
    },
    consultant: {
      title: "Strategic monitoring",
      note: "Menghubungkan performa distribusi ke narasi evaluasi dan rekomendasi strategi.",
      access: ["Cross-channel view", "PKS posture", "Risk narrative"],
    },
    principal: {
      title: "Principal monitoring",
      note: "Melihat status channel dan pembayaran yang relevan untuk kemitraan.",
      access: ["Read-only KPI", "Payment posture", "Channel progress"],
    },
    retail: {
      title: "Retail performance",
      note: "Melihat dampak upload, exception, dan sell-out pada channel masing-masing.",
      access: ["Channel performance", "Exception impact", "Store coverage"],
    },
  },
  reports: {
    executive: {
      title: "Executive reporting",
      note: "Menutup siklus dengan laporan yang sudah lolos quality gate dan siap dipakai mengambil keputusan.",
      access: ["Executive pack", "Decision note", "Governance checklist"],
    },
    operations: {
      title: "Operational reporting",
      note: "Meninjau ringkasan tindakan, exception, dan performa channel per periode.",
      access: ["Channel reports", "Risk summary", "Generated archive"],
    },
    finance: {
      title: "Financial reporting",
      note: "Memastikan aging, compliance, dan exposure arus kas masuk ke laporan yang tepat.",
      access: ["Payment annex", "Aging summary", "Distribution log"],
    },
    consultant: {
      title: "Strategic reporting",
      note: "Menyusun evaluasi naratif dan transparansi performa lintas pihak.",
      access: ["PKS report", "Narrative summary", "Cross-party report"],
    },
    principal: {
      title: "Principal distribution",
      note: "Menerima laporan yang relevan untuk visibility kemitraan dan performa channel.",
      access: ["Read-only pack", "Sent reports", "Audit-friendly summary"],
    },
    retail: {
      title: "Retail follow-up",
      note: "Melihat laporan channel yang terkait dengan performa, upload, dan exception mereka.",
      access: ["Channel summary", "Exception appendix", "Distribution status"],
    },
  },
} as const;

export function RoleFocusCard({
  context,
}: {
  context: keyof typeof roleContextMap;
}) {
  const { roleLabel, role } = useDemoConsole();

  const content = useMemo(() => roleContextMap[context][role], [context, role]);

  return (
    <Card className="surface-noise">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{content.title}</CardTitle>
            <CardDescription>{content.note}</CardDescription>
          </div>
          <Badge variant="outline">{roleLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-2">
        {content.access.map((item) => (
          <div key={item} className="rounded-2xl border border-border/25 bg-accent/20 px-4 py-3 text-sm text-muted-foreground">
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
