// Paid-flow report builder: pull VinAudit history (paid call), run the Gemini
// analysis over the full data, and persist both. Used by the callback and the
// report-fetch fallback. Server-side only.
import { fetchHistory, type HistoryRecord } from "./history";
import { generateAnalysis, type VinAnalysis } from "./gemini";
import { finalizeReport, type ReportRow } from "./vin-db";

export async function buildFullReport(
  report: ReportRow,
): Promise<{ analysis: VinAnalysis; history: HistoryRecord }> {
  const history = await fetchHistory(report.vin, report.id);
  const analysis = await generateAnalysis({
    decoded: report.decoded,
    recalls: report.recalls,
    auction: report.auction,
    history,
    checkDigitValid: true,
  });
  await finalizeReport(report.id, { history, analysis });
  return { analysis, history };
}
