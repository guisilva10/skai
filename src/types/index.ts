export type SkinProfileFormData = {
  // 1. Identificação do Tipo de Pele
  feelsTightAfterWashing?: boolean;
  getsShinySkin?: boolean;
  oilProductionArea?: "tzone" | "nose" | "fullface" | "minimal";
  hasDilatedPores?: boolean;
  dilatedPoresLocation?: "tzone" | "cheeks" | "fullface" | "none";
  hasFlakingSkin?: boolean;
  getsRedEasily?: boolean;
  cosmeticsBurn?: boolean;

  // 2. Histórico Dermatológico
  hasAcne?: boolean;
  hasRosacea?: boolean;
  hasAtopicDermatitis?: boolean;
  hasSeborrheicDermatitis?: boolean;
  hasMelasma?: boolean;
  hasPsoriasis?: boolean;
  currentTreatment?: string;
  currentMedication?: string;
  recentProcedures?: boolean;
  procedureType?: "peeling" | "laser" | "other";
  procedureDate?: string;

  // 3. Rotina Atual
  morningProducts?: string[];
  nightProducts?: string[];
  routineSteps?: number;

  // 4. Objetivos
  mainGoal?: string;
  secondaryGoals?: string[];

  // 5. Hábitos e Estilo de Vida
  sunExposure?: "low" | "moderate" | "high" | "outdoor_work";
  usesSunscreenDaily?: boolean;
  usesMakeup?: "daily" | "occasional" | "never";
  cleansingFrequency?: "once" | "twice" | "sometimes";
  diet?: "high_sugar" | "processed" | "balanced";

  // 6. Ambiente e Fatores Externos
  climate?: "humid" | "dry" | "cold" | "hot";
  sleepsWithAC?: boolean;
  intensiveWorkout?: boolean;

  // 7. Sensibilidade e Alergias
  hasAllergies?: boolean;
  allergyDetails?: string;
  irritatingIngredients?: string[];

  // 8. Teste de Tolerância
  skinIrritationFrequency?: "often" | "sometimes" | "rarely" | "never";
  triedRetinol?: boolean;
  retinolReaction?: "good" | "irritation" | "severe" | "never_tried";

  // 9. Preferências
  preferredTexture?: string[];
  prefersFragrance?: "yes" | "no" | "indifferent";
  brandPreference?: "dermocosmetic" | "pharmaceutical" | "affordable";

  // 10. Contraindicações
  hormonalTreatment?: boolean;
  hormonalTreatmentType?: string;
  usesAntibiotics?: boolean;
  usesCorticoids?: boolean;
};

export type QuizQuestionOption = {
  value: string;
  label: string;
};

export type QuizQuestion = {
  id: keyof SkinProfileFormData;
  label: string;
  type: "boolean" | "select" | "multiselect" | "text" | "date" | "number";
  options?: QuizQuestionOption[];
  required?: boolean;
  helpText?: string;
  condition?: (data: SkinProfileFormData) => boolean;
};

export type QuizSection = {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
};

export interface ProductRecommendation {
  id: string;
  name: string;
  category: "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar";
  description: string;
  searchTerms: string[];
}

export interface PurchaseUrl {
  storeName: string;
  url: string;
}

export type ProductRecommendationWithUrls = ProductRecommendation & {
  purchaseUrls: PurchaseUrl[];
};
