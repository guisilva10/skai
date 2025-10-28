// components/ProductCard.tsx
"use client";

import { cn } from "@/app/_lib/utils"; // Assumindo que você ainda usa o cn
import Image from "next/image"; // Usaremos o componente Image do Next.js para otimização

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    brand: string;
    price: string; // Ou number, dependendo de como você gerencia preços
    link: string; // Link para compra do produto
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group/card w-full max-w-xs">
      <div
        className={cn(
          "card relative mx-auto flex h-96 max-w-sm cursor-pointer flex-col justify-between overflow-hidden rounded-md p-4 shadow-xl",
          "bg-cover bg-center object-contain", // Ajustado para centralizar a imagem
        )}
        style={{ backgroundImage: `url(${product.imageUrl})` }} // Define a imagem de fundo aqui
      >
        {/* Overlay escuro ao passar o mouse */}
        <div className="absolute top-0 left-0 h-full w-full opacity-60 transition duration-300 group-hover/card:bg-black"></div>

        {/* Brand do produto no topo */}
        <div className="z-10 flex flex-row items-center space-x-2">
          {/* Você pode colocar um logo da marca aqui, ou apenas o nome */}
          <p className="relative z-10 text-base font-semibold text-gray-50">
            {product.brand}
          </p>
        </div>

        {/* Conteúdo do produto */}
        <div className="text content">
          <h1 className="relative z-10 text-xl font-bold text-gray-50 md:text-2xl">
            {product.name}
          </h1>
          <p className="relative z-10 my-4 line-clamp-3 text-sm font-normal text-gray-50">
            {/* line-clamp-3 limita a descrição a 3 linhas */}
            {product.description}
          </p>
          <div className="z-10 mt-2 flex items-center justify-between">
            <p className="relative z-10 text-lg font-bold text-white">
              {product.price}
            </p>
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-primary-foreground relative z-10 rounded-full px-4 py-2 text-sm transition-colors"
            >
              Ver Produto
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
