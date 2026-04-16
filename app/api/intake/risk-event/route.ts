import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { riskEvent } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Asumsi payload dari n8n berisi array of events atau single event object
    const events = Array.isArray(body) ? body : [body];

    await db.insert(riskEvent).values(
      events.map((e: any) => ({
        periodKey: e.periodKey,
        riskType: e.riskType,
        severity: e.severity,
        entityType: e.entityType,
        entityKey: e.entityKey,
        metricName: e.metricName,
        observedValue: e.observedValue,
        thresholdValue: e.thresholdValue,
        status: e.status || "open",
        ownerRole: e.ownerRole || "admin",
      }))
    );

    return NextResponse.json({
      success: true,
      message: `${events.length} risk events created`,
    });
  } catch (error: any) {
    console.error("Intake Risk Event Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
