"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";
import { getProductById } from "@/lib/product-catalog";

export type CatalogProduct = {
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

export async function getUserRecommendations(): Promise<CatalogProduct[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }

    const recommendations = await db.productRecommendation.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        PurchaseUrl: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(
      `[GET_USER_RECOMMENDATIONS] Encontradas ${recommendations.length} recomendações para o usuário ${session.user.id}`,
    );

    // Buscar dados adicionais dos produtos do catálogo
    const enrichedRecommendations = await Promise.all(
      recommendations.map(async (rec) => {
        // Tentar buscar dados completos do produto
        const productData = await getProductById(rec.productId);

        return {
          id: rec.id,
          productId: rec.productId,
          name: rec.name,
          category: rec.category,
          description: rec.description,
          searchTerms: rec.searchTerms,
          purchaseUrls: rec.PurchaseUrl.map((url) => ({
            storeName: url.storeName,
            url: url.url,
          })),
          imageUrl: productData?.image_url,
          price: productData?.price,
          brand: productData?.brand,
          createdAt: rec.createdAt,
        };
      }),
    );

    return enrichedRecommendations;
  } catch (error) {
    console.error("[GET_USER_RECOMMENDATIONS_ERROR]", error);
    return [];
  }
}
