"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function PoliticaReembolso() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/imgs/logo-doce-sabor.webp"
            alt="Doce Sabor Chocolates Finos"
            width={150}
            height={150}
            className="rounded-full"
          />
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </Link>

        <div className="bg-card rounded-xl border border-border p-6 space-y-6">
          <h1 className="text-3xl font-bold text-foreground">
            {"Pol\u00edtica de Cancelamento e Reembolso"}
          </h1>

          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{"1. Cancelamento do Pedido"}</h2>
              <p>
                {"O cliente pode solicitar o cancelamento do pedido enquanto ele ainda n\u00e3o estiver em prepara\u00e7\u00e3o. Ap\u00f3s o in\u00edcio do preparo, n\u00e3o ser\u00e1 poss\u00edvel cancelar, pois se trata de produtos perec\u00edveis e manipulados sob demanda."}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{"Pedido ainda n\u00e3o aceito pela loja: cancelamento imediato com reembolso total."}</li>
                <li>{"Pedido em prepara\u00e7\u00e3o: cancelamento n\u00e3o dispon\u00edvel."}</li>
                <li>{"Pedido j\u00e1 despachado/entregue: cancelamento n\u00e3o dispon\u00edvel."}</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{"2. Reembolso Integral"}</h2>
              <p>
                {"O reembolso integral ser\u00e1 realizado nas seguintes situa\u00e7\u00f5es:"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{"Pedido cancelado antes do in\u00edcio do preparo."}</li>
                <li>{"Produto entregue com defeito vis\u00edvel ou avaria (ex: ovo de P\u00e1scoa quebrado, embalagem violada)."}</li>
                <li>{"Produto diferente do solicitado."}</li>
                <li>{"Pedido n\u00e3o entregue dentro do prazo estimado (quando a falha for da loja ou do entregador)."}</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{"3. Reembolso Parcial"}</h2>
              <p>
                {"O reembolso parcial poder\u00e1 ser aplicado quando:"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{"Parte do pedido estiver incorreta ou em m\u00e1s condi\u00e7\u00f5es."}</li>
                <li>{"Itens faltantes no pedido."}</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{"4. Situa\u00e7\u00f5es em que N\u00c3O Cabe Reembolso"}</h2>
              <p>
                {"N\u00e3o ser\u00e1 poss\u00edvel solicitar reembolso nos seguintes casos:"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{"Arrependimento ap\u00f3s o in\u00edcio do preparo (produto perec\u00edvel)."}</li>
                <li>{"Endere\u00e7o de entrega fornecido incorretamente pelo cliente."}</li>
                <li>{"Aus\u00eancia do cliente no local de entrega ap\u00f3s tentativa de contato."}</li>
                <li>{"Produto consumido parcial ou totalmente."}</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{"5. Como Solicitar Reembolso"}</h2>
              <p>
                {"Para solicitar um reembolso, entre em contato conosco em at\u00e9 24 horas ap\u00f3s o recebimento do pedido:"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  {"E-mail: "}
                  <a href="mailto:contato@docesaborchocolates.com.br" className="text-primary hover:underline">
                    contato@docesaborchocolates.com.br
                  </a>
                </li>
              </ul>
              <p>
                {"Envie fotos do produto (em caso de avaria ou erro) e o n\u00famero do pedido. Analisaremos sua solicita\u00e7\u00e3o em at\u00e9 48 horas \u00fateis."}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{"6. Prazo de Reembolso"}</h2>
              <p>
                {"Ap\u00f3s a aprova\u00e7\u00e3o da solicita\u00e7\u00e3o, o reembolso ser\u00e1 processado da seguinte forma:"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>{"Pagamento via PIX: reembolso em at\u00e9 3 dias \u00fateis na mesma chave utilizada."}</li>
                <li>{"Cart\u00e3o de cr\u00e9dito: estorno em at\u00e9 2 faturas, conforme a operadora."}</li>
                <li>{"Cr\u00e9dito na loja: dispon\u00edvel imediatamente para uso em novo pedido."}</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{"7. Trocas"}</h2>
              <p>
                {"Por se tratar de produtos aliment\u00edcios perec\u00edveis, n\u00e3o realizamos trocas. Em caso de problema com o produto recebido, aplicamos a pol\u00edtica de reembolso descrita acima."}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{"8. Direitos do Consumidor"}</h2>
              <p>
                {"Esta pol\u00edtica est\u00e1 em conformidade com o C\u00f3digo de Defesa do Consumidor (Lei n\u00ba 8.078/1990). Em caso de d\u00favidas, o cliente pode entrar em contato com os \u00f3rg\u00e3os de defesa do consumidor (Procon) de sua regi\u00e3o."}
              </p>
            </section>
          </div>

          <div className="text-xs text-muted-foreground pt-6 border-t border-border">
            <p>{"\u00daltima atualiza\u00e7\u00e3o: "}{new Date().toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
