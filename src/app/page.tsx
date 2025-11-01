import { AuroraBackground } from "./_components/home/background-beams";
import { MarqueeCross } from "./_components/home/marquee-cross";
import { HeroSection } from "./_components/home/hero-section";
import StepByStepSection from "./_components/home/step-by-step";
import SmoothScroll from "./_components/home/scroll-smooth";
import { FeaturedProducts } from "./_components/home/products-section";
import { WhySkaiSection } from "./_components/home/why-skai-section";
import { TestimonialsSection } from "./_components/home/testimonials-section";
import { FAQSection } from "./_components/home/faq-section";
import { CTASection } from "./_components/home/cta-section";
import { Footer } from "./_components/home/footer";

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
