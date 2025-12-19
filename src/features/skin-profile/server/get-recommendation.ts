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

⚠️ ATENÇÃO CRÍTICA: Cada categoria deve conter APENAS produtos específicos daquela categoria. NÃO misture tipos de produtos.

🚫 REGRA FUNDAMENTAL - PRODUTOS FACIAIS vs CORPORAIS:
- NUNCA recomende produtos CORPORAIS (corpo, body, douche, banho, shower)
- Verifique CUIDADOSAMENTE o nome e descrição do produto
- Se o produto contém "corpo", "corporal", "body", "douche", "banho" ou "shower" no nome → NÃO RECOMENDE
- APENAS produtos explicitamente FACIAIS ou que não mencionem uso corporal
- Exemplos de produtos PROIBIDOS: "Gel Douche", "Sabonete Corporal", "Body Lotion", "Hidratante Corpo"

📋 CATEGORIAS DE PRODUTOS (SIGA RIGOROSAMENTE):

1. sabonetesFaciais: 
   - ✅ APENAS: Géis de limpeza FACIAL, espumas de limpeza FACIAL, sabonetes líquidos FACIAIS
   - ❌ NUNCA: Produtos com "micelar"/"micellar" (são demaquilantes)
   - ❌ NUNCA: Águas micelares, cleansing balm, cleansing oil
   - ❌ NUNCA: Produtos com "corpo", "corporal", "body", "douche", "banho"
   - ✅ Produtos de "segunda limpeza" (após demaquilante) devem vir aqui
   - ✅ Exemplos válidos: "Gel de Limpeza Facial", "Sabonete Líquido Facial", "Espuma de Limpeza"

2. hidratantesFaciais: 
   - ✅ APENAS: Cremes hidratantes FACIAIS, gel-cremes FACIAIS, loções hidratantes FACIAIS
   - ❌ NUNCA: Séruns, tratamentos, produtos corporais
   - ❌ NUNCA: Produtos com "corpo", "corporal", "body"
   - ✅ Exemplos válidos: "Creme Hidratante Facial", "Gel-Creme Facial"

3. vitaminaC: 
   - ✅ APENAS: Séruns e produtos com Vitamina C como ingrediente principal
   - ❌ NUNCA: Outros tipos de séruns, hidratantes com vitamina C
   - ✅ Exemplos válidos: "Sérum Vitamina C", "Antioxidante Vitamina C"

4. demaquilantes: 
   - ✅ APENAS: Águas micelares, cleansing balm, cleansing oil, removedores de maquiagem
   - ❌ NUNCA: Sabonetes faciais, géis de limpeza
   - ✅ Exemplos válidos: "Água Micelar", "Cleansing Balm", "Óleo Demaquilante"

5. protetoresSolares: 
   - ✅ APENAS: Protetores solares FACIAIS (FPS 30+)
   - ❌ NUNCA: Hidratantes com FPS, protetores corporais
   - ❌ NUNCA: Produtos com "corpo", "corporal", "body"
   - ✅ Exemplos válidos: "Protetor Solar Facial FPS 50", "Filtro Solar Facial"

6. tratamentos: 
   - ✅ APENAS: Séruns (exceto vitamina C), ácidos (AHA, BHA, retinol), tratamentos anti-idade, clareadores
   - ❌ NUNCA: Hidratantes, vitamina C, produtos corporais
   - ✅ Exemplos válidos: "Sérum Ácido Hialurônico", "Tratamento Anti-Idade", "Sérum Niacinamida"

🔒 REGRAS OBRIGATÓRIAS:
1. Selecione 15 produtos de cada categoria (para permitir filtragem posterior)
2. ORDENE os produtos do MAIS BARATO para o MAIS CARO (pelo campo "price")
3. DISTRIBUIÇÃO: Mescle produtos entre as lojas "amobeleza" e "labko" (aproximadamente 50/50)
4. Considere o perfil de pele do usuário para fazer recomendações personalizadas
5. Para cada produto, forneça uma breve razão (máximo 80 caracteres) do porquê ele é ideal
6. Use APENAS os IDs de produtos que estão no catálogo fornecido
7. NÃO repita o mesmo produto em categorias diferentes
8. Tente variar as MARCAS. Evite selecionar muitos produtos da mesma marca na mesma categoria.
9. 🚫 IGNORE COMPLETAMENTE produtos CORPORAIS - foque APENAS em produtos FACIAIS
10. Leia CUIDADOSAMENTE o nome E descrição do produto antes de categorizá-lo
11. Se tiver dúvida se um produto é facial ou corporal, NÃO o recomende
12. Produtos com "Gel Douche", "Sabonete Corpo", "Body" no nome são PROIBIDOS

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

