import { NextRequest, NextResponse } from "next/server";
import {
  normalizeVin,
  isValidVinFormat,
  checkDigitValid,
  gatherVehicleData,
} from "../../../lib/vin";
import { recentReportByVin, insertReport } from "../../../lib/vin-db";

export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  let vin = "";
  try {
    vin = normalizeVin((await req.json())?.vin);
  } catch {
    return NextResponse.json({ error: "არასწორი მოთხოვნა." }, { status: 400 });
  }
  if (!isValidVinFormat(vin)) {
    return NextResponse.json(
      { error: "VIN უნდა იყოს 17 სიმბოლო (ლათინური ასოები და ციფრები, გარდა I/O/Q)." },
      { status: 400 },
    );
  }

  try {
    // Cache is best-effort: a missing/unconfigured DB must not break the free teaser.
    let cached = null;
    try {
      cached = await recentReportByVin(vin);
    } catch (e) {
      console.warn("vin cache read skipped", e);
    }
    const fresh = cached && Date.now() - new Date(cached.created_at).getTime() < DAY;

    let decoded = cached?.decoded;
    let recalls = cached?.recalls;
    let auctionAvailable = cached?.auction?.available ?? false;

    if (!fresh) {
      const data = await gatherVehicleData(vin);
      decoded = data.decoded;
      recalls = data.recalls;
      auctionAvailable = data.auction.available;
      try {
        await insertReport({ vin, data, analysis: null });
      } catch (e) {
        console.warn("vin cache write skipped", e);
      }
    }

    if (!decoded?.make) {
      return NextResponse.json(
        { error: "ამ VIN-ით მანქანა ვერ მოიძებნა. გადაამოწმე ნომერი." },
        { status: 404 },
      );
    }

    const engine = [
      decoded.displacementL && `${decoded.displacementL}L`,
      decoded.engineCylinders && `${decoded.engineCylinders} ცილ.`,
      decoded.fuelType,
    ]
      .filter(Boolean)
      .join(" · ");

    return NextResponse.json({
      vin,
      vehicle: {
        make: decoded.make,
        model: decoded.model,
        year: decoded.year,
        trim: decoded.trim,
        bodyClass: decoded.bodyClass,
        engine,
        driveType: decoded.driveType,
        plant: [decoded.plantCity, decoded.plantCountry].filter(Boolean).join(", "),
      },
      recallCount: Array.isArray(recalls) ? recalls.length : 0,
      auctionAvailable,
      checkDigitValid: checkDigitValid(vin),
    });
  } catch (error) {
    console.error("vin preview failed", error);
    return NextResponse.json({ error: "დროებითი შეცდომა. სცადე ხელახლა." }, { status: 500 });
  }
}
