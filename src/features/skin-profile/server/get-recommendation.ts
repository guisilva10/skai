"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getProductsForAI, getProductById } from "@/lib/product-catalog";
import { redirect } from "next/navigation";

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

      // Verifica se é erro de quota (429)
      if (
        error?.message?.includes("429") ||
        error?.message?.includes("quota")
      ) {
        throw new Error(
          "QUOTA_EXCEEDED: Limite de requisições da API atingido. Por favor, tente novamente em alguns minutos.",
        );
      }

      // Verifica se é erro de autenticação
      if (
        error?.message?.includes("401") ||
        error?.message?.includes("API key")
      ) {
        throw new Error(
          "API_KEY_ERROR: Erro de autenticação com a API. Verifique a configuração.",
        );
      }

      const isRetryable =
        error?.message?.includes("503") ||
        error?.message?.includes("Service Unavailable") ||
        error?.message?.includes("overloaded");

      if (!isRetryable || attempt === maxRetries - 1) {
        throw new Error(
          `API_ERROR: ${error?.message || "Erro ao processar sua solicitação. Tente novamente."}`,
        );
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
  category:
    | "Sabonetes Faciais"
    | "Hidratantes Faciais"
    | "Vitamina C"
    | "Demaquilantes"
    | "Protetores Solares"
    | "Tratamentos";
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
  sabonetesFaciais: AIRecommendation[];
  hidratantesFaciais: AIRecommendation[];
  vitaminaC: AIRecommendation[];
  demaquilantes: AIRecommendation[];
  protetoresSolares: AIRecommendation[];
  tratamentos: AIRecommendation[];
};

