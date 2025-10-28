import { AuroraBackground } from "./_components/background-beams";
import { MarqueeCross } from "./_components/marquee-cross";
import { HeroSection } from "./_components/hero-section";
import StepByStepSection from "./_components/step-by-step";
import SmoothScroll from "./_components/scroll-smooth";
import { FeaturedProducts } from "./_components/products-section";
import { WhySkaiSection } from "./_components/why-skai-section";
import { TestimonialsSection } from "./_components/testimonials-section";
import { FAQSection } from "./_components/faq-section";
import { CTASection } from "./_components/cta-section";
import { Footer } from "./_components/footer";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="relative min-h-screen w-full overflow-hidden lg:max-w-screen">
        <AuroraBackground>
          <HeroSection />
        </AuroraBackground>
        <MarqueeCross />
        <StepByStepSection />
        <FeaturedProducts />
        <WhySkaiSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
