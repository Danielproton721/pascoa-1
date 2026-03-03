"use client"

import { Star, Clock, Truck, CreditCard, MapPin, ChevronDown } from "lucide-react"
import Image from "next/image"

interface StoreHeaderProps {
  userAddress?: string | null
  onChangeAddress?: () => void
}

export function StoreHeader({ userAddress, onChangeAddress }: StoreHeaderProps) {
  

  // Extrai cidade do endereco
  const getCityFromAddress = (address: string) => {
    const parts = address.split(",")
    if (parts.length >= 2) {
      // Tenta pegar a penultima ou ultima parte que geralmente é a cidade
      const city = parts[parts.length - 2]?.trim() || parts[parts.length - 1]?.trim()
      return city
    }
    return address
  }

  return (
    <header
      className="border-b border-[#532702]/30 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url(/imgs/fundo.webp)" }}
    >
      <div className="max-w-lg mx-auto px-4 py-4">
        {/* Top bar: Receber em */}
        <button
          type="button"
          onClick={onChangeAddress}
          className="flex items-center gap-1.5 mb-3 min-w-0 cursor-pointer group animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <MapPin className="w-4 h-4 text-amber-100 flex-shrink-0 group-hover:text-white transition-colors" />
          <div className="flex flex-col items-start min-w-0">
            <span className="text-[11px] text-amber-100/80 leading-tight">{"Receber em"}</span>
            <span className="text-sm font-semibold text-white leading-tight truncate max-w-[200px] group-hover:text-amber-100 transition-colors">
              {userAddress ? getCityFromAddress(userAddress) : "Selecione sua cidade"}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-amber-100/80 flex-shrink-0 group-hover:text-white transition-colors" />
        </button>

        {/* Logo centralizada e maior */}
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-[180px] h-[80px] flex items-center justify-center overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer">
            <Image
              src="/imgs/logo_branca.png"
              alt="Doce Sabor Chocolates"
              width={180}
              height={80}
              className="object-contain"
            />
          </div>
          
          {/* Badge loja aberta */}
          <div className="mt-2 inline-flex items-center gap-1.5 bg-white/15 border border-white/30 rounded-full px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-200" />
            </span>
            <span className="text-xs font-semibold text-white">
              Loja aberta agora a 2,5 KM de você!
            </span>
          </div>

          {/* Pedido minimo e prazo */}
          <p className="mt-1.5 text-xs text-amber-100/90">
            <span className="font-bold text-white">{""}</span>
            {" "}
            {userAddress ? (
              <>
                Receba em até{" "}
                <span className="font-bold text-white">1 hora</span>
                {" "}em {getCityFromAddress(userAddress)}
              </>
            ) : (
              <>
                Receba em até{" "}
                <span className="font-bold text-white">1 hora</span>
              </>
            )}
          </p>

          {/* Info abaixo da logo: avaliacao, tempo e frete */}
          <div className="flex items-center justify-center gap-3 mt-2 text-sm text-amber-100/90 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-200 text-amber-200" />
              <span className="font-medium text-white">4.8</span>
              <span className="text-xs text-amber-100/90">(230+ avaliações)</span>
            </div>
            <div className="flex items-center gap-1">
              
              
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-amber-200" />
              <span className="text-amber-200 font-medium">Frete Grátis</span>
            </div>
          </div>
          
          <p className="text-xs text-amber-100/90 mt-2 font-semibold text-center">{"Sua Páscoa mais gostosa!"}</p>
        </div>

        {/* Banner de localizacao */}
        {userAddress && (
          <button
            type="button"
            onClick={onChangeAddress}
            className="w-full mt-4 mx-4 bg-white border-2 border-[#1a0d00] rounded-3xl py-4 px-4
              hover:bg-amber-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer
              shadow-lg shadow-[#532702]/20 hover:shadow-xl hover:shadow-[#532702]/30"
          >
            <span className="text-[#532702] font-bold text-base tracking-wide">
              Entrega grátis
            </span>
          </button>
        )}



        {/* Info discreta */}
        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-amber-100/80
          animate-in fade-in duration-500 delay-300 fill-mode-both">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{"30-80 min"}</span>
          </div>
          <span className="text-amber-100/50">|</span>
          <div className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            <span className="leading-3 tracking-tighter">Aceitamos Pix</span>
          </div>
        </div>
      </div>
    </header>
  )
}
