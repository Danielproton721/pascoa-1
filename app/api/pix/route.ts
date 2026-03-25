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

    // Criar transacao PIX na PagouAI (app.conta.pagou.ai)
    // Tentando com x-api-key header
    const response = await fetch("https://api.conta.pagou.ai/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        amount: amountInCents,
        payment_method: "pix",
        customer: {
          name: customerName.trim(),
          email: customerEmail.trim().toLowerCase(),
          phone: customerPhone ? customerPhone.replace(/\D/g, "") : undefined,
          document: {
            type: docType.toLowerCase(),
            number: docNumber,
          },
        },
        items: [
          {
            title: description,
            unit_price: amountInCents,
            quantity: 1,
            tangible: true,
          },
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[PagouAI] Erro:", data.detail || data.message || data.error || JSON.stringify(data))
      return NextResponse.json(
        { error: data.detail || data.message || data.error || "Erro ao criar cobranca PIX" },
        { status: response.status }
      )
    }

    // Extrair dados PIX da resposta PagouAI (api.conta.pagou.ai)
    const transactionId = data.id || data.transaction_id || ""
    const pixData = data.pix || data.payment || data
    const pixCode = pixData?.qr_code || pixData?.qrcode || pixData?.brcode || pixData?.emv || pixData?.copy_paste || ""

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
      expiresAt: pixData?.expires_at || data.expires_at || null,
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
