"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

export default function PoliticaPrivacidade() {
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
          <h1 className="text-3xl font-bold text-foreground">Política de Privacidade</h1>

          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">1. Introdução</h2>
              <p>
                A Doce Sabor Chocolates está comprometida com a proteção da sua privacidade. Esta Política de Privacidade
                descreve como coletamos, usamos e protegemos suas informações pessoais.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">2. Coleta de Dados</h2>
              <p>
                Coletamos informações que você fornece diretamente, como nome, endereço de entrega, telefone e endereço de
                e-mail quando você faz um pedido ou se cadastra em nossa plataforma.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">3. Uso de Dados</h2>
              <p>
                Utilizamos suas informações para processar pedidos, enviar atualizações de entrega, responder a consultas e
                melhorar nossos serviços. Não compartilhamos suas informações com terceiros sem seu consentimento.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">4. Publicidade e Remarketing</h2>
              <p>
                Utilizamos ferramentas de publicidade online, como o Google Ads, para exibir anuncios relevantes com base 
                na sua navegacao em nosso site. Essas ferramentas podem utilizar cookies para coletar informacoes anonimas 
                sobre suas visitas, como paginas visualizadas e produtos consultados.
              </p>
              <p>
                Voce pode optar por desativar a personalizacao de anuncios nas configuracoes da sua conta Google ou 
                atraves das configuracoes de cookies do seu navegador.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">5. Segurança</h2>
              <p>
                Implementamos medidas de segurança adequadas para proteger seus dados pessoais contra acesso não autorizado,
                alteração ou divulgação.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">6. Direitos do Usuário</h2>
              <p>
                Você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais. Para exercer esses
                direitos, entre em contato conosco pelo e-mail contato@docesaborchocolates.com.br
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">7. Contato</h2>
              <p>
                Se tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através dos canais disponíveis
                em nosso site.
              </p>
            </section>
          </div>

          <div className="text-xs text-muted-foreground pt-6 border-t border-border">
            <p>Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
