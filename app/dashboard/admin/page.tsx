"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  CircleX,
  Clock3,
  Link2,
  UserPlus,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { toneToBadge } from "@/components/dashboard/tone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { registrationQueue, userDirectory } from "@/lib/mock-data";

type RegistrationRow = (typeof registrationQueue)[number];

const summaryCards = [
  { label: "Permintaan baru", value: "12", note: "Pengguna baru menunggu keputusan" },
  { label: "Akun aktif", value: "22 akun", note: "Dipakai oleh tim internal dan mitra" },
  { label: "Integrasi aktif", value: "3 layanan", note: "Dipakai untuk reminder dan laporan" },
  { label: "Perlu revisi", value: "3 akun", note: "Masih perlu data tambahan" },
];

const connectorCards = [
  { title: "Pengingat upload", status: "Aktif", note: "Reminder untuk PIC channel berjalan sesuai jadwal kerja harian.", tone: "success" as const },
  { title: "Ringkasan laporan", status: "Aktif", note: "Distribusi laporan internal berjalan otomatis setiap pagi.", tone: "success" as const },
  { title: "Pengingat piutang", status: "Perlu dicek", note: "Satu jalur notifikasi finance masih perlu konfirmasi.", tone: "warning" as const },
  { title: "Sinkron spreadsheet", status: "Siap", note: "Masih siap dipakai untuk unggahan dan rekap operasional.", tone: "info" as const },
];

function approvalLabel(value: RegistrationRow["approval"]) {
  if (value === "Pending Review") return "Menunggu review";
  if (value === "Needs Revision") return "Perlu revisi";
  return value;
}

function approvalTone(value: RegistrationRow["approval"]) {
  if (value === "Pending Review") return "warning";
  if (value === "Needs Revision") return "danger";
  return "neutral";
}

function userStatusLabel(value: (typeof userDirectory)[number]["status"]) {
  return value === "Active" ? "Aktif" : value;
}

