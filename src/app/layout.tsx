import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "./_components/providers";
import { Toaster } from "./_components/ui/sonner";

export const metadata: Metadata = {
  title: "SKAI - Recomendações Personalizadas de Skincare",
  description:
    "Descubra seu regime de skincare ideal em minutos com recomendações personalizadas impulsionadas por IA",
  keywords: [
    "skincare",
    "recomendações",
    "IA",
    "skai",
    "beleza",
    "limpeza de pele",
  ],
  openGraph: {
    title: "SKAI - Recomendações Personalizadas de Skincare",
    description:
      "Descubra seu regime de skincare ideal em minutos com recomendações personalizadas impulsionadas por IA",
    siteName: "SKAI",
    images: [
      {
        url: "https://appskai.vercel.app/logo.svg",
        width: 1200,
        height: 630,
        alt: "SKAI - Recomendações Personalizadas de Skincare",
      },
    ],
    locale: "pt-BR",
    type: "website",
  },
  twitter: {
    title: "SKAI - Recomendações Personalizadas de Skincare",
    description:
      "Descubra seu regime de skincare ideal em minutos com recomendações personalizadas impulsionadas por IA",
    images: [
      {
        url: "https://appskai.vercel.app/logo.svg",
        width: 1200,
        height: 630,
        alt: "SKAI - Recomendações Personalizadas de Skincare",
      },
    ],
  },
  alternates: {
    canonical: "https://appskai.vercel.app/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
