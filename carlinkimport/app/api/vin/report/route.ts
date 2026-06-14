import { NextRequest, NextResponse } from "next/server";
import { getOrder, getReportById, recentReportByVin } from "../../../lib/vin-db";
import { buildFullReport } from "../../../lib/vin-report";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("order") || "";
  const token = req.nextUrl.searchParams.get("token") || "";
  if (!orderId || !token) {
    return NextResponse.json({ error: "არასწორი მოთხოვნა." }, { status: 400 });
  }

  try {
    const order = await getOrder(orderId);
    if (!order || order.access_token !== token) {
      return NextResponse.json({ error: "წვდომა აკრძალულია." }, { status: 403 });
    }
    if (order.status !== "paid") {
      return NextResponse.json({ status: "pending" });
    }

    let report = order.report_id
      ? await getReportById(order.report_id)
      : await recentReportByVin(order.vin);

    // Fallback: build the full report now if the callback hasn't yet.
    if (report && !report.analysis_json) {
      try {
        const { analysis, history } = await buildFullReport(report);
        report = { ...report, analysis_json: analysis, analysis_text: analysis.narrative, history };
      } catch (error) {
        console.error("vin report generation failed", error);
        return NextResponse.json({ status: "generating" });
      }
    }

    return NextResponse.json({
      status: "paid",
      vin: order.vin,
      vehicle: report?.decoded ?? null,
      recalls: report?.recalls ?? [],
      history: report?.history ?? null,
      analysis: report?.analysis_json ?? null,
    });
  } catch (error) {
    console.error("vin report fetch failed", error);
    return NextResponse.json({ error: "დროებითი შეცდომა." }, { status: 500 });
  }
}
