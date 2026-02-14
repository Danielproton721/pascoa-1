"use client"

import { useEffect, useRef } from "react"

interface TrackPurchaseProps {
  transactionId: string
  amount: number
  items: Array<{ name: string; quantity: number; price: number }>
}

// Declaracao de tipos para o pixel do Facebook e Google Ads
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    gtag?: (...args: unknown[]) => void
  }
}

export function TrackPurchase({ transactionId, amount, items }: TrackPurchaseProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!transactionId) return

    // Verifica se ja disparou para essa transacao (protege contra StrictMode e re-renders)
    const storageKey = `tracked_${transactionId}`
    if (hasTracked.current || localStorage.getItem(storageKey)) return
    hasTracked.current = true
    localStorage.setItem(storageKey, "true")

    // ============================================
    // FACEBOOK PIXEL - Evento de Purchase
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
    }

    // ============================================
    // GOOGLE ADS - Evento de Conversao
    // ID: AW-17934359668
    // Rotulo: b5kPCJ_O3_gbEPS44udC
    // ============================================
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-17934359668/b5kPCJ_O3_gbEPS44udC",
        value: amount,
        currency: "BRL",
        transaction_id: transactionId,
      })
      console.log("[v0] Google Ads Conversion disparado:", { amount, transactionId })
    }
  }, [transactionId, amount, items])

  // Este componente nao renderiza nada visualmente
  return null
}
