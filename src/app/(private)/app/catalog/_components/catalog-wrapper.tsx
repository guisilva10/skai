"use client";

import { useState, useEffect } from "react";
import { CatalogTabs } from "./catalog-tabs";
import { getRecommendationsForProfile } from "@/features/skin-profile/server/get-recommendation";
import { getUserRecommendations } from "@/features/skin-profile/server/get-user-recommendations";

type CatalogProduct = {
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

type CatalogWrapperProps = {
  initialRecommendations: CatalogProduct[];
  hasProfile: boolean;
  needsGeneration: boolean;
};

export function CatalogWrapper({
  initialRecommendations,
  hasProfile,
  needsGeneration,
}: CatalogWrapperProps) {
  const [recommendations, setRecommendations] = useState<CatalogProduct[]>(
    initialRecommendations,
  );
  const [isLoading, setIsLoading] = useState(needsGeneration);

  useEffect(() => {
    async function generateRecommendations() {
      if (!needsGeneration || !hasProfile) return;

      try {
        // Gerar recomendações via IA
        await getRecommendationsForProfile();

        // Buscar recomendações atualizadas
        const updatedRecommendations = await getUserRecommendations();
        setRecommendations(updatedRecommendations);
      } catch (error) {
        console.error("Erro ao gerar recomendações:", error);
      } finally {
        setIsLoading(false);
      }
    }

    generateRecommendations();
  }, [needsGeneration, hasProfile]);

  return (
    <CatalogTabs recommendations={recommendations} isLoading={isLoading} />
  );
}
