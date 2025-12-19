"use server";

import prisma from "@/services/database/prisma";
import { auth } from "@/services/auth";

export async function checkUserFeedback() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { hasFeedback: false };
    }

    const count = await prisma.feedback.count({
      where: { userId: session.user.id },
    });

    return { hasFeedback: count > 0 };
  } catch (error) {
    console.error("Error checking user feedback:", error);
    return { hasFeedback: false };
  }
}
