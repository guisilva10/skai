"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SkinProfileFormData } from "@/types";
import { quizSections } from "../_data/quiz-sections";
import { QuizProgress } from "./quiz-progress";
import { QuizSectionCard } from "./quiz-section-card";
import { QuizNavigation } from "./quiz-navigation";
import { createSkincareProfile } from "@/features/skin-profile/server/create-skincare-profile";
import { toast } from "sonner";
import { IconPencil, IconSparkles } from "@tabler/icons-react";

interface QuizWizardProps {
  initialData?: SkinProfileFormData | null;
}

export function QuizWizard({ initialData }: QuizWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SkinProfileFormData>(
    initialData || {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = initialData !== null && initialData !== undefined;

  const currentSection = quizSections[currentStep];
  const totalSteps = quizSections.length;

  const handleFieldChange = (field: keyof SkinProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Save profile to database
      await createSkincareProfile(formData);

      toast(
        isEditMode
          ? "Perfil atualizado com sucesso!"
          : "Perfil salvo com sucesso!",
        {
          description: "Gerando suas recomendações personalizadas...",
        },
      );

      // Redirect to catalog to see recommendations
      // The catalog page will trigger recommendation generation if needed
      router.push("/app/catalog");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast("Erro ao salvar perfil", {
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto h-[calc(100vh-250px)] max-w-2xl space-y-8 px-4 py-8">
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Análise de Pele
        </h1>

        {/* Edit Mode Indicator */}
        {isEditMode && (
          <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-950/30">
            <IconPencil className="size-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm text-amber-700 dark:text-amber-300">
              Você já respondeu o quiz. Edite suas respostas e salve para
              receber novas recomendações.
            </span>
          </div>
        )}

        {!isEditMode && (
          <div className="border-primary/20 bg-primary/5 mx-auto flex max-w-md items-center justify-center gap-2 rounded-lg border px-4 py-2">
            <IconSparkles className="text-primary size-4" />
            <span className="text-primary text-sm">
              Responda para receber recomendações personalizadas
            </span>
          </div>
        )}

        <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <QuizSectionCard
        section={currentSection}
        data={formData}
        onChange={handleFieldChange}
      />

      <QuizNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isSubmitting={isSubmitting}
        isEditMode={isEditMode}
      />
    </div>
  );
}
