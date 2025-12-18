import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/services/auth";
import { processSubscriptionWebhook } from "@/features/subscription/server/process-subscription-webhook";

/**
 * TESTE APENAS - Simula um pagamento aprovado da Cakto
 * Use: POST /api/test/simulate-payment
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[TEST] Simulating payment for user:", session.user.email);

    // Simula o evento de webhook da Cakto
    const fakeWebhookEvent = {
      event: "order.approved",
      data: {
        customer: {
          email: session.user.email,
          name: session.user.name || "Test User",
          id: session.user.id,
        },
        subscription: {
          id: `test-sub-${Date.now()}`,
          status: "active",
          startDate: new Date().toISOString(),
          endDate: null,
        },
        status: "paid",
        amount: 90,
      },
    };

    // Processa o webhook
    await processSubscriptionWebhook(fakeWebhookEvent as any);

    return NextResponse.json({
      success: true,
      message: "Pagamento simulado com sucesso! Recomendações sendo geradas...",
      user: session.user.email,
    });
  } catch (error) {
    console.error("[TEST_PAYMENT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to simulate payment" },
      { status: 500 },
    );
  }
}
