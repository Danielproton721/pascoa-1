"use client"

import Link from "next/link"
import { FileText, Shield, Cookie, BadgeCheck, RotateCcw } from "lucide-react"

export function Footer() {
  return (
    <footer className="mt-16 bg-card border-t border-border">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Políticas e Conformidade */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Políticas e Conformidade</h3>
          <div className="space-y-2">
            <Link
              href="/politica-privacidade"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors py-2"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm">Política de Privacidade</span>
            </Link>
            <Link
              href="/termos-servico"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors py-2"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Termos de Serviço</span>
            </Link>
            <Link
              href="/politica-cookies"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors py-2"
            >
              <Cookie className="w-4 h-4" />
              <span className="text-sm">Política de Cookies</span>
            </Link>
            <Link
              href="/politica-reembolso"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors py-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Política de Cancelamento e Reembolso</span>
            </Link>
          </div>
        </div>

        {/* Aviso de qualidade */}
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <BadgeCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">
                {"Produtos originais e de qualidade"}
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                {"Trabalhamos apenas com chocolates e ovos de Páscoa originais das melhores marcas. Entrega cuidadosa para garantir que sua compra chegue em perfeito estado."}
              </p>
            </div>
          </div>
        </div>

        {/* Informações da Empresa */}
        <div className="border-t border-border pt-6 mt-6">
          <p className="text-sm font-medium text-foreground mb-2">
            Revendedor autorizado
          </p>
          <p className="text-xs text-muted-foreground">
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Av. Carlos de Campos, 946 - Pari, São Paulo - SP, 03035-040
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Telefone: (11) 91216-5632
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Contato:{" "}
            <a href="mailto:contato@docesaborchocolates.com.br" className="text-primary hover:underline">contato@docesaborchocolates.com.br</a>
          </p>
          <p className="text-xs text-muted-foreground mt-4 italic">
            As marcas dos produtos comercializados neste site sao propriedade de seus respectivos fabricantes. A Doce Sabor Chocolates nao possui vinculo societario com essas empresas. Somos um revendedor independente que comercializa produtos originais. Preco final sem taxas adicionais.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            © {new Date().getFullYear()} Doce Sabor Chocolates. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
