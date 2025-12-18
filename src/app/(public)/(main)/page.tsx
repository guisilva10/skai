import type { Metadata } from "next";
import { AuroraBackground } from "../../_components/home/background-beams";
import { MarqueeCross } from "../../_components/home/marquee-cross";
import { HeroSection } from "../../_components/home/hero-section";
import StepByStepSection from "../../_components/home/step-by-step";
import SmoothScroll from "../../_components/home/scroll-smooth";
import { SkincareRoutine } from "../../_components/home/products-section";
import { WhySkaiSection } from "../../_components/home/why-skai-section";
import { TestimonialsSection } from "../../_components/home/testimonials-section";
import { FAQSection } from "../../_components/home/faq-section";
import { CTASection } from "../../_components/home/cta-section";
import { Footer } from "../../_components/home/footer";

export const metadata: Metadata = {
  title: "SKAI - Recomendações Personalizadas de Skincare com IA",
  description:
    "Descubra seu regime de skincare ideal em minutos. Nossa IA analisa seu tipo de pele e recomenda os melhores produtos para você.",
  keywords: [
    "skincare",
    "cuidados com a pele",
    "recomendações IA",
    "rotina de beleza",
    "cosméticos",
    "SKAI",
  ],
  openGraph: {
    title: "SKAI - Recomendações Personalizadas de Skincare com IA",
    description:
      "Descubra seu regime de skincare ideal em minutos com recomendações personalizadas impulsionadas por IA.",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden lg:max-w-screen">
      <AuroraBackground>
        <HeroSection />
      </AuroraBackground>
      <MarqueeCross />
      <StepByStepSection />
      <SkincareRoutine />
      <WhySkaiSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
