"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";

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
      // Pegar apenas as 20 recomendações mais recentes
      take: 20,
    });

    return recommendations.map((rec) => ({
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
      createdAt: rec.createdAt,
    }));
  } catch (error) {
    console.error("[GET_USER_RECOMMENDATIONS_ERROR]", error);
    return [];
  }
}
