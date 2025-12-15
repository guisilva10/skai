"use client";

import { Button } from "@/app/_components/ui/button";
import { ArrowLeft, ArrowRight, Check, RefreshCw } from "lucide-react";

interface QuizNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting?: boolean;
  canNext?: boolean;
  isEditMode?: boolean;
}

export function QuizNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isSubmitting = false,
  canNext = true,
  isEditMode = false,
}: QuizNavigationProps) {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between pt-6 pb-32">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0 || isSubmitting}
        className="w-32"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Button
        onClick={onNext}
        disabled={!canNext || isSubmitting}
        className="bg-primary text-primary-foreground hover:bg-primary/90 w-36"
      >
        {isLastStep ? (
          isSubmitting ? (
            "Salvando..."
          ) : isEditMode ? (
            <>
              Atualizar
              <RefreshCw className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Finalizar
              <Check className="ml-2 h-4 w-4" />
            </>
          )
        ) : (
          <>
            Próximo
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
