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

export function QuizWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SkinProfileFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      toast("Perfil salvo com sucesso!", {
        description: "Gerando suas recomendações personalizadas...",
      });

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
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Análise de Pele
        </h1>
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
      />
    </div>
  );
}
