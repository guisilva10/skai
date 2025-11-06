"use client";

import { RoutineStepCard } from "./products-card"; // 1. Importa o NOVO card
import { SoapDispenserDroplet, Droplet, Sun, Wand2 } from "lucide-react"; // 2. Ícones para os passos

// 3. Novos dados focados nos passos da rotina
const routineStepsData = [
  {
    id: "step1",
    stepNumber: "Passo 1",
    title: "Limpeza",
    description:
      "Comece com um gel ou espuma de limpeza para remover impurezas, oleosidade e preparar a pele.",
    IconComponent: SoapDispenserDroplet, // Ícone de "Sabão"
  },
  {
    id: "step2",
    stepNumber: "Passo 2",
    title: "Tratamento",
    description:
      "Aplique séruns específicos (como Vitamina C ou Ácido Hialurônico) para tratar necessidades da sua pele.",
    IconComponent: Wand2, // Ícone de "Magia/Tratamento"
  },
  {
    id: "step3",
    stepNumber: "Passo 3",
    title: "Hidratação",
    description:
      "Use um hidratante adequado ao seu tipo de pele para reter a umidade e fortalecer a barreira cutânea.",
    IconComponent: Droplet, // Ícone de "Gota"
  },
  {
    id: "step4",
    stepNumber: "Passo 4",
    title: "Proteção",
    description:
      "Finalize com protetor solar (FPS 30+) todas as manhãs para prevenir danos e o envelhecimento precoce.",
    IconComponent: Sun, // Ícone de "Sol"
  },
];

// 4. Componente renomeado
export function SkincareRoutine() {
  return (
    <section
      className="mx-auto w-full px-8 py-12 lg:max-w-7xl"
      id="products" // 5. ID da seção atualizado
    >
      <div className="container mx-auto px-4">
        {/* 6. Textos atualizados para refletir a nova ideia */}
        <h2 className="mb-12 text-center text-3xl font-medium tracking-tight text-black md:text-4xl lg:text-5xl dark:text-white">
          Sua Rotina de Skincare Ideal
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-600 dark:text-gray-300">
          Construir uma rotina eficaz é mais simples do que parece. Siga estes
          passos essenciais para uma pele saudável e radiante.
        </p>

        {/* 7. O grid agora usa os novos dados e o novo componente de card */}
        <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {routineStepsData.map((step) => (
            <RoutineStepCard key={step.id} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
