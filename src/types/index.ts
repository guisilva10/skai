import * as z from "zod";

const skinTypes = [
  "OILY",
  "DRY",
  "COMBINATION",
  "NORMAL",
  "SENSITIVE",
] as const;

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

export const skinProfileSchema = z.object({
  skinType: z.enum(skinTypes),
  concerns: z
    .array(z.string())
    .refine(
      (value) => value.some(Boolean),
      "Selecione pelo menos uma preocupação.",
    ),
  sensitivity: z.string().min(1, "Por favor, descreva sua sensibilidade."),
});

export type SkinProfileFormData = z.infer<typeof skinProfileSchema>;

export interface ProductRecommendation {
  id: string;
  name: string;
  category: "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar";
  description: string;
  purchaseUrl: string;
}
