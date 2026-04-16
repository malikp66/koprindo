import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { batchRegistry, sellOutRecord, sellInRecord, inventoryPosition } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Asumsi payload dari n8n memiliki metadata batch dan records
    const { batchId, sourceType, sourceParty, channel, periodMonth, periodYear, fileName, fileChecksum, fileSizeBytes, records, qualityScore, blockingIssueCount } = body;

    if (!batchId || !sourceType) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Tentukan validation status
    let validationStatus: "passed" | "provisional" | "blocked" | "exception_review" = "passed";
    if (blockingIssueCount > 0) {
      validationStatus = "blocked";
    } else if (qualityScore < 90) {
      validationStatus = "provisional";
    }

    // 1. Insert ke batch_registry
    await db.insert(batchRegistry).values({
      batchId,
      sourceType,
      sourceParty,
      channel,
      periodMonth,
      periodYear,
      fileName,
      fileChecksum,
      fileSizeBytes,
      validationStatus: validationStatus as any,
      qualityScore,
    });

    // 2. Insert records sesuai dengan sourceType
    if (sourceType === "sell_out" && records?.length > 0) {
      await db.insert(sellOutRecord).values(
        records.map((r: any) => ({
          batchId,
          periodKey: `${periodYear}-${String(periodMonth).padStart(2, "0")}`,
          channel: r.channel,
          regionCode: r.regionCode,
          branchCode: r.branchCode,
          outletCode: r.outletCode,
          skuCode: r.skuCode,
          qtySellOut: r.qtySellOut,
          salesAmount: r.salesAmount,
          rawRowRef: r.rawRowRef || "n8n_processed",
        }))
      );
    } else if (sourceType === "sell_in" && records?.length > 0) {
      await db.insert(sellInRecord).values(
        records.map((r: any) => ({
          batchId,
          periodKey: `${periodYear}-${String(periodMonth).padStart(2, "0")}`,
          channel: r.channel,
          regionCode: r.regionCode,
          branchCode: r.branchCode,
          outletCode: r.outletCode,
          skuCode: r.skuCode,
          qtySellIn: r.qtySellIn,
          rawRowRef: r.rawRowRef || "n8n_processed",
        }))
      );
    } else if (sourceType === "inventory" && records?.length > 0) {
      await db.insert(inventoryPosition).values(
        records.map((r: any) => ({
          batchId,
          periodKey: `${periodYear}-${String(periodMonth).padStart(2, "0")}`,
          channel: r.channel,
          regionCode: r.regionCode,
          branchCode: r.branchCode,
          outletCode: r.outletCode,
          skuCode: r.skuCode,
          openingStock: r.openingStock,
          closingStock: r.closingStock,
          stockSnapshotDate: new Date(r.snapshotDate).toISOString(),
        }))
      );
    }

    return NextResponse.json({
      success: true,
      message: "Batch successfully registered and records inserted",
      data: { batchId, validationStatus }
    });
  } catch (error: any) {
    console.error("Intake Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
