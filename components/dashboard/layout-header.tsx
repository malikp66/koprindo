"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellRing,
  Menu,
  UserCircle2,
  Boxes,
  Check,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useDemoConsole, demoRoleOptions } from "@/components/dashboard/demo-console-provider";
import { Button } from "@/components/ui/button";
import { navItems } from "@/components/dashboard/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export function LayoutHeader({
  onToggleMobile,
}: {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onToggleMobile: () => void;
  }) {
  const pathname = usePathname();
  const { roleLabel, role, setRole } = useDemoConsole();

  return (
    <header className="grid gap-5 xl:grid-cols-[auto_1fr_auto] xl:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="outline" size="icon" className="shrink-0 lg:hidden" onClick={onToggleMobile}>
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-foreground text-white">
            <Boxes className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight text-foreground">FOX Control Tower</h2>
          </div>
        </div>
      </div>

      <div className="flex min-w-0 xl:justify-center">
        <div className="hidden w-fit rounded-full border border-border/30 bg-white p-1 shadow-soft lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 xl:justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" title="Notifications" className="relative">
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-500" />
              <BellRing className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="border-b border-border/30 px-4 py-3">
              <h3 className="font-medium">Prioritas Notifikasi</h3>
            </div>
            <div className="flex max-h-[300px] flex-col overflow-auto py-1">
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-accent/50 cursor-pointer">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-orange-500 shrink-0" />
                <div className="grid gap-1">
                  <p className="text-sm border-b-0 font-medium">Aging Payment Alert</p>
                  <p className="text-xs text-muted-foreground">3 invoice dari Alfamart mendekati bracket 46-60 hari.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-accent/50 cursor-pointer">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-red-500 shrink-0" />
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Stockout Warning</p>
                  <p className="text-xs text-muted-foreground">Ketersediaan gudang Cirebon untuk SKU beras menipis.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 px-4 py-3 hover:bg-accent/50 cursor-pointer">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" />
                <div className="grid gap-1">
                  <p className="text-sm font-medium">Batch Processed</p>
                  <p className="text-xs text-muted-foreground">Data sell-out Indomaret batch Sep-2026 berhasil divalidasi.</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border/30 px-4 py-2">
              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => {}}>Tandai semua dibaca</Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none ml-1">
            <div className="flex items-center gap-3 rounded-full border border-border/30 bg-white px-4 py-2 shadow-soft hover:bg-accent/50 transition-colors">
              <UserCircle2 className="h-7 w-7 text-muted-foreground" />
              <div className="hidden pr-1 text-sm leading-tight sm:block text-left">
                <div className="font-medium text-foreground">{roleLabel} Workspace</div>
                <div className="text-xs text-muted-foreground">akses pengguna aktif</div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch Role (Demo)</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {demoRoleOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value} 
                onClick={() => setRole(option.value)}
                className="justify-between"
              >
                {option.label}
                {role === option.value && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
