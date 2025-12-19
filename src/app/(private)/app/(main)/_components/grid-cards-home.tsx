import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  IconBolt,
  IconBulb,
  IconLighter,
  IconRobot,
  IconShoppingBag,
} from "@tabler/icons-react";
import Link from "next/link";

const cards = [
  {
    title: "Análise Personalizada",
    description:
      "Responda o questionário e descubra os produtos ideais para você",
    icon: <IconBolt />,
    href: "/app/quiz",
    gradient: "",
  },
  {
    title: "Dicas de skincare",
    description:
      "Visite nosso mural de dicas sobre skincare ideais para cada pele",
    icon: <IconBulb />,
    href: "/app/tips",
    gradient: "",
  },
  {
    title: "Análise inteligente com IA",
    description:
      "Descubra a sua rotina ideal de skincare e receba dicas com IA",
    icon: <IconRobot />,
    href: "/app/chat",
    gradient: "",
  },
  {
    title: "Favoritos",
    description:
      "Dê uma olhada em seus favoritos e encontre os melhores produtos de skincare",
    icon: <IconShoppingBag />,
    href: "/app/catalog",
    gradient: "",
  },
];

const GridCardsHome = () => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Link
          key={index}
          href={card.href}
          className="group block transition-transform active:scale-[0.98] sm:hover:scale-[1.02]"
        >
          <Card
            className={`relative h-full min-h-40 overflow-hidden border-2 bg-linear-to-br transition-all duration-300 sm:min-h-[200px] ${card.gradient} group-hover:border-primary/50 group-hover:shadow-lg`}
          >
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base leading-tight sm:text-lg">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex h-[calc(100%-80px)] flex-col justify-between sm:h-[calc(100%-88px)]">
              <p className="text-muted-foreground mb-3 text-xs leading-relaxed sm:mb-4 sm:text-sm">
                {card.description}
              </p>
              <div className="flex justify-end opacity-60 transition-opacity group-hover:opacity-100">
                <div className="bg-primary flex size-10 items-center justify-center rounded-lg p-1 text-white">
                  {card.icon}
                </div>
              </div>
            </CardContent>

            {/* Efeito de brilho sutil no hover */}
            <div className="via-primary/5 pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default GridCardsHome;