CARACTERÍSTICAS DA PELE:
- Repuxa após lavar: ${profile.feelsTightAfterWashing ? "Sim" : "Não"}
- Fica brilhosa: ${profile.getsShinySkin ? "Sim" : "Não"}
- Poros dilatados: ${profile.hasDilatedPores ? `Sim (${profile.dilatedPoresLocation || "não especificado"})` : "Não"}
- Pele descama: ${profile.hasFlakingSkin ? "Sim" : "Não"}
- Fica vermelha facilmente: ${profile.getsRedEasily ? "Sim" : "Não"}
- Arde com cosméticos: ${profile.cosmeticsBurn ? "Sim" : "Não"}
- Área de produção de óleo: ${profile.oilProductionArea || "Não especificado"}

CONDIÇÕES DERMATOLÓGICAS:
- Acne: ${profile.hasAcne ? "Sim" : "Não"}
- Rosácea: ${profile.hasRosacea ? "Sim" : "Não"}
- Melasma: ${profile.hasMelasma ? "Sim" : "Não"}
- Dermatite Atópica: ${profile.hasAtopicDermatitis ? "Sim" : "Não"}
- Dermatite Seborreica: ${profile.hasSeborrheicDermatitis ? "Sim" : "Não"}
- Psoríase: ${profile.hasPsoriasis ? "Sim" : "Não"}

OBJETIVOS E METAS:
- Objetivo principal: ${profile.mainGoal || "Não especificado"}
- Objetivos secundários: ${profile.secondaryGoals?.length ? profile.secondaryGoals.join(", ") : "Nenhum"}

TRATAMENTOS E MEDICAÇÕES:
- Tratamento atual: ${profile.currentTreatment || "Nenhum"}
- Medicação atual: ${profile.currentMedication || "Nenhuma"}
- Tratamento hormonal: ${profile.hormonalTreatment ? `Sim (${profile.hormonalTreatmentType || "não especificado"})` : "Não"}
- Usa antibióticos: ${profile.usesAntibiotics ? "Sim" : "Não"}
- Usa corticoides: ${profile.usesCorticoids ? "Sim" : "Não"}
- Já tentou retinol: ${profile.triedRetinol ? `Sim (reação: ${profile.retinolReaction || "não especificada"})` : "Não"}

PROCEDIMENTOS ESTÉTICOS:
- Procedimentos recentes: ${profile.recentProcedures ? `Sim (${profile.procedureType || "não especificado"} em ${profile.procedureDate || "data não especificada"})` : "Não"}

ALERGIAS E SENSIBILIDADES:
- Tem alergias: ${profile.hasAllergies ? `Sim (${profile.allergyDetails || "detalhes não especificados"})` : "Não"}
- Ingredientes irritantes: ${profile.irritatingIngredients?.length ? profile.irritatingIngredients.join(", ") : "Nenhum"}
- Frequência de irritação: ${profile.skinIrritationFrequency || "Não especificado"}

ESTILO DE VIDA:
- Exposição solar: ${profile.sunExposure || "Não informado"}
- Usa protetor solar diariamente: ${profile.usesSunscreenDaily ? "Sim" : "Não"}
- Clima onde vive: ${profile.climate || "Não informado"}
- Dorme com ar condicionado: ${profile.sleepsWithAC ? "Sim" : "Não"}
- Pratica exercícios intensos: ${profile.intensiveWorkout ? "Sim" : "Não"}
- Dieta: ${profile.diet || "Não especificada"}
- Usa maquiagem: ${profile.usesMakeup || "Não especificado"}

ROTINA ATUAL:
- Frequência de limpeza: ${profile.cleansingFrequency || "Não especificado"}
- Etapas da rotina: ${profile.routineSteps || "Não especificado"}
- Produtos manhã: ${profile.morningProducts?.length ? profile.morningProducts.join(", ") : "Nenhum"}
- Produtos noite: ${profile.nightProducts?.length ? profile.nightProducts.join(", ") : "Nenhum"}

