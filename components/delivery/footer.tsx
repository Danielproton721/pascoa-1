"use client"

import Link from "next/link"
import { FileText, Shield, Cookie, ShieldAlert } from "lucide-react"

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
          </div>
        </div>

        {/* Aviso +18 */}
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-1">
                {"+18 \u2014 Venda proibida para menores"}
              </p>
              <p className="text-xs text-amber-700 leading-relaxed">
                {"A venda de bebidas alco\u00f3licas \u00e9 permitida apenas para maiores de 18 anos. A idade poder\u00e1 ser conferida no ato da entrega. Beba com modera\u00e7\u00e3o."}
              </p>
            </div>
          </div>
        </div>

        {/* Informações da Empresa */}
        <div className="border-t border-border pt-6 mt-6">
          
          <p className="text-xs text-muted-foreground">
            Contato:{" "}
            <a href="mailto:contato@arcobebidas.com.br" className="text-primary hover:underline">contato@arcobebidas.com.br</a>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            © {new Date().getFullYear()} Bebidas Arco Iris LTDA. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
