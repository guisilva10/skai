import { auth } from "@/services/auth";
import db from "@/services/database/prisma";

/**
 * Get the subscription status for the current authenticated user
 * @returns The subscription status ('ACTIVE', 'PENDING', 'CANCELED', 'EXPIRED') or null if not found
 */
export async function getSubscriptionStatus(): Promise<string | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      subscriptionStatus: true,
    },
  });

  // Convert enum to string for easier comparison
  const status = user?.subscriptionStatus
    ? String(user.subscriptionStatus)
    : null;

  return status;
}
