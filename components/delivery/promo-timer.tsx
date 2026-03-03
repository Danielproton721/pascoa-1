"use client"

import { useState, useEffect } from "react"

export function PromoTimer() {
  const [timeLeft, setTimeLeft] = useState({ minutes: 30, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 }
        }
        return { minutes: 30, seconds: 0 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div 
      className="promo-pulse rounded-full px-4 py-2 flex items-center justify-between w-full text-white"
      style={{ backgroundColor: "#532702" }}
    >
      <span className="text-[11px] font-semibold whitespace-nowrap">Promoção acaba em</span>
      <div className="flex items-center gap-1 font-mono font-bold shrink-0">
        <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-xs">00</span>
        <span className="text-xs">:</span>
        <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-xs">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-xs">:</span>
        <span className={`bg-white/20 text-white px-1.5 py-0.5 rounded text-xs transition-all duration-150 ${timeLeft.seconds <= 10 ? "scale-110" : ""}`}>
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
