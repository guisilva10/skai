"use server";

import prisma from "@/services/database/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/services/auth";

export type FeedbackData = {
  name: string;
  role?: string;
  message: string;
  userId?: string;
};

export async function submitFeedback(data: FeedbackData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    await prisma.feedback.create({
      data: {
        name: data.name,
        role: data.role,
        message: data.message,
        imageUrl: session?.user?.image,
        userId: userId || data.userId,
      },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, error: "Failed to submit feedback" };
  }
}
