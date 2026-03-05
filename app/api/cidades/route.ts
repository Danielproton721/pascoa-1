import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const uf = searchParams.get("uf")

  if (!uf || uf.length !== 2) {
    return NextResponse.json({ error: "UF invalida" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`,
      { next: { revalidate: 86400 } } // cache por 24h
    )

    if (!response.ok) {
      return NextResponse.json({ error: "Erro ao buscar cidades" }, { status: response.status })
    }

    const data = await response.json()
    const cidades = data.map((cidade: { nome: string }) => cidade.nome)

    return NextResponse.json({ cidades })
  } catch {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
