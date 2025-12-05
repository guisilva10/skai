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
