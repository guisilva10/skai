"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";
import { redirect } from "next/navigation";

const CAKTO_CHECKOUT_LINK = process.env.CKATO_CHECKOUT_LINK;

export async function createSubscriptionCheckout(): Promise<never> {
  const session = await auth();

  if (!session?.user?.id || !session?.user?.email) {
    throw new Error("Usuário não autenticado");
  }

  if (!CAKTO_CHECKOUT_LINK) {
    throw new Error(
      "Link do checkout Cakto não configurado. Adicione CKATO_CHECKOUT_LINK no .env",
    );
  }

  try {
    // Update user status to PENDING
    await db.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionStatus: "PENDING",
      },
    });

    console.log("[CAKTO_CHECKOUT] Redirecting user to Cakto:", session.user.id);

    // Build checkout URL with user data as query parameters
    const checkoutUrl = new URL(CAKTO_CHECKOUT_LINK);
    checkoutUrl.searchParams.set("customer_email", session.user.email);
    checkoutUrl.searchParams.set(
      "customer_name",
      session.user.name || session.user.email,
    );
    checkoutUrl.searchParams.set("customer_id", session.user.id);

    // Redirect to Cakto checkout
    redirect(checkoutUrl.toString());
  } catch (error) {
    console.error("[CAKTO_CHECKOUT_ERROR]", error);
    throw error;
  }
}
