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
        { error: "Chave da API Medusa Pay nao configurada" },
        { status: 500 }
      )
    }

    // Descricao do pedido
    const totalQuantity = items?.reduce((acc: number, item: { quantity: number }) => acc + item.quantity, 0) || 1
    const description = `${totalQuantity}x Combo Escolhido`

    // Valor em centavos
    const amountInCents = Math.round(amount * 100)

    // Formatar documento
    const docNumber = customerDocument.replace(/\D/g, "")
    const docType = docNumber.length > 11 ? "cnpj" : "cpf"

    // Criar transacao PIX na Medusa Pay (Basic Auth)
    const response = await fetch("https://api.v2.medusapay.com.br/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${apiKey}:x`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: amountInCents,
        paymentMethod: "pix",
        items: [
          {
            id: "combo-1",
            title: "Combo Escolhido",
            unitPrice: amountInCents,
            quantity: 1,
            tangible: true,
          },
        ],
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone ? customerPhone.replace(/\D/g, "") : undefined,
          document: {
            number: docNumber,
            type: docType,
          },
        },
        pix: {
          expiresInDays: 1,
        },
        metadata: {
          description: description,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[MedusaPay] Erro:", data.message || data.error || JSON.stringify(data))
      return NextResponse.json(
        { error: data.message || data.error || "Erro ao criar cobranca PIX" },
        { status: response.status }
      )
    }

    // Extrair dados PIX da resposta Medusa Pay
    const pixCode = data.pix?.qrcode || data.pix?.qr_code || data.pix?.brcode || ""
    const transactionId = data.id || data.transactionId || ""

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
      expiresAt: data.pix?.expires_at || data.expires_at || null,
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
