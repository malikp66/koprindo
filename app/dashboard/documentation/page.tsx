"use client";

import { Bot, GitBranch, ShieldCheck, Workflow } from "lucide-react";
import {
  demoRoleOptions,
  useDemoConsole,
} from "@/components/dashboard/demo-console-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProcessFlowBar } from "@/components/dashboard/process-flow-bar";
import { RoleFocusCard } from "@/components/dashboard/role-focus-card";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { SystemStatusStrip } from "@/components/dashboard/system-status-strip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { operationalStatusSummary } from "@/lib/mock-data";

const aiReadinessCards = [
  {
    icon: Bot,
    title: "AI parsing and enrichment",
    note: "Agent hanya membantu parsing format tidak standar, klasifikasi exception, dan menyiapkan insight awal.",
  },
  {
    icon: Workflow,
    title: "n8n orchestration lane",
    note: "Workflow intake, reminder upload, payment follow-up, dan report routing diposisikan sebagai orkestrasi event, bukan sumber kebenaran angka.",
  },
  {
    icon: ShieldCheck,
    title: "Human review checkpoint",
    note: "KPI final, aging payment, risk closure, dan distribusi laporan eksternal tetap wajib melewati approval manusia.",
  },
  {
    icon: GitBranch,
    title: "Backend contract readiness",
    note: "Frontend sudah memetakan kontrak inti untuk batch registry, risk event, invoice ledger, dan report job.",
  },
];

export default function DocumentationPage() {
  const { role, setRole, roleLabel, periodLabel, channelLabel } = useDemoConsole();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Documentation"
        title="Operational Playbook"
        description="Halaman dokumentasi produk untuk menjelaskan alur control tower, status operasional, role lens, dan kesiapan orkestrasi AI tanpa membebani halaman kerja utama."
        actions={
          <div className="flex flex-wrap gap-2">
            <Select value={role} onValueChange={(value) => setRole(value as (typeof demoRoleOptions)[number]["value"])}>
              <SelectTrigger className="w-[170px]">
                <SelectValue placeholder="Workspace role" />
              </SelectTrigger>
              <SelectContent>
                {demoRoleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Current Workspace Scope</CardTitle>
            <CardDescription>Scope aktif tetap dipakai oleh seluruh halaman operasional, tetapi pengaturan role hanya disediakan di dokumentasi dan governance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Workspace role", roleLabel],
              ["Periode aktif", periodLabel],
              ["Channel aktif", channelLabel],
              ["Layout mode", "Production workspace"],
            ].map(([label, value]) => (
              <div key={label} className="kv-row">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-noise">
          <CardHeader>
            <CardTitle>Why This Page Exists</CardTitle>
            <CardDescription>Semua elemen yang sifatnya onboarding, context, dan role simulation dipusatkan di sini agar dashboard operasional tetap ringkas dan client-facing.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="outline">Operational flow guide</Badge>
            <Badge variant="outline">Role lens</Badge>
            <Badge variant="outline">Data posture</Badge>
            <Badge variant="outline">AI orchestration note</Badge>
          </CardContent>
        </Card>
      </section>

      <ProcessFlowBar
        title="Operational Cycle Reference"
        description="Referensi proses dari intake, monitoring, exception control, sampai reporting. Konten ini dipindahkan ke dokumentasi agar halaman kerja utama tetap fokus pada tindakan."
      />

      <SystemStatusStrip items={operationalStatusSummary} />

      <RoleFocusCard context="dashboard" />

      <section className="space-y-4">
        <SectionHeading
          eyebrow="AI Readiness"
          title="n8n and AI Orchestration Reference"
          description="Panduan singkat untuk membedakan area yang boleh dibantu AI dari area yang wajib tetap deterministik dan dapat diaudit."
        />
        <div className="grid gap-4 xl:grid-cols-2">
          {aiReadinessCards.map((item) => (
            <Card key={item.title}>
              <CardContent className="p-5">
                <item.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 text-base font-medium tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
