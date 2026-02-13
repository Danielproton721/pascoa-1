"use client"

import React from "react"

import { useState, useEffect } from "react"
import { MapPin, ChevronDown, Loader2, CheckCircle2, Store } from "lucide-react"
import { Button } from "@/components/ui/button"

// Lista de estados brasileiros
const ESTADOS_BRASIL = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapa" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceara" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espirito Santo" },
  { sigla: "GO", nome: "Goias" },
  { sigla: "MA", nome: "Maranhao" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Para" },
  { sigla: "PB", nome: "Paraiba" },
  { sigla: "PR", nome: "Parana" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piaui" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondonia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "Sao Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
]

// Funcao para buscar TODAS as cidades de um estado pela API do IBGE
async function fetchCidadesIBGE(uf: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`
    )
    if (!response.ok) throw new Error("Erro ao buscar cidades")
    const data = await response.json()
    return data.map((cidade: { nome: string }) => cidade.nome)
  } catch (error) {
    console.error("Erro ao buscar cidades:", error)
    return []
  }
}

interface LocationPopupProps {
  onClose: () => void
  onLocationSet: (address: string) => void
}

export function LocationPopup({ onClose, onLocationSet }: LocationPopupProps) {
  const [step, setStep] = useState<"state" | "city" | "searching" | "found">("state")
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [cidadesDoEstado, setCidadesDoEstado] = useState<string[]>([])
  const [loadingCidades, setLoadingCidades] = useState(false)

  useEffect(() => {
    if (selectedState) {
      setLoadingCidades(true)
      setCidadesDoEstado([])
      fetchCidadesIBGE(selectedState).then((cidades) => {
        setCidadesDoEstado(cidades)
        setLoadingCidades(false)
      })
    }
  }, [selectedState])

  // Efeito para o timer de 3.5 segundos no passo "searching"
  useEffect(() => {
    if (step === "searching") {
      const timer = setTimeout(() => {
        setStep("found")
      }, 3500) // 3.5 segundos
      return () => clearTimeout(timer)
    }
  }, [step])

  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value)
    setSelectedCity("")
  }

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value)
  }

  const handleNextToCity = () => {
    if (selectedState) {
      setStep("city")
    }
  }

  const handleConfirm = () => {
    if (selectedCity && selectedState) {
      setStep("searching")
    }
  }

  const handleGoShopping = () => {
    const estadoNome = ESTADOS_BRASIL.find(e => e.sigla === selectedState)?.nome || selectedState
    onLocationSet(`${selectedCity}, ${estadoNome}`)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 animate-in fade-in duration-300" />
      
      <div className="relative bg-card rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header - oculto nas telas de loading */}
        {(step === "state" || step === "city") && (
          <div className="bg-primary p-6 text-primary-foreground text-center">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold">Onde voce esta?</h2>
            <p className="text-sm text-primary-foreground/80 mt-1">
              {step === "state" ? "Escolha seu estado" : "Escolha sua cidade"}
            </p>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Selecao de Estado */}
          {step === "state" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Estado</label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={handleStateSelect}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                      transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="">Selecione o estado</option>
                    {ESTADOS_BRASIL.map((estado) => (
                      <option key={estado.sigla} value={estado.sigla}>
                        {estado.nome}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <Button
                onClick={handleNextToCity}
                disabled={!selectedState}
                className="w-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base font-semibold
                  hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proximo
              </Button>
              
              <button
                onClick={onClose}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pular por enquanto
              </button>
            </div>
          )}

          {/* Selecao de Cidade */}
          {step === "city" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-secondary/50 rounded-xl p-3 mb-2">
                <p className="text-sm text-muted-foreground">Estado selecionado:</p>
                <p className="font-medium text-foreground">
                  {ESTADOS_BRASIL.find(e => e.sigla === selectedState)?.nome}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Cidade {loadingCidades && <span className="text-muted-foreground">({cidadesDoEstado.length > 0 ? cidadesDoEstado.length : "carregando..."} cidades)</span>}
                  {!loadingCidades && cidadesDoEstado.length > 0 && <span className="text-muted-foreground">({cidadesDoEstado.length} cidades)</span>}
                </label>
                <div className="relative">
                  {loadingCidades ? (
                    <div className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-muted-foreground flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Carregando cidades...
                    </div>
                  ) : (
                    <select
                      value={selectedCity}
                      onChange={handleCitySelect}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-secondary/50 text-foreground
                        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                        transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="">Selecione a cidade</option>
                      {cidadesDoEstado.map((cidade) => (
                        <option key={cidade} value={cidade}>
                          {cidade}
                        </option>
                      ))}
                    </select>
                  )}
                  {!loadingCidades && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep("state")}
                  variant="outline"
                  className="flex-shrink-0 bg-transparent"
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={!selectedCity}
                  className="flex-1 py-6 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base font-semibold
                    hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar
                </Button>
              </div>
              
              <button
                onClick={onClose}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pular por enquanto
              </button>
            </div>
          )}

          {/* Tela de Procurando Loja */}
          {step === "searching" && (
            <div className="py-8 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Store className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-lg font-semibold text-foreground text-center mb-2">
                Estamos procurando a loja mais proxima de voce
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                {selectedCity}, {ESTADOS_BRASIL.find(e => e.sigla === selectedState)?.nome}
              </p>
              <div className="mt-4 flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Tela de Loja Encontrada */}
          {step === "found" && (
            <div className="py-8 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground text-center mb-2">
                Encontramos uma loja a 2,5 KM de você!
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                {selectedCity}, {ESTADOS_BRASIL.find(e => e.sigla === selectedState)?.nome}
              </p>
              <Button
                onClick={handleGoShopping}
                className="w-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base font-semibold
                  hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Ir as compras
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
