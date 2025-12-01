"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/_components/ui/card";
import { QuizSection, SkinProfileFormData } from "@/types";
import { QuizQuestion } from "./quiz-question";

interface QuizSectionCardProps {
  section: QuizSection;
  data: SkinProfileFormData;
  onChange: (field: keyof SkinProfileFormData, value: any) => void;
}

export function QuizSectionCard({
  section,
  data,
  onChange,
}: QuizSectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 pb-8">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {section.title}
          </CardTitle>
          <CardDescription className="text-base">
            {section.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {section.questions.map((question) => {
            // Check condition if exists
            if (question.condition && !question.condition(data)) {
              return null;
            }

            return (
              <QuizQuestion
                key={question.id}
                question={question}
                value={data[question.id]}
                onChange={(val) => onChange(question.id, val)}
              />
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
