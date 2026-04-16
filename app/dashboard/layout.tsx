import { DemoConsoleProvider } from "@/components/dashboard/demo-console-provider";
import { DashboardShell } from "@/components/dashboard/shell";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoConsoleProvider>
      <DashboardShell>{children}</DashboardShell>
      <Toaster position="top-right" />
    </DemoConsoleProvider>
  );
}
