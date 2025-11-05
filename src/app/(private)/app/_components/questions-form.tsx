"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Skeleton } from "@/app/_components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { RocketIcon, CheckCircle, ExternalLink, XCircle } from "lucide-react";
import {
  concernOptions,
  ProductRecommendation,
  SkinProfileFormData,
  skinProfileSchema,
  skinTypeOptions,
} from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { saveProfileAndGetRecommendations } from "@/server/skin-profile/create-skincare-profile";
import { toast } from "sonner";
import { getSkinProfile } from "@/server/skin-profile/get-skin-profile";

function FormSkeleton() {
  return (
    <div className="space-y-6">
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
    <div className="animate-in fade-in-50 space-y-6">
      <Alert variant="default" className="border-green-200 bg-green-50">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="font-semibold text-green-800">
          Perfil Salvo e Recomendações Prontas!
        </AlertTitle>
        <AlertDescription className="text-green-700">
          Aqui está uma rotina inicial baseada nas suas respostas.
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

  const [recommendations, setRecommendations] = useState<
    ProductRecommendation[]
  >([]);

  const {
    data: existingProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["skinProfile"],
    queryFn: () => getSkinProfile(),
  });

  const form = useForm<SkinProfileFormData>({
    resolver: zodResolver(skinProfileSchema),
    defaultValues: {
      skinType: undefined,
      concerns: [],
      sensitivity: "",
    },
  });

  useEffect(() => {
    if (existingProfile) {
      form.reset({
        skinType: existingProfile.skinType,
        concerns: existingProfile.concerns,
        sensitivity: existingProfile.sensitivity,
      });
    }
  }, [existingProfile, form]);

  const { mutate, isPending: isSaving } = useMutation({
    mutationFn: saveProfileAndGetRecommendations,
    onSuccess: (response) => {
      if (response.success) {
        setRecommendations(response.data);
        toast.success("Seu perfil foi salvo com sucesso");
        queryClient.invalidateQueries({ queryKey: ["skinProfile"] });
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

  if (isProfileError) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-5 w-5" />
        <AlertTitle>Falha ao Carregar</AlertTitle>
        <AlertDescription>
          Não foi possível carregar seu perfil de pele. Tente recarregar a
          página.
        </AlertDescription>
      </Alert>
    );
  }

  if (isProfileLoading) {
    return <FormSkeleton />;
  }

  if (recommendations.length > 0) {
    return (
      <RecommendationResults
        recommendations={recommendations}
        onReset={() => setRecommendations([])}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Campo: Tipo de Pele (Select) */}
        <FormField
          control={form.control}
          name="skinType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                Qual seu tipo de pele?
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu tipo de pele" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {skinTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Preocupações (Checkbox Group) */}
        <FormField
          control={form.control}
          name="concerns"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">
                Quais suas principais preocupações?
              </FormLabel>
              <FormDescription>Selecione todas que se aplicam.</FormDescription>
              <div className="space-y-2 pt-2">
                {concernOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="concerns"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-center space-y-0 space-x-3 rounded-md border p-4 shadow-sm"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      item.id,
                                    ])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== item.id,
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Campo: Sensibilidade (Radio Group) */}
        <FormField
          control={form.control}
          name="sensitivity"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-base">
                Como você descreve a sensibilidade da sua pele?
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="baixa" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Baixa (Raramente reage a produtos)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="media" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Média (Às vezes fica vermelha ou irritada)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-y-0 space-x-3">
                    <FormControl>
                      <RadioGroupItem value="alta" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Alta (Muito reativa, rosácea, eczema, etc.)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? (
            <div className="flex items-center">
              <svg
                className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Salvando...
            </div>
          ) : (
            <div className="flex items-center">
              <RocketIcon className="mr-2 h-5 w-5" />
              Salvar e Ver Recomendações
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
}
