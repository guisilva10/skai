import type { Metadata } from "next";
import { QuizWizard } from "./_components/quiz-wizard";
import { getSkinProfile } from "@/features/skin-profile/server/get-skin-profile";
import { getUserRecommendations } from "@/features/skin-profile/server/get-user-recommendations";
import { getSubscriptionStatus } from "@/features/subscription/server/get-subscription-status";
import { SkinProfileFormData } from "@/types";

// Marcar a rota como dinâmica para evitar warning no build
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quiz de Análise de Pele | SKAI",
  description:
    "Responda nosso questionário inteligente e descubra os produtos ideais para o seu tipo de pele. Análise personalizada com IA.",
  keywords: [
    "quiz skincare",
    "análise de pele",
    "tipo de pele",
    "questionário",
    "diagnóstico de pele",
    "rotina personalizada",
  ],
  openGraph: {
    title: "Quiz de Análise de Pele | SKAI",
    description:
      "Responda nosso questionário inteligente e descubra os produtos ideais para o seu tipo de pele.",
    type: "website",
  },
};

export default async function QuizPage() {
  let existingProfile: SkinProfileFormData | null = null;
  let hasExistingRecommendations = false;
  let hasActiveSubscription = false;

  try {
    const profile = await getSkinProfile();
    if (profile) {
      // Extrair apenas os campos do formulário (excluir id, userId, createdAt, updatedAt)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, userId, createdAt, updatedAt, ...formData } = profile;
      existingProfile = formData as SkinProfileFormData;

      // Verificar se tem recomendações existentes
      const recommendations = await getUserRecommendations();
      hasExistingRecommendations = recommendations.length > 0;
    }

    // Verificar se tem assinatura ativa
    const subscriptionStatus = await getSubscriptionStatus();
    console.log(
      "[QUIZ_PAGE] Subscription status from server:",
      subscriptionStatus,
    );
    hasActiveSubscription = subscriptionStatus === "ACTIVE";
    console.log(
      "[QUIZ_PAGE] Has active subscription (subscriptionStatus === 'ACTIVE'):",
      hasActiveSubscription,
    );
  } catch {
    // Usuário não autenticado ou sem perfil
    existingProfile = null;
  }

  return (
    <QuizWizard
      initialData={existingProfile}
      hasExistingRecommendations={hasExistingRecommendations}
      hasActiveSubscription={hasActiveSubscription}
    />
  );
}
