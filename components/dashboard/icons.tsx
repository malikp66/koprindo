import {
  BookOpenText,
  ClipboardList,
  FileSpreadsheet,
  Gauge,
  LayoutDashboard,
  ReceiptText,
  Settings,
  ShieldCheck,
  UserCog
} from "lucide-react";

export const navItems = [
  { title: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { title: "Penerimaan Data", href: "/dashboard/upload", icon: FileSpreadsheet },
  { title: "Monitoring", href: "/dashboard/monitoring", icon: Gauge },
  { title: "Retur & Koreksi", href: "/dashboard/retur", icon: ReceiptText },
  { title: "Laporan", href: "/dashboard/laporan", icon: ClipboardList }
];

export const adminItems = [
  { title: "Panduan Penggunaan", href: "/dashboard/documentation", icon: BookOpenText },
  { title: "Tata Kelola", href: "/dashboard/admin", icon: UserCog },
  { title: "Integrasi", href: "/dashboard/admin#integrasi", icon: ShieldCheck },
  { title: "Kebijakan", href: "/dashboard/admin#pengaturan", icon: Settings }
];
