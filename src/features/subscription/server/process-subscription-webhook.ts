"use server";

import db from "@/services/database/prisma";
import { CaktoWebhookEvent } from "@/lib/cakto/types";
import { getRecommendationsForProfile } from "@/features/skin-profile/server/get-recommendation";

export async function processSubscriptionWebhook(event: CaktoWebhookEvent) {
  const { data } = event;

  console.log("[CAKTO_WEBHOOK] Processing event:", event.event, data);

  // Find user by email or customer ID
  const user = await db.user.findFirst({
    where: {
      OR: [
        { email: data.customer.email },
        { caktoCustomerId: data.customer.id },
      ],
    },
  });

  if (!user) {
    console.error("[CAKTO_WEBHOOK] User not found:", data.customer.email);
    return;
  }

  switch (event.event) {
    case "subscription.created":
    case "subscription.activated":
    case "order.approved":
      // Update user subscription status to ACTIVE
      await db.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: "ACTIVE",
          caktoCustomerId: data.customer.id,
          caktoSubscriptionId: data.subscription?.id,
          subscriptionStartDate: data.subscription?.startDate
            ? new Date(data.subscription.startDate)
            : new Date(),
          subscriptionEndDate: data.subscription?.endDate
            ? new Date(data.subscription.endDate)
            : null,
        },
      });

      console.log("[CAKTO_WEBHOOK] Subscription activated for user:", user.id);

      // Check if user has skin profile but no recommendations yet
      const skinProfile = await db.skinProfile.findUnique({
        where: { userId: user.id },
      });

      const existingRecommendations = await db.productRecommendation.findFirst({
        where: { userId: user.id },
      });

      // Generate recommendations if profile exists but no recommendations
      if (skinProfile && !existingRecommendations) {
        console.log(
          "[CAKTO_WEBHOOK] Generating recommendations for user:",
          user.id,
        );
        try {
          // Call recommendation function (it will handle the user context)
          // We need to pass the userId since this is called from webhook
          await generateRecommendationsForUser(user.id);
        } catch (error) {
          console.error(
            "[CAKTO_WEBHOOK] Error generating recommendations:",
            error,
          );
        }
      }
      break;

    case "subscription.canceled":
      await db.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: "CANCELED",
        },
      });
      console.log("[CAKTO_WEBHOOK] Subscription canceled for user:", user.id);
      break;

    case "subscription.expired":
      await db.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: "EXPIRED",
        },
      });
      console.log("[CAKTO_WEBHOOK] Subscription expired for user:", user.id);
      break;

    default:
      console.log("[CAKTO_WEBHOOK] Unhandled event:", event.event);
  }
}

// Helper function to generate recommendations for a specific user
async function generateRecommendationsForUser(userId: string) {
  try {
    await getRecommendationsForProfile(userId);
    console.log(
      "[CAKTO_WEBHOOK] Recommendations generated successfully for user:",
      userId,
    );
  } catch (error) {
    console.error("[CAKTO_WEBHOOK] Error generating recommendations:", error);
    throw error;
  }
}
