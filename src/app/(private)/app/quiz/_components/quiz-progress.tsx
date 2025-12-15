"use client";

import { motion } from "framer-motion";

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function QuizProgress({ currentStep, totalSteps }: QuizProgressProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="text-muted-foreground flex justify-between text-xs font-medium">
        <span>
          Passo {currentStep + 1} de {totalSteps}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
        <motion.div
          className="bg-primary h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
