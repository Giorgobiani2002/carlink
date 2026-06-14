import { NextRequest, NextResponse } from "next/server";
import { verifyCallback } from "../../../lib/flitt";
import { getOrder, getReportById, updateOrder } from "../../../lib/vin-db";
import { buildFullReport } from "../../../lib/vin-report";

export const dynamic = "force-dynamic";

async function parseParams(req: NextRequest): Promise<Record<string, string>> {
  const contentType = req.headers.get("content-type") || "";
  const out: Record<string, string> = {};

  if (contentType.includes("application/json")) {
    const json = (await req.json()) as Record<string, unknown>;
    const obj = (json?.response as Record<string, unknown>) ?? json;
    for (const k in obj) out[k] = String(obj[k] ?? "");
    return out;
  }

  const sp = new URLSearchParams(await req.text());
  sp.forEach((v, k) => (out[k] = v));
  if (out.response) {
    try {
      const o = JSON.parse(out.response) as Record<string, unknown>;
      for (const k in o) out[k] = String(o[k] ?? "");
    } catch {
      /* ignore */
    }
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const params = await parseParams(req);
    const { valid, paid, orderId } = verifyCallback(params);
    if (!valid) return NextResponse.json({ error: "invalid signature" }, { status: 400 });
    if (!paid || !orderId) return NextResponse.json({ ok: true }); // declined/other — acknowledge

    const order = await getOrder(orderId);
    if (!order) return NextResponse.json({ ok: true });

    if (order.status !== "paid") {
      await updateOrder(order.id, {
        status: "paid",
        paid_at: new Date().toISOString(),
        provider_order_id: params.payment_id || order.provider_order_id,
      });
    }

    const report = order.report_id ? await getReportById(order.report_id) : null;
    if (report && !report.analysis_json) {
      try {
        await buildFullReport(report);
      } catch (error) {
        console.error("vin report build failed", error);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("vin callback failed", error);
    return NextResponse.json({ error: "callback error" }, { status: 500 });
  }
}
