"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";

export async function toggleFavorite(product: {
  productId: string;
  name: string;
  category: string;
  description: string;
  searchTerms: string[];
  storeName: string;
  storeUrl: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  console.log(
    "[TOGGLE_FAVORITE] Toggling favorite for product:",
    product.productId,
  );

  // Buscar se já existe em ProductRecommendation
  const existing = await db.productRecommendation.findFirst({
    where: {
      userId: session.user.id,
      productId: product.productId,
    },
  });

  if (existing) {
    // Remover (unfavorite)
    console.log("[TOGGLE_FAVORITE] Removing favorite:", existing.id);
    await db.productRecommendation.delete({ where: { id: existing.id } });
    return { isFavorited: false };
  } else {
    // Criar novo registro em ProductRecommendation + PurchaseUrl
    console.log("[TOGGLE_FAVORITE] Adding favorite:", product.name);
    const recommendation = await db.productRecommendation.create({
      data: {
        productId: product.productId,
        name: product.name,
        category: product.category,
        description: product.description,
        searchTerms: product.searchTerms,
        userId: session.user.id,
      },
    });

    await db.purchaseUrl.create({
      data: {
        storeName: product.storeName,
        url: product.storeUrl,
        recommendationId: recommendation.id,
      },
    });

    console.log("[TOGGLE_FAVORITE] Favorite added successfully");
    return { isFavorited: true };
  }
}
