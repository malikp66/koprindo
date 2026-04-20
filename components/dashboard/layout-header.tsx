"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BrainCircuit,
  BellRing,
  Menu,
  MoonStar,
  UserCircle2,
  Boxes,
  CheckCircle2,
  AlertTriangle,
  PackageSearch,
  Siren,
  Sparkles,
  SunMedium,
  WalletCards,
} from "lucide-react";
import { useDemoConsole } from "@/components/dashboard/demo-console-provider";
import { DetailSheet } from "@/components/dashboard/detail-sheet";
import { Button } from "@/components/ui/button";
import { navItems } from "@/components/dashboard/icons";
import { Badge } from "@/components/ui/badge";

const operationalAlerts = [
  {
    title: "Piutang aging masuk bucket 46-60 hari",
    detail: "3 invoice Alfamart perlu follow-up finance hari ini agar tidak naik ke status kritis.",
    severity: "High",
    icon: WalletCards,
    iconClassName: "border border-amber-500/20 bg-amber-500/14 text-amber-300",
  },
  {
    title: "Stock cover Cirebon di bawah batas warning",
    detail: "SKU FOX Premium mendekati threshold stockout risk dan perlu realokasi antar cabang.",
    severity: "Warning",
    icon: PackageSearch,
    iconClassName: "border border-rose-500/20 bg-rose-500/14 text-rose-300",
  },
  {
    title: "Mismatch sell-in vs sell-out terdeteksi",
    detail: "Cabang Bekasi menunjukkan deviasi distribusi yang perlu diverifikasi dengan batch terbaru.",
    severity: "Review",
    icon: AlertTriangle,
    iconClassName: "border border-sky-500/20 bg-sky-500/14 text-sky-300",
  },
];

const aiNotifications = [
  {
    title: "AI mendeteksi risiko distribusi paling mendesak",
    summary:
      "Kombinasi aging payment tinggi, outlet aktif yang tertahan, dan stock cover rendah menunjukkan kebutuhan intervensi lintas finance dan distribusi.",
    insight:
      "Sesuai PRD, prioritas utama hari ini adalah payment aging critical, stockout risk, dan sell-in/sell-out mismatch pada cabang ber-volume besar.",
    badge: "AI Prioritas",
  },
  {
    title: "AI merekomendasikan fokus cabang",
    summary:
      "Jawa Barat masih memimpin sell-out, tetapi return pressure dan ketidakseimbangan stok mulai muncul di cluster kota berputar cepat.",
    insight:
      "Langkah paling berdampak adalah audit outlet risiko tinggi, validasi batch provisional, dan redistribusi stok untuk menjaga coverage aktif.",
    badge: "AI Insight",
  },
];