export default function AdminPage() {
  const [selectedRegistration, setSelectedRegistration] = React.useState<RegistrationRow>(registrationQueue[0]);
  const [activeTab, setActiveTab] = React.useState("approvals");

  React.useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "integrasi") return setActiveTab("connectors");
      if (hash === "pengaturan") return setActiveTab("settings");
      if (hash === "pengguna") return setActiveTab("users");
      return setActiveTab("approvals");
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const registrationColumns: ColumnDef<RegistrationRow>[] = [
    { accessorKey: "name", header: () => <SortableHeader label="Nama" />, cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "type", header: "Tipe Pengguna" },
    { accessorKey: "org", header: "Organisasi" },
    { accessorKey: "role", header: "Peran" },
    { accessorKey: "whatsapp", header: "WA" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "otp", header: "OTP", cell: ({ row }) => <Badge variant="info">{row.original.otp}</Badge> },
    { accessorKey: "approval", header: "Status", cell: ({ row }) => <Badge variant={toneToBadge(approvalTone(row.original.approval))}>{approvalLabel(row.original.approval)}</Badge> },
  ];

  const userColumns: ColumnDef<(typeof userDirectory)[number]>[] = [
    { accessorKey: "code", header: "Kode" },
    { accessorKey: "name", header: () => <SortableHeader label="Nama" />, cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "type", header: "Tipe" },
    { accessorKey: "unit", header: "Unit" },
    { accessorKey: "role", header: "Peran" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="success">{userStatusLabel(row.original.status)}</Badge> },
    { accessorKey: "lastActivity", header: () => <SortableHeader label="Aktivitas Terakhir" /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin"
        title="Kelola Pengguna, Akses, dan Pengaturan Kerja"
        description="Halaman ini dipakai untuk menyetujui pengguna baru, melihat akun aktif, mengecek layanan pendukung, dan mengatur kebiasaan kerja harian tim."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success("Direktori pengguna sedang disiapkan")}>Ekspor Direktori</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus data-icon="inline-start" />
                  Tambah Pengguna
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah pengguna</DialogTitle>
                  <DialogDescription>Buat akun baru untuk tim internal, finance, konsultan, atau PIC ritel.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="Nama lengkap" />
                  <Input placeholder="Email" />
                  <Select defaultValue="internal">
                    <SelectTrigger><SelectValue placeholder="Tipe pengguna" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Koordinator Internal</SelectItem>
                      <SelectItem value="ritel">PIC Ritel</SelectItem>
                      <SelectItem value="consultant">Konsultan</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Nomor WhatsApp" />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => toast.info("Pembuatan pengguna dibatalkan")}>Batal</Button>
                  <Button onClick={() => toast.success("Undangan berhasil dikirim")}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="text-xs font-medium text-muted-foreground">{item.label}</div>
              <div className="mt-3 text-2xl tracking-tight tabular text-foreground">{item.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{item.note}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="approvals">Persetujuan</TabsTrigger>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
          <TabsTrigger value="connectors">Integrasi</TabsTrigger>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle>Antrean persetujuan</CardTitle>
                <CardDescription>Buka permintaan baru, cek identitas dan peran pengguna, lalu putuskan apakah akun bisa langsung diaktifkan.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={registrationColumns}
                  data={registrationQueue}
                  searchPlaceholder="Cari nama atau organisasi..."
                  onRowClick={setSelectedRegistration}
                  toolbar={
                    <>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[160px]"><SelectValue placeholder="Tipe user" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Tipe</SelectItem>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="ritel">PIC Ritel</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="pending">
                        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Menunggu review</SelectItem>
                          <SelectItem value="revision">Perlu revisi</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Keputusan untuk pengaju terpilih</CardTitle>
                <CardDescription>Panel kanan merangkum informasi utama agar admin bisa cepat memutuskan akun ini disetujui, direvisi, atau ditolak.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Pengaju</p>
                      <h3 className="mt-2 text-xl tracking-tight text-foreground">{selectedRegistration.name}</h3>
                    </div>
                    <Badge variant={toneToBadge(approvalTone(selectedRegistration.approval))}>{approvalLabel(selectedRegistration.approval)}</Badge>
                  </div>
                </div>
                {[
                  ["Tipe pengguna", selectedRegistration.type],
                  ["Organisasi", selectedRegistration.org],
                  ["Peran", selectedRegistration.role],
                  ["Status OTP", selectedRegistration.otp],
                  ["Email", selectedRegistration.email],
                  ["Catatan admin", selectedRegistration.approval === "Needs Revision" ? "Minta pengaju melengkapi data atau memperjelas kebutuhan akses." : "Data cukup untuk diproses selama peran dan organisasinya sesuai."],
                ].map(([label, value]) => (
                  <div key={label} className="kv-row">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="max-w-[56%] text-right text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button className="gap-2" onClick={() => toast.success("Akses disetujui")}><CheckCircle2 data-icon="inline-start" /> Setujui</Button>
                  <Button variant="secondary" className="gap-2" onClick={() => toast.info("Permintaan revisi dikirim")}><Clock3 data-icon="inline-start" /> Minta revisi</Button>
                  <Button variant="destructive" className="gap-2" onClick={() => toast.error("Permintaan ditolak")}><CircleX data-icon="inline-start" /> Tolak</Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Direktori pengguna aktif</CardTitle>
                <CardDescription>Lihat siapa saja yang sudah aktif memakai sistem dan kapan terakhir kali mereka mengakses halaman kerja.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={userColumns}
                  data={userDirectory}
                  searchPlaceholder="Cari nama atau unit..."
                  toolbar={
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status akun" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                />
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="connectors">
          <Card>
            <CardHeader>
              <CardTitle>Status layanan pendukung</CardTitle>
              <CardDescription>Cek apakah reminder, pengiriman laporan, dan layanan pendukung lain masih siap dipakai oleh tim setiap hari.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {connectorCards.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                    </div>
                    <Badge variant={toneToBadge(item.tone)}>{item.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan kerja harian</CardTitle>
              <CardDescription>Atur kebiasaan operasional yang sering dipakai tim, mulai dari jam kirim laporan sampai pengingat piutang.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input defaultValue="Batas review akun baru: 24 jam" aria-label="approval sla" />
              <Input defaultValue="Jadwal kirim laporan: 07:00 WIB" aria-label="report schedule" />
              <Input defaultValue="Pengingat upload: pukul 09:00 WIB" aria-label="upload reminder" />
              <Input defaultValue="Pengingat piutang: 3 hari sebelum jatuh tempo" aria-label="aging reminder" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
