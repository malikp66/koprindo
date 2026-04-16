"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  CircleX,
  Clock3,
  Link2,
  ShieldAlert,
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
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { registrationQueue, registrationStats, userDirectory } from "@/lib/mock-data";

type RegistrationRow = (typeof registrationQueue)[number];

const governanceMetrics = [
  { label: "Pending Review", value: "12", note: "Persetujuan user baru" },
  { label: "Role Coverage", value: "22 akun", note: "Internal dan partner aktif" },
  { label: "Connector Readiness", value: "3 siap integrasi", note: "State orkestrasi dan sinkronisasi" },
  { label: "Policy Breach", value: "0", note: "Belum ada threshold kritis" },
];

const connectorCards = [
  { title: "n8n Workflow", status: "Ready for orchestration", note: "Workflow event sudah dipetakan untuk intake, reminder, dan reporting.", tone: "info" as const },
  { title: "Google Sheets", status: "Connected", note: "Disiapkan untuk batch intake dan pelaporan berkala.", tone: "success" as const },
  { title: "WhatsApp Gateway", status: "Queued for activation", note: "Disiapkan untuk reminder upload dan aging payment.", tone: "warning" as const },
  { title: "Storage / Parser", status: "Awaiting activation", note: "Struktur batch dan quality gate sudah siap menerima parser dan storage service.", tone: "neutral" as const },
];

