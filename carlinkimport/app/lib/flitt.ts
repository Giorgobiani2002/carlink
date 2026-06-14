// Flitt (TBC Group) hosted-checkout integration. Server-side only.
// Signature: SHA1( secret | <non-empty param VALUES, ordered by KEY alphabetically, joined by "|"> ).
import { createHash } from "crypto";

const API_URL = process.env.FLITT_API_URL || "https://pay.flitt.com/api/checkout/url/";

function getCreds() {
  const merchantId = process.env.FLITT_MERCHANT_ID;
  const secret = process.env.FLITT_SECRET_KEY;
  if (!merchantId || !secret) throw new Error("Flitt credentials are not configured.");
  return { merchantId, secret };
}

export function buildSignature(params: Record<string, string>, secret: string): string {
  const values = Object.keys(params)
    .filter((k) => k !== "signature" && k !== "response_signature_string")
    .filter((k) => params[k] !== "" && params[k] != null)
    .sort()
    .map((k) => params[k]);
  const base = [secret, ...values].join("|");
  return createHash("sha1").update(base, "utf8").digest("hex");
}

export async function createCheckout(opts: {
  orderId: string;
  amountGel: number;
  description: string;
  callbackUrl: string;
  responseUrl: string;
}): Promise<{ checkoutUrl: string }> {
  const { merchantId, secret } = getCreds();
  const request: Record<string, string> = {
    order_id: opts.orderId,
    merchant_id: merchantId,
    order_desc: opts.description,
    amount: String(Math.round(opts.amountGel * 100)), // coins
    currency: "GEL",
    server_callback_url: opts.callbackUrl,
    response_url: opts.responseUrl,
  };
  request.signature = buildSignature(request, secret);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request }),
    signal: AbortSignal.timeout(20000),
  });
  const json = (await res.json()) as {
    response?: { response_status?: string; checkout_url?: string; error_message?: string };
  };
  const r = json.response;
  if (!r || r.response_status !== "success" || !r.checkout_url) {
    throw new Error(`Flitt checkout failed: ${r?.error_message || "unknown error"}`);
  }
  return { checkoutUrl: r.checkout_url };
}

// Verify a server callback and return whether the payment is approved.
export function verifyCallback(params: Record<string, string>): {
  valid: boolean;
  paid: boolean;
  orderId: string;
} {
  const { secret } = getCreds();
  const provided = params.signature || "";
  const expected = buildSignature(params, secret);
  const valid = provided.length > 0 && provided === expected;
  const paid = valid && params.order_status === "approved";
  return { valid, paid, orderId: params.order_id || "" };
}
