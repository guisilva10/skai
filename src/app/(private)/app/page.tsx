import { auth } from "@/services/auth"; // Seu serviço de autenticação
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { redirect } from "next/navigation";
import SkincareQuestionnaire from "./_components/questions-form";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    // Redireciona para o login se não estiver autenticado
    redirect("/auth");
  }

  return (
    <div className="container mx-auto max-w-3xl py-8 md:py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Análise de Pele
          </CardTitle>
          <CardDescription>
            Olá,{" "}
            <span className="font-medium">
              {session.user.name || "usuário"}
            </span>
            ! Responda ao questionário abaixo para receber recomendações de
            produtos personalizadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* O componente cliente faz todo o trabalho de fetch e mutação */}
          <SkincareQuestionnaire />
        </CardContent>
      </Card>
    </div>
  );
}
