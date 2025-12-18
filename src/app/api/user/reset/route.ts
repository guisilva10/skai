import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/services/auth";
import db from "@/services/database/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete all user data
    await db.purchaseUrl.deleteMany({
      where: {
        ProductRecommendation: {
          userId: session.user.id,
        },
      },
    });

    await db.productRecommendation.deleteMany({
      where: { userId: session.user.id },
    });

    await db.skinProfile.deleteMany({
      where: { userId: session.user.id },
    });

    await db.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionStatus: "PENDING",
        caktoCustomerId: null,
        caktoSubscriptionId: null,
        subscriptionStartDate: null,
        subscriptionEndDate: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Dados resetados com sucesso!",
    });
  } catch (error) {
    console.error("[RESET_USER_DATA_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to reset user data" },
      { status: 500 },
    );
  }
}
