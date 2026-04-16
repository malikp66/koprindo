import { type StatusTone } from "@/lib/mock-data";

export function toneToBadge(tone: StatusTone) {
  switch (tone) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "danger":
      return "danger";
    case "info":
      return "info";
    default:
      return "neutral";
  }
}
