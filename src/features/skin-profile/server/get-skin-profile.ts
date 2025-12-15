"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";

export async function getSkinProfile() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Usuário não autenticado.");
    }

    const profile = await db.skinProfile.findUnique({
      where: { userId: session.user.id },
    });

    return profile;
  } catch (error) {
    console.error("[GET_SKIN_PROFILE_ERROR]", error);
    // Para useQuery, é melhor lançar o erro para o `error` state funcionar
    throw new Error("Falha ao buscar perfil de pele.");
  }
}
