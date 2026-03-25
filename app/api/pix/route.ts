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

    const apiKey = process.env.PAGOUAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API PagouAI nao configurada" },
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
    const docType = docNumber.length > 11 ? "CNPJ" : "CPF"

    // Gerar external_ref unico
    const externalRef = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`

    // Criar transacao PIX na PagouAI
    // Tentando diferentes formatos de autenticacao
    const response = await fetch("https://api.conta.pagou.ai/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        amount: amountInCents,
        paymentMethod: "pix",
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim().toLowerCase(),
          phone: customerPhone ? customerPhone.replace(/\D/g, "") : undefined,
          document: {
            type: docType,
            number: docNumber,
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

    if (!response.ok || !data.success) {
      console.error("[PagouAI] Erro:", data.message || data.error || JSON.stringify(data))
      return NextResponse.json(
        { error: data.message || data.error || "Erro ao criar cobranca PIX" },
        { status: response.status }
      )
    }

    // Extrair dados PIX da resposta PagouAI
    const transactionData = data.data || data
    const transactionId = transactionData.id || ""
    const pixCode = transactionData.pix?.qrcode || transactionData.pix?.qr_code || transactionData.pix?.brcode || transactionData.pix?.code || ""

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
      expiresAt: transactionData.pix?.expires_at || transactionData.expires_at || null,
      amount: amount,
    })
  } catch (err) {
    console.error("[PagouAI] PIX API error:", err instanceof Error ? err.message : err)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
