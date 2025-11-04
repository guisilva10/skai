import { FeaturesSection } from "./features-section";

const StepByStepSection = () => {
  return (
    <div
      className="mx-auto w-full px-8 py-12 lg:max-w-7xl lg:py-24"
      id="howitworks"
    >
      <div className="text-center">
        <h2 className="text-center text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl">
          Como Funciona
        </h2>
        <p className="text-muted-foreground mt-4 text-lg">
          Chega de confusão. Em poucos passos, transformamos suas respostas em
          uma rotina de skincare 100% personalizada.
        </p>
      </div>
      <FeaturesSection />
    </div>
  );
};

export default StepByStepSection;
