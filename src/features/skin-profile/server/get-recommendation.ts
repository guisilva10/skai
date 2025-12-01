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
  const translations: Record<string, string> = {
    OLEOSA: "Oleosa (brilhante, poros dilatados)",
    SECA: "Seca (tendência a descamação)",
    MISTA: "Mista (Zona T oleosa, bochechas secas)",
    SENSIVEL: "Sensível (reativa, propensa a irritações)",
    NAO_COMEÇANDO_AGORA: "Não tem rotina, começando agora",
    SIM_APENAS_LIMPEZA_E_HIDRATANTE:
      "Rotina básica (apenas limpeza e hidratante)",
    SIM_VARIOS_PRODUTOS: "Usa vários produtos",
    SIM_ROTINA_COMPLETA_COM_ATIVOS: "Rotina completa com ativos",
    BAIXO: "Baixa exposição ao sol (maioria do dia em casa)",
    MODERADO: "Moderada exposição ao sol (sai ocasionalmente)",
    ALTO: "Alta exposição ao sol (muito tempo ao ar livre)",
    NAO_TENHO: "Nenhuma alergia conhecida",
    FRAGRANCIAS: "Alergia a fragrâncias",
    ACIDOS_E_ATIVOS_FORTES: "Sensibilidade a ácidos e ativos fortes",
    MULTIPLAS_SENSIBILIDADES: "Múltiplas sensibilidades",
    NAO: "Não está grávida ou amamentando",
    GRAVIDA: "Está grávida",
    AMAMENTANDO: "Está amamentando",
    GRAVIDA_E_AMAMENTANDO: "Está grávida e amamentando",
    NAO_TOMA: "Não toma medicação que influencia a pele",
    ISOTRETINOINA: "Toma Isotretinoína (Roacutan)",
    ESPIRONOLACTONA: "Toma Espironolactona",
    OUTRAS_MEDICACOES_DERMATOLOGICAS: "Toma outras medicações dermatológicas",
    MULTIPLAS_MEDICACOES: "Toma múltiplas medicações",
    NAO_TENHO_CONDICOES_SPECIAIS: "Nenhuma doença de pele",
    DERMATITE_ATORPICA_SEBORREICA_OU_DE_CONTATO:
      "Dermatite (atópica, seborreica ou de contato)",
    ROSACEA: "Rosácea",
    ECZEMA: "Eczema",
    PSORIASE: "Psoríase",
    HISTORICO_DE_HIPERSENSIBILIDADE_CUTANEA:
      "Histórico de hipersensibilidade cutânea",
    MULTIPLAS_CONDICOES: "Múltiplas condições de pele",
    LIMPOS_E_POUCO_VISIVEIS: "Poros limpos e pouco visíveis",
    VISIVEIS_MAS_SEM_PONTOS_PRETOS: "Poros visíveis, mas sem pontos pretos",
    DILATADOS_PRINCIPALMENTE_NA_ZONA_T:
      "Poros dilatados, principalmente na Zona T",
    COM_PRESENCA_DE_PONTOS_PRETOS_CRAVOS:
      "Poros com presença de pontos pretos (cravos)",
    DILATADOS_COM_MUITOS_PONTOS_PRETOS:
      "Poros dilatados com muitos pontos pretos",
    NAO_FUMO: "Não fuma",
    EX_FUMANTE: "Ex-fumante",
    FUMO_OCASIONALMENTE: "Fuma ocasionalmente (menos de 5/semana)",
    FUMO_MODERADAMENTE: "Fuma moderadamente (5-10/dia)",
    FUMO_FREQUENTEMENTE: "Fuma frequentemente (mais de 10/dia)",
    MENOS_DE_1L: "Menos de 1 litro/dia",
    DE_1_A_2L: "1 a 2 litros/dia",
    DE_2_A_3L: "2 a 3 litros/dia",
    MAIS_DE_3L: "Mais de 3 litros/dia",
  };

  return Object.entries(data)
    .filter(([, value]) => value != null)
    .map(([key, value]) => {
      const displayValue =
        typeof value === "string" && value in translations
          ? translations[value]
          : String(value);
      return `- ${key}: ${displayValue}`;
    })
    .join("\n");
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

    // Cast to any to avoid Prisma type errors
    const userProfile = await (db as any).skinProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return [];
    }

    const ALLOWED_BRANDS_LIST = ALLOWED_BRANDS.join(", ");

    const profileSummary = formatProfileForAI(
      userProfile as SkinProfileFormData,
    );
    // ... (systemPrompt and userPrompt omitted for brevity, they are unchanged)
    const systemPrompt = `
      Você é uma dermatologista especialista em skincare.
      Sua tarefa é criar uma rotina de skincare de 4 passos (Limpeza, Hidratação, Tratamento, Proteção Solar) com base no perfil do usuário.
      
      **REGRAS CRÍTICAS DE PRODUTO:**
      1. Recomende APENAS produtos REAIS que EXISTEM e são FACILMENTE ENCONTRADOS no mercado brasileiro.
      2. O 'name' do produto DEVE ser EXATAMENTE como é vendido (marca + nome completo).
      3. Use APENAS marcas permitidas: ${ALLOWED_BRANDS_LIST}.
      4. NUNCA recomende: ${DISALLOWED_BRANDS.join(", ")}.
      5. NUNCA invente nomes de produtos - use apenas produtos que você SABE que existem.
      
      **EXEMPLOS DE PRODUTOS REAIS E CORRETOS (que funcionam bem nas buscas):**
      
      LIMPEZA:
      - "Bioderma Sensibio H2O" (água micelar)
      - "Cosrx Low pH Good Morning Gel Cleanser"
      - "Neutrogena Deep Clean"
      - "Avene Cleanance Gel de Limpeza"
      
      HIDRATAÇÃO:
      - "Neutrogena Hydro Boost Water Gel"
      - "Eucerin Urea Repair Plus"
      - "Bioderma Atoderm Intensive Baume"
      - "Laneige Water Sleeping Mask"
      
      TRATAMENTO:
      - "The Ordinary Niacinamide 10% + Zinc 1%"
      - "The Ordinary Hyaluronic Acid 2% + B5"
      - "Cosrx Advanced Snail 96 Mucin Power Essence"
      - "Beauty of Joseon Glow Serum"
      - "Skin1004 Madagascar Centella Ampoule"
      
      PROTEÇÃO SOLAR:
      - "Bioderma Photoderm Max FPS 50+"
      - "Neutrogena Sun Fresh FPS 50"
      - "Beauty of Joseon Relief Sun SPF 50+"
      - "Anua Heartleaf Silky Moisture Sun Cream"
      - "Eucerin Sun Oil Control FPS 50+"

      **IMPORTANTE:** Use EXATAMENTE esses nomes ou produtos similares que você SABE que existem.
      NÃO crie variações ou invente produtos.
      EVITE produtos que não são facilmente encontrados em lojas brasileiras.

      Retorne APENAS um objeto JSON com uma única chave: "recommendations".
      A chave "recommendations" deve ser um array de 4 objetos.
      Cada objeto deve seguir esta interface:
      {
        id: string; // Use 'p1', 'p2', 'p3', 'p4'
        name: string; // MARCA + NOME EXATO DO PRODUTO (ex: "Bioderma Sensibio H2O")
        category: "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar";
        description: string; // Breve explicação (2-3 linhas) do porquê este produto é ideal.
        searchTerms: string[]; // Array com 2 termos: ["marca nome-produto", "tipo"]. Ex: ["bioderma sensibio h2o", "agua micelar"]
      }
      
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
      await (db as any).productRecommendation.createMany({
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
        const savedRec = await (db as any).productRecommendation.findFirst({
          where: {
            productId: rec.id,
            userId: session.user.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (savedRec && rec.purchaseUrls.length > 0) {
          await (db as any).purchaseUrl.createMany({
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
