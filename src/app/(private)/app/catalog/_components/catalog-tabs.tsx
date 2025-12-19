"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import {
  IconExternalLink,
  IconLoader2,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { toggleFavorite } from "@/features/favorites/server/toggle-favorite";
import { checkFavoritedProducts } from "@/features/favorites/server/check-favorited";
import { cn } from "@/app/_lib/utils";

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

type CatalogTabsProps = {
  recommendations: CatalogProduct[];
  isLoading?: boolean;
};

const categoryConfig = {
  "Sabonetes Faciais": {
    icon: "🧼",
    color: "from-blue-500 to-cyan-500",
  },
  "Hidratantes Faciais": {
    icon: "💧",
    color: "from-green-500 to-emerald-500",
  },
  "Vitamina C": {
    icon: "🍊",
    color: "from-amber-500 to-orange-500",
  },
  Demaquilantes: {
    icon: "🧴",
    color: "from-pink-500 to-rose-500",
  },
  "Protetores Solares": {
    icon: "☀️",
    color: "from-yellow-500 to-orange-500",
  },
  Tratamentos: {
    icon: "✨",
    color: "from-purple-500 to-pink-500",
  },
};

const categoryOrder = [
  "Sabonetes Faciais",
  "Hidratantes Faciais",
  "Vitamina C",
  "Demaquilantes",
  "Protetores Solares",
  "Tratamentos",
];

// Loading Component
function LoadingState() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
        <div className="bg-primary/10 relative rounded-full p-6">
          <IconLoader2 className="text-primary h-12 w-12 animate-spin" />
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold">Consultando produtos{dots}</h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Nossa IA está analisando seu perfil e selecionando os melhores
          produtos para você
        </p>
      </div>
    </div>
  );
}

export function CatalogTabs({ recommendations, isLoading }: CatalogTabsProps) {
  // Estado para controlar favoritos
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  // Carregar status de favoritos ao montar
  useEffect(() => {
    const loadFavorites = async () => {
      const productIds = recommendations.map((r) => r.productId);
      const favorites = await checkFavoritedProducts(productIds);
      setFavoritesMap(favorites);
    };

    if (recommendations.length > 0) {
      loadFavorites();
    }
  }, [recommendations]);

  // Handler para favoritar/desfavoritar
  const handleToggleFavorite = async (product: CatalogProduct) => {
    // Optimistic update
    setFavoritesMap((prev) => ({
      ...prev,
      [product.productId]: !prev[product.productId],
    }));

    startTransition(async () => {
      try {
        const result = await toggleFavorite({
          productId: product.productId,
          name: product.name,
          category: product.category,
          description: product.description,
          searchTerms: product.searchTerms,
          storeName: product.purchaseUrls[0]?.storeName || "",
          storeUrl: product.purchaseUrls[0]?.url || "",
        });

        // Atualizar com resultado real
        setFavoritesMap((prev) => ({
          ...prev,
          [product.productId]: result.isFavorited,
        }));

        if (result.isFavorited) {
          toast.success("Produto adicionado aos favoritos!");
        } else {
          toast.success("Produto removido dos favoritos.");
        }
      } catch (error) {
        console.error("[TOGGLE_FAVORITE_ERROR]", error);
        // Reverter em caso de erro
        setFavoritesMap((prev) => ({
          ...prev,
          [product.productId]: !prev[product.productId],
        }));
        toast.error("Erro ao atualizar favoritos. Tente novamente.");
      }
    });
  };

  // Se estiver carregando, mostrar loading
  if (isLoading) {
    return <LoadingState />;
  }

  // Agrupar produtos por categoria
  const productsByCategory = recommendations.reduce(
    (acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {} as Record<string, CatalogProduct[]>,
  );

  console.log(
    "[CATALOG_TABS] Categorias encontradas:",
    Object.keys(productsByCategory),
  );
  console.log("[CATALOG_TABS] Total de produtos:", recommendations.length);

  // Ordenar categorias
  const sortedCategories = categoryOrder.filter(
    (cat) => productsByCategory[cat]?.length > 0,
  );

  console.log("[CATALOG_TABS] Categorias ordenadas:", sortedCategories);

  if (sortedCategories.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <div className="mb-4 text-6xl">📦</div>
          <h3 className="mb-2 text-xl font-semibold">
            Nenhum produto recomendado ainda
          </h3>
          <p className="text-muted-foreground mb-6">
            Complete o quiz para receber recomendações personalizadas de
            produtos
          </p>
          <Button asChild>
            <a href="/app/quiz">Fazer Quiz</a>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Tabs defaultValue={sortedCategories[0]} className="w-full">
      {/* Tabs Navigation */}
      <TabsList className="mb-6 grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 sm:grid-cols-4">
        {sortedCategories.map((category) => {
          const config =
            categoryConfig[category as keyof typeof categoryConfig];
          const count = productsByCategory[category]?.length || 0;

          return (
            <TabsTrigger
              key={category}
              value={category}
              className="data-[state=active]:bg-primary bg-card flex h-auto flex-col gap-1 rounded-xl border px-4 py-3 text-left shadow-sm transition-all hover:shadow-md data-[state=active]:shadow-lg"
            >
              <div className="flex w-full items-center gap-2">
                <span className="text-xl">{config?.icon}</span>
                <span className="font-semibold">{category}</span>
              </div>
              <span className="text-foreground text-xs data-[state=active]:text-white">
                {count} {count === 1 ? "produto" : "produtos"}
              </span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Tabs Content */}
      {sortedCategories.map((category) => {
        const products = productsByCategory[category] || [];

        return (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => {
                const isFavorited = favoritesMap[product.productId] || false;

                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden transition-all hover:shadow-lg"
                  >
                    {/* Product Image with Favorite Button */}
                    {product.imageUrl && (
                      <div className="group relative aspect-square overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                        {/* Favorite Button */}
                        <button
                          onClick={() => handleToggleFavorite(product)}
                          disabled={isPending}
                          className={cn(
                            "absolute top-2 right-2 rounded-full p-2 transition-all",
                            "bg-white/90 shadow-md hover:bg-white hover:shadow-lg",
                            "opacity-0 group-hover:opacity-100",
                            isFavorited && "opacity-100",
                            isPending && "cursor-not-allowed opacity-50",
                          )}
                          aria-label={
                            isFavorited
                              ? "Remover dos favoritos"
                              : "Adicionar aos favoritos"
                          }
                        >
                          {isFavorited ? (
                            <IconHeartFilled className="h-5 w-5 text-red-500" />
                          ) : (
                            <IconHeart className="h-5 w-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    )}

                    <CardHeader className="border-t py-2 pb-2">
                      {/* Brand */}
                      {product.brand && (
                        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                          {product.brand}
                        </span>
                      )}
                      <CardTitle className="line-clamp-2 text-sm leading-tight">
                        {product.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      {/* Description (reason for recommendation) */}
                      <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                        {product.description}
                      </p>

                      {/* Purchase Link */}
                      {product.purchaseUrls.length > 0 && (
                        <Button
                          variant="default"
                          size="sm"
                          className="h-9 w-full justify-between text-xs"
                          asChild
                        >
                          <a
                            href={product.purchaseUrls[0].url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>Ver produto na loja</span>
                            <IconExternalLink size={14} />
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
