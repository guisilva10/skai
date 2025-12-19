"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconLoader2, IconCheck, IconX } from "@tabler/icons-react";

export function CheckoutStatus() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Processando seu pagamento...");

  useEffect(() => {
    if (success === "false") {
      setStatus("error");
      setMessage("Pagamento cancelado ou não concluído");
      return;
    }

    // Poll for subscription status
    const checkStatus = async () => {
      try {
        const response = await fetch("/api/user/subscription-status");
        const data = await response.json();

        if (data.status === "ACTIVE") {
          setStatus("success");
          setMessage("Pagamento confirmado! Gerando suas recomendações...");

          // Wait a bit and redirect to recommendations page
          setTimeout(() => {
            router.push("/app/recommendations");
          }, 2000);
        } else if (data.status === "PENDING") {
          // Still pending, check again
          setTimeout(checkStatus, 3000);
        } else {
          setStatus("error");
          setMessage(
            "Erro ao processar pagamento. Entre em contato com o suporte.",
          );
        }
      } catch (error) {
        console.error("Error checking status:", error);
        setTimeout(checkStatus, 3000);
      }
    };

    if (success === "true") {
      checkStatus();
    }
  }, [success, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-card mx-4 w-full max-w-md rounded-2xl border p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-6">
          {/* Icon */}
          <div className="relative">
            {status === "loading" && (
              <>
                <div className="bg-primary/20 absolute inset-0 animate-ping rounded-full" />
                <div className="bg-primary/10 relative rounded-full p-6">
                  <IconLoader2 className="text-primary h-12 w-12 animate-spin" />
                </div>
              </>
            )}
            {status === "success" && (
              <div className="relative rounded-full bg-green-100 p-6 dark:bg-green-900/30">
                <IconCheck className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            )}
            {status === "error" && (
              <div className="relative rounded-full bg-red-100 p-6 dark:bg-red-900/30">
                <IconX className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>

          {/* Message */}
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              {status === "loading" && "Aguarde..."}
              {status === "success" && "Sucesso!"}
              {status === "error" && "Ops!"}
            </h2>
            <p className="text-muted-foreground mt-2">{message}</p>
          </div>

          {/* Action button for error state */}
          {status === "error" && (
            <button
              onClick={() => router.push("/app/quiz")}
              className="bg-primary hover:bg-primary/90 mt-4 rounded-lg px-6 py-2 text-white transition-colors"
            >
              Voltar ao Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
