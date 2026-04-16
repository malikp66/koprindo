import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sellInRecord, sellOutRecord } from "@/lib/db/schema";
import { sql, eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "2026-09";

  try {
    const sellInGrouped = await db
      .select({
        channel: sellInRecord.channel,
        totalQty: sql<number>`sum(${sellInRecord.qtySellIn})`,
      })
      .from(sellInRecord)
      .where(eq(sellInRecord.periodKey, period))
      .groupBy(sellInRecord.channel);

    const sellOutGrouped = await db
      .select({
        channel: sellOutRecord.channel,
        totalQty: sql<number>`sum(${sellOutRecord.qtySellOut})`,
      })
      .from(sellOutRecord)
      .where(eq(sellOutRecord.periodKey, period))
      .groupBy(sellOutRecord.channel);

    return NextResponse.json({
      success: true,
      data: {
        period,
        sellIn: sellInGrouped,
        sellOut: sellOutGrouped,
        lastUpdatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
