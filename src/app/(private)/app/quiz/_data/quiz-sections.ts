import { QuizSection } from "@/types";

export const quizSections: QuizSection[] = [
  {
    id: "identification",
    title: "1. Identificação do Tipo de Pele",
    description:
      "Vamos começar entendendo as características básicas da sua pele.",
    questions: [
      {
        id: "feelsTightAfterWashing",
        label: "Você sente sua pele repuxar depois de lavar?",
        type: "boolean",
        helpText: "Indica pele seca ou sensível.",
      },
      {
        id: "getsShinySkin",
        label: "Sua pele costuma ficar brilhosa ao longo do dia?",
        type: "boolean",
        helpText: "Ajuda a avaliar a oleosidade.",
      },
      {
        id: "oilProductionArea",
        label: "Onde você produz mais óleo?",
        type: "select",
        options: [
          { value: "tzone", label: "Testa, nariz e queixo (Zona T)" },
          { value: "nose", label: "Apenas nariz" },
          { value: "fullface", label: "Rosto todo" },
          { value: "minimal", label: "Quase nada" },
        ],
        condition: (data) => data.getsShinySkin === true,
      },
      {
        id: "hasDilatedPores",
        label: "Você costuma ter poros dilatados?",
        type: "boolean",
      },
      {
        id: "dilatedPoresLocation",
        label: "Onde estão os poros dilatados?",
        type: "select",
        options: [
          { value: "tzone", label: "Zona T" },
          { value: "cheeks", label: "Bochechas" },
          { value: "fullface", label: "Rosto todo" },
        ],
        condition: (data) => data.hasDilatedPores === true,
      },
      {
        id: "hasFlakingSkin",
        label: "Sua pele costuma descamar?",
        type: "boolean",
        helpText: "Pode indicar pele seca ou uso inadequado de ácidos.",
      },
      {
        id: "getsRedEasily",
        label: "Sua pele fica vermelha facilmente?",
        type: "boolean",
      },
      {
        id: "cosmeticsBurn",
        label: "Sua pele arde com cosméticos?",
        type: "boolean",
        helpText: "Indica pele sensível ou reativa.",
      },
    ],
  },
  {
    id: "history",
    title: "2. Histórico Dermatológico",
    description:
      "Perguntas essenciais para evitar indicar produtos incompatíveis.",
    questions: [
      {
        id: "hasAcne",
        label: "Você tem ou já teve Acne?",
        type: "boolean",
      },
      {
        id: "hasRosacea",
        label: "Você tem ou já teve Rosácea?",
        type: "boolean",
      },
      {
        id: "hasAtopicDermatitis",
        label: "Você tem ou já teve Dermatite Atópica?",
        type: "boolean",
      },
      {
        id: "hasSeborrheicDermatitis",
        label: "Você tem ou já teve Dermatite Seborreica?",
        type: "boolean",
      },
      {
        id: "hasMelasma",
        label: "Você tem ou já teve Melasma?",
        type: "boolean",
      },
      {
        id: "hasPsoriasis",
        label: "Você tem ou já teve Psoríase?",
        type: "boolean",
      },
      {
        id: "currentTreatment",
        label: "Você está em tratamento dermatológico atual?",
        type: "text",
        helpText: "Descreva qual produto ou medicação está usando.",
      },
      {
        id: "recentProcedures",
        label: "Já fez peeling, lasers ou procedimentos estéticos recentes?",
        type: "boolean",
      },
    ],
  },
  {
    id: "routine",
    title: "3. Rotina Atual de Cuidados",
    description:
      "Para evitar sobreposição de ativos e recomendar combinações seguras.",
    questions: [
      {
        id: "morningProducts",
        label: "Quais produtos você usa pela manhã?",
        type: "multiselect",
        options: [
          { value: "cleanser", label: "Limpeza" },
          { value: "vitc", label: "Vitamina C" },
          { value: "sunscreen", label: "Protetor Solar" },
          { value: "moisturizer", label: "Hidratante" },
          { value: "none", label: "Nada" },
        ],
      },
      {
        id: "nightProducts",
        label: "E à noite?",
        type: "multiselect",
        options: [
          { value: "retinol", label: "Retinol" },
          { value: "acids", label: "Ácidos" },
          { value: "brighteners", label: "Clareadores" },
          { value: "moisturizer", label: "Hidratante" },
          { value: "none", label: "Nada" },
        ],
      },
      {
        id: "routineSteps",
        label: "Quantos passos sua rotina costuma ter?",
        type: "number",
        helpText:
          "Para saber se devemos sugerir uma rotina simples ou completa.",
      },
    ],
  },
  {
    id: "goals",
    title: "4. Objetivos do Usuário",
    description: "Fundamental para personalizar sua rotina.",
    questions: [
      {
        id: "mainGoal",
        label: "Qual seu objetivo principal?",
        type: "select",
        options: [
          { value: "brighten", label: "Clarear manchas" },
          { value: "texture", label: "Melhorar textura" },
          { value: "oilcontrol", label: "Controlar oleosidade" },
          { value: "acne", label: "Tratar acne" },
          { value: "antiaging", label: "Rejuvenescer" },
          { value: "redness", label: "Reduzir vermelhidão" },
          { value: "hydrate", label: "Hidratar" },
        ],
      },
      {
        id: "secondaryGoals",
        label: "Quais outros objetivos você tem?",
        type: "multiselect",
        options: [
          { value: "brighten", label: "Clarear manchas" },
          { value: "texture", label: "Melhorar textura" },
          { value: "oilcontrol", label: "Controlar oleosidade" },
          { value: "acne", label: "Tratar acne" },
          { value: "antiaging", label: "Rejuvenescer" },
          { value: "redness", label: "Reduzir vermelhidão" },
          { value: "hydrate", label: "Hidratar" },
        ],
      },
    ],
  },
  {
    id: "lifestyle",
    title: "5. Hábitos e Estilo de Vida",
    description: "Fatores que impactam diretamente a recomendação.",
    questions: [
      {
        id: "sunExposure",
        label: "Como é seu padrão de exposição solar?",
        type: "select",
        options: [
          { value: "low", label: "Baixo" },
          { value: "moderate", label: "Moderado" },
          { value: "high", label: "Alto" },
          { value: "outdoor_work", label: "Trabalha no sol" },
        ],
      },
      {
        id: "usesSunscreenDaily",
        label: "Usa protetor solar diariamente?",
        type: "boolean",
      },
      {
        id: "usesMakeup",
        label: "Costuma usar maquiagem?",
        type: "select",
        options: [
          { value: "daily", label: "Diariamente" },
          { value: "occasional", label: "Ocasionalmente" },
          { value: "never", label: "Não uso" },
        ],
      },
      {
        id: "cleansingFrequency",
        label: "Com que frequência limpa o rosto?",
        type: "select",
        options: [
          { value: "once", label: "1x ao dia" },
          { value: "twice", label: "2x ao dia" },
          { value: "sometimes", label: "Às vezes" },
        ],
      },
      {
        id: "diet",
        label: "Como é sua alimentação?",
        type: "select",
        options: [
          { value: "high_sugar", label: "Alta em açúcar" },
          { value: "processed", label: "Rica em ultraprocessados" },
          { value: "balanced", label: "Equilibrada" },
        ],
      },
    ],
  },
  {
    id: "environment",
    title: "6. Ambiente e Fatores Externos",
    description: "Para personalizar ainda mais.",
    questions: [
      {
        id: "climate",
        label: "Onde você mora?",
        type: "select",
        options: [
          { value: "humid", label: "Clima úmido" },
          { value: "dry", label: "Clima seco" },
          { value: "cold", label: "Clima frio" },
          { value: "hot", label: "Clima quente" },
        ],
      },
      {
        id: "sleepsWithAC",
        label: "Você dorme com ar condicionado/ventilador ligado?",
        type: "boolean",
      },
      {
        id: "intensiveWorkout",
        label: "Você tem rotina de treino intensa?",
        type: "boolean",
      },
    ],
  },
  {
    id: "sensitivity",
    title: "7. Sensibilidade e Alergias",
    description: "Para evitar ativos irritantes.",
    questions: [
      {
        id: "hasAllergies",
        label: "Você já teve alergia a cosméticos ou ativos?",
        type: "boolean",
      },
      {
        id: "allergyDetails",
        label: "Quais?",
        type: "text",
        condition: (data) => data.hasAllergies === true,
      },
      {
        id: "irritatingIngredients",
        label: "Algum ingrediente causa irritação em você?",
        type: "multiselect",
        options: [
          { value: "salicylic", label: "Ácido salicílico" },
          { value: "glycolic", label: "Ácido glicólico" },
          { value: "retinol", label: "Retinol" },
          { value: "vitc", label: "Vitamina C pura" },
          { value: "fragrance", label: "Fragrância/perfume" },
        ],
      },
    ],
  },
  {
    id: "tolerance",
    title: "8. Teste de Tolerância Cutânea",
    description: "Para identificar a resistência da pele a ativos.",
    questions: [
      {
        id: "skinIrritationFrequency",
        label:
          "Com que frequência sua pele irrita ou descama com novos produtos?",
        type: "select",
        options: [
          { value: "often", label: "Frequentemente" },
          { value: "sometimes", label: "Às vezes" },
          { value: "rarely", label: "Raramente" },
          { value: "never", label: "Nunca" },
        ],
      },
      {
        id: "triedRetinol",
        label: "Você já tentou usar retinol?",
        type: "boolean",
      },
      {
        id: "retinolReaction",
        label: "Como sua pele reagiu?",
        type: "select",
        options: [
          { value: "good", label: "Bem" },
          { value: "irritation", label: "Irritação leve" },
          { value: "severe", label: "Irritação severa" },
        ],
        condition: (data) => data.triedRetinol === true,
      },
    ],
  },
  {
    id: "preferences",
    title: "9. Preferências do Usuário",
    description: "Extremamente importante para adesão.",
    questions: [
      {
        id: "preferredTexture",
        label: "Você prefere texturas:",
        type: "multiselect",
        options: [
          { value: "gel", label: "Gel" },
          { value: "gelcream", label: "Gel creme" },
          { value: "cream", label: "Creme" },
          { value: "fluid", label: "Fluido" },
          { value: "serum", label: "Sérum" },
        ],
      },
      {
        id: "prefersFragrance",
        label: "Você prefere produtos com fragrância?",
        type: "select",
        options: [
          { value: "yes", label: "Sim" },
          { value: "no", label: "Não" },
          { value: "indifferent", label: "Indiferente" },
        ],
      },
      {
        id: "brandPreference",
        label: "Prefere marcas:",
        type: "select",
        options: [
          { value: "dermocosmetic", label: "Dermocosméticos" },
          { value: "pharmaceutical", label: "Farmacêuticas" },
          { value: "affordable", label: "Opções mais acessíveis" },
        ],
      },
    ],
  },
  {
    id: "contraindications",
    title: "10. Contraindicações e Segurança",
    description: "Segurança em primeiro lugar.",
    questions: [
      {
        id: "hormonalTreatment",
        label: "Está usando algum tratamento hormonal?",
        type: "boolean",
      },
      {
        id: "usesAntibiotics",
        label: "Está usando antibióticos?",
        type: "boolean",
      },
      {
        id: "usesCorticoids",
        label: "Está usando corticoides?",
        type: "boolean",
      },
    ],
  },
];
