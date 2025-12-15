import type { Metadata } from "next";
import { LoginForm } from "../_components/login-form";

export const metadata: Metadata = {
  title: "Entrar | SKAI",
  description:
    "Faça login na sua conta SKAI e acesse suas recomendações personalizadas de skincare.",
  keywords: ["login", "entrar", "conta SKAI", "skincare", "acesso"],
  openGraph: {
    title: "Entrar | SKAI",
    description:
      "Faça login na sua conta SKAI e acesse suas recomendações personalizadas de skincare.",
    type: "website",
  },
};

export default function LoginPage() {
  return (
    <div className="w-full overflow-hidden lg:max-w-screen">
      <LoginForm />
    </div>
  );
}
