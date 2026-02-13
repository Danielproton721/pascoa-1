"use client"

import Image from "next/image"
import { categories } from "@/lib/data"

interface CategoryShowcaseProps {
  onCategorySelect: (categoryId: string) => void
}

// Mapeamento de categoria para imagem de produto representativo (especificas)
const categoryImages: Record<string, { image: string; scale: string }> = {
  cervejas: { 
    image: "https://cdn.shopify.com/s/files/1/0800/7050/8802/files/imgi_1_image_3.jpg?v=1769488266", // Brahma Duplo Malte
    scale: "scale-125" 
  },
  queridinhos: { 
    image: "https://cdn.shopify.com/s/files/1/0709/6211/8725/files/whisky-johnnie-walker-red-label-1-l-1.jpg?v=1769119712", // Johnnie Walker
    scale: "scale-125" 
  },
  combinados: { 
    image: "https://cdn.shopify.com/s/files/1/0800/7050/8802/files/352bc8bb94367ea49ebf312bf24bf842.jpg?v=1769488562", // Red Bull
    scale: "scale-100" 
  },
  temaki: { 
    image: "https://cdn.shopify.com/s/files/1/0794/8750/0511/files/00008884_91a99c52-6aad-4f1e-a91f-f8b943bbbd46.webp?v=1769744532", // Guarana
    scale: "scale-125" 
  },
  poke: { 
    image: "https://cdn.shopify.com/s/files/1/0794/8750/0511/files/limao.webp?v=1769742103", // Gelo Limao
    scale: "scale-125" 
  },
}

export function CategoryShowcase({ onCategorySelect }: CategoryShowcaseProps) {
  // Filtra apenas as categorias que queremos mostrar (exclui ofertas)
  const showcaseCategories = categories.filter(cat => cat.id !== "ofertas")

  return (
    <section className="mb-8 py-6 bg-background -mx-4 px-4">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-lg font-bold text-foreground">Voce Encontra Aqui</h2>
        <div className="flex-1 h-1 rounded-full max-w-[80px] bg-primary" />
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {showcaseCategories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className="flex flex-col items-center gap-2 min-w-[90px] group animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
          >
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border shadow-md 
              group-hover:border-primary group-hover:scale-110 transition-all duration-300 bg-card">
              {categoryImages[category.id] ? (
                <Image
                  src={categoryImages[category.id].image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className={`object-cover group-hover:scale-110 transition-transform duration-300 leading-6 ${categoryImages[category.id].scale}`}
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <span className="text-2xl">🍺</span>
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-foreground whitespace-nowrap">
              {category.name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
