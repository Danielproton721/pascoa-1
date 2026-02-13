"use client"

import { useEffect, useRef } from "react"

interface TrackPurchaseProps {
  transactionId: string
  amount: number
  items: Array<{ name: string; quantity: number; price: number }>
}

// Declaracao de tipos para o pixel do Facebook
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export function TrackPurchase({ transactionId, amount, items }: TrackPurchaseProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    // Evita disparar o evento mais de uma vez
    if (hasTracked.current) return
    hasTracked.current = true

    const trackEvents = () => {
      // ============================================
      // FACEBOOK PIXEL - Evento de Purchase
      // O pixel ja esta carregado no layout.tsx
      // ============================================
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Purchase", {
          value: amount,
          currency: "BRL",
          content_ids: items.map((_, index) => `product_${index}`),
          content_type: "product",
          contents: items.map((item, index) => ({
            id: `product_${index}`,
            quantity: item.quantity,
            item_price: item.price,
          })),
          num_items: items.reduce((acc, item) => acc + item.quantity, 0),
        })
        console.log("[v0] Facebook Pixel Purchase disparado:", { amount, items })
      } else {
        console.log("[v0] Facebook Pixel nao encontrado - fbq:", typeof window !== "undefined" ? window.fbq : "undefined")
      }
    }

    // Dispara imediatamente e tambem com delay para garantir
    trackEvents()
    const timer = setTimeout(trackEvents, 1000)
    return () => clearTimeout(timer)
  }, [transactionId, amount, items])

  // Este componente nao renderiza nada visualmente
  return null
}
