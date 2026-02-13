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

    const secretKey = process.env.MEDUSAPAY_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json(
        { error: "Chave da API nao configurada" },
        { status: 500 }
      )
    }

    // Gerar ID unico para a transacao
    const transactionId = `FOLIA-${Date.now()}-${Math.random().toString(36).substring(7)}`

    // Descricao dos itens
    const description = items
      ?.map((item: { name: string; quantity: number }) => `${item.quantity}x ${item.name}`)
      .join(", ") || "Pedido Folia Delivery"

    // Formatar items para a API (maximo 5 items)
    const formattedItems = (items || []).slice(0, 5).map((item: { name: string; quantity: number; price?: number }, index: number) => ({
      id: `item-${index + 1}`,
      title: item.name.substring(0, 50),
      unitPrice: item.price ? Math.round(item.price * 100) : Math.round((amount / (items?.length || 1)) * 100),
      quantity: item.quantity,
      tangible: true,
    }))

    // Se nao tiver items, criar um item generico
    if (formattedItems.length === 0) {
      formattedItems.push({
        id: "item-1",
        title: "Pedido Folia Delivery",
        unitPrice: Math.round(amount * 100),
        quantity: 1,
        tangible: true,
      })
    }

    // Criar transacao PIX na MedusaPay
    const response = await fetch("https://api.v2.medusapay.com.br/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${secretKey}:x`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Valor em centavos
        paymentMethod: "pix",
        items: formattedItems,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone ? customerPhone.replace(/\D/g, "") : undefined,
          document: {
            number: customerDocument.replace(/\D/g, ""),
            type: customerDocument.replace(/\D/g, "").length > 11 ? "cnpj" : "cpf",
          },
        },
        pix: {
          expiresInDays: 1,
        },
        metadata: {
          order_id: transactionId,
          description: description,
        },
      }),
    })

    const data = await response.json()

    console.log("[v0] MedusaPay full response:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      console.error("[v0] MedusaPay error:", data)
      return NextResponse.json(
        { error: data.message || "Erro ao criar cobranca PIX" },
        { status: response.status }
      )
    }

    // Extrair codigo PIX (campo e "qrcode" minusculo na API MedusaPay)
    const pixCode = data.pix?.qrcode || ""
    
    // MedusaPay nao retorna imagem do QR code, vamos gerar via API publica
    // Usando a API do QR Server para gerar a imagem do QR Code
    const pixQrCodeImage = pixCode 
      ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`
      : ""

    console.log("[v0] Extracted pixCode:", pixCode)
    console.log("[v0] Generated pixQrCodeImage:", pixQrCodeImage)

    // Retornar dados do QR Code
    return NextResponse.json({
      success: true,
      transactionId: data.id || data.transactionId || transactionId,
      pixCode: pixCode,
      pixQrCodeImage: pixQrCodeImage,
      expiresAt: data.pix?.expiresAt || data.pix?.expires_at || data.expiresAt,
      amount: amount,
      rawResponse: data, // Enviar resposta completa para debug
    })
  } catch (error) {
    console.error("[v0] PIX creation error:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
