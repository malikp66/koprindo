"use client";

import * as React from "react";

export const demoRoleOptions = [
  { value: "executive", label: "Admin" },
  { value: "operations", label: "Operasional" },
  { value: "finance", label: "Keuangan" },
  { value: "consultant", label: "Konsultan" },
  { value: "principal", label: "Prinsipal" },
  { value: "retail", label: "Retail PIC" },
] as const;

export const demoPeriodOptions = [
  { value: "sep-2026", label: "September 2026" },
  { value: "agu-2026", label: "Agustus 2026" },
  { value: "jul-2026", label: "Juli 2026" },
] as const;

export const demoChannelOptions = [
  { value: "all", label: "Semua Channel" },
  { value: "alfamart", label: "Alfamart" },
  { value: "indomaret", label: "Indomaret" },
  { value: "aksesmu", label: "AksesMu" },
] as const;

type DemoRole = (typeof demoRoleOptions)[number]["value"];
type DemoPeriod = (typeof demoPeriodOptions)[number]["value"];
type DemoChannel = (typeof demoChannelOptions)[number]["value"];

type DemoConsoleContextValue = {
  role: DemoRole;
  period: DemoPeriod;
  channel: DemoChannel;
  setRole: (role: DemoRole) => void;
  setPeriod: (period: DemoPeriod) => void;
  setChannel: (channel: DemoChannel) => void;
  roleLabel: string;
  periodLabel: string;
  channelLabel: string;
};

const DemoConsoleContext = React.createContext<DemoConsoleContextValue | null>(null);

function findLabel<T extends readonly { value: string; label: string }[]>(options: T, value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function DemoConsoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = React.useState<DemoRole>("executive");
  const [period, setPeriod] = React.useState<DemoPeriod>("sep-2026");
  const [channel, setChannel] = React.useState<DemoChannel>("all");

  const value = React.useMemo<DemoConsoleContextValue>(
    () => ({
      role,
      period,
      channel,
      setRole,
      setPeriod,
      setChannel,
      roleLabel: findLabel(demoRoleOptions, role),
      periodLabel: findLabel(demoPeriodOptions, period),
      channelLabel: findLabel(demoChannelOptions, channel),
    }),
    [role, period, channel]
  );

  return <DemoConsoleContext.Provider value={value}>{children}</DemoConsoleContext.Provider>;
}

export function useDemoConsole() {
  const context = React.useContext(DemoConsoleContext);

  if (!context) {
    throw new Error("useDemoConsole must be used within DemoConsoleProvider");
  }

  return context;
}
