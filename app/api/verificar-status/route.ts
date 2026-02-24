import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pedidoId = searchParams.get("pedido_id")

    if (!pedidoId) {
      return NextResponse.json(
        { error: "pedido_id e obrigatorio" },
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

    // Consultar status da transacao na MedusaPay
    const response = await fetch(`https://api.v2.medusapay.com.br/v1/transactions/${pedidoId}`, {
      method: "GET",
      headers: {
        "Authorization": `Basic ${Buffer.from(`${secretKey}:x`).toString("base64")}`,
      },
    })

    const data = await response.json()

    console.log("[v0] MedusaPay status check for", pedidoId, ":", JSON.stringify(data?.status))

    if (!response.ok) {
      console.error("[v0] MedusaPay status error:", data)
      return NextResponse.json(
        { error: data.message || "Erro ao consultar status" },
        { status: response.status }
      )
    }

    // MedusaPay retorna status como "paid", "pending", "refused", etc.
    const rawStatus = (data.status || "").toLowerCase()
    const isPaid = rawStatus === "paid" || rawStatus === "approved" || rawStatus === "pago"

    return NextResponse.json({
      status: isPaid ? "Pago" : "Pendente",
      rawStatus: rawStatus,
    })
  } catch (error) {
    console.error("[v0] Status check error:", error)
    return NextResponse.json(
      { error: "Erro interno ao verificar status" },
      { status: 500 }
    )
  }
}
