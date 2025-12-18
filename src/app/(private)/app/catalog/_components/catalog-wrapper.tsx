"use client";

import { CatalogTabs } from "./catalog-tabs";

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
};

export function CatalogWrapper({
  initialRecommendations,
  hasProfile,
}: CatalogWrapperProps) {
  // Apenas mostra as recomendações salvas, sem gerar novas
  return (
    <CatalogTabs recommendations={initialRecommendations} isLoading={false} />
  );
}
