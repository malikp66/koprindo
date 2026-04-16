import Link from "next/link";
import { cn } from "@/lib/utils";
import { adminItems, navItems } from "@/components/dashboard/icons";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CircleDot, Layers2 } from "lucide-react";

export function Sidebar({
  pathname,
  collapsed = false,
  mobile = false,
  onNavigate,
}: {
  pathname: string;
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <aside
      className={cn(
        "border-r border-border/30 bg-white/90 p-4 backdrop-blur-xl",
        mobile
          ? "flex h-full w-[min(84vw,320px)] flex-col"
          : "sticky top-0 hidden h-screen shrink-0 transition-[width] duration-300 lg:flex flex-col",
        !mobile && (collapsed ? "w-[94px]" : "w-[260px]")
      )}
    >
      <div className={cn("flex items-center gap-3 px-2 pt-1", collapsed && !mobile ? "justify-center" : "justify-between")}>
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-foreground text-white">
            <Layers2 className="h-4 w-4" />
          </div>
          {(!collapsed || mobile) && (
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold">FOX Control Tower</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">Operational control and reporting</p>
            </div>
          )}
        </div>
        {mobile && (
          <Button variant="ghost" size="icon" onClick={onNavigate}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="mt-8 space-y-0.5">
        {(!collapsed || mobile) && (
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/50">Operasional</p>
        )}
        {navItems.map((item) => {
          const active = pathname === item.href.split("#")[0];
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                collapsed && !mobile ? "justify-center" : "gap-3",
                active
                  ? "bg-primary/15 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              )}
              title={collapsed && !mobile ? item.title : undefined}
            >
              {active && !collapsed && !mobile && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary" />}
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl transition-colors", active ? "bg-primary/20 text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                <Icon className="h-4 w-4" />
              </div>
              {(!collapsed || mobile) && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <nav className="mt-6 space-y-0.5 border-t border-border/30 pt-5">
        {(!collapsed || mobile) && (
          <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/50">Admin</p>
        )}
        {adminItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href.split("#")[0];
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                collapsed && !mobile ? "justify-center" : "gap-3",
                active
                  ? "bg-primary/15 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
              )}
              title={collapsed && !mobile ? item.title : undefined}
            >
              {active && !collapsed && !mobile && <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary" />}
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-xl transition-colors", active ? "bg-primary/20 text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
                <Icon className="h-4 w-4" />
              </div>
              {(!collapsed || mobile) && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {(!collapsed || mobile) && (
        <div className="mt-auto rounded-2xl border border-border/30 bg-accent/20 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CircleDot className="h-4 w-4 text-amber-500" />
            Quality gate perlu tindak lanjut
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Batch Indomaret masih provisional dan AksesMu perlu melengkapi periode aktif sebelum siklus laporan ditutup.
          </p>
        </div>
      )}
    </aside>
  );
}
