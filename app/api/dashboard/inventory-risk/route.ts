import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inventoryPosition, riskEvent } from "@/lib/db/schema";
import { sql, eq, and, or } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "2026-09";

  try {
    const stockOutRisks = await db
      .select({ count: sql<number>`count(*)` })
      .from(riskEvent)
      .where(
        and(
          eq(riskEvent.periodKey, period),
          eq(riskEvent.riskType, "stockout_risk"),
          eq(riskEvent.status, "open")
        )
      );

    const overStockRisks = await db
      .select({ count: sql<number>`count(*)` })
      .from(riskEvent)
      .where(
        and(
          eq(riskEvent.periodKey, period),
          eq(riskEvent.riskType, "overstock_risk"),
          eq(riskEvent.status, "open")
        )
      );

    const totalStock = await db
      .select({ totalClosing: sql<number>`sum(${inventoryPosition.closingStock})` })
      .from(inventoryPosition)
      .where(eq(inventoryPosition.periodKey, period));

    return NextResponse.json({
      success: true,
      data: {
        period,
        totalClosingStock: totalStock[0]?.totalClosing || 0,
        activeStockoutRisks: stockOutRisks[0]?.count || 0,
        activeOverstockRisks: overStockRisks[0]?.count || 0,
        lastUpdatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
