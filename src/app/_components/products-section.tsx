// components/FeaturedProducts.tsx
"use client";

import { ProductCard } from "./products-card";

// Dados de exemplo para seus produtos
// Substitua estas informações pelos seus produtos reais
const featuredProductsData = [
  {
    id: "prod1",
    name: "Sérum Hidratante com Ácido Hialurônico",
    description:
      "Hidrata profundamente a pele, reduzindo linhas finas e melhorando a elasticidade. Ideal para todos os tipos de pele.",
    imageUrl: "/products/product-01.jpg",
    brand: "BeautyLab",
    price: "R$ 89,90",
    link: "https://www.exemplo.com/serum-hidratante",
  },
  {
    id: "prod2",
    name: "Gel de Limpeza Facial Suave",
    description:
      "Limpa sem ressecar, removendo impurezas e maquiagem. Perfeito para peles sensíveis e uso diário.",
    imageUrl: "/products/product-02.jpg", // Placeholder funcional
    brand: "Purity Skincare",
    price: "R$ 45,50",
    link: "https://www.exemplo.com/gel-limpeza-suave",
  },
  {
    id: "prod3",
    name: "Protetor Solar Facial FPS 50",
    description:
      "Proteção UVA/UVB de amplo espectro com toque seco. Essencial para prevenir envelhecimento precoce e manchas.",
    imageUrl: "/products/product-03.jpg", // Placeholder funcional
    brand: "SunGuard",
    price: "R$ 72,00",
    link: "https://www.exemplo.com/protetor-solar",
  },
  {
    id: "prod4",
    name: "Creme Anti-idade com Retinol",
    description:
      "Estimula a renovação celular, combatendo rugas e linhas de expressão para uma pele mais firme.",
    imageUrl: "/products/product-04.jpg", // Placeholder funcional
    brand: "Eternal Youth",
    price: "R$ 120,00",
    link: "https://www.exemplo.com/creme-retinol",
  },
];

export function FeaturedProducts() {
  return (
    <section className="mx-auto w-full px-8 py-12 lg:max-w-7xl">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-medium tracking-tight text-black md:text-4xl lg:text-5xl dark:text-white">
          Produtos que Fazem a Diferença
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-center text-lg text-gray-600 dark:text-gray-300">
          Descubra os produtos recomendados que vão transformar sua rotina de
          skincare e trazer resultados incríveis para sua pele.
        </p>

        <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredProductsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
