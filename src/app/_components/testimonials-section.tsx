"use client";
import { cn } from "@/app/_lib/utils";
import { WobbleCard } from "@/components/ui/wobble-card";
import { motion } from "framer-motion"; // 1. Importe o motion

// Dados dos feedbacks (sem alteração)
const feedbacks = [
  {
    quote:
      "A SKAI mudou minha rotina! Finalmente encontrei produtos que realmente funcionam para minha pele sensível. O questionário foi super rápido e as recomendações, perfeitas.",
    name: "Juliana R.",
    role: "Pele Sensível",
    imageUrl: "/mulher01.jpg",
    containerClassName: "col-span-1 lg:col-span-2 h-full min-h-[300px]",
  },
  {
    quote:
      "Rápido, fácil e certeiro. Minha pele está visivelmente melhor. Recomendo 100%.",
    name: "Marcela B.",
    role: "Pele Seca",
    imageUrl: "/mulher02.jpg",
    containerClassName: "col-span-1 min-h-[300px]",
  },
  {
    quote:
      "Estava completamente perdida sem saber o que comprar. O questionário foi um divisor de águas. Minha acne melhorou 90% em 3 meses seguindo a rotina sugerida pela SKAI. Incrível!",
    name: "Carla S.",
    role: "Pele Acneica",
    imageUrl: "/mulher03.jpg",
    containerClassName: "col-span-1 lg:col-span-3 h-full min-h-[300px]",
  },
];

// 2. Variantes de Animação
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Atraso entre cada card
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Componente da Seção
export function TestimonialsSection() {
  return (
    <div className="mx-auto py-16 md:py-24 lg:max-w-7xl">
      {/* 3. Título da Seção Animado */}
      <div className="px-8">
        <motion.h2
          className="mb-12 text-center text-3xl font-medium text-gray-900 lg:max-w-5xl lg:text-5xl dark:text-white"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          O que nossos clientes dizem
        </motion.h2>
      </div>

      {/* 4. Grid de Feedbacks Animado (Contêiner) */}
      <motion.div
        className="grid w-full grid-cols-1 gap-4 px-4 md:px-8 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }} // Inicia quando 10% do grid estiver visível
      >
        {feedbacks.map((item, index) => (
          // 5. Wrapper Animado para cada Card
          <motion.div
            key={index}
            variants={itemVariants} // Anima este wrapper
            className={item.containerClassName} // Classes de grid (col-span, etc) vêm para o wrapper
          >
            <WobbleCard
              // As classes de cor e altura preenchem o wrapper
              containerClassName={cn("bg-primary h-full")}
              className="flex h-full flex-col justify-between p-6" // h-full para preencher o wrapper
            >
              <p className="text-muted-foreground text-left text-lg/7 font-normal">
                "{item.quote}"
              </p>

              <div className="mt-6 flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
                />
                <div>
                  <h3 className="text-left text-base font-semibold tracking-[-0.015em] text-balance text-white md:text-lg">
                    {item.name}
                  </h3>
                  <p className="text-sm text-neutral-200">{item.role}</p>
                </div>
              </div>
            </WobbleCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
