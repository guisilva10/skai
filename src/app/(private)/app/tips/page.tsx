"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { tipsData, type Tip, categoryInfo } from "./_data/tips-data";
import {
  IconChevronDown,
  IconChevronUp,
  IconDroplet,
  IconSparkles,
  IconSun,
  IconWash,
  IconAlertTriangle,
  IconBulb,
  IconMoon,
  IconSunHigh,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

const categoryIcons = {
  limpeza: IconWash,
  tratamento: IconSparkles,
  hidratacao: IconDroplet,
  protecao: IconSun,
};

const categoryColors = {
  limpeza: "from-blue-500 to-cyan-500",
  tratamento: "from-purple-500 to-pink-500",
  hidratacao: "from-green-500 to-emerald-500",
  protecao: "from-orange-500 to-yellow-500",
};

// Dados da ordem de aplicação por período
const morningRoutine = [
  { step: 1, product: "Sabonete", description: "Limpeza suave" },
  { step: 2, product: "Tônico", description: "Equilibra o pH" },
  { step: 3, product: "Vitamina C", description: "Antioxidante" },
  { step: 4, product: "Área dos olhos", description: "Creme específico" },
  { step: 5, product: "Hidratante / Sérum", description: "Hidratação" },
  { step: 6, product: "Protetor Solar", description: "Proteção UV" },
];

const nightRoutine = [
  {
    step: 1,
    product: "Água micelar / Demaquilante / Cleansing oil ou balm",
    description: "Remove maquiagem e sujeira",
  },
  { step: 2, product: "Sabonete", description: "Segunda limpeza" },
  { step: 3, product: "Tônico", description: "Equilibra o pH" },
  { step: 4, product: "Área dos olhos", description: "Creme específico" },
  { step: 5, product: "Hidratante", description: "Nutrição noturna" },
  {
    step: 6,
    product: "Tratamento noturno (Sérum, Ácidos)",
    description: "Renovação celular",
  },
];

function RoutineOrderCard() {
  return (
    <Card className="border-primary/30 from-primary/5 to-secondary/5 mb-8 overflow-hidden border-2 border-dashed bg-gradient-to-br">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <span className="text-3xl">📋</span>
          Ordem de Aplicação dos Produtos
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Siga esta ordem para garantir a máxima absorção e eficácia de cada
          produto
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Rotina da Manhã */}
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:from-amber-950/30 dark:to-orange-950/30">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-amber-500/20 p-2">
                <IconSunHigh className="size-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-amber-700 dark:text-amber-300">
                Manhã
              </h3>
            </div>
            <div className="space-y-2">
              {morningRoutine.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-3 rounded-lg bg-white/60 p-3 transition-all hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-amber-900 dark:text-amber-100">
                      {item.product}
                    </p>
                    <p className="text-xs text-amber-700/70 dark:text-amber-300/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rotina da Noite */}
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-5 dark:from-indigo-950/30 dark:to-purple-950/30">
            <div className="mb-4 flex items-center gap-2">
              <div className="rounded-full bg-indigo-500/20 p-2">
                <IconMoon className="size-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                Noite
              </h3>
            </div>
            <div className="space-y-2">
              {nightRoutine.map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-3 rounded-lg bg-white/60 p-3 transition-all hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-indigo-900 dark:text-indigo-100">
                      {item.product}
                    </p>
                    <p className="text-xs text-indigo-700/70 dark:text-indigo-300/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900 dark:bg-amber-950/20">
          <IconBulb className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-xs text-amber-800 dark:text-amber-200">
            <strong>Dica importante:</strong> Sempre aplique os produtos do mais
            leve (aquoso) para o mais denso (cremoso). Aguarde 1-2 minutos entre
            cada produto para garantir a absorção completa.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function TipCard({ tip }: { tip: Tip }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = categoryIcons[tip.category];
  const categoryTitle = categoryInfo[tip.category].title;

  return (
    <Card className="overflow-hidden py-0 transition-shadow hover:shadow-lg">
      <CardHeader
        className={`cursor-pointer bg-gradient-to-r py-4 ${categoryColors[tip.category]} text-white`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-white/20 p-2">
              <Icon size={24} />
            </div>
            <div>
              <div className="mb-1 text-xs font-medium opacity-90">
                {categoryTitle}
              </div>
              <CardTitle className="text-xl">{tip.title}</CardTitle>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-white hover:bg-white/20"
          >
            {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
          </Button>
        </div>
      </CardHeader>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="space-y-6 pt-6">
              {/* Description */}
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  {tip.description}
                </p>
              </div>

              {/* Frequency and Best Time */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-muted rounded-lg p-4">
                  <div className="mb-1 text-sm font-semibold">Frequência</div>
                  <div className="text-sm">{tip.frequency}</div>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="mb-1 text-sm font-semibold">
                    Melhor Horário
                  </div>
                  <div className="text-sm">{tip.bestTime}</div>
                </div>
              </div>

              {/* Steps */}
              <div>
                <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <span className="bg-primary flex size-6 items-center justify-center rounded-full text-xs text-white">
                    ✓
                  </span>
                  Passo a Passo
                </h4>
                <div className="space-y-3">
                  {tip.steps.map((step, index) => (
                    <div
                      key={index}
                      className="hover:bg-muted/50 flex gap-3 rounded-lg border p-4 transition-colors"
                    >
                      <div className="bg-primary flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm">{step}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                  <IconBulb size={20} className="text-yellow-500" />
                  Dicas Extras
                </h4>
                <ul className="space-y-2">
                  {tip.tips.map((tipItem, index) => (
                    <li
                      key={index}
                      className="flex gap-2 text-sm leading-relaxed"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{tipItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              {tip.warnings && tip.warnings.length > 0 && (
                <div className="mb-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 p-4 dark:bg-orange-950/20">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-orange-700 dark:text-orange-400">
                    <IconAlertTriangle size={20} />
                    Atenção
                  </h4>
                  <ul className="space-y-1">
                    {tip.warnings.map((warning, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-sm text-orange-700 dark:text-orange-300"
                      >
                        <span className="mt-1">⚠</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function TipsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "limpeza", "tratamento", "hidratacao", "protecao"];

  const filteredTips =
    selectedCategory === "all"
      ? tipsData
      : tipsData.filter((tip) => tip.category === selectedCategory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 pb-32 sm:px-6">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Guia de Aplicação de Produtos
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Aprenda a aplicar cada tipo de produto corretamente para maximizar os
          resultados da sua rotina de skincare
        </p>
      </div>

      {/* Ordem de Aplicação */}
      <RoutineOrderCard />

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category === "all"
              ? "Todas"
              : categoryInfo[category as keyof typeof categoryInfo]?.title ||
                category}
          </Button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="space-y-4">
        {filteredTips.map((tip) => (
          <TipCard key={tip.id} tip={tip} />
        ))}
      </div>

      {filteredTips.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            Nenhuma dica encontrada para esta categoria.
          </p>
        </div>
      )}
    </div>
  );
}
