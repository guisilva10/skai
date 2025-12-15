import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dicas de Skincare | SKAI",
  description:
    "Aprenda a aplicar cada tipo de produto corretamente. Guia completo com ordem de aplicação para manhã e noite.",
  keywords: [
    "dicas skincare",
    "como aplicar produtos",
    "rotina skincare",
    "ordem de aplicação",
    "guia de cuidados com a pele",
  ],
  openGraph: {
    title: "Dicas de Skincare | SKAI",
    description:
      "Aprenda a aplicar cada tipo de produto corretamente para maximizar os resultados da sua rotina.",
    type: "website",
  },
};

export default function TipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
