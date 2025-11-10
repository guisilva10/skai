"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Skeleton } from "@/app/_components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import { RocketIcon, CheckCircle, ExternalLink, XCircle } from "lucide-react";
import {
  ProductRecommendation,
  SkinProfileFormData,
  skinProfileSchema,
} from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { saveProfileAndGetRecommendations } from "@/features/skin-profile/server/create-skincare-profile";
import { toast } from "sonner";
import { getSkinProfile } from "@/features/skin-profile/server/get-skin-profile";
import { getRecommendationsForProfile } from "@/features/skin-profile/server/get-recommendation";
import { Progress } from "@/app/_components/ui/progress";

// ... (const quizSteps = [...] permanece o mesmo) ...
const quizSteps = [
  {
    name: "skinType",
    question: "Qual é o seu tipo de pele?",
    options: [
      {
        value: "OLEOSA",
        label: "Oleosa - Pele brilhante e poros dilatados",
      },
      { value: "SECA", label: "Seca - Pele com tendência a descamação" },
      {
        value: "MISTA",
        label: "Mista - Oleosa na zona T e seca nas bochechas",
      },
      {
        value: "SENSIVEL",
        label: "Sensível - Pele reativa e propensa a irritações",
      },
    ],
  },
  {
    name: "skincareRoutine",
    question: "Você já tem uma rotina de skincare?",
    options: [
      { value: "NAO_COMEÇANDO_AGORA", label: "Não, estou começando agora" },
      {
        value: "SIM_APENAS_LIMPEZA_E_HIDRATANTE",
        label: "Sim, uso apenas limpeza e hidratante",
      },
      { value: "SIM_VARIOS_PRODUTOS", label: "Sim, uso vários produtos" },
      {
        value: "SIM_ROTINA_COMPLETA_COM_ATIVOS",
        label: "Sim, tenho uma rotina completa com ativos",
      },
    ],
  },
  {
    name: "sunExposure",
    question: "Qual é o seu nível de exposição ao sol?",
    options: [
      {
        value: "BAIXO",
        label: "Baixo - Fico dentro de casa a maior parte do dia",
      },
      {
        value: "MODERADO",
        label: "Moderado - Saio ocasionalmente durante o dia",
      },
      { value: "ALTO", label: "Alto - Passo muito tempo ao ar livre" },
    ],
  },
  {
    name: "knownAllergies",
    question: "Você tem alergias ou sensibilidades conhecidas?",
    options: [
      { value: "NAO_TENHO", label: "Não tenho alergias conhecidas" },
      { value: "FRAGRANCIAS", label: "Fragrâncias" },
      { value: "ACIDOS_E_ATIVOS_FORTES", label: "Ácidos e ativos fortes" },
      {
        value: "MULTIPLAS_SENSIBILIDADES",
        label: "Múltiplas sensibilidades",
      },
    ],
  },
  {
    name: "pregnancyStatus",
    question: "Você está grávida ou amamentando?",
    options: [
      { value: "NAO", label: "Não" },
      { value: "GRAVIDA", label: "Sim, estou grávida" },
      { value: "AMAMENTANDO", label: "Sim, estou amamentando" },
      {
        value: "GRAVIDA_E_AMAMENTANDO",
        label: "Sim, estou grávida e amamentando",
      },
    ],
  },
  {
    name: "skinMedication",
    question: "Você toma alguma medicação que influencia na pele?",
    options: [
      { value: "NAO_TOMA", label: "Não tomo nenhuma medicação" },
      { value: "ISOTRETINOINA", label: "Isotretinoína (Roacutan)" },
      { value: "ESPIRONOLACTONA", label: "Espironolactona" },
      {
        value: "OUTRAS_MEDICACOES_DERMATOLOGICAS",
        label: "Outras medicações dermatológicas",
      },
      { value: "MULTIPLAS_MEDICACOES", label: "Múltiplas medicações" },
    ],
  },
  {
    name: "skinCondition",
    question:
      "Você tem alguma doença de pele ou histórico de hipersensibilidade?",
    options: [
      {
        value: "NAO_TENHO_CONDICOES_ESPECIAIS",
        label: "Não tenho condições especiais",
      },
      {
        value: "DERMATITE_ATORPICA_SEBORREICA_OU_DE_CONTATO",
        label: "Dermatite (atópica, seborreica ou de contato)",
      },
      { value: "ROSACEA", label: "Rosácea" },
      { value: "ECZEMA", label: "Eczema" },
      { value: "PSORIASE", label: "Psoríase" },
      {
        value: "HISTORICO_DE_HIPERSENSIBILIDADE_CUTANEA",
        label: "Histórico de hipersensibilidade cutânea",
      },
      { value: "MULTIPLAS_CONDICOES", label: "Múltiplas condições" },
    ],
  },
  {
    name: "poreCondition",
    question: "Como estão seus poros?",
    options: [
      {
        value: "LIMPOS_E_POUCO_VISIVEIS",
        label: "Limpos e pouco visíveis",
      },
      {
        value: "VISIVEIS_MAS_SEM_PONTOS_PRETOS",
        label: "Visíveis mas sem pontos pretos",
      },
      {
        value: "DILATADOS_PRINCIPALMENTE_NA_ZONA_T",
        label: "Dilatados, principalmente na zona T",
      },
      {
        value: "COM_PRESENCA_DE_PONTOS_PRETOS_CRAVOS",
        label: "Com presença de pontos pretos (cravos)",
      },
      {
        value: "DILATADOS_COM_MUITOS_PONTOS_PRETOS",
        label: "Dilatados com muitos pontos pretos",
      },
    ],
  },
  {
    name: "smokingHabit",
    question: "Você fuma?",
    options: [
      { value: "NAO_FUMO", label: "Não fumo" },
      { value: "EX_FUMANTE", label: "Ex-fumante" },
      {
        value: "FUMO_OCASIONALMENTE",
        label: "Fumo ocasionalmente (menos de 5 cigarros por semana)",
      },
      {
        value: "FUMO_MODERADAMENTE",
        label: "Fumo moderadamente (5-10 cigarros por dia)",
      },
      {
        value: "FUMO_FREQUENTEMENTE",
        label: "Fumo frequentemente (mais de 10 cigarros por dia)",
      },
    ],
  },
  {
    name: "waterIntake",
    question: "Qual é a sua ingestão diária de água?",
    options: [
      { value: "MENOS_DE_1L", label: "Menos de 1 litro por dia" },
      { value: "DE_1_A_2L", label: "1 a 2 litros por dia" },
      { value: "DE_2_A_3L", label: "2 a 3 litros por dia" },
      { value: "MAIS_DE_3L", label: "Mais de 3 litros por dia" },
    ],
  },
];

