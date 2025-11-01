import * as z from "zod";
// 1. Importar o Enum SkinType gerado pelo Prisma
import { SkinType } from "@/generated/prisma/client";

// 2. Exportar o Enum para que outros arquivos possam usá-lo
// (Isso é útil se o Prisma client não for importado em outro lugar)
export { SkinType };

// -------------------------------------

// Opções para os formulários
// 3. Usar o Enum importado do Prisma
export const skinTypeOptions = [
  { value: SkinType.OILY, label: "Oleosa" },
  { value: SkinType.DRY, label: "Seca" },
  { value: SkinType.COMBINATION, label: "Mista" },
  { value: SkinType.NORMAL, label: "Normal" },
  { value: SkinType.SENSITIVE, label: "Sensível" },
] as const;

export const concernOptions = [
  { id: "acne", label: "Acne e Manchas" },
  { id: "aging", label: "Sinais de Idade (Rugas, Linhas Finas)" },
  { id: "hyperpigmentation", label: "Hiperpigmentação (Manchas Escuras)" },
  { id: "dryness", label: "Ressecamento e Desidratação" },
  { id: "redness", label: "Vermelhidão e Rosácea" },
  { id: "pores", label: "Poros Dilatados" },
] as const;

// Schema de validação do Zod para o formulário
export const skinProfileSchema = z.object({
  // 4. Usar z.nativeEnum com o Enum do Prisma
  skinType: z.nativeEnum(SkinType),
  concerns: z
    .array(z.string())
    .refine(
      (value) => value.some(Boolean),
      "Selecione pelo menos uma preocupação.",
    ),
  sensitivity: z.string().min(1, "Por favor, descreva sua sensibilidade."),
});

// Tipo inferido do schema Zod
export type SkinProfileFormData = z.infer<typeof skinProfileSchema>;

// Tipo para os produtos recomendados
export interface ProductRecommendation {
  id: string;
  name: string;
  category: "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar";
  description: string;
  purchaseUrl: string;
}
