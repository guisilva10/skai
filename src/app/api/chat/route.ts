import { auth } from "@/services/auth";
import db from "@/services/database/prisma";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Mensagens inválidas" },
        { status: 400 },
      );
    }

    // Buscar perfil do usuário para personalizar respostas
    const userProfile = await db.skinProfile.findUnique({
      where: { userId: session.user.id },
    });

    // Criar contexto personalizado baseado no perfil
    let profileContext = "";
    if (userProfile) {
      // Cast para any para evitar erros de tipo com cliente desatualizado
      const p = userProfile as any;

      profileContext = `
O usuário tem o seguinte perfil de pele detalhado:
- Características: ${p.feelsTightAfterWashing ? "Repuxa após lavar" : ""} ${p.getsShinySkin ? "Fica brilhosa" : ""} ${p.hasDilatedPores ? "Poros dilatados" : ""}
- Sensibilidade: ${p.getsRedEasily ? "Fica vermelha fácil" : ""} ${p.cosmeticsBurn ? "Arde com cosméticos" : ""}
- Histórico: ${p.hasAcne ? "Acne" : ""} ${p.hasRosacea ? "Rosácea" : ""} ${p.hasMelasma ? "Melasma" : ""} ${p.hasAtopicDermatitis ? "Dermatite Atópica" : ""}
- Alergias: ${p.hasAllergies ? p.allergyDetails : "Nenhuma conhecida"}
- Tratamentos atuais: ${p.currentTreatment || "Nenhum"}
- Objetivos: ${p.mainGoal}
- Estilo de vida: Exposição solar ${p.sunExposure}, ${p.usesSunscreenDaily ? "Usa protetor diário" : "Não usa protetor diário"}

Use essas informações para personalizar suas recomendações e levar em conta sensibilidades e contraindicações.
`;
    }

    const systemPrompt = `Você é uma dermatologista especialista em skincare, amigável e prestativa.
Seu objetivo é ajudar as pessoas com dúvidas sobre cuidados com a pele, produtos, rotinas e problemas dermatológicos.

${profileContext}

Diretrizes:
- Seja clara, objetiva e use linguagem acessível
- Forneça explicações científicas quando relevante, mas de forma compreensível
- Recomende produtos das seguintes marcas preferencialmente: The Ordinary, Principia, Bioderma, Avene, Isdin, Neutrogena, Eucerin, Laneige, Anua, Beauty of Joseon, Bioré, Biodance, Cosrx, Skin1004, Medicube, Tocobo, Caudalie
- NUNCA recomende: Cadiveu, Nivea, Darrow, Payot
- Se a pergunta envolver condições médicas sérias, sugira consultar um dermatologista
- Considere sempre o perfil do usuário ao dar recomendações
- Se o usuário estiver grávido ou amamentando, evite recomendar retinol, ácido salicílico e ácidos fortes
- Seja empática e encorajadora

Responda em português do Brasil de forma natural e conversacional.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const assistantMessage = response.choices[0].message.content;

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("[CHAT_ERROR]", error);
    return NextResponse.json(
      { error: "Erro ao processar mensagem" },
      { status: 500 },
    );
  }
}
