"use client";

import { BookOpenCheck, CircleHelp, Contact2, ListChecks, Users } from "lucide-react";
import { demoRoleOptions, useDemoConsole } from "@/components/dashboard/demo-console-provider";
import { PageHeader } from "@/components/dashboard/page-header";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roleGuides = {
  executive: {
    start: "Mulai dari Dashboard Utama untuk membaca ringkasan penjualan, lalu buka Monitoring bila ada area yang perlu ditindaklanjuti lebih detail.",
    pages: ["Dashboard Utama", "Monitoring", "Laporan"],
  },
  operations: {
    start: "Mulai dari Data Intake untuk memastikan file masuk sudah rapi, lalu lanjut ke Monitoring dan Retur untuk menyelesaikan isu lapangan.",
    pages: ["Data Intake", "Monitoring", "Retur"],
  },
  finance: {
    start: "Fokus ke Monitoring tab Pembayaran dan halaman Laporan untuk memastikan follow-up piutang dan isi laporan tetap sinkron.",
    pages: ["Monitoring", "Laporan", "Admin"],
  },
  consultant: {
    start: "Gunakan Dashboard Utama untuk konteks, lalu Monitoring dan Laporan untuk membaca area yang perlu rekomendasi atau review lanjutan.",
    pages: ["Dashboard Utama", "Monitoring", "Laporan"],
  },
  principal: {
    start: "Fokus ke Dashboard Utama, Monitoring, dan Laporan agar pembacaan performa dan catatan tindak lanjut tetap satu arah.",
    pages: ["Dashboard Utama", "Monitoring", "Laporan"],
  },
  retail: {
    start: "Mulai dari Data Intake untuk unggah file, lalu cek Monitoring bila ada catatan yang perlu kamu perbaiki dari data yang sudah dikirim.",
    pages: ["Data Intake", "Monitoring", "Retur"],
  },
} as const;

const dailyFlow = [
  { title: "1. Unggah data", detail: "PIC channel masuk ke Data Intake untuk kirim file periode aktif dan membaca hasil pengecekannya." },
  { title: "2. Cek kondisi operasional", detail: "Tim operasional dan finance membuka Monitoring untuk melihat area yang paling perlu perhatian hari itu." },
  { title: "3. Selesaikan retur atau masalah lapangan", detail: "Kasus retur dan masalah operasional ditindaklanjuti agar angka penjualan dan status kerja tetap bersih." },
  { title: "4. Susun dan kirim laporan", detail: "Setelah data cukup rapi, tim menyiapkan laporan untuk manajemen atau pihak lain yang membutuhkan." },
];

const statusGuide = [
  { label: "Siap dipakai", meaning: "Data atau item sudah cukup aman dipakai untuk monitoring dan laporan.", variant: "success" as const },
  { label: "Perlu revisi", meaning: "Masih ada bagian yang harus diperbaiki sebelum bisa dipakai penuh.", variant: "warning" as const },
  { label: "Menunggu tindak lanjut", meaning: "Sudah terbaca, tetapi masih ada PIC yang harus bergerak lebih dulu.", variant: "info" as const },
  { label: "Selesai", meaning: "Kasus atau pekerjaan sudah ditutup dan tidak perlu aksi tambahan.", variant: "neutral" as const },
];

const faqItems = [
  { question: "Kalau file ditolak atau perlu revisi, apa yang harus dicek dulu?", answer: "Cek periode, daftar produk, outlet, dan pastikan format file mengikuti template yang dipakai tim." },
  { question: "Kalau ada invoice yang mendekati jatuh tempo, siapa yang follow-up?", answer: "Tim finance menjadi PIC utama, tetapi monitoring tetap dipakai untuk memastikan catatan pembayaran diperbarui." },
  { question: "Kalau retur sudah dicatat, kapan penjualannya ikut dikoreksi?", answer: "Setelah kasus retur selesai ditindaklanjuti dan statusnya diperbarui oleh tim terkait." },
  { question: "Kapan laporan boleh dikirim ke manajemen?", answer: "Saat angka utama sudah cukup rapi, catatan prioritas jelas, dan tidak ada data penting yang masih menunggu revisi." },
];

