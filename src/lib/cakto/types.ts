// Cakto API Types

export type CaktoAuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type CaktoCheckoutRequest = {
  productId: string;
  customerName: string;
  customerEmail: string;
  customerId?: string;
  successUrl?: string;
  cancelUrl?: string;
};

export type CaktoCheckoutResponse = {
  id: string;
  checkoutUrl: string;
  status: string;
};

export type CaktoWebhookEvent = {
  event: string;
  data: {
    id: string;
    customer: {
      id: string;
      name: string;
      email: string;
    };
    subscription?: {
      id: string;
      status: string;
      startDate: string;
      endDate?: string;
    };
    product: {
      id: string;
      name: string;
    };
    amount: number;
    status: string;
    createdAt: string;
  };
};

export type CaktoSubscriptionStatus =
  | "active"
  | "canceled"
  | "expired"
  | "pending";
