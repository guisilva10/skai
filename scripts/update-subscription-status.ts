import db from "../src/services/database/prisma";

async function updateSubscriptionStatus() {
  const userId = "cmjbvh6i20001mor36tatyhwq";

  console.log("Updating subscription status for user:", userId);

  const user = await db.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: "ACTIVE",
    },
  });

  console.log("Updated user:", user);
  console.log("New subscription status:", user.subscriptionStatus);
}

updateSubscriptionStatus()
  .then(() => {
    console.log("✅ Subscription status updated successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error updating subscription status:", error);
    process.exit(1);
  });
