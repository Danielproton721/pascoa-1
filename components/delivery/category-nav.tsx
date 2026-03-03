"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/data"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

const SCROLL_AMOUNT = 120

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return
    const delta = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT
    scrollRef.current.scrollBy({ left: delta, behavior: "smooth" })
  }

  return (
    <nav className="py-4">
      <div className="max-w-lg mx-auto px-4">
        <div className="relative flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Categorias anteriores"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary/80 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            ref={scrollRef}
            className="flex-1 overflow-x-auto scrollbar-hide gap-3 pb-1 flex scroll-smooth"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  "hover:scale-105 active:scale-95",
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Próximas categorias"
            className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary/80 hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}
