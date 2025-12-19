"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";
import { getProductById } from "@/lib/product-catalog";

export type FavoriteProduct = {
  id: string;
  productId: string;
  name: string;
  category: string;
  description: string;
  searchTerms: string[];
  purchaseUrls: {
    storeName: string;
    url: string;
  }[];
  imageUrl?: string;
  price?: number;
  brand?: string;
  createdAt: Date;
};

export async function getUserFavorites(): Promise<FavoriteProduct[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    const favorites = await db.productRecommendation.findMany({
      where: { userId: session.user.id },
      include: { PurchaseUrl: true },
      orderBy: { createdAt: "desc" },
    });

    console.log(
      `[GET_USER_FAVORITES] Found ${favorites.length} favorites for user ${session.user.id}`,
    );

    // Enriquecer com dados do catálogo
    const enrichedFavorites = await Promise.all(
      favorites.map(async (fav) => {
        const productData = await getProductById(fav.productId);

        return {
          id: fav.id,
          productId: fav.productId,
          name: fav.name,
          category: fav.category,
          description: fav.description,
          searchTerms: fav.searchTerms,
          purchaseUrls: fav.PurchaseUrl.map((url) => ({
            storeName: url.storeName,
            url: url.url,
          })),
          imageUrl: productData?.image_url,
          price: productData?.price,
          brand: productData?.brand,
          createdAt: fav.createdAt,
        };
      }),
    );

    return enrichedFavorites;
  } catch (error) {
    console.error("[GET_USER_FAVORITES_ERROR]", error);
    return [];
  }
}
