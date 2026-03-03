"use client"

import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { categories } from "@/lib/data"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll para o botao da categoria ativa
  useEffect(() => {
    if (!scrollRef.current) return
    const activeBtn = scrollRef.current.querySelector<HTMLElement>(`[data-category-id="${activeCategory}"]`)
    if (activeBtn) {
      const container = scrollRef.current
      const scrollLeft = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: "smooth" })
    }
  }, [activeCategory])

  return (
    <nav className="py-4">
      <div className="max-w-lg mx-auto px-4">
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide gap-3 pb-1 flex scroll-smooth"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              data-category-id={category.id}
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
      </div>
    </nav>
  )
}
