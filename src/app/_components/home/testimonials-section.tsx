"use client";
import { cn } from "@/app/_lib/utils";
import { WobbleCard } from "@/app/_components/ui/wobble-card";
import { motion } from "framer-motion";
import { useFeedbacks } from "@/features/feedback/hooks/use-feedback";

// Dados dos feedbacks de exemplo (fallback)
const defaultFeedbacks = [
  {
    message:
      "A SKAI mudou minha rotina! Finalmente encontrei produtos que realmente funcionam para minha pele sensível. O questionário foi super rápido e as recomendações, perfeitas.",
    name: "Juliana R.",
    role: "Pele Sensível",
    imageUrl: "/mulher01.jpg",
    containerClassName: "col-span-1 lg:col-span-2 h-full min-h-[300px]",
  },
  {
    message:
      "Rápido, fácil e certeiro. Minha pele está visivelmente melhor. Recomendo 100%.",
    name: "Marcela B.",
    role: "Pele Seca",
    imageUrl: "/mulher02.jpg",
    containerClassName: "col-span-1 min-h-[300px]",
  },
  {
    message:
      "Estava completamente perdida sem saber o que comprar. O questionário foi um divisor de águas. Minha acne melhorou 90% em 3 meses seguindo a rotina sugerida pela SKAI. Incrível!",
    name: "Carla S.",
    role: "Pele Acneica",
    imageUrl: "/mulher03.jpg",
    containerClassName: "col-span-1 lg:col-span-3 h-full min-h-[300px]",
  },
];

// Variantes de Animação
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

export function TestimonialsSection() {
  const { data: dbFeedbacks, isLoading: isLoadingFeedbacks } = useFeedbacks();

  // Determine which feedbacks to show
  const displayFeedbacks =
    dbFeedbacks && dbFeedbacks.length > 0
      ? dbFeedbacks.map((f, index) => ({
          ...f,
          // Assign classes based on index to match the layout of defaults
          containerClassName:
            index === 0
              ? "col-span-1 lg:col-span-2 h-full min-h-[300px]"
              : index === 1
                ? "col-span-1 min-h-[300px]"
                : "col-span-1 lg:col-span-3 h-full min-h-[300px]",
          // Use default images if not provided (or random ones)
          imageUrl: f.imageUrl || `/mulher0${(index % 3) + 1}.jpg`,
        }))
      : defaultFeedbacks;

  return (
    <div className="mx-auto py-16 md:py-24 lg:max-w-7xl" id="testimonials">
      <div className="px-8">
        <motion.h2
          className="mx-auto mb-12 text-center text-3xl font-medium lg:max-w-5xl lg:text-5xl"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          O que nossos clientes dizem
        </motion.h2>
      </div>

      <motion.div
        className="grid w-full grid-cols-1 gap-4 px-4 md:px-8 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {displayFeedbacks.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={item.containerClassName}
          >
            <WobbleCard
              containerClassName={cn("bg-primary h-full")}
              className="flex h-full flex-col justify-between p-6"
            >
              <p className="text-left text-lg/7 font-normal text-white">
                "{item.message}"
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
