import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sellOutRecord, riskEvent, paymentRecord } from "@/lib/db/schema";
import { sql, eq, or, and } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "2026-09";
  const channel = searchParams.get("channel") ?? "all";

  try {
    // 1. Fetch Headline KPIs from sellOutRecord
    const sellOutStats = await db
      .select({
        totalSellOut: sql<number>`sum(${sellOutRecord.qtySellOut})`,
        totalSales: sql<number>`sum(${sellOutRecord.salesAmount})`,
      })
      .from(sellOutRecord)
      .where(
        and(
          eq(sellOutRecord.periodKey, period),
          channel === "all" ? undefined : eq(sellOutRecord.channel, channel as any)
        )
      );

    // 2. Fetch Open Risks from riskEvent
    const openRisks = await db
      .select({
        count: sql<number>`count(*)`,
        severity: riskEvent.severity,
      })
      .from(riskEvent)
      .where(
        and(
          eq(riskEvent.periodKey, period),
          eq(riskEvent.status, "open"),
          or(eq(riskEvent.severity, "high"), eq(riskEvent.severity, "critical"))
        )
      )
      .groupBy(riskEvent.severity);

    // 3. Outstanding / Overdue from paymentRecord
    const paymentStats = await db
      .select({
        outstanding: sql<number>`sum(${paymentRecord.invoiceAmount} - ${paymentRecord.paidAmount})`,
        overdueCount: sql<number>`count(*)`,
      })
      .from(paymentRecord)
      .where(eq(paymentRecord.paymentStatus, "overdue"));

    return NextResponse.json({
      success: true,
      data: {
        period,
        channel,
        sellOutTotal: sellOutStats[0]?.totalSellOut || 0,
        salesTotal: sellOutStats[0]?.totalSales || 0,
        riskEvents: openRisks,
        paymentExposure: {
          outstandingAmount: paymentStats[0]?.outstanding || 0,
          overdueInvoices: paymentStats[0]?.overdueCount || 0,
        },
        lastUpdatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
