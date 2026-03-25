import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, customerName, customerEmail, customerDocument, customerPhone, items } = body

    // Validacao basica
    if (!amount || !customerName || !customerEmail || !customerDocument) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      )
    }

    const apiKey = process.env.MEDUSAPAY_SECRET_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API MedusaPay nao configurada" },
        { status: 500 }
      )
    }

    // Descricao do pedido
    const totalQuantity = items?.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0) || 1
    const description = `${totalQuantity}x Combo Escolhido`

    // Valor em centavos
    const amountInCents = Math.round(amount * 100)

    // Formatar documento - remover caracteres nao numericos
    const docNumber = customerDocument.replace(/\D/g, "")
    const docType = docNumber.length > 11 ? "cnpj" : "cpf"

    // Limpar email - remover espacos e converter para minusculas
    const cleanEmail = customerEmail.trim().toLowerCase()

    // Criar transacao PIX na MedusaPay
    // Documentacao: https://medusapay.readme.io/reference/introducao
    // Autenticacao: Basic Auth com SECRET_KEY:x em base64
    const basicAuth = Buffer.from(`${apiKey}:x`).toString("base64")
    
    const response = await fetch("https://api.v2.medusapay.com.br/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        amount: amountInCents,
        paymentMethod: "pix",
        customer: {
          name: customerName.trim(),
          email: cleanEmail,
          phone: customerPhone ? customerPhone.replace(/\D/g, "") : undefined,
          document: {
            number: docNumber,
            type: docType,
          },
        },
        items: [
          {
            title: description,
            unitPrice: amountInCents,
            quantity: 1,
            tangible: true,
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok || data.errors) {
      console.error("[MedusaPay] Erro:", data.errors || data.message || JSON.stringify(data))
      return NextResponse.json(
        { error: data.errors?.[0] || data.message || "Erro ao criar cobranca PIX" },
        { status: response.status }
      )
    }

    // Extrair dados PIX da resposta MedusaPay
    // Log para debug da resposta
    console.log("[v0] MedusaPay resposta PIX:", JSON.stringify(data.pix || data))
    
    const transactionId = data.id || ""
    const pixCode = data.pix?.qr_code || data.pix?.emv || data.pix?.qrcode || data.pix?.brcode || data.pix?.copyPaste || data.pix?.copy_paste || ""

    // Gerar imagem do QR Code via API publica
    const pixQrCodeImage = pixCode
      ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`
      : ""

    // Retornar dados do QR Code no formato esperado pelo frontend
    return NextResponse.json({
      success: true,
      transactionId: transactionId,
      pixCode: pixCode,
      pixQrCodeImage: pixQrCodeImage,
      expiresAt: data.pix?.expires_at || null,
      amount: amount,
    })
  } catch (err) {
    console.error("[MedusaPay] PIX API error:", err instanceof Error ? err.message : err)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
