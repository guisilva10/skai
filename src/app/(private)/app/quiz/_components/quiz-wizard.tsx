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
import {
  IconPencil,
  IconSparkles,
  IconPackage,
  IconLoader2,
} from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";

interface QuizWizardProps {
  initialData?: SkinProfileFormData | null;
  hasExistingRecommendations?: boolean;
}

// Loading Overlay Component
function LoadingOverlay({ message }: { message: string }) {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-card flex flex-col items-center gap-6 rounded-2xl border p-8 shadow-2xl">
        <div className="relative">
          <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
          <div className="bg-primary/10 relative rounded-full p-6">
            <IconLoader2 className="text-primary h-12 w-12 animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold">{message}</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Isso pode levar alguns segundos...
          </p>
        </div>
      </div>
    </div>
  );
}

export function QuizWizard({
  initialData,
  hasExistingRecommendations = false,
}: QuizWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SkinProfileFormData>(
    initialData || {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showExistingDialog, setShowExistingDialog] = useState(
    initialData !== null &&
      initialData !== undefined &&
      hasExistingRecommendations,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [errorDialog, setErrorDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
  }>({ show: false, title: "", message: "" });

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
      setLoadingMessage("Salvando seu perfil...");

      // Save profile to database
      await createSkincareProfile(formData);

      // Redirect to Cakto checkout
      setLoadingMessage("Redirecionando para pagamento...");

      // Import the checkout function
      const { createSubscriptionCheckout } =
        await import("@/features/subscription/server/create-checkout");

      // This will redirect to Cakto checkout page
      await createSubscriptionCheckout();

      // The redirect happens in the server action, so we won't reach here
    } catch (error: any) {
      console.error(error);
      setIsSubmitting(false);
      setLoadingMessage("");

      // Detecta tipo de erro e mostra mensagem apropriada
      let errorTitle = "Erro ao processar";
      let errorMessage =
        "Ocorreu um erro ao processar sua solicitação. Tente novamente.";

      if (error?.message?.includes("QUOTA_EXCEEDED")) {
        errorTitle = "Limite de requisições atingido";
        errorMessage =
          "A API do Gemini atingiu o limite de requisições. Por favor, aguarde alguns minutos e tente novamente.";
      } else if (error?.message?.includes("API_KEY_ERROR")) {
        errorTitle = "Erro de configuração";
        errorMessage =
          "Erro de autenticação com a API. Entre em contato com o suporte.";
      } else if (error?.message?.includes("API_ERROR")) {
        errorTitle = "Erro na API";
        errorMessage = error.message.replace("API_ERROR: ", "");
      } else if (error?.message?.includes("Cakto")) {
        errorTitle = "Erro no checkout";
        errorMessage = "Não foi possível criar o checkout. Tente novamente.";
      }

      setErrorDialog({
        show: true,
        title: errorTitle,
        message: errorMessage,
      });
    }
  };

  const handleViewProducts = () => {
    router.push("/app/catalog");
  };

  const handleEditQuiz = () => {
    setShowExistingDialog(false);
    setIsEditing(true);
  };

  // Loading overlay
  if (isSubmitting) {
    return <LoadingOverlay message={loadingMessage} />;
  }

  // Se tem perfil existente com recomendações e usuário ainda não decidiu editar
  if (showExistingDialog) {
    return (
      <AlertDialog
        open={showExistingDialog}
        onOpenChange={setShowExistingDialog}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <IconPackage className="text-primary h-8 w-8" />
            </div>
            <AlertDialogTitle className="text-center">
              Você já tem produtos recomendados!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Você já respondeu o quiz e possui recomendações personalizadas.
              Deseja ver seus produtos ou editar suas respostas para receber
              novas sugestões?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <AlertDialogAction onClick={handleViewProducts} className="w-full">
              <IconPackage className="mr-2 h-4 w-4" />
              Ver Meus Produtos
            </AlertDialogAction>
            <AlertDialogCancel onClick={handleEditQuiz} className="w-full">
              <IconPencil className="mr-2 h-4 w-4" />
              Editar Quiz
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Error dialog
  if (errorDialog.show) {
    return (
      <AlertDialog
        open={errorDialog.show}
        onOpenChange={(open) => setErrorDialog({ ...errorDialog, show: open })}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <IconSparkles className="text-destructive h-8 w-8" />
            </div>
            <AlertDialogTitle className="text-center">
              {errorDialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {errorDialog.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() =>
                setErrorDialog({ show: false, title: "", message: "" })
              }
              className="w-full"
            >
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div className="mx-auto h-[calc(100vh-250px)] max-w-2xl space-y-8 px-4 py-8">
      <div className="space-y-4">
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
          Análise de Pele
        </h1>

        {/* Edit Mode Indicator */}
        {(isEditMode || isEditing) && (
          <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 dark:border-amber-800 dark:bg-amber-950/30">
            <IconPencil className="size-4 text-amber-600 dark:text-amber-400" />
            <span className="text-sm text-amber-700 dark:text-amber-300">
              Você já respondeu o quiz. Edite suas respostas e salve para
              receber novas recomendações.
            </span>
          </div>
        )}

        {!isEditMode && !isEditing && (
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
        isEditMode={isEditMode || isEditing}
      />
    </div>
  );
}
