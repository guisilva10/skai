"use server";

import { z } from "zod";
import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";
import {
  ProductRecommendation,
  SkinProfileFormData,
  skinProfileSchema,
} from "@/types";
import OpenAI from "openai";
import { db } from "@/services/database/prisma";

type ActionResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: { message: string; validationErrors?: z.ZodIssue[] };
    };

// Inicializa o cliente OpenAI
// Certifique-se de que a variável de ambiente OPENAI_API_KEY está definida
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Formata os dados do perfil em um texto legível para a IA.
 */
function formatProfileForAI(data: SkinProfileFormData): string {
  const translations: Record<string, string> = {
    // SkinType
    OLEOSA: "Oleosa (brilhante, poros dilatados)",
    SECA: "Seca (tendência a descamação)",
    MISTA: "Mista (Zona T oleosa, bochechas secas)",
    SENSIVEL: "Sensível (reativa, propensa a irritações)",
    // SkincareRoutine
    NAO_COMEÇANDO_AGORA: "Não tem rotina, começando agora",
    SIM_APENAS_LIMPEZA_E_HIDRATANTE:
      "Rotina básica (apenas limpeza e hidratante)",
    SIM_VARIOS_PRODUTOS: "Usa vários produtos",
    SIM_ROTINA_COMPLETATA_COM_ATIVOS: "Rotina completa com ativos",
    // SunExposure
    BAIXO: "Baixa exposição ao sol (maioria do dia em casa)",
    MODERADO: "Moderada exposição ao sol (sai ocasionalmente)",
    ALTO: "Alta exposição ao sol (muito tempo ao ar livre)",
    // KnownAllergies
    NAO_TENHO: "Nenhuma alergia conhecida",
    FRAGRANCIAS: "Alergia a fragrâncias",
    ACIDOS_E_ATIVOS_FORTES: "Sensibilidade a ácidos e ativos fortes",
    MULTIPLAS_SENSIBILIDADES: "Múltiplas sensibilidades",
    // PregnancyStatus
    NAO: "Não está grávida ou amamentando",
    GRAVIDA: "Está grávida",
    AMAMENTANDO: "Está amamentando",
    GRAVIDA_E_AMAMENTANDO: "Está grávida e amamentando",
    // SkinMedication
    NAO_TOMA: "Não toma medicação que influencia a pele",
    ISOTRETINOINA: "Toma Isotretinoína (Roacutan)",
    ESPIRONOLACTONA: "Toma Espironolactona",
    OUTRAS_MEDICACOES_DERMATOLOGICAS: "Toma outras medicações dermatológicas",
    MULTIPLAS_MEDICACOES: "Toma múltiplas medicações",
    // SkinCondition
    NAO_TENHO_CONDICOES_ESPECIAIS: "Nenhuma doença de pele",
    DERMATITE_ATORPICA_SEBORREICA_OU_DE_CONTATO:
      "Dermatite (atópica, seborreica ou de contato)",
    ROSACEA: "Rosácea",
    ECZEMA: "Eczema",
    PSORIASE: "Psoríase",
    HISTORICO_DE_HIPERSENSIBILIDADE_CUTANEA:
      "Histórico de hipersensibilidade cutânea",
    MULTIPLAS_CONDICOES: "Múltiplas condições de pele",
    // PoreCondition
    LIMPOS_E_POUCO_VISIVEIS: "Poros limpos e pouco visíveis",
    VISIVEIS_MAS_SEM_PONTOS_PRETOS: "Poros visíveis, mas sem pontos pretos",
    DILATADOS_PRINCIPALMENTE_NA_ZONA_T:
      "Poros dilatados, principalmente na Zona T",
    COM_PRESENCA_DE_PONTOS_PRETOS_CRAVOS:
      "Poros com presença de pontos pretos (cravos)",
    DILATADOS_COM_MUITOS_PONTOS_PRETOS:
      "Poros dilatados com muitos pontos pretos",
    // SmokingHabit
    NAO_FUMO: "Não fuma",
    EX_FUMANTE: "Ex-fumante",
    FUMO_OCASIONALMENTE: "Fuma ocasionalmente (menos de 5/semana)",
    FUMO_MODERADAMENTE: "Fuma moderadamente (5-10/dia)",
    FUMO_FREQUENTEMENTE: "Fuma frequentemente (mais de 10/dia)",
    // WaterIntake
    MENOS_DE_1L: "Menos de 1 litro/dia",
    DE_1_A_2L: "1 a 2 litros/dia",
    DE_2_A_3L: "2 a 3 litros/dia",
    MAIS_DE_3L: "Mais de 3 litros/dia",
  };

  return `
- Tipo de Pele: ${translations[data.skinType!] || "Não informado"}
- Rotina Atual: ${translations[data.skincareRoutine!] || "Não informado"}
- Exposição ao Sol: ${translations[data.sunExposure!] || "Não informado"}
- Alergias Conhecidas: ${translations[data.knownAllergies!] || "Não informado"}
- Gravidez/Amamentação: ${
    translations[data.pregnancyStatus!] || "Não informado"
  }
- Medicação de Pele: ${translations[data.skinMedication!] || "Não informado"}
- Condições de Pele: ${translations[data.skinCondition!] || "Não informado"}
- Condição dos Poros: ${translations[data.poreCondition!] || "Não informado"}
- Hábito de Fumar: ${translations[data.smokingHabit!] || "Não informado"}
- Ingestão de Água: ${translations[data.waterIntake!] || "Não informado"}
`;
}

