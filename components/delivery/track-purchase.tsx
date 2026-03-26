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
    dataLayer?: Record<string, unknown>[]
  }
}

/**
 * TrackPurchase - Componente para rastrear COMPRAS CONFIRMADAS (PIX Pago)
 * 
 * Este componente dispara eventos de conversao APENAS quando o pagamento
 * foi efetivamente confirmado. NAO usar para PIX pendente.
 * 
 * - Google Ads: conversion (Purchase)
 * - Facebook: Purchase
 * - DataLayer: purchase
 */
export function TrackPurchase({ transactionId, amount, items }: TrackPurchaseProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!transactionId) return

    // Verifica se ja disparou para essa transacao (protege contra StrictMode e re-renders)
    const storageKey = `purchase_tracked_${transactionId}`
    if (hasTracked.current || localStorage.getItem(storageKey)) return
    hasTracked.current = true
    localStorage.setItem(storageKey, "true")

    // ============================================
    // DATALAYER - Evento de Purchase (Compra Confirmada)
    // ============================================
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: "purchase",
        transaction_id: transactionId,
        value: amount,
        currency: "BRL",
      })
    }

    // ============================================
    // GOOGLE ADS - Evento de Conversao (COMPRA REAL)
    // ID: AW-18020237329
    // Rotulo: ldPtCPrYhowcEJGA3JBD
    // ============================================
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-18020237329/ldPtCPrYhowcEJGA3JBD",
        value: amount,
        currency: "BRL",
        transaction_id: transactionId,
      })
    }

    // ============================================
    // FACEBOOK PIXEL - Evento de Purchase (COMPRA REAL)
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
    }
  }, [transactionId, amount, items])

  // Este componente nao renderiza nada visualmente
  return null
}
