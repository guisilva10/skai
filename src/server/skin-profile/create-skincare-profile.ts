"use server";

import { z } from "zod";
import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";
import {
  ProductRecommendation,
  SkinProfileFormData,
  skinProfileSchema,
} from "@/types";
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

export async function saveProfileAndGetRecommendations(
  data: SkinProfileFormData,
): Promise<ActionResponse<ProductRecommendation[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: { message: "Usuário não autenticado." } };
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

    await db.skinProfile.upsert({
      where: { userId: session.user.id },
      update: validation.data,
      create: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    const recommendations: ProductRecommendation[] = [];

    if (data.skinType === "OILY") {
      recommendations.push({
        id: "p1",
        name: "Gel de Limpeza Antioleosidade",
        category: "Limpeza",
        description:
          "Limpa profundamente e controla a oleosidade sem ressecar.",
        purchaseUrl: "https://exemplo.com/produto/gel-limpeza-oleosa",
      });
    } else {
      recommendations.push({
        id: "p2",
        name: "Sabonete Líquido Hidratante",
        category: "Limpeza",
        description:
          "Limpa suavemente preservando a hidratação natural da pele.",
        purchaseUrl: "https://exemplo.com/produto/sabonete-hidratante",
      });
    }

    if (data.concerns.includes("acne")) {
      recommendations.push({
        id: "p3",
        name: "Sérum Antiacne com Ácido Salicílico",
        category: "Tratamento",
        description: "Reduz a acne e previne o surgimento de novas espinhas.",
        purchaseUrl: "https://exemplo.com/produto/serum-antiacne",
      });
    }

    if (data.concerns.includes("aging")) {
      recommendations.push({
        id: "p4",
        name: "Creme Antissinais com Retinol",
        category: "Tratamento",
        description:
          "Suaviza rugas e linhas finas, melhorando a firmeza da pele.",
        purchaseUrl: "https://exemplo.com/produto/creme-retinol",
      });
    }

    recommendations.push({
      id: "p99",
      name: "Protetor Solar FPS 50 Toque Seco",
      category: "Proteção Solar",
      description: "Proteção diária essencial contra raios UVA/UVB.",
      purchaseUrl: "https://exemplo.com/produto/protetor-solar-fps50",
    });

    revalidatePath("/app");

    return { success: true, data: recommendations };
  } catch (error) {
    console.error("[SAVE_PROFILE_ERROR]", error);
    return { success: false, error: { message: "Falha ao salvar o perfil." } };
  }
}
