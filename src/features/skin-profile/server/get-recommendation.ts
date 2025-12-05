"use server";

import { auth } from "@/services/auth";
import { db } from "@/services/database/prisma";
import { SkinProfileFormData } from "@/types";
import OpenAI from "openai";

const ALLOWED_BRANDS = [
  "The Ordinary",
  "Principia",
  "Bioderma",
  "Avene",
  "Isdin",
  "Neutrogena",
  "Eucerin",
  "Laneige",
  "Anua",
  "Beauty of Joseon",
  "Bioré",
  "Biodance",
  "Cosrx",
  "Skin1004",
  "Medicube",
  "Tocobo",
  "Caudalie",
  "La Roche-Posay",
  "Cetaphil",
];

const DISALLOWED_BRANDS = ["Cadiveu", "Nivea", "Darrow", "Payot"];

export type ProductRecommendation = {
  id: string;
  name: string;
  category: "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar";
  description: string;
  searchTerms: string[];
};

export type PurchaseUrl = {
  storeName: string;
  url: string;
};

export type ProductRecommendationWithUrls = ProductRecommendation & {
  purchaseUrls: PurchaseUrl[];
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ECommerceStore {
  name: string;
  baseUrl: string;
  searchPath: string;
}

const ECOMMERCE_STORES: ECommerceStore[] = [
  {
    name: "LABKO",
    baseUrl: "https://labko.com.br",
    searchPath: "/busca?q=",
  },
  {
    name: "Amobeleza",
    baseUrl: "https://www.amobeleza.com.br",
    searchPath: "/busca?q=",
  },
  {
    name: "Sephora",
    baseUrl: "https://sephora.com.br",
    searchPath: "/busca/?q=",
  },
  {
    name: "Beleza na Web",
    baseUrl: "https://www.belezanaweb.com.br",
    searchPath: "/busca?q=",
  },
  {
    name: "Drogaraia",
    baseUrl: "https://www.drogaraia.com.br",
    searchPath: "/busca?q=",
  },
];

function generatePurchaseUrls(terms: string[]): PurchaseUrl[] {
  if (!terms || terms.length === 0) {
    return [];
  }

  // Usar apenas o primeiro termo (que deve ser "Marca Nome-do-Produto")
  // Isso garante busca mais precisa
  const mainSearchTerm = terms[0];
  // Converter para lowercase para melhor compatibilidade com sites de e-commerce
  const searchQuery = mainSearchTerm.toLowerCase().replace(/\s/g, "+");
  let selectedStore: ECommerceStore;

  // 20% de chance de mostrar LABKO (primeira loja)
  // 80% distribuído entre as outras lojas
  const randomChance = Math.random();
  if (randomChance < 0.2 && ECOMMERCE_STORES.length > 0) {
    selectedStore = ECOMMERCE_STORES[0]; // LABKO
  } else {
    // Seleciona aleatoriamente entre as outras lojas (índices 1-4)
    const otherStores = ECOMMERCE_STORES.slice(1);
    const randomIndex = Math.floor(Math.random() * otherStores.length);
    selectedStore = otherStores[randomIndex];
  }

  const purchaseUrl: PurchaseUrl = {
    storeName: selectedStore.name,
    url: `${selectedStore.baseUrl}${selectedStore.searchPath}${searchQuery}`,
  };

  return [purchaseUrl];
}

function formatProfileForAI(data: SkinProfileFormData): string {
  const sections: string[] = [];

  // 1. Identificação do Tipo de Pele
  const skinType: string[] = [];
  if (data.feelsTightAfterWashing)
    skinType.push("Sente a pele repuxar após lavar");
  if (data.getsShinySkin) skinType.push("Pele fica brilhosa");
  if (data.oilProductionArea)
    skinType.push(`Produção de óleo: ${data.oilProductionArea}`);
  if (data.hasDilatedPores) skinType.push("Tem poros dilatados");
  if (data.dilatedPoresLocation)
    skinType.push(`Localização dos poros: ${data.dilatedPoresLocation}`);
  if (data.hasFlakingSkin) skinType.push("Pele descama");
  if (data.getsRedEasily) skinType.push("Pele fica vermelha facilmente");
  if (data.cosmeticsBurn) skinType.push("Cosméticos ardem na pele");
  if (skinType.length > 0) {
    sections.push(`**Tipo de Pele:**\n${skinType.join(", ")}`);
  }

  // 2. Histórico Dermatológico
  const conditions: string[] = [];
  if (data.hasAcne) conditions.push("Acne");
  if (data.hasRosacea) conditions.push("Rosácea");
  if (data.hasAtopicDermatitis) conditions.push("Dermatite Atópica");
  if (data.hasSeborrheicDermatitis) conditions.push("Dermatite Seborreica");
  if (data.hasMelasma) conditions.push("Melasma");
  if (data.hasPsoriasis) conditions.push("Psoríase");
  if (conditions.length > 0) {
    sections.push(`**Condições de Pele:**\n${conditions.join(", ")}`);
  }
  if (data.currentTreatment) {
    sections.push(`**Tratamento Atual:** ${data.currentTreatment}`);
  }
  if (data.currentMedication) {
    sections.push(`**Medicação Atual:** ${data.currentMedication}`);
  }
  if (data.recentProcedures && data.procedureType) {
    sections.push(
      `**Procedimento Recente:** ${data.procedureType}${data.procedureDate ? ` em ${data.procedureDate}` : ""}`,
    );
  }

  // 3. Rotina Atual
  if (data.morningProducts && data.morningProducts.length > 0) {
    sections.push(`**Produtos Matinais:** ${data.morningProducts.join(", ")}`);
  }
  if (data.nightProducts && data.nightProducts.length > 0) {
    sections.push(`**Produtos Noturnos:** ${data.nightProducts.join(", ")}`);
  }
  if (data.routineSteps) {
    sections.push(`**Passos na Rotina:** ${data.routineSteps}`);
  }

  // 4. Objetivos
  if (data.mainGoal) {
    sections.push(`**Objetivo Principal:** ${data.mainGoal}`);
  }
  if (data.secondaryGoals && data.secondaryGoals.length > 0) {
    sections.push(
      `**Objetivos Secundários:** ${data.secondaryGoals.join(", ")}`,
    );
  }

  // 5. Hábitos e Estilo de Vida
  const lifestyle: string[] = [];
  if (data.sunExposure) lifestyle.push(`Exposição solar: ${data.sunExposure}`);
  if (data.usesSunscreenDaily !== undefined) {
    lifestyle.push(
      `Usa protetor solar diariamente: ${data.usesSunscreenDaily ? "Sim" : "Não"}`,
    );
  }
  if (data.usesMakeup) lifestyle.push(`Uso de maquiagem: ${data.usesMakeup}`);
  if (data.cleansingFrequency)
    lifestyle.push(`Frequência de limpeza: ${data.cleansingFrequency}`);
  if (data.diet) lifestyle.push(`Dieta: ${data.diet}`);
  if (lifestyle.length > 0) {
    sections.push(`**Estilo de Vida:**\n${lifestyle.join("\n")}`);
  }

  // 6. Ambiente
  const environment: string[] = [];
  if (data.climate) environment.push(`Clima: ${data.climate}`);
  if (data.sleepsWithAC) environment.push("Dorme com ar condicionado");
  if (data.intensiveWorkout) environment.push("Faz exercícios intensos");
  if (environment.length > 0) {
    sections.push(`**Ambiente:** ${environment.join(", ")}`);
  }

  // 7. Sensibilidade e Alergias
  if (data.hasAllergies && data.allergyDetails) {
    sections.push(`**Alergias:** ${data.allergyDetails}`);
  }
  if (data.irritatingIngredients && data.irritatingIngredients.length > 0) {
    sections.push(
      `**Ingredientes Irritantes:** ${data.irritatingIngredients.join(", ")}`,
    );
  }

  // 8. Teste de Tolerância
  if (data.skinIrritationFrequency) {
    sections.push(
      `**Frequência de Irritação:** ${data.skinIrritationFrequency}`,
    );
  }
  if (data.triedRetinol && data.retinolReaction) {
    sections.push(`**Reação ao Retinol:** ${data.retinolReaction}`);
  }

  // 9. Preferências
  const preferences: string[] = [];
  if (data.preferredTexture && data.preferredTexture.length > 0) {
    preferences.push(
      `Texturas preferidas: ${data.preferredTexture.join(", ")}`,
    );
  }
  if (data.prefersFragrance) {
    preferences.push(`Preferência por fragrância: ${data.prefersFragrance}`);
  }
  if (data.brandPreference) {
    preferences.push(`Preferência de marca: ${data.brandPreference}`);
  }
  if (preferences.length > 0) {
    sections.push(`**Preferências:**\n${preferences.join("\n")}`);
  }

  // 10. Contraindicações
  const contraindications: string[] = [];
  if (data.hormonalTreatment && data.hormonalTreatmentType) {
    contraindications.push(
      `Tratamento hormonal: ${data.hormonalTreatmentType}`,
    );
  }
  if (data.usesAntibiotics) contraindications.push("Usa antibióticos");
  if (data.usesCorticoids) contraindications.push("Usa corticoides");
  if (contraindications.length > 0) {
    sections.push(
      `**⚠️ CONTRAINDICAÇÕES IMPORTANTES:** ${contraindications.join(", ")}`,
    );
  }

  return sections.join("\n\n");
}

export async function getRecommendationsForProfile(): Promise<
  ProductRecommendationWithUrls[]
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado.");
    }

    const MODEL_NAME = "gpt-4-turbo";

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Chave da API OpenAI não configurada.");
    }

    const userProfile = await db.skinProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return [];
    }

    const ALLOWED_BRANDS_LIST = ALLOWED_BRANDS.join(", ");

    const profileSummary = formatProfileForAI(
      userProfile as SkinProfileFormData,
    );
    const systemPrompt = `
      Você é uma dermatologista especialista em skincare.
      Sua tarefa é criar uma rotina de skincare completa com base no perfil do usuário.
      Você deve recomendar 4 PRODUTOS DIFERENTES para cada uma das 4 categorias (Limpeza, Hidratação, Tratamento, Proteção Solar).
      TOTAL: 16 produtos recomendados.
      
      **REGRAS CRÍTICAS DE PRODUTO:**
      1. Recomende APENAS produtos que você TEM CERTEZA que existem e são vendidos no Brasil
      2. O 'name' do produto DEVE estar em PORTUGUÊS e incluir o TIPO do produto + MARCA + NOME
         Exemplos: "Gel de Limpeza Neutrogena Deep Clean", "Hidratante Neutrogena Hydro Boost", "Sérum The Ordinary Niacinamide"
      3. Use APENAS marcas permitidas: ${ALLOWED_BRANDS_LIST}
      4. NUNCA recomende: ${DISALLOWED_BRANDS.join(", ")}
      5. Prefira produtos POPULARES e AMPLAMENTE DISPONÍVEIS
      6. Se não tiver certeza sobre um produto, escolha outro da lista de exemplos
      7. Os 4 produtos de cada categoria devem ser DIFERENTES entre si (marcas ou linhas diferentes)
      
      **PRODUTOS VERIFICADOS E DISPONÍVEIS (use PREFERENCIALMENTE estes):**
      
      LIMPEZA (use prefixos: "Água Micelar", "Gel de Limpeza", "Sabonete Líquido", "Espuma de Limpeza"):
      - "Água Micelar Bioderma Sensibio H2O" - disponível em todas as lojas
      - "Gel de Limpeza Neutrogena Deep Clean" - muito popular
      - "Gel de Limpeza Cosrx Low pH Good Morning" - suave
      - "Gel de Limpeza La Roche-Posay Effaclar" - para pele oleosa
      - "Sabonete Líquido Cetaphil Gentle Skin Cleanser" - suave
      - "Gel de Limpeza Eucerin Dermatoclean" - pele sensível
      - "Espuma de Limpeza Bioré Perfect Whip" - pele oleosa
      
      HIDRATAÇÃO (use prefixos: "Hidratante", "Gel Hidratante", "Creme Hidratante", "Bálsamo"):
      - "Gel Hidratante Neutrogena Hydro Boost Water Gel" - muito popular
      - "Creme Hidratante Eucerin Urea Repair Plus" - intenso
      - "Bálsamo Hidratante Bioderma Atoderm Intensive Baume"
      - "Hidratante La Roche-Posay Toleriane Ultra" - pele sensível
      - "Creme Hidratante Cetaphil Moisturizing Cream"
      - "Gel Hidratante Isdin Hydration Ureadin" - pele seca
      - "Creme Hidratante Avene Tolerance Extreme" - pele muito sensível
      
      TRATAMENTO (use prefixos: "Sérum", "Essência", "Ampola", "Tratamento"):
      - "Sérum The Ordinary Niacinamide 10% + Zinc 1%" - oleosidade e poros
      - "Sérum The Ordinary Hyaluronic Acid 2% + B5" - hidratante
      - "Essência Cosrx Advanced Snail 96 Mucin Power" - reparadora
      - "Sérum Beauty of Joseon Glow Serum" - iluminador
      - "Ampola Skin1004 Madagascar Centella" - calmante
      - "Sérum The Ordinary Retinol 0.5% in Squalane" - anti-idade
      - "Sérum Principia Vitamina C 10%" - antioxidante
      - "Tratamento Cosrx BHA Blackhead Power Liquid" - poros e cravos
      
      PROTEÇÃO SOLAR (use prefixos: "Protetor Solar", "Filtro Solar"):
      - "Protetor Solar Bioderma Photoderm Max SPF 50+"
      - "Protetor Solar La Roche-Posay Anthelios XL SPF 50+"
      - "Protetor Solar Neutrogena Sun Fresh FPS 50"
      - "Protetor Solar Eucerin Sun Oil Control FPS 50+"
      - "Protetor Solar Isdin Fusion Water FPS 50"
      - "Protetor Solar Beauty of Joseon Relief Sun SPF 50+"
      - "Protetor Solar Anua Heartleaf Silky Moisture Sun Cream SPF 50+"

      **IMPORTANTE:** 
      - SEMPRE inclua o tipo do produto em português no início do nome
      - Use APENAS produtos desta lista ou produtos MUITO SIMILARES que você SABE que existem
      - NÃO invente variações de nomes
      - Se tiver dúvida, escolha outro produto da lista
      - Priorize marcas como Bioderma, La Roche-Posay, Neutrogena, Eucerin, The Ordinary
      - Para cada categoria, escolha 4 produtos DIFERENTES (marcas ou linhas diferentes)
      
      Retorne APENAS um objeto JSON com uma única chave: "recommendations".
      A chave "recommendations" deve ser um array de 16 objetos (4 de cada categoria).
      Cada objeto deve seguir esta interface:
      {
        id: string; // Use 'p1' até 'p16'
        name: string; // TIPO + MARCA + NOME (ex: "Gel de Limpeza Neutrogena Deep Clean")
        category: "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar";
        description: string; // Breve explicação (2-3 linhas) do porquê este produto é ideal.
        searchTerms: string[]; // Array com 2 termos: ["tipo marca nome-produto", "categoria"]. Ex: ["gel de limpeza neutrogena deep clean", "limpeza facial"]
      }
      
      **DISTRIBUIÇÃO DOS IDS:**
      - Limpeza: p1, p2, p3, p4
      - Hidratação: p5, p6, p7, p8
      - Tratamento: p9, p10, p11, p12
      - Proteção Solar: p13, p14, p15, p16
      
      **REGRAS ESPECIAIS:**
      - Se gravidez/amamentação/Isotretinoína: EVITE Retinol, Ácido Salicílico, ácidos fortes
      - Para pele sensível: prefira Bioderma, Avene, Eucerin
      - Para pele oleosa: prefira The Ordinary, Cosrx, Neutrogena
      - Para tratamento: The Ordinary, Cosrx, Skin1004 têm ótimos séruns
      - Para proteção solar: Bioderma, Neutrogena, Beauty of Joseon, Anua, Eucerin
      
      **VALIDAÇÃO FINAL:** Antes de retornar, verifique se TODOS os produtos que você recomendou são REAIS e FACILMENTE ENCONTRADOS.
    `;

    const userPrompt = `
      Aqui está o perfil do meu paciente. Gere as recomendações no formato JSON.
      Perfil:
      ${profileSummary}
    `;

    const response = await openai.chat.completions.create({
      model: MODEL_NAME,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
    });

    const jsonResponse = response.choices[0].message.content;
    if (!jsonResponse) {
      throw new Error("A IA não retornou uma resposta JSON válida.");
    }

    const parsedJson = JSON.parse(jsonResponse);
    const rawRecommendations: ProductRecommendation[] =
      parsedJson.recommendations || [];

    const recommendationsWithUrls: ProductRecommendationWithUrls[] =
      rawRecommendations.map((rec) => {
        const purchaseUrls = generatePurchaseUrls(rec.searchTerms);
        return {
          ...rec,
          purchaseUrls: purchaseUrls,
        };
      });

    // Salvar recomendações no banco de dados
    try {
      await db.productRecommendation.createMany({
        data: recommendationsWithUrls.map((rec) => ({
          productId: rec.id,
          name: rec.name,
          category: rec.category,
          description: rec.description,
          searchTerms: rec.searchTerms,
          userId: session.user.id,
        })),
      });

      // Salvar URLs de compra
      for (const rec of recommendationsWithUrls) {
        const savedRec = await db.productRecommendation.findFirst({
          where: {
            productId: rec.id,
            userId: session.user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (savedRec && rec.purchaseUrls.length > 0) {
          await db.purchaseUrl.createMany({
            data: rec.purchaseUrls.map((url) => ({
              storeName: url.storeName,
              url: url.url,
              recommendationId: savedRec.id,
            })),
          });
        }
      }
    } catch (dbError) {
      console.error("[SAVE_RECOMMENDATIONS_ERROR]", dbError);
      // Continua mesmo se houver erro ao salvar
    }

    return recommendationsWithUrls;
  } catch (error) {
    console.error("[GET_RECOMMENDATIONS_ERROR]", error);
    return [];
  }
}
