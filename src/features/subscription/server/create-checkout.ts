"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";
import { createCaktoCheckout } from "@/lib/cakto/client";
import { redirect } from "next/navigation";

const CAKTO_PRODUCT_ID = process.env.CAKTO_SUBSCRIPTION_PRODUCT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function createSubscriptionCheckout(): Promise<never> {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email) {
    throw new Error("Usuário não autenticado");
  }

  if (!CAKTO_PRODUCT_ID) {
    throw new Error(
      "ID do produto Cakto não configurado. Adicione CAKTO_SUBSCRIPTION_PRODUCT_ID no .env",
    );
  }

  try {
    // Create checkout in Cakto
    const checkout = await createCaktoCheckout({
      productId: CAKTO_PRODUCT_ID,
      customerName: session.user.name || session.user.email,
      customerEmail: session.user.email,
      customerId: session.user.id,
      successUrl: `${APP_URL}/app/checkout/callback?success=true`,
      cancelUrl: `${APP_URL}/app/checkout/callback?success=false`,
    });

    // Update user status to PENDING
    await db.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionStatus: "PENDING",
      },
    });

    console.log("[CAKTO_CHECKOUT] Created checkout:", checkout.id);

    // Redirect to Cakto checkout
    redirect(checkout.checkoutUrl);
  } catch (error) {
    console.error("[CAKTO_CHECKOUT_ERROR]", error);
    throw error;
  }
}
