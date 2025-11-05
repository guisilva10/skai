"use server";

import bcrypt from "bcryptjs";
import { db } from "@/services/database/prisma";
import { revalidatePath } from "next/cache";
import { User } from "@prisma/client";

export type SafeUser = Omit<User, "password" | "emailVerified">;

export type UserFormData = {
  name: string;
  email: string;
  password: string;
};

export const registerUser = async (formData: UserFormData) => {
  try {
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    await db.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
      },
    });

    revalidatePath("/auth/register");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar usuário:", error);

    return { success: false, message: "Erro desconhecido ao salvar." };
  }
};
