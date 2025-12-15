import type { Metadata } from "next";
import { QuizWizard } from "./_components/quiz-wizard";
import { getSkinProfile } from "@/features/skin-profile/server/get-skin-profile";
import { SkinProfileFormData } from "@/types";

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

  try {
    const profile = await getSkinProfile();
    if (profile) {
      // Extrair apenas os campos do formulário (excluir id, oderId, createdAt, updatedAt)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, userId, createdAt, updatedAt, ...formData } = profile;
      existingProfile = formData as SkinProfileFormData;
    }
  } catch {
    // Usuário não autenticado ou sem perfil
    existingProfile = null;
  }

  return <QuizWizard initialData={existingProfile} />;
}
