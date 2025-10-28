"use client";

import type React from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqData = [
  {
    question: "O que é a SKAI e o que ela faz?",
    answer:
      "A SKAI é uma plataforma inteligente de skincare. Nosso objetivo é acabar com a confusão na hora de cuidar da pele. Através de um questionário rápido, nossa IA analisa seu tipo de pele e suas necessidades para recomendar uma rotina de produtos personalizada para você.",
  },
  {
    question: "Como funciona a análise da SKAI?",
    answer:
      "É simples! Você responde nosso questionário, indicando seu tipo de pele, suas principais preocupações (como acne, manchas, ressecamento) e seus objetivos. Nossa tecnologia cruza essas informações com um vasto banco de dados de ingredientes e produtos para montar a rotina ideal.",
  },
  {
    question: "A SKAI vende os produtos de skincare?",
    answer:
      "Não, nós não vendemos nenhum produto diretamente. A SKAI é uma plataforma de recomendação 100% imparcial. Nosso foco é te ajudar a encontrar os produtos certos. Para facilitar, fornecemos links diretos para você comprar os itens recomendados nos e-commerces parceiros.",
  },
  {
    question: "O que eu recebo exatamente após o questionário?",
    answer:
      "Você recebe uma rotina de skincare completa e personalizada. Isso inclui os passos sugeridos para o dia e para a noite (ex: limpeza, tratamento, hidratação, proteção solar), com os nomes dos produtos específicos recomendados para cada etapa.",
  },
  {
    question: "Por que usar a SKAI em vez de pesquisar por conta própria?",
    answer:
      "O grande diferencial da SKAI é a personalização que economiza seu tempo e dinheiro. Em vez de gastar com produtos errados baseados em 'achismos', nossa plataforma usa dados para sugerir apenas o que tem maior probabilidade de funcionar para *você*.",
  },
  {
    question: "Meus dados sobre minha pele estão seguros?",
    answer:
      "Absolutamente. Levamos sua privacidade muito a sério. Todas as suas respostas são tratadas com total confidencialidade e usadas exclusivamente para gerar suas recomendações de rotina. Não compartilhamos seus dados pessoais com terceiros.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle();
  };
  return (
    <div
      className={`outline-border border-l-primary w-full cursor-pointer overflow-hidden rounded-[10px] border bg-[rgba(231,236,235,0.08)] shadow-[0px_2px_4px_rgba(0,0,0,0.16)] outline-1 transition-all duration-500 ease-out`}
      onClick={handleClick}
    >
      <div className="flex w-full items-center justify-between gap-5 px-5 py-[18px] pr-4 text-left transition-all duration-300 ease-out">
        <div className="text-foreground flex-1 text-base leading-6 font-medium wrap-break-word">
          {question}
        </div>
        <div className="flex items-center justify-center">
          <ChevronDown
            className={`text-muted-foreground-dark h-6 w-6 transition-all duration-500 ease-out ${isOpen ? "scale-110 rotate-180" : "scale-100 rotate-0"}`}
          />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{
          transitionProperty: "max-height, opacity, padding",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className={`px-5 transition-all duration-500 ease-out ${isOpen ? "translate-y-0 pt-2 pb-[18px]" : "-translate-y-2 pt-0 pb-0"}`}
        >
          <div className="text-foreground/80 text-sm leading-6 font-normal wrap-break-word">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };
  return (
    <section
      id="faq"
      className="relative z-10 mx-auto flex w-full flex-col items-center justify-center px-5 pt-[66px] pb-20 md:pb-40 lg:max-w-7xl"
    >
      <div className="bg-primary/10 absolute top-[150px] left-1/2 z-0 h-[500px] w-[300px] origin-top-left -translate-x-1/2 rotate-[-33.39deg] blur-[100px]" />
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 self-stretch pt-8 pb-8 md:pt-14 md:pb-14">
        <div className="flex flex-col items-center justify-start gap-4">
          <h2 className="mb-4 text-center text-3xl font-medium tracking-tight text-balance text-black md:text-5xl lg:text-5xl">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground self-stretch text-center text-sm leading-[18.20px] font-medium wrap-break-word">
            Algumas das perguntas mais frequentes feitas pelos nossos clientes.
          </p>
        </div>
      </div>
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-start justify-start gap-4 pt-0.5 pb-10">
        {faqData.map((faq, index) => (
          <FAQItem
            key={index}
            {...faq}
            isOpen={openItems.has(index)}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </section>
  );
}
