"use client"; // Necessário para animações

import { cn } from "@/app/_lib/utils";
import {
  IconClipboardText,
  IconSparkles,
  IconChecklist,
  IconShoppingCart,
  // Os ícones IconFlask e IconStar não estão sendo usados neste array
} from "@tabler/icons-react";
import { motion } from "framer-motion"; // Importe o motion

// Variantes de animação para o grid (contêiner)
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Atraso de 0.15s entre cada card
    },
  },
};

// Variantes de animação para cada card (item)
const featureItemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function FeaturesSection() {
  const features = [
    {
      title: "Diagnóstico Rápido",
      description:
        "Responda um questionário simples para entendermos seu tipo de pele, suas preocupações e seus objetivos.",
      icon: <IconClipboardText className="h-8 w-8" />, // Aumentei o tamanho
    },
    {
      title: "Análise Inteligente",
      description:
        "Nossa tecnologia analisa suas respostas para identificar os ingredientes e produtos ideais para você.",
      icon: <IconSparkles className="h-8 w-8" />,
    },
    {
      title: "Rotina Personalizada",
      description:
        "Receba uma rotina de skincare completa (manhã e noite) montada especificamente para suas necessidades.",
      icon: <IconChecklist className="h-8 w-8" />,
    },
    {
      title: "Compre com Confiança",
      description:
        "Fornecemos links diretos para você comprar os produtos recomendados nos melhores e-commerces.",
      icon: <IconShoppingCart className="h-8 w-8" />,
    },
  ];

  return (
    // Transforme o grid em um motion.div com as variantes do contêiner
    <motion.div
      className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-4"
      variants={gridContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Inicia quando 20% estiver visível
    >
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </motion.div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    // Transforme o card em um motion.div com as variantes de item
    <motion.div
      variants={featureItemVariants}
      className={cn(
        "group/feature relative flex flex-col py-10",
        // Lógica de borda simplificada para uma fileira de 4:
        "border-b dark:border-neutral-800", // Borda inferior em mobile
        "lg:border-r lg:border-b-0", // Borda direita no desktop, remove inferior
        index === 0 && "lg:border-l", // Borda esquerda no primeiro item (desktop)
        index === 3 && "lg:border-r-0", // Remove borda direita no último item (desktop)
      )}
    >
      {/* Gradiente de hover (lógica simplificada, pois index >= 4 não existe) */}
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-linear-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />

      <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="relative z-10 mb-2 px-10 text-lg font-bold">
        <div className="group-hover/feature:bg-primary absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-tr-full rounded-br-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 dark:bg-neutral-700" />
        <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="relative z-10 max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300">
        {description}
      </p>
    </motion.div>
  );
};
