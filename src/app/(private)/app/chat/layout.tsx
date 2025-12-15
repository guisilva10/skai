import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat de Skincare | SKAI",
  description:
    "Tire suas dúvidas sobre cuidados com a pele com nossa IA especializada. Chat inteligente para skincare personalizado.",
  keywords: [
    "chat skincare",
    "IA skincare",
    "dúvidas pele",
    "assistente virtual",
    "cuidados com a pele",
  ],
  openGraph: {
    title: "Chat de Skincare | SKAI",
    description:
      "Tire suas dúvidas sobre cuidados com a pele com nossa IA especializada.",
    type: "website",
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
