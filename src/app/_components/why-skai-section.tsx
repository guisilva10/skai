// components/WhySkaiSection.tsx
"use client";

import React from "react";
import { cn } from "@/app/_lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion"; // <-- MUDANÇA IMPORTANTE AQUI
import { IconBrandYoutubeFilled } from "@tabler/icons-react";

/**
 * Define uma variante de animação padrão "fade in para cima"
 * que usaremos em múltiplos elementos.
 */
const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Seção Principal: "Por que usar SKAI?"
 */
export function WhySkaiSection() {
  const features = [
    {
      title: "Análise Personalizada com IA",
      description:
        "Chega de adivinhar. Nossa IA analisa seu tipo de pele, preocupações e objetivos para criar uma rotina que realmente funciona para você.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Recomendações Imparciais",
      description:
        "Analisamos milhares de produtos para encontrar o melhor para sua pele e seu bolso, sem viés de marca.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "Veja Como Funciona",
      description:
        "Em menos de 2 minutos, você preenche o quiz e recebe sua rotina completa. Veja uma demonstração rápida.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
    },
    {
      title: "Economize Tempo e Dinheiro",
      description:
        "Pare de gastar com produtos errados. Enviamos links diretos para você comprar exatamente o que precisa nas suas lojas favoritas.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];

  return (
    <div className="relative z-20 mx-auto w-full overflow-hidden py-10 lg:max-w-7xl lg:py-24">
      <div className="px-8">
        {/* Título animado */}
        <motion.h4
          className="mx-auto max-w-5xl text-center text-3xl font-medium tracking-tight text-black lg:text-5xl lg:leading-tight dark:text-white"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Sua pele é única. Sua rotina também deveria ser.
        </motion.h4>

        {/* Descrição animada */}
        <motion.p
          className="mx-auto my-4 max-w-2xl text-center text-sm font-normal text-neutral-500 lg:text-base dark:text-neutral-300"
          variants={fadeUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Descubra por que a SKAI é a forma mais inteligente de encontrar os
          produtos certos e parar de gastar com o que não funciona.
        </motion.p>
      </div>

      <div className="relative">
        {/* Contêiner do Grid animado com "staggerChildren" */}
        <motion.div
          className="mt-12 grid grid-cols-1 rounded-md lg:grid-cols-6 xl:border dark:border-neutral-800"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1, // Cada card-filho animará 0.1s após o anterior
              },
            },
          }}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// --- Componentes Helper (Card, Title, Description) ---

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    // O FeatureCard agora é um "motion.div" e usará
    // as variantes "hidden" e "visible" passadas pelo contêiner pai.
    <motion.div
      className={cn(`relative overflow-hidden p-4 sm:p-8`, className)}
      variants={fadeUpVariant} // Usa a mesma variante de "fade para cima"
    >
      {children}
    </motion.div>
  );
};

// ... (O restante dos componentes: FeatureTitle, FeatureDescription, Skeletons e Globe)
// ... (Não é necessário colar o resto, pois eles permanecem iguais ao código anterior)
// ... (Cole apenas até aqui e mantenha o resto do seu arquivo)

// ... (Resto do seu código: FeatureTitle, FeatureDescription, SkeletonOne, SkeletonTwo, etc.)

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="mx-auto max-w-5xl text-left text-xl tracking-tight text-black md:text-2xl md:leading-snug dark:text-white">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p
      className={cn(
        "mx-auto max-w-4xl text-left text-sm md:text-base",
        "text-center font-normal text-neutral-500 dark:text-neutral-300",
        "mx-0 my-2 max-w-sm text-left md:text-sm",
      )}
    >
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex h-full gap-10 px-2 py-8">
      <div className="group mx-auto h-full w-full bg-white p-5 shadow-2xl dark:bg-neutral-900">
        <div className="flex h-full w-full flex-1 flex-col space-y-2">
          <img
            src="/rotina.jpg"
            alt="Rotina de Skincare"
            width={800}
            height={800}
            className="aspect-square h-full w-full rounded-sm object-cover object-center"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-60 w-full bg-linear-to-t from-white via-white to-transparent dark:from-black dark:via-black" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-60 w-full bg-linear-to-b from-white via-transparent to-transparent dark:from-black" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <a
      href="https://www.youtube.com/" // ATUALIZE com o link do seu vídeo
      target="__blank"
      className="group/image relative flex h-full gap-10"
    >
      <div className="group mx-auto h-full w-full bg-transparent dark:bg-transparent">
        <div className="relative flex h-full w-full flex-1 flex-col space-y-2">
          <IconBrandYoutubeFilled className="absolute inset-0 z-10 m-auto h-20 w-20 text-red-500" />
          <img
            src="https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=800&auto=format&fit=crop"
            alt="Pessoa aplicando skincare"
            width={800}
            height={800}
            className="aspect-square h-full w-full rounded-sm object-cover object-center blur-none transition-all duration-200 group-hover/image:blur-md"
          />
        </div>
      </div>
    </a>
  );
};

export const SkeletonTwo = () => {
  const productImages = [
    "/products/product-01.jpg",
    "/products/product-02.jpg",
    "/products/product-03.jpg",
    "/products/product-04.jpg",
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };
  return (
    <div className="relative flex h-full flex-col items-start gap-10 overflow-hidden p-8">
      <div className="-ml-20 flex flex-row">
        {productImages.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="mt-4 -mr-4 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <img
              src={image}
              alt="Produto de Skincare"
              width="500"
              height="500"
              className="h-20 w-20 shrink-0 rounded-lg object-cover md:h-40 md:w-40"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {productImages.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="mt-4 -mr-4 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <img
              src={image}
              alt="Produto de Skincare"
              width="500"
              height="500"
              className="h-20 w-20 shrink-0 rounded-lg object-cover md:h-40 md:w-40"
            />
          </motion.div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-100 h-full w-20 bg-linear-to-r from-white to-transparent dark:from-black" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-100 h-full w-20 bg-linear-to-l from-white to-transparent dark:from-black" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="relative mt-10 flex h-60 flex-col items-center bg-transparent md:h-60 dark:bg-transparent">
      <Globe className="absolute -right-10 -bottom-80 md:-right-10 md:-bottom-72" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [-23.5505, -46.6333], size: 0.1 },
        { location: [-22.9068, -43.1729], size: 0.05 },
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
