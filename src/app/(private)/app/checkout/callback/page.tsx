import { Suspense } from "react";
import { CheckoutStatus } from "./_components/checkout-status";

export default function CheckoutCallbackPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CheckoutStatus />
    </Suspense>
  );
}
