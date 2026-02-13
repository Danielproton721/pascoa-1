"use client"

import { cn } from "@/lib/utils"
import { categories } from "@/lib/data"

interface CategoryNavProps {
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

const dotColors = [
  "bg-yellow-500",
  "bg-orange-500", 
  "bg-red-500",
  "bg-pink-500",
  "bg-purple-500",
]

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <nav className="bg-secondary/50 py-3">
      <div className="max-w-lg mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide gap-2">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 rounded-full flex items-center gap-2",
                "hover:scale-105 active:scale-95",
                activeCategory === category.id
                  ? "bg-card text-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className={cn(
                "w-2 h-2 rounded-full",
                dotColors[index % dotColors.length]
              )} />
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
