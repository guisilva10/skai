import { NextRequest, NextResponse } from "next/server";
import { verifyCaktoWebhook } from "@/lib/cakto/client";
import { processSubscriptionWebhook } from "@/features/subscription/server/process-subscription-webhook";
import { CaktoWebhookEvent } from "@/lib/cakto/types";

const WEBHOOK_SECRET = process.env.CAKTO_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get("x-cakto-signature") || "";

    // Verify webhook signature
    if (WEBHOOK_SECRET && signature) {
      const isValid = await verifyCaktoWebhook(body, signature, WEBHOOK_SECRET);
      if (!isValid) {
        console.error("[CAKTO_WEBHOOK] Invalid signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 },
        );
      }
    } else {
      console.warn(
        "[CAKTO_WEBHOOK] No webhook secret configured or no signature provided",
      );
    }

    // Parse webhook event
    const event: CaktoWebhookEvent = JSON.parse(body);

    // Process the webhook
    await processSubscriptionWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[CAKTO_WEBHOOK_ERROR]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
