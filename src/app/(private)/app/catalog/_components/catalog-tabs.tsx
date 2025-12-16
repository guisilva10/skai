"use client";

import { useState, useEffect } from "react";
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
import { IconExternalLink, IconLoader2 } from "@tabler/icons-react";

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

type CatalogTabsProps = {
  recommendations: CatalogProduct[];
  isLoading?: boolean;
};

const categoryConfig = {
  Limpeza: {
    icon: "🧼",
    color: "from-blue-500 to-cyan-500",
  },
  Hidratação: {
    icon: "💧",
    color: "from-green-500 to-emerald-500",
  },
  Tratamento: {
    icon: "✨",
    color: "from-purple-500 to-pink-500",
  },
  "Proteção Solar": {
    icon: "☀️",
    color: "from-orange-500 to-yellow-500",
  },
};

const categoryOrder = ["Limpeza", "Hidratação", "Tratamento", "Proteção Solar"];

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

  // Ordenar categorias
  const sortedCategories = categoryOrder.filter(
    (cat) => productsByCategory[cat]?.length > 0,
  );

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
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden transition-all hover:shadow-lg"
                >
                  {/* Product Image */}
                  {product.imageUrl && (
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
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
                    {/* Price - Comentado por enquanto */}
                    {/* {product.price && (
                      <div className="text-primary text-lg font-bold">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(product.price)}
                      </div>
                    )} */}
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
              ))}
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
