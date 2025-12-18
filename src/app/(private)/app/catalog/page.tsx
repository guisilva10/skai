import type { Metadata } from "next";
import { getUserRecommendations } from "@/features/skin-profile/server/get-user-recommendations";
import db from "@/services/database/prisma";
import { auth } from "@/services/auth";
import { CatalogWrapper } from "./_components/catalog-wrapper";

export const metadata: Metadata = {
  title: "Catálogo de Produtos | SKAI",
  description:
    "Veja os produtos de skincare recomendados especialmente para você pela nossa IA. Encontre os melhores cosméticos para sua pele.",
  keywords: [
    "catálogo skincare",
    "produtos recomendados",
    "cosméticos",
    "cuidados com a pele",
    "recomendações IA",
  ],
  openGraph: {
    title: "Catálogo de Produtos | SKAI",
    description:
      "Veja os produtos de skincare recomendados especialmente para você pela nossa IA.",
    type: "website",
  },
};

export default async function CatalogPage() {
  const session = await auth();
  const recommendations = await getUserRecommendations();

  // Verificar se o usuário tem perfil
  let hasProfile = false;
  if (session?.user?.id) {
    const profile = await db.skinProfile.findUnique({
      where: { userId: session.user.id },
    });
    hasProfile = !!profile;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-32 sm:px-6">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Catálogo de Produtos
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Produtos recomendados especialmente para você
        </p>
      </div>

      {/* Content - Apenas mostra recomendações salvas */}
      <CatalogWrapper
        initialRecommendations={recommendations}
        hasProfile={hasProfile}
      />
    </div>
  );
}
