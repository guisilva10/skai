"use client";

import { Button } from "@/app/_components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Header from "./header";

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95, x: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.7,
      delay: 0.3,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative mx-auto min-h-screen py-12">
      <Header />
      <div className="mx-auto w-full px-8 py-12 lg:max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="flex flex-col gap-6"
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={textItemVariants}
              className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Descubra sua rotina de skincare ideal em minutos!
            </motion.h1>

            <motion.p
              variants={textItemVariants}
              className="text-muted-foreground max-w-xl text-lg leading-relaxed text-pretty"
            >
              Responda a algumas perguntas simples e receba recomendações
              personalizadas de produtos de skincare, criadas especialmente para
              você.
            </motion.p>

            <motion.div
              variants={textItemVariants}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                className="group py-6 text-base font-semibold"
                asChild
              >
                <Link href="/auth/login" prefetch>
                  Iniciar Questionário
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent py-6 text-base font-semibold"
                asChild
              >
                <Link href="#cta">Saiba Mais</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={textItemVariants}
              className="flex items-center gap-8 pt-4"
            >
              <div>
                <div className="text-foreground text-3xl font-bold">50k+</div>
                <div className="text-muted-foreground text-sm">
                  Usuários Ativos
                </div>
              </div>
              <div className="bg-border h-12 w-px" />
              <div>
                <div className="text-foreground text-3xl font-bold">4.9/5</div>
                <div className="text-muted-foreground text-sm">
                  Avaliação Média
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative hidden lg:block"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-accent/10 absolute inset-0 rounded-3xl blur-3xl" />
            <div className="border-border bg-card relative aspect-square overflow-hidden rounded-3xl border">
              <img
                src="/woman-with-glowing-healthy-skin-applying-skincare-.jpg"
                alt="Mulher aplicando produto de skincare"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
