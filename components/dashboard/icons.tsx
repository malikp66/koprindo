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
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Data Intake", href: "/dashboard/upload", icon: FileSpreadsheet },
  { title: "Monitoring", href: "/dashboard/monitoring", icon: Gauge },
  { title: "Exceptions", href: "/dashboard/retur", icon: ReceiptText },
  { title: "Reports", href: "/dashboard/laporan", icon: ClipboardList }
];

export const adminItems = [
  { title: "Documentation", href: "/dashboard/documentation", icon: BookOpenText },
  { title: "Governance", href: "/dashboard/admin", icon: UserCog },
  { title: "Connectors", href: "/dashboard/admin#integrasi", icon: ShieldCheck },
  { title: "Policy", href: "/dashboard/admin#pengaturan", icon: Settings }
];