function FormSkeleton() {
  return (
    <div className="w-full space-y-6">
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

function RecommendationResults({
  recommendations,
  onReset,
}: {
  recommendations: ProductRecommendation[];
  onReset: () => void;
}) {
  return (
    <div className="animate-in fade-in-50 w-full space-y-6">
      <Alert variant="default" className="border-green-200 bg-green-50">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="font-semibold text-green-800">
          Suas Recomendações Personalizadas
        </AlertTitle>
        <AlertDescription className="text-green-700">
          Aqui está uma rotina inicial baseada no seu perfil.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {recommendations.map((product) => (
          <Card key={product.id} className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg">
                {product.name}
                <span className="text-muted-foreground bg-secondary rounded-full px-2 py-0.5 text-sm font-medium">
                  {product.category}
                </span>
              </CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="sm" variant="outline">
                <a
                  href={product.purchaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver Produto
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="secondary" onClick={onReset} className="w-full">
        Editar Respostas
      </Button>
    </div>
  );
}

export default function SkincareQuestionnaire() {
  const queryClient = useQueryClient();

  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [tempRecommendations, setTempRecommendations] = useState<
    ProductRecommendation[] | null
  >(null);
  const [displayRecs, setDisplayRecs] = useState<ProductRecommendation[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // 1. Busca o perfil de pele
  const {
    data: existingProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["skinProfile"],
    queryFn: () => getSkinProfile(),
  });

  // 2. Se o perfil existir E não estivermos editando, busca as recomendações
  const {
    data: initialRecs,
    isLoading: isRecsLoading,
    isError: isRecsError,
  } = useQuery({
    queryKey: ["skinRecommendations", existingProfile?.id],
    queryFn: () => getRecommendationsForProfile(),
    enabled: !!existingProfile && !isEditing, // Só roda se o perfil existir E não estiver em modo de edição
  });

  // 3. Define o estado inicial (editando ou vendo resultados)
  useEffect(() => {
    if (!isProfileLoading) {
      if (existingProfile) {
        setIsEditing(false); // Perfil existe, mostra resultados
      } else {
        setIsEditing(true); // Perfil não existe, força a edição (inicia o quiz)
      }
    }
  }, [isProfileLoading, existingProfile]);

  // 4. Popula as recomendações na tela quando a query carregar
  useEffect(() => {
    if (initialRecs) {
      setDisplayRecs(initialRecs);
    }
  }, [initialRecs]);

  const form = useForm<SkinProfileFormData>({
    resolver: zodResolver(skinProfileSchema),
    shouldUnregister: false,
    defaultValues: {
      skinType: undefined,
      skincareRoutine: undefined,
      sunExposure: undefined,
      knownAllergies: undefined,
      pregnancyStatus: undefined,
      skinMedication: undefined,
      skinCondition: undefined,
      poreCondition: undefined,
      smokingHabit: undefined,
      waterIntake: undefined,
    },
  });

  // 5. Preenche o formulário com dados existentes QUANDO o usuário clicar em "Editar"
  useEffect(() => {
    if (existingProfile && isEditing) {
      form.reset({
        skinType: existingProfile.skinType || undefined,
        skincareRoutine: existingProfile.skincareRoutine || undefined,
        sunExposure: existingProfile.sunExposure || undefined,
        knownAllergies: existingProfile.knownAllergies || undefined,
        pregnancyStatus: existingProfile.pregnancyStatus || undefined,
        skinMedication: existingProfile.skinMedication || undefined,
        skinCondition: existingProfile.skinCondition || undefined,
        poreCondition: existingProfile.poreCondition || undefined,
        smokingHabit: existingProfile.smokingHabit || undefined,
        waterIntake: existingProfile.waterIntake || undefined,
      });
      setCurrentStep(0); // Reseta para a primeira pergunta
    }
  }, [existingProfile, isEditing, form]);

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: saveProfileAndGetRecommendations,
    onSuccess: (response) => {
      if (response.success) {
        setTempRecommendations(response.data); // Salva recs temporariamente
        setShowSuccessDialog(true); // Abre o dialog
        setIsEditing(false); // Sai do modo de edição
        queryClient.invalidateQueries({ queryKey: ["skinProfile"] });
        queryClient.invalidateQueries({
          queryKey: ["skinRecommendations", existingProfile?.id],
        });
      } else {
        toast.error("Erro ao salvar perfil!.");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Erro no servidor");
    },
  });

  function onSubmit(data: SkinProfileFormData) {
    mutate(data);
  }

  const totalSteps = quizSteps.length;

  function goToNextStep() {
    setCurrentStep((prev) => (prev < totalSteps - 1 ? prev + 1 : prev));
  }

  function goToPreviousStep() {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  }

  // --- Lógica de Renderização ---

  if (isProfileError || isRecsError) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-5 w-5" />
        <AlertTitle>Falha ao Carregar</AlertTitle>
        <AlertDescription>
          Não foi possível carregar seu perfil. Tente recarregar a página.
        </AlertDescription>
      </Alert>
    );
  }

  // Mostra skeleton enquanto carrega perfil ou recomendações
  if (isProfileLoading || (isRecsLoading && !isEditing)) {
    return <FormSkeleton />;
  }

  // Se NÃO estiver editando e TIVER recomendações, mostra os resultados
  if (!isEditing && displayRecs.length > 0) {
    return (
      <RecommendationResults
        recommendations={displayRecs}
        onReset={() => {
          setIsEditing(true); // Botão "Editar Respostas"
          setDisplayRecs([]); // Limpa recs antigas para não dar flash
        }}
      />
    );
  }

  // Se estiver editando (ou for um novo usuário), mostra o formulário
  if (isEditing) {
    const progress = ((currentStep + 1) / totalSteps) * 100;

    return (
      <div className="mx-auto flex w-full items-center justify-center lg:max-w-svw">
        <Card className="w-full">
          <CardContent className="w-full pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mx-auto w-full space-y-8 lg:max-w-svw"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      Questão {currentStep + 1} de {totalSteps}
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>

                <div className="relative">
                  {quizSteps.map((step, index) => (
                    <div
                      key={step.name}
                      className={currentStep === index ? "block" : "hidden"}
                    >
                      <FormField
                        control={form.control}
                        name={step.name as any}
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-lg font-semibold">
                              {step.question}
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  if (currentStep < totalSteps - 1) {
                                    setTimeout(() => {
                                      goToNextStep();
                                    }, 200);
                                  }
                                }}
                                value={field.value || ""}
                                className="flex flex-col space-y-2"
                              >
                                {step.options.map((option) => (
                                  <FormItem
                                    key={option.value}
                                    className="hover:bg-accent flex items-center space-y-0 space-x-3 rounded-md border p-4 transition-all"
                                  >
                                    <FormControl>
                                      <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {option.label}
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={currentStep === 0}
                  >
                    Voltar
                  </Button>

                  {currentStep < totalSteps - 1 ? (
                    <Button
                      type="button"
                      variant="default"
                      onClick={goToNextStep}
                    >
                      Próxima
                    </Button>
                  ) : (
                    <Button type="submit" className="" disabled={isSaving}>
                      {isSaving ? "Salvando..." : "Ver Recomendações"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <AlertDialog open={showSuccessDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Perfil Salvo!</AlertDialogTitle>
              <AlertDialogDescription>
                Seu perfil foi salvo com sucesso. Já preparamos suas
                recomendações.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  if (tempRecommendations) {
                    setDisplayRecs(tempRecommendations); // Atualiza a tela com as novas recs
                  }
                  setShowSuccessDialog(false);
                  setTempRecommendations(null);
                }}
              >
                Ver Recomendações
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Fallback, caso algo não carregue
  return <FormSkeleton />;
}
