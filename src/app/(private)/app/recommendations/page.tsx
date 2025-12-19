import type { Metadata } from "next";
import { auth } from "@/services/auth";
import { redirect } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { RecommendationsClient } from "./_components/recommendations-client";

export const metadata: Metadata = {
  title: "Suas Recomendações | SKAI",
  description:
    "Veja os produtos de skincare recomendados pela nossa IA e favorite os que mais gostar!",
};

export default async function RecommendationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-32 sm:px-6">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Suas Recomendações Personalizadas
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Nossa IA selecionou os melhores produtos para sua pele. Favorite
              os que você mais gostar!
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/app/catalog">Ver Meus Favoritos</Link>
          </Button>
        </div>

        {/* Info Card */}
        <div className="bg-primary/10 border-primary/20 rounded-lg border p-4">
          <p className="text-sm">
            💡 <strong>Dica:</strong> Clique no coração ❤️ nos produtos que você
            gostou para salvá-los nos seus favoritos. Você pode acessá-los a
            qualquer momento em "Catálogo de Produtos".
          </p>
        </div>
      </div>

      {/* Client Component with Session Storage logic */}
      <RecommendationsClient userId={session.user.id} />
    </div>
  );
}