export async function saveProfileAndGetRecommendations(
  data: SkinProfileFormData,
): Promise<ActionResponse<ProductRecommendation[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: { message: "Usuário não autenticado." } };
    }

    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: { message: "Chave da API OpenAI não configurada." },
      };
    }

    const validation = skinProfileSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: {
          message: "Dados inválidos.",
          validationErrors: validation.error.issues,
        },
      };
    }

    // 1. Salvar o perfil no banco de dados
    await db.skinProfile.upsert({
      where: { userId: session.user.id },
      update: validation.data,
      create: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    // 2. Preparar o prompt para a IA
    const profileSummary = formatProfileForAI(validation.data);
    const systemPrompt = `
      Você é uma dermatologista especialista em skincare.
      Sua tarefa é criar uma rotina de skincare de 4 passos (Limpeza, Hidratação, Tratamento, Proteção Solar) com base no perfil do usuário.
      
      Retorne APENAS um objeto JSON com uma única chave: "recommendations".
      A chave "recommendations" deve ser um array de 4 objetos, um para cada categoria.
      
      Cada objeto no array deve seguir esta interface TypeScript:
      {
        id: string; // Use 'p1', 'p2', 'p3', 'p4'
        name: string; // O nome do produto genérico ou tipo (ex: "Gel de Limpeza Suave")
        category: "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar";
        description: string; // Uma breve explicação (1-2 frases) do porquê este produto é recomendado para este perfil.
        purchaseUrl: string; // Use um URL de placeholder: "https://exemplo.com/produto"
      }

      Importante: Se o perfil indicar gravidez, amamentação ou uso de Isotretinoína,
      os produtos da categoria "Tratamento" devem ser extremamente suaves (ex: Ácido Hialurônico)
      e você deve EVITAR recomendar Retinol, Ácido Salicílico ou outros ácidos fortes.
    `;

    const userPrompt = `
      Aqui está o perfil do meu paciente. Por favor, gere as recomendações de produtos no formato JSON solicitado.
      
      Perfil:
      ${profileSummary}
    `;

    // 3. Chamar a API da OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // ou "gpt-3.5-turbo" para mais rapidez/custo menor
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

    // 4. Parsear e retornar as recomendações
    const parsedJson = JSON.parse(jsonResponse);
    const recommendations: ProductRecommendation[] = parsedJson.recommendations;

    if (!recommendations || !Array.isArray(recommendations)) {
      throw new Error("Formato de recomendação inválido da IA.");
    }

    revalidatePath("/app"); // Mantenha isso se você tiver uma página de perfil

    return { success: true, data: recommendations };
  } catch (error) {
    console.error("[SAVE_PROFILE_ERROR]", error);
    return { success: false, error: { message: "Falha ao salvar o perfil." } };
  }
}
