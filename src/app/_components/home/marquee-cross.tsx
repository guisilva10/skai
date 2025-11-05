import { X } from "lucide-react"; // Você provavelmente já usa lucide-react com shadcn

const featuresStripeContent = [
  "Questionário Rápido",
  "Análise de Pele",
  "Recomendação Certa",
  "Questionário Rápido",
  "Análise de Pele",
  "Recomendação Certa",
];

const topicsStripeContent = [
  "Pele Saudável",
  "Rotina Perfeita",
  "Guias de Produtos",
  "Pele Saudável",
  "Rotina Perfeita",
  "Guias de Produtos",
];

const StripeContent = ({ items }: { items: string[] }) => (
  <>
    {items.map((text, i) => (
      <span
        key={i}
        className="mx-4 flex items-center text-lg font-semibold sm:text-xl"
      >
        {text}
        <X className="ml-4 h-4 w-4" />
      </span>
    ))}
  </>
);

export const MarqueeCross = () => {
  return (
    <section className="relative flex h-48 w-full max-w-screen items-center justify-center overflow-hidden md:h-64 lg:py-24">
      <div className="bg-primary-foreground absolute flex rotate-[4deg] p-3 text-green-950">
        <div className="flex whitespace-nowrap">
          <StripeContent items={topicsStripeContent} />
          <span aria-hidden="true" className="flex">
            <StripeContent items={topicsStripeContent} />
          </span>
        </div>
      </div>

      <div className="from-primary/80 via-primary to-primary/80 absolute z-10 flex -rotate-[4deg] bg-linear-to-r p-3 text-white">
        <div className="flex whitespace-nowrap">
          <StripeContent items={featuresStripeContent} />
          <span aria-hidden="true" className="flex">
            <StripeContent items={featuresStripeContent} />
          </span>
        </div>
      </div>
    </section>
  );
};
