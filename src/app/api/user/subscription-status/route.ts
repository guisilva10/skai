import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/services/auth";
import db from "@/services/database/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionStatus: true,
        caktoCustomerId: true,
        caktoSubscriptionId: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      status: user.subscriptionStatus,
      customerId: user.caktoCustomerId,
      subscriptionId: user.caktoSubscriptionId,
      startDate: user.subscriptionStartDate,
      endDate: user.subscriptionEndDate,
    });
  } catch (error) {
    console.error("[SUBSCRIPTION_STATUS_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to get subscription status" },
      { status: 500 },
    );
  }
}
