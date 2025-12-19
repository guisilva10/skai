"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";

/**
 * Verifica se um produto está favoritado pelo usuário
 */
export async function checkIsFavorited(productId: string): Promise<boolean> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return false;
    }

    const favorite = await db.productRecommendation.findFirst({
      where: {
        userId: session.user.id,
        productId: productId,
      },
    });

    return !!favorite;
  } catch (error) {
    console.error("[CHECK_IS_FAVORITED_ERROR]", error);
    return false;
  }
}

/**
 * Verifica quais produtos de uma lista estão favoritados
 */
export async function checkFavoritedProducts(
  productIds: string[],
): Promise<Record<string, boolean>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {};
    }

    const favorites = await db.productRecommendation.findMany({
      where: {
        userId: session.user.id,
        productId: { in: productIds },
      },
      select: { productId: true },
    });

    const favoritedMap: Record<string, boolean> = {};
    productIds.forEach((id) => {
      favoritedMap[id] = favorites.some((fav) => fav.productId === id);
    });

    return favoritedMap;
  } catch (error) {
    console.error("[CHECK_FAVORITED_PRODUCTS_ERROR]", error);
    return {};
  }
}
