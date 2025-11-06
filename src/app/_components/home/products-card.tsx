"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { LucideIcon } from "lucide-react";

// Interface para as propriedades do nosso novo card
interface RoutineStepProps {
  step: {
    id: string;
    stepNumber: string;
    title: string;
    description: string;
    IconComponent: LucideIcon; // Vamos usar ícones para ilustrar
  };
}

export function RoutineStepCard({ step }: RoutineStepProps) {
  return (
    <Card className="flex h-full w-full max-w-xs flex-col text-center shadow-lg transition-transform duration-300 hover:scale-105 dark:bg-gray-800">
      <CardHeader className="flex flex-col items-center">
        {/* Ícone */}
        <div className="bg-primary/10 text-primary mb-4 rounded-full p-4">
          <step.IconComponent className="h-10 w-10" strokeWidth={1.5} />
        </div>

        {/* Título e Passo */}
        <span className="text-primary text-sm font-semibold">
          {step.stepNumber}
        </span>
        <CardTitle className="mt-2 text-2xl font-bold">{step.title}</CardTitle>
      </CardHeader>
      <CardContent className="grow">
        <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
      </CardContent>
    </Card>
  );
}
