import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./_components/providers";
import { Toaster } from "./_components/ui/sonner";

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
    <html lang="en" suppressContentEditableWarning suppressHydrationWarning>
      <body>
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
