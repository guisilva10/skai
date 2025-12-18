"use server";

import {
  CaktoAuthResponse,
  CaktoCheckoutRequest,
  CaktoCheckoutResponse,
} from "./types";

const CAKTO_API_URL = process.env.CAKTO_API_URL || "https://api.cakto.com.br";
const CAKTO_CLIENT_ID = process.env.CAKTO_CLIENT_ID;
const CAKTO_CLIENT_SECRET = process.env.CAKTO_CLIENT_SECRET;

if (!CAKTO_CLIENT_ID || !CAKTO_CLIENT_SECRET) {
  console.warn(
    "Cakto credentials not configured. Set CAKTO_CLIENT_ID and CAKTO_CLIENT_SECRET in .env",
  );
}

/**
 * Get OAuth2 access token from Cakto
 */
async function getAccessToken(): Promise<string> {
  console.log("[CAKTO_AUTH] Checking credentials...");
  console.log("[CAKTO_AUTH] Client ID exists:", !!CAKTO_CLIENT_ID);
  console.log("[CAKTO_AUTH] Client Secret exists:", !!CAKTO_CLIENT_SECRET);

  if (!CAKTO_CLIENT_ID || !CAKTO_CLIENT_SECRET) {
    throw new Error("Cakto credentials not configured");
  }

  // Cakto expects x-www-form-urlencoded for the token endpoint
  const params = new URLSearchParams();
  params.append("client_id", CAKTO_CLIENT_ID);
  params.append("client_secret", CAKTO_CLIENT_SECRET);

  const response = await fetch(`${CAKTO_API_URL}/public_api/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[CAKTO_AUTH_ERROR] Status:", response.status);
    console.error("[CAKTO_AUTH_ERROR] Response:", errorText);
    throw new Error(
      `Failed to get Cakto access token: ${response.status} ${errorText}`,
    );
  }

  const data: CaktoAuthResponse = await response.json();
  console.log("[CAKTO_AUTH_SUCCESS] Token received");
  return data.access_token;
}

/**
 * Create a checkout session in Cakto
 */
export async function createCaktoCheckout(
  request: CaktoCheckoutRequest,
): Promise<CaktoCheckoutResponse> {
  const accessToken = await getAccessToken();

  const response = await fetch(`${CAKTO_API_URL}/v1/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      product_id: request.productId,
      customer: {
        name: request.customerName,
        email: request.customerEmail,
        id: request.customerId,
      },
      success_url: request.successUrl,
      cancel_url: request.cancelUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Cakto checkout: ${error}`);
  }

  const data = await response.json();

  return {
    id: data.id,
    checkoutUrl: data.checkout_url || data.url,
    status: data.status,
  };
}

/**
 * Verify webhook signature from Cakto (async wrapper for API routes)
 */
export async function verifyCaktoWebhook(
  payload: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  // Cakto uses HMAC SHA256 for webhook signatures
  const crypto = require("crypto");
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest("hex");

  return signature === expectedSignature;
}
