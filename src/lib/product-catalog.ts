"use server";

import amobelezaData from "@/app/_data/amobeleza.json";
import labkoData from "@/app/_data/labko.json";

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price: number | null;
  currency: string;
  image_url: string;
  product_url: string;
  description: string | null;
  source: "amobeleza" | "labko";
  category: "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar";
};

export type ProductCatalog = {
  limpeza: Product[];
  hidratacao: Product[];
  tratamento: Product[];
  protecaoSolar: Product[];
};

// Palavras-chave para categorização
const CATEGORY_KEYWORDS = {
  limpeza: [
    "gel de limpeza",
    "limpeza",
    "cleanser",
    "sabonete",
    "água micelar",
    "micelar",
    "demaquilante",
    "esfoliante",
    "tônico",
    "tonico",
    "peeling",
    "deep clean",
    "purificante",
  ],
  protecaoSolar: [
    "protetor solar",
    "protetor",
    "sunscreen",
    "fps",
    "fps 30",
    "fps 50",
    "fps 60",
    "fps 70",
    "sun fresh",
    "sun",
    "solar",
    "uv",
  ],
  tratamento: [
    "anti-acne",
    "antiacne",
    "acne",
    "clareador",
    "clareamento",
    "anti-pigment",
    "antipigment",
    "retinol",
    "vitamina c",
    "ácido",
    "acido",
    "sérum",
    "serum",
    "niacinamida",
    "aha",
    "bha",
    "glycolic",
    "salicylic",
    "brightening",
    "anti-aging",
    "antiaging",
    "anti-idade",
    "rugas",
    "manchas",
    "olheiras",
    "reparador",
    "cicatrizante",
  ],
  hidratacao: [
    "hidratante",
    "hidratação",
    "moisturizer",
    "creme",
    "loção",
    "locao",
    "gel creme",
    "gel-creme",
    "emulsão",
    "emulsao",
    "óleo",
    "oleo",
    "balm",
    "manteiga",
    "nutritivo",
    "hyaluron",
    "ácido hialurônico",
    "acido hialuronico",
  ],
};

function categorizeProduct(
  name: string,
  description: string | null,
): "Limpeza" | "Hidratação" | "Tratamento" | "Proteção Solar" {
  const searchText = `${name} ${description || ""}`.toLowerCase();

  // Verificar proteção solar primeiro (tem prioridade)
  for (const keyword of CATEGORY_KEYWORDS.protecaoSolar) {
    if (searchText.includes(keyword.toLowerCase())) {
      return "Proteção Solar";
    }
  }

  // Verificar limpeza
  for (const keyword of CATEGORY_KEYWORDS.limpeza) {
    if (searchText.includes(keyword.toLowerCase())) {
      return "Limpeza";
    }
  }

  // Verificar tratamento
  for (const keyword of CATEGORY_KEYWORDS.tratamento) {
    if (searchText.includes(keyword.toLowerCase())) {
      return "Tratamento";
    }
  }

  // Default para hidratação
  return "Hidratação";
}

export async function loadAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];

  // Carregar produtos do Amobeleza (estrutura: { products: [...] })
  const amobelezaProducts = (amobelezaData as any).products || [];
  for (const p of amobelezaProducts) {
    allProducts.push({
      id: p.id,
      name: p.name,
      brand: p.brand || "Sem marca",
      price: p.price,
      original_price: p.original_price,
      currency: p.currency || "BRL",
      image_url: p.image_url,
      product_url: p.product_url,
      description: p.description,
      source: "amobeleza",
      category: categorizeProduct(p.name, p.description),
    });
  }

  // Carregar produtos do Labko (estrutura: [...])
  const labkoProducts = Array.isArray(labkoData) ? labkoData : [];
  for (const p of labkoProducts) {
    allProducts.push({
      id: p.id,
      name: p.name,
      brand: p.brand || "Sem marca",
      price: p.price,
      original_price: p.original_price,
      currency: p.currency || "BRL",
      image_url: p.image_url,
      product_url: p.product_url,
      description: p.description,
      source: "labko",
      category: categorizeProduct(p.name, p.description),
    });
  }

  return allProducts;
}

export async function getProductsByCategory(): Promise<ProductCatalog> {
  const products = await loadAllProducts();

  const catalog: ProductCatalog = {
    limpeza: [],
    hidratacao: [],
    tratamento: [],
    protecaoSolar: [],
  };

  for (const product of products) {
    switch (product.category) {
      case "Limpeza":
        catalog.limpeza.push(product);
        break;
      case "Hidratação":
        catalog.hidratacao.push(product);
        break;
      case "Tratamento":
        catalog.tratamento.push(product);
        break;
      case "Proteção Solar":
        catalog.protecaoSolar.push(product);
        break;
    }
  }

  return catalog;
}

// Normaliza o nome do produto removendo tamanhos e volumes
function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(
      /\d+\s*(ml|g|mg|kg|l|litro|litros|gramas?|miligramas?|quilogramas?)/gi,
      "",
    ) // Remove tamanhos
    .replace(/\d+\s*unidades?/gi, "") // Remove "X unidades"
    .replace(/kit\s+/gi, "") // Remove "kit"
    .replace(/refil/gi, "") // Remove "refil"
    .replace(/\s+/g, " ") // Normaliza espaços
    .trim();
}

// Remove produtos duplicados baseando-se no nome normalizado
function removeDuplicateProducts(products: Product[]): Product[] {
  const seen = new Map<string, Product>();

  for (const product of products) {
    const normalizedName = normalizeProductName(product.name);
    const key = `${product.brand}-${normalizedName}`;

    // Se ainda não vimos este produto, ou se o atual é mais barato, mantemos ele
    if (!seen.has(key) || seen.get(key)!.price > product.price) {
      seen.set(key, product);
    }
  }

  return Array.from(seen.values());
}

// Retorna catálogo resumido para enviar ao OpenAI (sem descrições longas)
export async function getProductsForAI(limitPerCategory: number = 30): Promise<{
  limpeza: {
    id: string;
    name: string;
    brand: string;
    price: number;
    source: string;
  }[];
  hidratacao: {
    id: string;
    name: string;
    brand: string;
    price: number;
    source: string;
  }[];
  tratamento: {
    id: string;
    name: string;
    brand: string;
    price: number;
    source: string;
  }[];
  protecaoSolar: {
    id: string;
    name: string;
    brand: string;
    price: number;
    source: string;
  }[];
}> {
  const catalog = await getProductsByCategory();

  const summarize = (products: Product[], limit: number) => {
    // Remove duplicatas antes de limitar
    const uniqueProducts = removeDuplicateProducts(products);

    return uniqueProducts.slice(0, limit).map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      price: p.price,
      source: p.source,
    }));
  };

  return {
    limpeza: summarize(catalog.limpeza, limitPerCategory),
    hidratacao: summarize(catalog.hidratacao, limitPerCategory),
    tratamento: summarize(catalog.tratamento, limitPerCategory),
    protecaoSolar: summarize(catalog.protecaoSolar, limitPerCategory),
  };
}

// Busca um produto pelo ID
export async function getProductById(
  productId: string,
): Promise<Product | null> {
  const products = await loadAllProducts();
  return products.find((p) => p.id === productId) || null;
}

// Busca múltiplos produtos pelos IDs
export async function getProductsByIds(
  productIds: string[],
): Promise<Product[]> {
  const products = await loadAllProducts();
  return products.filter((p) => productIds.includes(p.id));
}
