import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { normalizeVin, isValidVinFormat, gatherVehicleData } from "../../../lib/vin";
import { recentReportByVin, insertReport, insertOrder, updateOrder } from "../../../lib/vin-db";
import { createCheckout } from "../../../lib/flitt";

export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  let body: { vin?: string; contact?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "არასწორი მოთხოვნა." }, { status: 400 });
  }

  const vin = normalizeVin(body?.vin || "");
  const contact = String(body?.contact || "").trim();
  if (!isValidVinFormat(vin)) {
    return NextResponse.json({ error: "არასწორი VIN." }, { status: 400 });
  }
  if (!contact) {
    return NextResponse.json({ error: "მიუთითე ელფოსტა ან ტელეფონი." }, { status: 400 });
  }

  try {
    let report = await recentReportByVin(vin);
    const fresh = report && Date.now() - new Date(report.created_at).getTime() < DAY;
    if (!fresh) {
      const data = await gatherVehicleData(vin);
      report = await insertReport({ vin, data, analysis: null });
    }

    const accessToken = randomUUID().replace(/-/g, "");
    const order = await insertOrder({ vin, contact, accessToken, reportId: report!.id });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const { checkoutUrl } = await createCheckout({
      orderId: order.id,
      amountGel: 5,
      description: `VIN ანალიზი ${vin}`,
      callbackUrl: `${origin}/api/vin/callback`,
      responseUrl: `${origin}/vin/report?order=${order.id}&token=${accessToken}`,
    });

    await updateOrder(order.id, { provider_order_id: order.id });
    return NextResponse.json({ checkoutUrl, orderId: order.id, token: accessToken });
  } catch (error) {
    console.error("vin checkout failed", error);
    return NextResponse.json({ error: "გადახდის დაწყება ვერ მოხერხდა." }, { status: 500 });
  }
}