const RECOMMENDATION_PROMPT = `Você é uma dermatologista especialista em skincare. 
Analise o perfil de pele do usuário e selecione os melhores produtos do catálogo fornecido.

ATENÇÃO: Cada categoria deve conter APENAS produtos específicos daquela categoria. NÃO misture tipos de produtos.

CATEGORIAS DE PRODUTOS (SIGA RIGOROSAMENTE):

1. sabonetesFaciais: 
   - APENAS géis de limpeza facial SEM função demaquilante, espumas de limpeza, sabonetes faciais líquidos
   - SE o produto tiver "micelar" no nome, NÃO coloque aqui - coloque em demaquilantes
   - NÃO incluir águas micelares, cleansing balm, cleansing oil ou qualquer produto demaquilante

2. hidratantesFaciais: 
   - APENAS cremes hidratantes faciais, gel-cremes, loções hidratantes faciais
   - NÃO incluir séruns ou tratamentos aqui

3. vitaminaC: 
   - APENAS séruns e produtos com Vitamina C como ingrediente principal
   - NÃO incluir outros tipos de séruns aqui

4. demaquilantes: 
   - APENAS águas micelares, cleansing balm, cleansing oil, removedores de maquiagem
   - NÃO incluir sabonetes faciais aqui

5. protetoresSolares: 
   - APENAS protetores solares faciais (FPS 30+)
   - NÃO incluir hidratantes com FPS aqui

6. tratamentos: 
   - APENAS séruns (exceto vitamina C), ácidos (AHA, BHA, retinol), tratamentos anti-idade, clareadores
   - NÃO incluir hidratantes ou vitamina C aqui

REGRAS IMPORTANTES:
1. Selecione EXATAMENTE 15 produtos de cada categoria
2. ORDENE os produtos do MAIS BARATO para o MAIS CARO (pelo campo "price")
3. DISTRIBUIÇÃO: Mescle produtos entre as lojas "amobeleza" e "labko" (aproximadamente 50/50)
4. Considere o perfil de pele do usuário para fazer recomendações personalizadas
5. Para cada produto, forneça uma breve razão (máximo 80 caracteres) do porquê ele é ideal
6. Use APENAS os IDs de produtos que estão no catálogo fornecido
7. NÃO repita o mesmo produto em categorias diferentes
8. NÃO repita produtos com mesmo nome mas tamanhos diferentes (ex: "Produto 100ml" e "Produto 200ml" - escolha apenas UM)
9. IGNORE produtos corporais, foque apenas em produtos FACIAIS
10. Leia atentamente o nome e descrição do produto antes de categorizá-lo

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem explicações, apenas o JSON puro):
{
  "sabonetesFaciais": [{"productId": "id_do_produto", "reason": "Razão breve"}],
  "hidratantesFaciais": [{"productId": "id_do_produto", "reason": "Razão breve"}],
  "vitaminaC": [{"productId": "id_do_produto", "reason": "Razão breve"}],
  "demaquilantes": [{"productId": "id_do_produto", "reason": "Razão breve"}],
  "protetoresSolares": [{"productId": "id_do_produto", "reason": "Razão breve"}],
  "tratamentos": [{"productId": "id_do_produto", "reason": "Razão breve"}]
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

// Função para remover duplicatas de recomendações (produtos com mesmo nome mas tamanhos diferentes)
function removeDuplicateRecommendations(
  recommendations: ProductRecommendationWithUrls[],
): ProductRecommendationWithUrls[] {
  const seen = new Map<string, ProductRecommendationWithUrls>();

  for (const rec of recommendations) {
    // Normaliza o nome removendo tamanhos
    const normalizedName = rec.name
      .toLowerCase()
      .replace(
        /\d+\s*(ml|g|mg|kg|l|litro|litros|gramas?|miligramas?|quilogramas?)/gi,
        "",
      )
      .replace(/\d+\s*unidades?/gi, "")
      .replace(/kit\s+/gi, "")
      .replace(/refil/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    const key = `${rec.category}-${normalizedName}`;

    // Se ainda não vimos este produto, ou se o atual é mais barato, mantemos ele
    if (
      !seen.has(key) ||
      (rec.price && seen.get(key)!.price && rec.price < seen.get(key)!.price!)
    ) {
      seen.set(key, rec);
    }
  }

  return Array.from(seen.values());
}

export async function getRecommendationsForProfile(
  userId?: string,
): Promise<ProductRecommendationWithUrls[]> {
  try {
    let targetUserId: string;

    if (userId) {
      // Called from webhook with specific userId
      targetUserId = userId;
    } else {
      // Called from user session
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado.");
      }
      targetUserId = session.user.id;
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        "Gemini API key não configurada. Adicione GEMINI_API_KEY no .env",
      );
    }

    const userProfile = await db.skinProfile.findUnique({
      where: { userId: targetUserId },
    });

    if (!userProfile) {
      return [];
    }

    console.log("[AI_RECOMMENDATION] Carregando catálogo de produtos...");
    const catalog = await getProductsForAI(30);

    const profileText = formatProfileForAI(userProfile);

    console.log("[AI_RECOMMENDATION] Enviando para Gemini...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
      sabonetesFaciais: "Sabonetes Faciais" as const,
      hidratantesFaciais: "Hidratantes Faciais" as const,
      vitaminaC: "Vitamina C" as const,
      demaquilantes: "Demaquilantes" as const,
      protetoresSolares: "Protetores Solares" as const,
      tratamentos: "Tratamentos" as const,
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

    // ✅ Remove duplicatas (produtos com mesmo nome mas tamanhos diferentes)
    console.log(
      `[AI_RECOMMENDATION] Produtos antes da deduplicação: ${recommendationsWithUrls.length}`,
    );
    const deduplicatedRecommendations = removeDuplicateRecommendations(
      recommendationsWithUrls,
    );
    console.log(
      `[AI_RECOMMENDATION] Produtos após deduplicação: ${deduplicatedRecommendations.length}`,
    );

    try {
      console.log("[AI_RECOMMENDATION] Salvando recomendações no banco...");

      // Limpa recomendações antigas primeiro
      await db.productRecommendation.deleteMany({
        where: { userId: targetUserId },
      });

      // Salva todas as recomendações de uma vez (SEM duplicatas)
      await db.productRecommendation.createMany({
        data: deduplicatedRecommendations.map((rec) => ({
          productId: rec.id,
          name: rec.name,
          category: rec.category,
          description: rec.description,
          searchTerms: rec.searchTerms || [],
          userId: targetUserId,
        })),
      });

      // Busca todos os IDs salvos de uma vez (batch)
      const savedRecs = await db.productRecommendation.findMany({
        where: { userId: targetUserId },
        select: { id: true, productId: true },
      });

      // Cria um mapa para lookup rápido
      const recMap = new Map(savedRecs.map((r) => [r.productId, r.id]));

      // Prepara todas as URLs para inserção em batch
      const allUrls = deduplicatedRecommendations.flatMap((rec) => {
        const savedRecId = recMap.get(rec.id);
        if (!savedRecId || rec.purchaseUrls.length === 0) return [];

        return rec.purchaseUrls.map((url) => ({
          storeName: url.storeName,
          url: url.url,
          recommendationId: savedRecId,
        }));
      });

      // Insere todas as URLs de uma vez
      if (allUrls.length > 0) {
        await db.purchaseUrl.createMany({
          data: allUrls,
        });
      }

      console.log("[AI_RECOMMENDATION] Recomendações salvas com sucesso!");
    } catch (dbError) {
      console.error("[SAVE_RECOMMENDATIONS_ERROR]", dbError);
    }

    // Return recommendations instead of redirecting
    return deduplicatedRecommendations;
  } catch (error) {
    console.error("[GET_RECOMMENDATIONS_ERROR]", error);
    throw error;
  }
}
