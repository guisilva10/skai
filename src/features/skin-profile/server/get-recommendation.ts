"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getProductsForAI, getProductById } from "@/lib/product-catalog";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Função de retry com backoff exponencial
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRetryable =
        error?.message?.includes("503") ||
        error?.message?.includes("Service Unavailable") ||
        error?.message?.includes("overloaded");

      if (!isRetryable || attempt === maxRetries - 1) {
        throw error;
      }

      const delay = initialDelay * Math.pow(2, attempt);
      console.log(
        `[AI_RECOMMENDATION] Tentativa ${attempt + 1} falhou. Aguardando ${delay}ms antes de tentar novamente...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

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
  imageUrl?: string;
  price?: number;
};

type AIRecommendation = {
  productId: string;
  reason: string;
};

type AIResponse = {
  limpeza: AIRecommendation[];
  hidratacao: AIRecommendation[];
  tratamento: AIRecommendation[];
  protecaoSolar: AIRecommendation[];
};

const RECOMMENDATION_PROMPT = `Você é uma dermatologista especialista em skincare. 
Analise o perfil de pele do usuário e selecione os melhores produtos do catálogo fornecido.

REGRAS IMPORTANTES:
1. Selecione EXATAMENTE 5 produtos de cada categoria (Limpeza, Hidratação, Tratamento, Proteção Solar)
2. DISTRIBUIÇÃO OBRIGATÓRIA: Em cada categoria, selecione 3 produtos da loja "amobeleza" e 2 da loja "labko"
3. Considere o perfil de pele do usuário para fazer recomendações personalizadas
4. Para cada produto, forneça uma breve razão (máximo 80 caracteres) do porquê ele é ideal
5. Use APENAS os IDs de produtos que estão no catálogo fornecido
6. NÃO repita o mesmo produto

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem explicações, apenas o JSON puro):
{
  "limpeza": [{"productId": "id_do_produto", "reason": "Razão breve"}],
  "hidratacao": [{"productId": "id_do_produto", "reason": "Razão breve"}],
  "tratamento": [{"productId": "id_do_produto", "reason": "Razão breve"}],
  "protecaoSolar": [{"productId": "id_do_produto", "reason": "Razão breve"}]
}`;

function formatProfileForAI(profile: any): string {
  const characteristics = [];

  if (profile.feelsTightAfterWashing)
    characteristics.push("Pele repuxa após lavar");
  if (profile.getsShinySkin) characteristics.push("Pele fica brilhosa");
  if (profile.hasDilatedPores)
    characteristics.push(
      `Poros dilatados ${profile.dilatedPoresLocation || ""}`,
    );
  if (profile.hasFlakingSkin) characteristics.push("Pele descama");
  if (profile.getsRedEasily) characteristics.push("Fica vermelha facilmente");
  if (profile.cosmeticsBurn) characteristics.push("Arde com cosméticos");

  const conditions = [];
  if (profile.hasAcne) conditions.push("Acne");
  if (profile.hasRosacea) conditions.push("Rosácea");
  if (profile.hasMelasma) conditions.push("Melasma");
  if (profile.hasAtopicDermatitis) conditions.push("Dermatite Atópica");
  if (profile.hasSeborrheicDermatitis) conditions.push("Dermatite Seborreica");
  if (profile.hasPsoriasis) conditions.push("Psoríase");

  const goals = [];
  if (profile.mainGoal) goals.push(`Principal: ${profile.mainGoal}`);
  if (profile.secondaryGoals?.length)
    goals.push(`Secundários: ${profile.secondaryGoals.join(", ")}`);

  return `
