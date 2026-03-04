"use client"

import Image from "next/image"
import { MapPin } from "lucide-react" // Importa o ícone de localização

export function AboutUs() {
  return (
    <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-lg font-bold text-foreground mb-4">Sobre Nós</h2>
      
      <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
        <div className="relative w-full h-48">
          <Image
            src="https://cdn.shopify.com/s/files/1/0965/3846/0530/files/imgi_1_fachada_doce_sabor.png?v=1772575019"
            alt="Doce Sabor - Revendedora de chocolates"
            fill
            className="object-cover object-top"
          />
        </div>
        
        <div className="p-4 space-y-3">
          <h3 className="font-bold text-foreground text-lg">Doce Sabor</h3>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Doce Sabor é revendedora autorizada das melhores marcas de chocolates e ovos de Páscoa. 
            Trabalhamos com Lacta, Nestlé, Hershey's, Ferrero e outras marcas premium. 
            Preços competitivos, entrega rápida e a garantia de produtos originais em cada pedido.
          </p>
          
          
        </div>
      </div>
    </section>
  )
}