export function LayoutHeader({
  onToggleMobile,
}: {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onToggleMobile: () => void;
  }) {
  const pathname = usePathname();
  const { roleLabel } = useDemoConsole();
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [aiInsightOpen, setAiInsightOpen] = React.useState(false);
  const [themeMode, setThemeMode] = React.useState<"dark" | "light">("dark");
  const unreadCount = operationalAlerts.length + 1;
  const aiInsightCount = aiNotifications.length;

  React.useEffect(() => {
    const currentTheme =
      typeof document !== "undefined" &&
      (document.documentElement.dataset.theme === "light" || document.documentElement.dataset.theme === "dark")
        ? (document.documentElement.dataset.theme as "dark" | "light")
        : "dark";
    setThemeMode(currentTheme);
    document.documentElement.classList.add("theme-ready");
  }, []);

  const toggleTheme = React.useCallback(() => {
    const nextTheme = themeMode === "dark" ? "light" : "dark";
    setThemeMode(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("koprindo-theme", nextTheme);
  }, [themeMode]);

  return (
    <>
    <header className="grid gap-5 xl:grid-cols-[auto_1fr_auto] xl:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="outline" size="icon" className="shrink-0 lg:hidden" onClick={onToggleMobile}>
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <Boxes className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">FOX Monitoring</h2>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 xl:justify-center">
        <div className="hidden h-14 w-fit items-center rounded-full border border-border/70 bg-card px-2 shadow-soft lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-10 items-center rounded-full px-5 text-sm font-medium transition-all duration-200 ${active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 xl:justify-end">
        <div className="grid h-14 grid-cols-3 items-center gap-3 rounded-full border border-border/70 bg-card/95 px-3 shadow-soft">
          <Button
            variant="ghost"
            size="icon"
            title="Notifikasi"
            aria-label="Buka notifikasi operasional"
            className="relative h-10 w-10 rounded-full bg-transparent text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
            onClick={() => setNotificationOpen(true)}
          >
            <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 translate-x-[18%] -translate-y-[12%] items-center justify-center rounded-full px-1.5 text-[10px] font-semibold leading-none text-white">
              {unreadCount}
            </span>
            <BellRing className="h-4.5 w-4.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="AI Insight"
            aria-label="Buka AI Insight"
            onClick={() => setAiInsightOpen(true)}
            className="relative h-10 w-10 rounded-full bg-transparent text-primary transition-all hover:bg-accent hover:text-primary"
          >
            <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 translate-x-[18%] -translate-y-[12%] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold leading-none text-primary-foreground shadow-sm">
              {aiInsightCount}
            </span>
            <Sparkles className="h-4.5 w-4.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            title={themeMode === "dark" ? "Ganti ke light mode" : "Ganti ke dark mode"}
            aria-label={themeMode === "dark" ? "Ganti ke light mode" : "Ganti ke dark mode"}
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full bg-transparent text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          >
            <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden">
              <MoonStar
                className={`absolute h-4.5 w-4.5 transition-all duration-300 ${
                  themeMode === "dark"
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-90 scale-75 opacity-0"
                }`}
              />
              <SunMedium
                className={`absolute h-4.5 w-4.5 transition-all duration-300 ${
                  themeMode === "light"
                    ? "rotate-0 scale-100 opacity-100"
                    : "rotate-90 scale-75 opacity-0"
                }`}
              />
            </span>
          </Button>
        </div>

        <div className="flex h-14 items-center gap-3 rounded-full border border-border/70 bg-card px-4 shadow-soft">
          <UserCircle2 className="h-7 w-7 text-muted-foreground" />
          <div className="hidden pr-1 text-left text-sm leading-tight sm:block">
            <div className="font-medium text-foreground">Ruang kerja {roleLabel}</div>
            <div className="text-xs text-muted-foreground">akses pengguna aktif</div>
          </div>
        </div>
      </div>
    </header>
    <DetailSheet
      open={notificationOpen}
      onOpenChange={setNotificationOpen}
      title="Notifikasi Operasional"
      description="Alert prioritas operasional yang diringkas dari rule risiko di PRD FOX 2026."
      className="w-[min(96vw,560px)]"
    >
      <div className="space-y-6 xl:space-y-7">
        <div className="rounded-3xl border border-border/70 bg-accent/70 p-5 xl:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-foreground xl:text-[15px]">Ringkasan saat ini</div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground xl:max-w-[380px]">
                Ada {operationalAlerts.length} alert operasional yang perlu diperhatikan admin hari ini.
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/14 text-primary xl:h-12 xl:w-12">
              <Siren className="h-5 w-5 xl:h-5.5 xl:w-5.5" />
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-300" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground xl:text-[15px]">Alert Operasional</h3>
          </div>
          <div className="space-y-3.5">
            {operationalAlerts.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/70 bg-card p-4 xl:p-5">
                <div className="flex items-start gap-3.5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.iconClassName} xl:h-11 xl:w-11`}>
                    <item.icon className="h-4.5 w-4.5 xl:h-5 xl:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="pr-2 text-sm font-semibold leading-6 text-foreground xl:text-[15px]">{item.title}</div>
                      <Badge variant="warning">{item.severity}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/12 px-4 py-3.5 xl:px-5 xl:py-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card text-emerald-300 ring-1 ring-emerald-500/20">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <p className="pt-0.5 text-sm leading-6 text-foreground">
              Batch sell-out Indomaret periode aktif sudah tervalidasi dan aman dipakai untuk monitoring admin.
            </p>
          </div>
        </div>
      </div>
    </DetailSheet>
    <DetailSheet
      open={aiInsightOpen}
      onOpenChange={setAiInsightOpen}
      title="AI Insight"
      description="Ringkasan prioritas penting untuk admin yang dibentuk dari signal risiko dan fokus keputusan pada PRD FOX 2026."
      className="w-[min(96vw,600px)]"
    >
      <div className="space-y-6 xl:space-y-7">
        <div className="rounded-3xl border border-primary/20 bg-accent/70 p-5 xl:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-foreground xl:text-[15px]">AI Prioritas Hari Ini</div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground xl:max-w-[420px]">
                Insight ini merangkum kombinasi payment aging, stock risk, mismatch distribusi, dan kualitas batch yang paling perlu perhatian admin.
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/14 text-primary xl:h-12 xl:w-12">
              <BrainCircuit className="h-5 w-5 xl:h-5.5 xl:w-5.5" />
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold tracking-tight text-foreground xl:text-[15px]">Notifikasi AI Penting</h3>
          </div>
          <div className="space-y-3.5">
            {aiNotifications.map((item) => (
              <div key={item.title} className="rounded-2xl border border-border/70 bg-card p-4 xl:p-5">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/14 text-primary xl:h-11 xl:w-11">
                    <Sparkles className="h-4.5 w-4.5 xl:h-5 xl:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="pr-2 text-sm font-semibold leading-6 text-foreground xl:text-[15px]">{item.title}</div>
                      <Badge variant="info">{item.badge}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.summary}</p>
                    <div className="mt-3 rounded-2xl border border-border/70 bg-accent/80 px-3.5 py-3 text-sm leading-6 text-foreground">
                      {item.insight}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DetailSheet>
    </>
  );
}
