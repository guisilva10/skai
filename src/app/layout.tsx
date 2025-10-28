import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SKAI - Recomendações Personalizadas de Skincare",
  description:
    "Descubra seu regime de skincare ideal em minutos com recomendações personalizadas impulsionadas por IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
