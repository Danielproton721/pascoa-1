"use client"

import { useState, useEffect } from "react"
import { LocationPopup } from "./location-popup"

export function LocationGuard({ children }: { children: React.ReactNode }) {
  const [hasAddress, setHasAddress] = useState<boolean | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("delivery_address")
    setHasAddress(!!saved)
  }, [])

  const handleLocationSet = (address: string) => {
    localStorage.setItem("delivery_address", address)
    setHasAddress(true)
  }

  // Aguarda verificar localStorage (evita flash)
  if (hasAddress === null) {
    return <div className="min-h-screen bg-background" />
  }

  // Sem endereco: mostra popup obrigatorio (bloqueia ate selecionar)
  if (!hasAddress) {
    return (
      <div className="min-h-screen bg-background">
        <LocationPopup onClose={() => {}} onLocationSet={handleLocationSet} />
      </div>
    )
  }

  return <>{children}</>
}
