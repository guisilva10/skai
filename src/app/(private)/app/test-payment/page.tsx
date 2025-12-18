"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function TestPaymentPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulatePayment = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/test/simulate-payment", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Pagamento simulado com sucesso!");
        toast.info("Recomendações sendo geradas... Aguarde alguns segundos.");

        // Aguarda 5 segundos e redireciona para o catálogo
        setTimeout(() => {
          window.location.href = "/app/catalog";
        }, 5000);
      } else {
        toast.error(data.error || "Erro ao simular pagamento");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao simular pagamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Teste de Pagamento</CardTitle>
          <CardDescription>
            Simule um pagamento aprovado para testar o fluxo completo de geração
            de recomendações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
            <h3 className="font-semibold text-amber-900 dark:text-amber-100">
              ⚠️ Apenas para testes
            </h3>
            <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
              Este botão simula um pagamento aprovado da Cakto. Use apenas em
              ambiente de desenvolvimento.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">O que vai acontecer:</h4>
            <ol className="text-muted-foreground list-decimal space-y-1 pl-5 text-sm">
              <li>Seu status de assinatura será atualizado para ATIVO</li>
              <li>
                A IA Gemini vai gerar recomendações personalizadas (pode demorar
                ~30s)
              </li>
              <li>Você será redirecionado para o catálogo com seus produtos</li>
            </ol>
          </div>

          <Button
            onClick={handleSimulatePayment}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Processando..." : "🚀 Simular Pagamento Aprovado"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
