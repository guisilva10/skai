"use server";

import { auth } from "@/services/auth";
import db from "@/services/database/prisma";
import { SkinProfileFormData } from "@/types";
import { revalidatePath } from "next/cache";

export async function createSkincareProfile(data: SkinProfileFormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado");
  }

  await db.skinProfile.deleteMany({
    where: {
      userId: session.user.id,
    },
  });

  await db.skinProfile.create({
    data: {
      userId: session.user.id,
      ...(data as any),
    },
  });

  revalidatePath("/app");
  revalidatePath("/app/catalog");
}
