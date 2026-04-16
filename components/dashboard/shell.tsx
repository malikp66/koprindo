"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutHeader } from "@/components/dashboard/layout-header";
import { Sidebar } from "@/components/dashboard/sidebar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="shell-panel mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1660px] overflow-hidden md:min-h-[calc(100vh-2.5rem)]">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <Sidebar pathname={pathname} mobile onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <main className="flex min-h-full min-w-0 flex-1 flex-col gap-6 bg-transparent p-4 md:p-6 xl:p-8">
        <LayoutHeader
          collapsed={false}
          onToggleSidebar={() => undefined}
          onToggleMobile={() => setMobileOpen((value) => !value)}
        />
        {children}
      </main>
    </div>
  );
}
