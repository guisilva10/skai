import type { Metadata } from "next";
import { RegisterForm } from "../_components/register-form";

export const metadata: Metadata = {
  title: "Criar Conta | SKAI",
  description:
    "Crie sua conta gratuita na SKAI e comece a receber recomendações personalizadas de skincare com IA.",
  keywords: [
    "cadastro",
    "criar conta",
    "registro",
    "SKAI",
    "skincare gratuito",
  ],
  openGraph: {
    title: "Criar Conta | SKAI",
    description:
      "Crie sua conta gratuita na SKAI e comece a receber recomendações personalizadas de skincare.",
    type: "website",
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