export default function AdminPage() {
  const [selectedRegistration, setSelectedRegistration] = React.useState<RegistrationRow>(registrationQueue[0]);
  const [activeTab, setActiveTab] = React.useState("approvals");

  React.useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "integrasi") {
        setActiveTab("connectors");
        return;
      }
      if (hash === "pengaturan") {
        setActiveTab("policy");
        return;
      }
      if (hash === "pengguna") {
        setActiveTab("users");
        return;
      }
      setActiveTab("approvals");
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const registrationColumns: ColumnDef<RegistrationRow>[] = [
    { accessorKey: "name", header: () => <SortableHeader label="Nama" />, cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "type", header: "Tipe User" },
    { accessorKey: "org", header: "Organisasi" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "whatsapp", header: "WA" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "otp", header: "OTP", cell: ({ row }) => <Badge variant="info">{row.original.otp}</Badge> },
    { accessorKey: "approval", header: "Approval", cell: ({ row }) => <Badge variant={row.original.approval === "Pending Review" ? "warning" : "danger"}>{row.original.approval}</Badge> },
  ];

  const userColumns: ColumnDef<(typeof userDirectory)[number]>[] = [
    { accessorKey: "code", header: "Kode" },
    { accessorKey: "name", header: () => <SortableHeader label="Nama" />, cell: ({ row }) => <span className="font-medium">{row.original.name}</span> },
    { accessorKey: "type", header: "Tipe" },
    { accessorKey: "unit", header: "Unit" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant="success">{row.original.status}</Badge> },
    { accessorKey: "lastActivity", header: () => <SortableHeader label="Last Activity" /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Governance"
        title="Access Control and Governance"
        description="Workspace governance untuk approval pengguna, role mapping, kesiapan integrasi, dan policy threshold agar operasi control tower tetap terkendali."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success("Export direktori diproses", { description: "Download file CSV akan dimulai." })}>Export Directory</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus data-icon="inline-start" />
                  Tambah Pengguna
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Pengguna</DialogTitle>
                  <DialogDescription>Buat akun baru untuk koordinator internal, finance, konsultan, atau PIC ritel.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input placeholder="Nama lengkap" />
                  <Input placeholder="Email" />
                  <Select defaultValue="internal">
                    <SelectTrigger>
                      <SelectValue placeholder="Tipe pengguna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Koordinator Internal</SelectItem>
                      <SelectItem value="ritel">PIC Ritel</SelectItem>
                      <SelectItem value="consultant">Konsultan</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Nomor WhatsApp" />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => toast.info("Undangan dibatalkan")}>Batal</Button>
                  <Button onClick={() => toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), { loading: "Menyimpan...", success: "Undangan dikirim ke email tujuan." })}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {governanceMetrics.map((item) => (
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
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="connectors">Connectors</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
        </TabsList>

        <TabsContent value="approvals" className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {registrationStats.map((item) => (
              <Card key={item.label}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <div className="mt-3 text-2xl tracking-tight tabular text-foreground">{item.value}</div>
                    </div>
                    <Badge variant={toneToBadge(item.tone)}>{item.tone}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card>
              <CardHeader>
                <CardTitle>Approval Queue</CardTitle>
                <CardDescription>Antrean approval untuk menjaga akses sistem tetap terkontrol sejak tahap implementasi awal hingga operasional penuh.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={registrationColumns}
                  data={registrationQueue}
                  searchPlaceholder="Cari applicant..."
                  onRowClick={setSelectedRegistration}
                  toolbar={
                    <>
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Tipe user" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Tipe</SelectItem>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="ritel">PIC Ritel</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="pending">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status approval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending Review</SelectItem>
                          <SelectItem value="revision">Needs Revision</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review Decision</CardTitle>
                <CardDescription>Panel review untuk keputusan akses, verifikasi identitas, dan penetapan role pengguna.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Applicant</p>
                      <h3 className="mt-2 text-xl tracking-tight text-foreground">{selectedRegistration.name}</h3>
                    </div>
                    <Badge variant={selectedRegistration.approval === "Pending Review" ? "warning" : "danger"}>
                      {selectedRegistration.approval}
                    </Badge>
                  </div>
                </div>
                {[
                  ["Tipe", selectedRegistration.type],
                  ["Organisasi", selectedRegistration.org],
                  ["Jabatan", selectedRegistration.role],
                  ["OTP Status", selectedRegistration.otp],
                  ["Email", selectedRegistration.email],
                ].map(([label, value]) => (
                  <div key={label} className="kv-row">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button className="gap-2" onClick={() => toast.success("Akses disetujui")}>
                    <CheckCircle2 data-icon="inline-start" /> Setujui
                  </Button>
                  <Button variant="secondary" className="gap-2" onClick={() => toast.info("Meminta revisi dokumen")}>
                    <Clock3 data-icon="inline-start" /> Revisi
                  </Button>
                  <Button variant="destructive" className="gap-2" onClick={() => toast.error("Permintaan akses ditolak")}>
                    <CircleX data-icon="inline-start" /> Tolak
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Direktori akun aktif untuk internal Koprindo, partner, dan PIC ritel yang akan memakai sistem ini.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={userColumns}
                  data={userDirectory}
                  searchPlaceholder="Cari user aktif..."
                  toolbar={
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Status akun" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role and Access Notes</CardTitle>
                <CardDescription>Kontrol minimum yang perlu dijaga untuk operasi campuran executive dan operasional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: ShieldAlert, title: "Approval SLA", note: "Target review maksimum 24 jam sejak submit." },
                  { icon: CheckCircle2, title: "Role mapping", note: "Konsultan, admin, finance, dan PIC ritel memiliki hak akses view yang berbeda." },
                  { icon: Clock3, title: "Ownership", note: "Semua channel punya owner yang jelas untuk upload, exception, dan laporan." },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-border/25 bg-accent/20 p-4">
                    <item.icon className="h-5 w-5 text-primary" />
                    <p className="mt-3 text-sm font-medium text-foreground">{item.title}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{item.note}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        <TabsContent value="connectors">
          <Card>
            <CardHeader>
              <CardTitle>Connector Readiness</CardTitle>
              <CardDescription>Kesiapan integrasi yang dipetakan dari sisi orkestrasi, storage, reminder, dan pelaporan.</CardDescription>
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

        <TabsContent value="policy">
          <Card>
            <CardHeader>
              <CardTitle>Policy and Threshold</CardTitle>
              <CardDescription>Panel ringkas untuk threshold quality gate, SLA approval, dan preferensi notifikasi operasional.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Input defaultValue="24 jam" aria-label="approval sla" />
              <Input defaultValue="07:00 WIB" aria-label="scheduler report" />
              <Input defaultValue="Quality score minimum 85" aria-label="quality gate" />
              <Input defaultValue="Reminder aging 3 hari sebelum jatuh tempo" aria-label="aging reminder" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
