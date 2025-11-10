"use server";

import { auth } from "@/services/auth";
import { db } from "@/services/database/prisma";
import { ProductRecommendation, SkinProfileFormData } from "@/types";
import OpenAI from "openai";

// Inicializa o cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// COPIADO de 'create-skincare-profile.ts'
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
    SIM_ROTINA_COMPLETA_COM_ATIVOS: "Rotina completa com ativos",
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
    NAO_TENHO_CONDICOES_SPECIAIS: "Nenhuma doença de pele",
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

  // Filtra chaves nulas ou indefinidas antes de traduzir
  return Object.entries(data)
    .filter(([, value]) => value != null)
    .map(([key, value]) => `- ${key}: ${translations[value] || value}`)
    .join("\n");
}

/**
 * Busca o perfil do usuário e gera recomendações da IA.
 */
export async function getRecommendationsForProfile(): Promise<
  ProductRecommendation[]
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado.");
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Chave da API OpenAI não configurada.");
    }

    // 1. Buscar perfil existente
    const userProfile = await db.skinProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return []; // Retorna vazio se não há perfil
    }

    // 2. Preparar o prompt para a IA
    const profileSummary = formatProfileForAI(
      userProfile as SkinProfileFormData,
    );
    const systemPrompt = `
      Você é uma dermatologista especialista em skincare.
      Sua tarefa é criar uma rotina de skincare de 4 passos (Limpeza, Hidratação, Tratamento, Proteção Solar) com base no perfil do usuário.
      Retorne APENAS um objeto JSON com uma única chave: "recommendations".
      A chave "recommendations" deve ser um array de 4 objetos.
      Cada objeto deve seguir esta interface:
      {
        id: string; // Use 'p1', 'p2', 'p3', 'p4'
        name: string; // O nome do produto genérico (ex: "Gel de Limpeza Suave")
        category: "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar";
        description: string; // Breve explicação do porquê.
        purchaseUrl: string; // Use "https://exemplo.com/produto"
      }
      Se o perfil indicar gravidez, amamentação ou Isotretinoína,
      EVITE recomendar Retinol, Ácido Salicílico ou ácidos fortes.
    `;

    const userPrompt = `
      Aqui está o perfil do meu paciente. Gere as recomendações no formato JSON.
      Perfil:
      ${profileSummary}
    `;

    // 3. Chamar a API da OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
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
    return parsedJson.recommendations || [];
  } catch (error) {
    console.error("[GET_RECOMMENDATIONS_ERROR]", error);
    return []; // Retorna vazio em caso de erro
  }
}
