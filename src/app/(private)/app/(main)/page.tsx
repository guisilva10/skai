import type { Metadata } from "next";
import GridCardsHome from "./_components/grid-cards-home";

export const metadata: Metadata = {
  title: "SKAI - Recomendações Personalizadas de Skincare",
  description:
    "Descubra seu regime de skincare ideal em minutos com recomendações personalizadas impulsionadas por IA",
  keywords: [
    "skincare",
    "recomendações",
    "IA",
    "skai",
    "beleza",
    "limpeza de pele",
  ],
};

export default async function Page() {
  return (
    <div className="relative mx-auto my-auto min-h-screen px-6 py-8">
      {/* Header Section */}
      <div className="mb-8 space-y-3 sm:mb-10">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Sua jornada de cuidados com a pele
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed sm:text-base">
          Explore ferramentas inteligentes para descobrir a rotina perfeita,
          produtos ideais e dicas personalizadas para sua pele
        </p>
      </div>

      <GridCardsHome />
    </div>
  );
}
