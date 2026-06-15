const ZARINPAL_MERCHANT = process.env.ZARINPAL_MERCHANT_ID!
const ZARINPAL_REQUEST_URL = 'https://api.zarinpal.com/pg/v4/payment/request.json'
const ZARINPAL_VERIFY_URL = 'https://api.zarinpal.com/pg/v4/payment/verify.json'
const ZARINPAL_GATEWAY = 'https://www.zarinpal.com/pg/StartPay'

export interface ZarinpalRequestResult {
  authority: string
  url: string
}

export async function createPayment(
  amount: number,
  description: string,
  callbackUrl: string,
  email?: string,
  mobile?: string
): Promise<ZarinpalRequestResult> {
  const response = await fetch(ZARINPAL_REQUEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: ZARINPAL_MERCHANT,
      amount: amount * 10, // Toman to Rial
      description,
      callback_url: callbackUrl,
      metadata: { email, mobile },
    }),
  })

  const data = await response.json()
  if (data.data?.code !== 100) {
    throw new Error(`ZarinPal error: ${data.errors?.message || 'Unknown error'}`)
  }

  return {
    authority: data.data.authority,
    url: `${ZARINPAL_GATEWAY}/${data.data.authority}`,
  }
}

export async function verifyPayment(
  authority: string,
  amount: number
): Promise<{ refId: string }> {
  const response = await fetch(ZARINPAL_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      merchant_id: ZARINPAL_MERCHANT,
      authority,
      amount: amount * 10,
    }),
  })

  const data = await response.json()
  if (data.data?.code !== 100 && data.data?.code !== 101) {
    throw new Error(`Payment verification failed: ${data.errors?.message || 'Unknown'}`)
  }

  return { refId: String(data.data.ref_id) }
}
