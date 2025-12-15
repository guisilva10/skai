"use client";

import { Label } from "@/app/_components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { QuizQuestion as QuizQuestionType } from "@/types";
import { cn } from "@/app/_lib/utils";

interface QuizQuestionProps {
  question: QuizQuestionType;
  value: any;
  onChange: (value: any) => void;
}

export function QuizQuestion({ question, value, onChange }: QuizQuestionProps) {
  if (question.type === "boolean") {
    return (
      <div className="space-y-3">
        <Label className="text-base font-medium">{question.label}</Label>
        {question.helpText && (
          <p className="text-muted-foreground text-sm">{question.helpText}</p>
        )}
        <RadioGroup
          value={value === true ? "yes" : value === false ? "no" : undefined}
          onValueChange={(val) => onChange(val === "yes")}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id={`${question.id}-yes`} />
            <Label htmlFor={`${question.id}-yes`}>Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id={`${question.id}-no`} />
            <Label htmlFor={`${question.id}-no`}>Não</Label>
          </div>
        </RadioGroup>
      </div>
    );
  }

  if (question.type === "select") {
    return (
      <div className="space-y-3">
        <Label className="text-base font-medium">{question.label}</Label>
        {question.helpText && (
          <p className="text-muted-foreground text-sm">{question.helpText}</p>
        )}
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma opção" />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (question.type === "multiselect") {
    const selectedValues = (value as string[]) || [];

    const toggleValue = (val: string) => {
      if (selectedValues.includes(val)) {
        onChange(selectedValues.filter((v) => v !== val));
      } else {
        onChange([...selectedValues, val]);
      }
    };

    return (
      <div className="space-y-3">
        <Label className="text-base font-medium">{question.label}</Label>
        {question.helpText && (
          <p className="text-muted-foreground text-sm">{question.helpText}</p>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {question.options?.map((option) => (
            <div
              key={option.value}
              className={cn(
                "hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-colors",
                selectedValues.includes(option.value) &&
                  "border-primary bg-accent",
              )}
              onClick={() => toggleValue(option.value)}
            >
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onCheckedChange={() => toggleValue(option.value)}
                id={`${question.id}-${option.value}`}
              />
              <Label
                htmlFor={`${question.id}-${option.value}`}
                className="cursor-pointer font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === "text") {
    return (
      <div className="space-y-3">
        <Label className="text-base font-medium" htmlFor={question.id}>
          {question.label}
        </Label>
        {question.helpText && (
          <p className="text-muted-foreground text-sm">{question.helpText}</p>
        )}
        <Input
          id={question.id}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Digite sua resposta..."
        />
      </div>
    );
  }

  if (question.type === "number") {
    return (
      <div className="space-y-3">
        <Label className="text-base font-medium" htmlFor={question.id}>
          {question.label}
        </Label>
        {question.helpText && (
          <p className="text-muted-foreground text-sm">{question.helpText}</p>
        )}
        <Input
          id={question.id}
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          min={0}
          max={20}
        />
      </div>
    );
  }

  return null;
}
