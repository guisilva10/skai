"use client";

import { CatalogTabs } from "./catalog-tabs";
import { useCheckUserFeedback } from "@/features/feedback/hooks/use-feedback";
import { FeedbackDialog } from "@/features/feedback/components/feedback-dialog";
import { useEffect, useState } from "react";

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
  const { data: hasFeedback, isLoading: isLoadingCheck } =
    useCheckUserFeedback();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasOpenedDialog, setHasOpenedDialog] = useState(false);

  useEffect(() => {
    if (!isLoadingCheck && hasFeedback === false && !hasOpenedDialog) {
      // Delay slightly to not be too aggressive
      const timer = setTimeout(() => {
        setIsDialogOpen(true);
        setHasOpenedDialog(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasFeedback, isLoadingCheck, hasOpenedDialog]);

  // Apenas mostra as recomendações salvas, sem gerar novas
  return (
    <>
      <FeedbackDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <CatalogTabs recommendations={initialRecommendations} isLoading={false} />
    </>
  );
}
