import * as z from "zod";

// 1. Removida a importação do '@prisma/client'.
// Este arquivo agora é 100% client-safe e não causará erros de build.

// 2. Definir os tipos de pele como um 'const' tuple
// Isto é o que o z.enum espera para inferir o tipo corretamente.
const skinTypes = [
  "OILY",
  "DRY",
  "COMBINATION",
  "NORMAL",
  "SENSITIVE",
] as const;

// Opções para os formulários
// 3. Usar os valores de string diretamente.
export const skinTypeOptions = [
  { value: "OILY", label: "Oleosa" },
  { value: "DRY", label: "Seca" },
  { value: "COMBINATION", label: "Mista" },
  { value: "NORMAL", label: "Normal" },
  { value: "SENSITIVE", label: "Sensível" },
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
  // 4. Usar z.enum() com o const tuple.
  // Isso resolve os erros de tipo anteriores E o erro de build.
  skinType: z.enum(skinTypes),
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
