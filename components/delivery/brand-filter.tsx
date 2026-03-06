"use client"

import { useState, useRef, useEffect } from "react"
import { Tag, Check } from "lucide-react"

interface BrandFilterProps {
  brands: string[]
  selectedBrands: string[]
  onChange: (brands: string[]) => void
}

export function BrandFilter({ brands, selectedBrands, onChange }: BrandFilterProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onChange(selectedBrands.filter((b) => b !== brand))
    } else {
      onChange([...selectedBrands, brand])
    }
  }

  const clearAll = () => {
    onChange([])
    setOpen(false)
  }

  const hasSelection = selectedBrands.length > 0

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
          hasSelection
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
        }`}
        aria-label="Filtrar por marca"
      >
        <Tag className="w-4 h-4" />
        {hasSelection && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
            {selectedBrands.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Filtrar por marca</span>
            {hasSelection && (
              <button
                onClick={clearAll}
                className="text-xs text-primary hover:underline"
              >
                Limpar
              </button>
            )}
          </div>
          <div className="max-h-[250px] overflow-y-auto">
            {brands.map((brand) => {
              const isSelected = selectedBrands.includes(brand)
              return (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 text-sm transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  {brand}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
