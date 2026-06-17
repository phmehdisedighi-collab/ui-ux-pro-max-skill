/**
 * یکپارچه‌سازی زرین‌پال (REST API v4).
 * مبالغ به ریال ارسال می‌شوند (۱ تومان = ۱۰ ریال).
 * اگر ZARINPAL_SANDBOX=true باشد از درگاه تست استفاده می‌شود.
 */

const isSandbox = process.env.ZARINPAL_SANDBOX === 'true';
const BASE = isSandbox
  ? 'https://sandbox.zarinpal.com/pg'
  : 'https://payment.zarinpal.com/pg';

export const ZARINPAL_START_PAY = `${BASE}/StartPay`;

type RequestResult =
  | { ok: true; authority: string; gatewayUrl: string }
  | { ok: false; error: string };

export async function requestPayment(params: {
  amountToman: number;
  description: string;
  callbackUrl: string;
  email?: string;
  mobile?: string;
}): Promise<RequestResult> {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID!;
  const res = await fetch(`${BASE}/v4/payment/request.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      merchant_id: merchantId,
      amount: params.amountToman * 10, // ریال
      description: params.description,
      callback_url: params.callbackUrl,
      metadata: { email: params.email, mobile: params.mobile },
    }),
  });

  const json = await res.json();
  if (json?.data?.authority && json?.data?.code === 100) {
    return {
      ok: true,
      authority: json.data.authority,
      gatewayUrl: `${ZARINPAL_START_PAY}/${json.data.authority}`,
    };
  }
  return { ok: false, error: json?.errors?.message || 'request_failed' };
}

type VerifyResult =
  | { ok: true; refId: string }
  | { ok: false; error: string; alreadyVerified?: boolean };

export async function verifyPayment(params: {
  authority: string;
  amountToman: number;
}): Promise<VerifyResult> {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID!;
  const res = await fetch(`${BASE}/v4/payment/verify.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      merchant_id: merchantId,
      amount: params.amountToman * 10,
      authority: params.authority,
    }),
  });

  const json = await res.json();
  const code = json?.data?.code;
  if (code === 100) {
    return { ok: true, refId: String(json.data.ref_id) };
  }
  if (code === 101) {
    // قبلاً تأیید شده
    return { ok: true, refId: String(json.data.ref_id) };
  }
  return { ok: false, error: json?.errors?.message || 'verify_failed' };
}
