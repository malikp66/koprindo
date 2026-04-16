"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoConsole } from "@/components/dashboard/demo-console-provider";

const roleContextMap = {
  dashboard: {
    executive: {
      title: "Sudut pandang pimpinan",
      note: "Fokus pada headline metric, posture risiko, dan keputusan lintas channel.",
      access: ["Ringkasan nasional", "Status target", "Risiko utama"],
    },
    operations: {
      title: "Sudut pandang operasional",
      note: "Fokus pada cabang prioritas, pemeriksaan mutu, dan tindak lanjut operasional.",
      access: ["Cabang prioritas", "Jalur tindakan", "Status batch"],
    },
    finance: {
      title: "Sudut pandang keuangan",
      note: "Fokus pada exposure payment, aging, dan implikasi arus kas.",
      access: ["Paparan kas", "Status umur piutang", "Pemantauan pembayaran"],
    },
    consultant: {
      title: "Sudut pandang konsultan",
      note: "Fokus pada transparansi data, evaluasi performa, dan narasi strategis.",
      access: ["Ringkasan pimpinan", "Status PKS", "Visibilitas lintas pihak"],
    },
    principal: {
      title: "Sudut pandang prinsipal",
      note: "Fokus pada performa channel dan status pembayaran dari Koprindo.",
      access: ["KPI baca-saja", "Status pembayaran", "Kesehatan distribusi"],
    },
    retail: {
      title: "Sudut pandang PIC ritel",
      note: "Fokus pada performa channel sendiri, upload posture, dan exception yang perlu klarifikasi.",
      access: ["Cakupan channel", "Status unggah", "Klarifikasi pengecualian"],
    },
  },
  upload: {
    executive: {
      title: "Pengawasan mutu",
      note: "Memastikan batch yang masuk ke control tower punya publish posture yang jelas.",
      access: ["Batch terbit", "Batch sementara", "Pemeriksaan mutu"],
    },
    operations: {
      title: "Kepemilikan penerimaan data",
      note: "Memastikan semua source type masuk sesuai jadwal dan siap direkonsiliasi.",
      access: ["Daftar batch", "Validasi skema", "Antrean rekonsiliasi"],
    },
    finance: {
      title: "Penerimaan data keuangan",
      note: "Memastikan `payment_record` dan invoice evidence lengkap sebelum masuk monitoring.",
      access: ["Kontrak pembayaran", "Kelengkapan jatuh tempo", "Mutu invoice"],
    },
    consultant: {
      title: "Transparansi penerimaan data",
      note: "Menjaga source visibility dan kualitas data agar laporan strategis tetap objektif.",
      access: ["Jejak sumber", "Status mutu", "Catatan peninjauan"],
    },
    principal: {
      title: "Visibilitas prinsipal",
      note: "Melihat source distribusi dan publish posture tanpa mengubah batch operasional.",
      access: ["Penerimaan data baca-saja", "Status batch", "Sumber distribusi"],
    },
    retail: {
      title: "Pengiriman data ritel",
      note: "Memastikan batch sell-out dikirim lengkap dan lolos quality gate tanpa rework berulang.",
      access: ["Aksi unggah", "Kolom wajib", "Hasil validasi"],
    },
  },
  monitoring: {
    executive: {
      title: "Kendali keputusan",
      note: "Membaca apakah distribusi, stok, dan pembayaran masih dalam posture yang bisa diterima.",
      access: ["Pusat keputusan", "Kartu nilai PKS", "Peristiwa risiko utama"],
    },
    operations: {
      title: "Kendali tindakan",
      note: "Memilih cabang prioritas dan menurunkan monitoring ke tindakan lapangan.",
      access: ["Risiko cabang", "Ringkasan tindakan", "Peringatan stok"],
    },
    finance: {
      title: "Kendali pembayaran",
      note: "Memantau invoice, aging, compliance, dan exposure arus kas.",
      access: ["Buku invoice", "Daftar pantau umur piutang", "Penanda kepatuhan"],
    },
    consultant: {
      title: "Monitoring strategis",
      note: "Menghubungkan performa distribusi ke narasi evaluasi dan rekomendasi strategi.",
      access: ["Tampilan lintas channel", "Status PKS", "Narasi risiko"],
    },
    principal: {
      title: "Monitoring prinsipal",
      note: "Melihat status channel dan pembayaran yang relevan untuk kemitraan.",
      access: ["KPI baca-saja", "Status pembayaran", "Progres channel"],
    },
    retail: {
      title: "Kinerja ritel",
      note: "Melihat dampak upload, exception, dan sell-out pada channel masing-masing.",
      access: ["Kinerja channel", "Dampak pengecualian", "Cakupan toko"],
    },
  },
  reports: {
    executive: {
      title: "Pelaporan pimpinan",
      note: "Menutup siklus dengan laporan yang sudah lolos quality gate dan siap dipakai mengambil keputusan.",
      access: ["Paket laporan pimpinan", "Catatan keputusan", "Daftar periksa tata kelola"],
    },
    operations: {
      title: "Pelaporan operasional",
      note: "Meninjau ringkasan tindakan, exception, dan performa channel per periode.",
      access: ["Laporan channel", "Ringkasan risiko", "Arsip laporan"],
    },
    finance: {
      title: "Pelaporan keuangan",
      note: "Memastikan aging, compliance, dan exposure arus kas masuk ke laporan yang tepat.",
      access: ["Lampiran pembayaran", "Ringkasan umur piutang", "Catatan distribusi"],
    },
    consultant: {
      title: "Pelaporan strategis",
      note: "Menyusun evaluasi naratif dan transparansi performa lintas pihak.",
      access: ["Laporan PKS", "Ringkasan naratif", "Laporan lintas pihak"],
    },
    principal: {
      title: "Distribusi ke prinsipal",
      note: "Menerima laporan yang relevan untuk visibility kemitraan dan performa channel.",
      access: ["Paket baca-saja", "Laporan terkirim", "Ringkasan siap audit"],
    },
    retail: {
      title: "Tindak lanjut ritel",
      note: "Melihat laporan channel yang terkait dengan performa, upload, dan exception mereka.",
      access: ["Ringkasan channel", "Lampiran pengecualian", "Status distribusi"],
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
