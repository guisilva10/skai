"use server";

import prisma from "@/services/database/prisma";

const defaultFeedbacks = [
  {
    id: "mock-1",
    message:
      "A SKAI mudou minha rotina! Finalmente encontrei produtos que realmente funcionam para minha pele sensível. O questionário foi super rápido e as recomendações, perfeitas.",
    name: "Juliana R.",
    role: "Pele Sensível",
    imageUrl: "/mulher01.jpg",
    approved: true,
  },
  {
    id: "mock-2",
    message:
      "Rápido, fácil e certeiro. Minha pele está visivelmente melhor. Recomendo 100%.",
    name: "Marcela B.",
    role: "Pele Seca",
    imageUrl: "/mulher02.jpg",
    approved: true,
  },
  {
    id: "mock-3",
    message:
      "Estava completamente perdida sem saber o que comprar. O questionário foi um divisor de águas. Minha acne melhorou 90% em 3 meses seguindo a rotina sugerida pela SKAI. Incrível!",
    name: "Carla S.",
    role: "Pele Acneica",
    imageUrl: "/mulher03.jpg",
    approved: true,
  },
];

export async function getFeedbacks() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    });

    if (feedbacks.length < 3) {
      const needed = 3 - feedbacks.length;
      const mocks = defaultFeedbacks.slice(0, needed);
      return [...feedbacks, ...mocks];
    }

    // Logic to rotate 3 feedbacks every 3 days
    const epoch = new Date("2024-01-01").getTime();
    const now = Date.now();
    const threeDaysInMs = 1000 * 60 * 60 * 24 * 3;
    const periodIndex = Math.floor((now - epoch) / threeDaysInMs);

    // Calculate start index based on the period
    const startIndex = (periodIndex * 3) % feedbacks.length;

    const selected = [];
    for (let i = 0; i < 3; i++) {
      selected.push(feedbacks[(startIndex + i) % feedbacks.length]);
    }

    return selected;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return defaultFeedbacks;
  }
}
