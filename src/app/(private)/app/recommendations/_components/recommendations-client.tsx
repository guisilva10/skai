"use client";

import { useState, useEffect } from "react";
import {
  CatalogTabs,
  CatalogProduct,
} from "../../catalog/_components/catalog-tabs";
import { getRecommendationsForProfile } from "@/features/skin-profile/server/get-recommendation";
import { Button } from "@/app/_components/ui/button";
import { IconRefresh } from "@tabler/icons-react";
import { toast } from "sonner";

interface RecommendationsClientProps {
  userId: string;
}

export function RecommendationsClient({ userId }: RecommendationsClientProps) {
  const [recommendations, setRecommendations] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      // Tenta pegar do session storage primeiro
      const stored = sessionStorage.getItem("skai_recommendations");

      if (stored && !forceRefresh) {
        // Se tem no storage e não é refresh forçado, usa o cache
        const parsed = JSON.parse(stored);
        // Precisamos converter as datas de string para Date
        const hydrated = parsed.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
        }));
        setRecommendations(hydrated);
        setIsLoading(false);
        return;
      }

      // Se não tem ou é refresh, busca da API
      const newRecommendations = await getRecommendationsForProfile(userId);

      // Enriquece os dados
      const enriched = newRecommendations.map((rec) => ({
        ...rec,
        productId: rec.id,
        brand: rec.searchTerms?.[0] || "",
        createdAt: new Date(),
      }));

      setRecommendations(enriched);

      // Salva no session storage
      sessionStorage.setItem("skai_recommendations", JSON.stringify(enriched));

      if (forceRefresh) {
        toast.success("Novas recomendações geradas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao carregar recomendações:", error);
      toast.error("Erro ao carregar recomendações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  const handleRefresh = () => {
    fetchRecommendations(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
          className="gap-2"
        >
          <IconRefresh
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Gerar Novas Recomendações
        </Button>
      </div>

      <CatalogTabs recommendations={recommendations} isLoading={isLoading} />
    </div>
  );
}