export default function DocumentationPage() {
  const { role, setRole, roleLabel } = useDemoConsole();
  const roleGuide = roleGuides[role];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Panduan Penggunaan"
        title="Mulai dari Sini Kalau Baru Pakai Sistem"
        description="Panduan singkat untuk memahami alur kerja harian, arti status yang muncul di halaman, dan urutan pakai modul yang paling relevan buat peranmu."
        actions={
          <Select value={role} onValueChange={(value) => setRole(value as (typeof demoRoleOptions)[number]["value"])}>
            <SelectTrigger className="w-[190px]"><SelectValue placeholder="Pilih peran" /></SelectTrigger>
            <SelectContent>
              {demoRoleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Sistem ini dipakai untuk apa?</CardTitle>
            <CardDescription>Singkatnya, sistem ini membantu tim menerima data, memantau kondisi operasional, menyelesaikan retur, dan mengirim laporan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              ["Peran yang sedang dipilih", roleLabel],
              ["Fokus utama", roleGuide.start],
              ["Halaman yang paling sering dipakai", roleGuide.pages.join(", ")],
            ].map(([label, value]) => (
              <div key={label} className="kv-row">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="max-w-[60%] text-right text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-noise">
          <CardHeader>
            <CardTitle>Mulai dari peranmu</CardTitle>
            <CardDescription>Pilih peran di kanan atas, lalu pakai ringkasan ini sebagai jalur masuk paling cepat ke halaman yang kamu butuhkan.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {roleGuide.pages.map((page) => (
              <div key={page} className="rounded-2xl border border-border/25 bg-white/80 p-4">
                <div className="text-xs font-medium text-muted-foreground">Halaman prioritas</div>
                <div className="mt-2 text-base font-medium text-foreground">{page}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Alur Harian"
          title="Urutan kerja yang paling umum"
          description="Kalau bingung harus mulai dari mana, pakai alur ini sebagai urutan kerja standar."
        />
        <div className="grid gap-4 xl:grid-cols-4">
          {dailyFlow.map((item) => (
            <Card key={item.title}>
              <CardContent className="p-5">
                <ListChecks className="h-5 w-5 text-primary" />
                <h3 className="mt-3 text-base font-medium tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Arti status yang sering muncul</CardTitle>
            <CardDescription>Gunakan arti ini agar setiap status di halaman kerja lebih mudah dipahami tanpa perlu bertanya ke tim lain dulu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {statusGuide.map((item) => (
              <div key={item.label} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                <div className="flex items-center gap-3">
                  <Badge variant={item.variant}>{item.label}</Badge>
                  <span className="text-sm text-muted-foreground">{item.meaning}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan yang sering muncul</CardTitle>
            <CardDescription>Jawaban singkat untuk masalah yang paling sering bikin user bingung di awal pemakaian.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <CircleHelp className="h-4 w-4 text-primary" />
                  {item.question}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {[
          { icon: BookOpenCheck, title: "Butuh bantuan upload data?", note: "Mulai dari halaman Data Intake. Kalau file masih perlu revisi, bawa catatan pengecekan ke PIC pengirim file." },
          { icon: Users, title: "Butuh bantuan akses atau peran?", note: "Masuk ke Admin untuk lihat status akun, persetujuan pengguna baru, atau pengaturan kerja harian." },
          { icon: Contact2, title: "Butuh bantuan laporan atau angka?", note: "Cek Monitoring dan Laporan lebih dulu. Kalau masih ragu, koordinasikan dengan PIC operasional atau finance yang memegang periodenya." },
        ].map((item) => (
          <Card key={item.title}>
            <CardContent className="p-5">
              <item.icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 text-base font-medium tracking-tight text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