PREFERÊNCIAS:
- Textura preferida: ${profile.preferredTexture?.length ? profile.preferredTexture.join(", ") : "Não especificada"}
- Preferência de fragrância: ${profile.prefersFragrance || "Não especificada"}
- Preferência de marca: ${profile.brandPreference || "Não especificada"}
`;
}

// Função para remover duplicatas e limitar produtos por marca
function removeDuplicateRecommendations(
  recommendations: ProductRecommendationWithUrls[],
): ProductRecommendationWithUrls[] {
  const seen = new Map<string, ProductRecommendationWithUrls>();
  const brandCounts = new Map<string, number>();

  for (const rec of recommendations) {
    // Extrai a marca do produto (primeira palavra geralmente)
    const brand = rec.searchTerms?.[0]?.toLowerCase() || "unknown";
    const brandKey = `${rec.category}-${brand}`;

    // 🚫 REGRA DE VARIEDADE: Limite de 1 produto por marca por categoria
    // Se já temos um produto desta marca nesta categoria, ignoramos (a menos que seja o mesmo produto sendo atualizado por preço)
    if ((brandCounts.get(brandKey) || 0) >= 1) {
      // Verifica se é o MESMO produto (pela chave de nome) para permitir atualização de preço
      // Se for produto diferente da mesma marca, pula
      // Mas como a chave de nome não tem marca, precisamos ter cuidado.
      // Vamos simplificar: Se a IA mandou ordenado por preço, o primeiro que aparece é o melhor/mais barato.
      // Se já existe um produto dessa marca na categoria, e este não é mais barato que o que já temos, ignoramos.
      // Se for mais barato, substituímos.
      const existingRec = seen.get(`${rec.category}-${rec.name.toLowerCase()}`); // Check for exact name match first
      if (
        existingRec &&
        rec.price &&
        existingRec.price &&
        rec.price < existingRec.price
      ) {
        console.log(
          `[DEDUP] Substituindo "${existingRec.name}" (R$ ${existingRec.price}) por "${rec.name}" (R$ ${rec.price}) - mais barato`,
        );
        seen.set(`${rec.category}-${rec.name.toLowerCase()}`, rec);
      } else if (!existingRec) {
        // If it's a new product name for this brand in this category
        console.log(
          `[DEDUP] Ignorando produto extra da marca "${brand}" na categoria "${rec.category}": "${rec.name}"`,
        );
      }
      continue;
    }

    // Normaliza o nome de forma EXTREMAMENTE agressiva
    const normalizedName = rec.name
      .toLowerCase()
      // Remove tamanhos e unidades (ml, g, kg, etc)
      .replace(
        /\d+\s*(ml|g|mg|kg|l|litro|litros|gramas?|miligramas?|quilogramas?|oz|fl\.?\s*oz)/gi,
        "",
      )
      .replace(/\d+\s*unidades?/gi, "")
      // Remove TODOS os números (incluindo FPS, etc)
      .replace(/\d+/g, "")
      // Remove palavras comuns que não afetam a identidade do produto
      .replace(/\b(kit|refil|pack|duo|trio|combo|set|fps|uv|uva|uvb)\b/gi, "")
      // Remove caracteres especiais e pontuação
      .replace(/[+\-*\/()[\]{}.,;:!?'"–-]/g, " ")
      // Remove palavras muito curtas (artigos, preposições)
      .replace(/\b(de|da|do|e|a|o|com|para|em|no|na)\b/gi, " ")
      // Normaliza espaços múltiplos
      .replace(/\s+/g, " ")
      .trim();

    // ORDENA as palavras para garantir que "Gel Bioderma" e "Bioderma Gel" sejam iguais
    const sortedWords = normalizedName.split(" ").sort().join(" ");

    // Cria uma chave única baseada APENAS na categoria e nome normalizado ordenado
    const key = `${rec.category}-${sortedWords}`;

    console.log(
      `[DEDUP] Original: "${rec.name}" -> Normalized & Sorted: "${sortedWords}" -> Key: "${key}"`,
    );

    // Se ainda não vimos este produto, ou se o atual é mais barato, mantemos ele
    if (
      !seen.has(key) ||
      (rec.price && seen.get(key)!.price && rec.price < seen.get(key)!.price!)
    ) {
      if (seen.has(key)) {
        console.log(
          `[DEDUP] Substituindo "${seen.get(key)!.name}" (R$ ${seen.get(key)!.price}) por "${rec.name}" (R$ ${rec.price}) - mais barato`,
        );
      }
      seen.set(key, rec);
      brandCounts.set(brandKey, (brandCounts.get(brandKey) || 0) + 1);
    } else {
      console.log(
        `[DEDUP] Ignorando duplicata: "${rec.name}" (já temos "${seen.get(key)!.name}")`,
      );
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
    // AUMENTADO PARA 60 para dar mais opções de marcas
    const catalog = await getProductsForAI(60);

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

        // ✅ Validação: só adiciona se o produto existir E tiver URL válida
        if (
          product &&
          product.product_url &&
          product.product_url.trim() !== ""
        ) {
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
        } else {
          console.log(
            `[AI_RECOMMENDATION] Produto ignorado (sem URL válida): ${product?.name || rec.productId}`,
          );
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
      // LIMITA A 10 PRODUTOS POR CATEGORIA AQUI, se necessário, ou salva tudo
      // O prompt pede 15, então podemos ter mais que 10. Vamos salvar todos os filtrados.
      // Ou melhor, vamos garantir que não salvamos demais para não poluir a UI.
      // Vamos agrupar por categoria e pegar os top 10.

      const finalRecommendations: ProductRecommendationWithUrls[] = [];
      const recsByCategory = new Map<string, ProductRecommendationWithUrls[]>();

      for (const rec of deduplicatedRecommendations) {
        if (!recsByCategory.has(rec.category)) {
          recsByCategory.set(rec.category, []);
        }
        if (recsByCategory.get(rec.category)!.length < 10) {
          recsByCategory.get(rec.category)!.push(rec);
          finalRecommendations.push(rec);
        }
      }

      console.log(
        "[AI_RECOMMENDATION] Recomendações geradas com sucesso (sem salvar no banco)!",
      );

      // Return recommendations directly without saving
      return finalRecommendations;
    } catch (error) {
      console.error("[PROCESS_RECOMMENDATIONS_ERROR]", error);
      throw error;
    }
  } catch (error) {
    console.error("[GET_RECOMMENDATIONS_ERROR]", error);
    throw error;
  }
}
