import * as z from "zod";

const skinTypes = ["OLEOSA", "SECA", "MISTA", "SENSIVEL"] as const;

const skinRoutineTypes = [
  "NAO_COMEÇANDO_AGORA",
  "SIM_APENAS_LIMPEZA_E_HIDRATANTE",
  "SIM_VARIOS_PRODUTOS",
  "SIM_ROTINA_COMPLETA_COM_ATIVOS",
] as const;

const sunExposureLevels = ["BAIXO", "MODERADO", "ALTO"] as const;

const knownAllergiesTypes = [
  "NAO_TENHO",
  "FRAGRANCIAS",
  "ACIDOS_E_ATIVOS_FORTES",
  "MULTIPLAS_SENSIBILIDADES",
] as const;

const pregnancyStatusTypes = [
  "NAO",
  "GRAVIDA",
  "AMAMENTANDO",
  "GRAVIDA_E_AMAMENTANDO",
] as const;

const skinMedicationTypes = [
  "NAO_TOMA",
  "ISOTRETINOINA",
  "ESPIRONOLACTONA",
  "OUTRAS_MEDICACOES_DERMATOLOGICAS",
  "MULTIPLAS_MEDICACOES",
] as const;

const skinConditionTypes = [
  "NAO_TENHO_CONDICOES_ESPECIAIS",
  "DERMATITE_ATORPICA_SEBORREICA_OU_DE_CONTATO",
  "ROSACEA",
  "ECZEMA",
  "PSORIASE",
  "HISTORICO_DE_HIPERSENSIBILIDADE_CUTANEA",
  "MULTIPLAS_CONDICOES",
] as const;

const poreConditionTypes = [
  "LIMPOS_E_POUCO_VISIVEIS",
  "VISIVEIS_MAS_SEM_PONTOS_PRETOS",
  "DILATADOS_PRINCIPALMENTE_NA_ZONA_T",
  "COM_PRESENCA_DE_PONTOS_PRETOS_CRAVOS",
  "DILATADOS_COM_MUITOS_PONTOS_PRETOS",
] as const;

const smokingHabitTypes = [
  "NAO_FUMO",
  "EX_FUMANTE",
  "FUMO_OCASIONALMENTE",
  "FUMO_MODERADAMENTE",
  "FUMO_FREQUENTEMENTE",
] as const;

const waterIntakeTypes = [
  "MENOS_DE_1L",
  "DE_1_A_2L",
  "DE_2_A_3L",
  "MAIS_DE_3L",
] as const;

export const skinProfileSchema = z.object({
  skinType: z.enum(skinTypes).optional(),
  skincareRoutine: z.enum(skinRoutineTypes).optional(),
  sunExposure: z.enum(sunExposureLevels).optional(),
  knownAllergies: z.enum(knownAllergiesTypes).optional(),
  pregnancyStatus: z.enum(pregnancyStatusTypes).optional(),
  skinMedication: z.enum(skinMedicationTypes).optional(),
  skinCondition: z.enum(skinConditionTypes).optional(),
  poreCondition: z.enum(poreConditionTypes).optional(),
  smokingHabit: z.enum(smokingHabitTypes).optional(),
  waterIntake: z.enum(waterIntakeTypes).optional(),
});

export type SkinProfileFormData = z.infer<typeof skinProfileSchema>;

export interface ProductRecommendation {
  id: string;
  name: string;
  category: "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar";
  description: string;
  purchaseUrl: string;
}
