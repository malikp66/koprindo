"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { toneToBadge } from "@/components/dashboard/tone";
import { branchRanking } from "@/lib/mock-data";

type BranchRow = (typeof branchRanking)[number];

const columns: ColumnDef<BranchRow>[] = [
  {
    accessorKey: "rank",
    header: () => <SortableHeader label="Rank" />,
    cell: ({ row }) => <span className="tabular font-semibold">{row.original.rank}</span>,
  },
  {
    accessorKey: "branch",
    header: () => <SortableHeader label="Cabang" />,
    cell: ({ row }) => <span className="font-medium">{row.original.branch}</span>,
  },
  {
    accessorKey: "region",
    header: () => <SortableHeader label="Wilayah" />,
  },
  {
    accessorKey: "sellout",
    header: () => <SortableHeader label="Sell-out" />,
    cell: ({ row }) => <span className="tabular">{row.original.sellout}</span>,
  },
  {
    accessorKey: "growth",
    header: () => <SortableHeader label="Growth" />,
    cell: ({ row }) => <span className="tabular">{row.original.growth}</span>,
  },
  {
    accessorKey: "activeOutlet",
    header: () => <SortableHeader label="Outlet Aktif" />,
    cell: ({ row }) => <span className="tabular">{row.original.activeOutlet}</span>,
  },
  {
    accessorKey: "stock",
    header: "Status",
    cell: ({ row }) => <Badge variant={toneToBadge(row.original.tone)}>{row.original.stock}</Badge>,
  },
];

export function BranchRankingTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Ranking Center</CardTitle>
        <CardDescription>Data table interaktif untuk top performer dan cabang yang perlu intervensi.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={branchRanking} searchPlaceholder="Cari cabang atau wilayah..." />
      </CardContent>
    </Card>
  );
}