PERFIL DE PELE DO USUÁRIO:
- Características: ${characteristics.length ? characteristics.join(", ") : "Nenhuma especificada"}
- Condições dermatológicas: ${conditions.length ? conditions.join(", ") : "Nenhuma"}
- Objetivos: ${goals.length ? goals.join("; ") : "Não especificado"}
- Tratamento atual: ${profile.currentTreatment || "Nenhum"}
- Alergias: ${profile.hasAllergies ? profile.allergyDetails || "Sim" : "Não"}
- Ingredientes irritantes: ${profile.irritatingIngredients?.length ? profile.irritatingIngredients.join(", ") : "Nenhum"}
- Exposição solar: ${profile.sunExposure || "Não informado"}
- Usa protetor diariamente: ${profile.usesSunscreenDaily ? "Sim" : "Não"}
- Clima: ${profile.climate || "Não informado"}
- Preferência de textura: ${profile.preferredTexture?.length ? profile.preferredTexture.join(", ") : "Não especificada"}
- Preferência de fragrância: ${profile.prefersFragrance || "Não especificada"}
- Preferência de marca: ${profile.brandPreference || "Não especificada"}
`;
}

export async function getRecommendationsForProfile(): Promise<
  ProductRecommendationWithUrls[]
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado.");
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "Gemini API key não configurada. Adicione GEMINI_API_KEY no .env",
      );
    }

    const userProfile = await db.skinProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return [];
    }

    console.log("[AI_RECOMMENDATION] Carregando catálogo de produtos...");
    const catalog = await getProductsForAI(30);

    const profileText = formatProfileForAI(userProfile);

    console.log("[AI_RECOMMENDATION] Enviando para Gemini...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `${RECOMMENDATION_PROMPT}

${profileText}

CATÁLOGO DE PRODUTOS DISPONÍVEIS:
${JSON.stringify(catalog, null, 2)}`;

    const result = await retryWithBackoff(
      () => model.generateContent(prompt),
      3, // máximo de 3 tentativas
      2000, // começar com 2 segundos de delay
    );
    const response = await result.response;
    const aiContent = response.text();

    console.log("[AI_RECOMMENDATION] Resposta recebida:", aiContent);

    let aiRecommendations: AIResponse;
    try {
      const cleanContent = aiContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      aiRecommendations = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error(
        "[AI_RECOMMENDATION] Erro ao parsear resposta:",
        parseError,
      );
      console.error("[AI_RECOMMENDATION] Conteúdo recebido:", aiContent);
      throw new Error("Erro ao processar resposta da IA");
    }

    const recommendationsWithUrls: ProductRecommendationWithUrls[] = [];

    const categoryMap = {
      limpeza: "Limpeza" as const,
      hidratacao: "Hidratação" as const,
      tratamento: "Tratamento" as const,
      protecaoSolar: "Proteção Solar" as const,
    };

    for (const [categoryKey, categoryName] of Object.entries(categoryMap)) {
      const categoryRecs =
        aiRecommendations[categoryKey as keyof AIResponse] || [];

      for (const rec of categoryRecs) {
        const product = await getProductById(rec.productId);

        if (product) {
          recommendationsWithUrls.push({
            id: product.id,
            name: product.name,
            category: categoryName,
            description: rec.reason,
            searchTerms: [product.brand, product.name],
            imageUrl: product.image_url,
            price: product.price,
            purchaseUrls: [
              {
                storeName: product.source === "labko" ? "LABKO" : "Amobeleza",
                url: product.product_url,
              },
            ],
          });
        }
      }
    }

    try {
      console.log("[AI_RECOMMENDATION] Salvando recomendações no banco...");

      await db.productRecommendation.createMany({
        data: recommendationsWithUrls.map((rec) => ({
          productId: rec.id,
          name: rec.name,
          category: rec.category,
          description: rec.description,
          searchTerms: rec.searchTerms || [],
          userId: session.user.id,
        })),
      });

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

      console.log("[AI_RECOMMENDATION] Recomendações salvas com sucesso!");
    } catch (dbError) {
      console.error("[SAVE_RECOMMENDATIONS_ERROR]", dbError);
    }

    return recommendationsWithUrls;
  } catch (error) {
    console.error("[GET_RECOMMENDATIONS_ERROR]", error);
    return [];
  }
}
