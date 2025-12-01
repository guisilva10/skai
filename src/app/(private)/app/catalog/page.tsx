import { getUserRecommendations } from "@/features/skin-profile/server/get-user-recommendations";
import { getRecommendationsForProfile } from "@/features/skin-profile/server/get-recommendation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { IconExternalLink, IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { db } from "@/services/database/prisma";
import { auth } from "@/services/auth";

const categoryColors = {
  Limpeza: "from-blue-500 to-cyan-500",
  Hidratação: "from-green-500 to-emerald-500",
  Tratamento: "from-purple-500 to-pink-500",
  "Proteção Solar": "from-orange-500 to-yellow-500",
};

const categoryIcons = {
  Limpeza: "🧼",
  Hidratação: "💧",
  Tratamento: "✨",
  "Proteção Solar": "☀️",
};

export default async function CatalogPage() {
  const session = await auth();
  let recommendations = await getUserRecommendations();

  // Se não houver recomendações, verificamos se o usuário tem um perfil
  // Se tiver perfil, geramos as recomendações agora
  if (recommendations.length === 0 && session?.user?.id) {
    const profile = await db.skinProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (profile) {
      // Gerar recomendações
      await getRecommendationsForProfile();
      // Buscar novamente do banco para ter o formato correto (com datas, etc)
      recommendations = await getUserRecommendations();
    }
  }

  // Agrupar por data
  const groupedByDate = recommendations.reduce(
    (acc, rec) => {
      const dateKey = format(new Date(rec.createdAt), "dd/MM/yyyy", {
        locale: ptBR,
      });
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(rec);
      return acc;
    },
    {} as Record<string, typeof recommendations>,
  );

  return (
    <div className="mx-auto h-[calc(100vh-250px)] max-w-6xl px-4 py-6 pb-20 sm:px-6">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Catálogo de Produtos
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Histórico de produtos recomendados especialmente para você
        </p>
      </div>

      {/* Content */}
      {recommendations.length === 0 ? (
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
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByDate).map(([date, products]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
                <IconCalendar size={16} />
                <span className="font-medium">{date}</span>
                <div className="bg-border h-px flex-1" />
              </div>

              {/* Products Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden pt-0 transition-shadow hover:shadow-lg"
                  >
                    <CardHeader
                      className={`bg-gradient-to-r py-4 ${categoryColors[product.category as keyof typeof categoryColors] || "from-gray-500 to-gray-600"} text-white`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">
                          {categoryIcons[
                            product.category as keyof typeof categoryIcons
                          ] || "📦"}
                        </span>
                        <div className="flex-1">
                          <div className="mb-1 text-xs font-medium opacity-90">
                            {product.category}
                          </div>
                          <CardTitle className="text-lg leading-tight">
                            {product.name}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                      {/* Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {product.description}
                      </p>

                      {/* Purchase Links */}
                      {product.purchaseUrls.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                            Onde Comprar
                          </div>
                          {product.purchaseUrls.map((url, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="w-full justify-between"
                              asChild
                            >
                              <a
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span>{url.storeName}</span>
                                <IconExternalLink size={16} />
                              </a>
                            </Button>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
