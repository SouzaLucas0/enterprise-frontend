import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const FILE_PATH = path.resolve('C:\\CeConnect\\application\\params.ini')

function readApiKey(): string | null {
  if (!fs.existsSync(FILE_PATH)) return null

  const content = fs.readFileSync(FILE_PATH, 'utf-8')

  const match = content.match(/^apiKey=(.*)$/m)
  return match ? match[1].trim() : null
}

export async function GET() {
  try {
    const apiKey = readApiKey()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'apiKey não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(apiKey)
  } catch {
    return NextResponse.json(
      { error: 'Erro ao ler params.ini' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const { apiKey } = await req.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'apiKey é obrigatória' },
        { status: 400 }
      )
    }
    
    let content = ''
    if (fs.existsSync(FILE_PATH)) {
      content = fs.readFileSync(FILE_PATH, 'utf-8')
    }

    const lines = content.split(/\r?\n/)
    let found = false
    const newLines = lines.map(line => {
      if (line.startsWith('apiKey=')) {
        found = true
        return `apiKey=${apiKey}`
      }
      return line
    })

    if (!found) {
      newLines.push(`apiKey=${apiKey}`)
    }

    fs.writeFileSync(FILE_PATH, newLines.join('\n'), 'utf-8')

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Erro ao atualizar params.ini' },
      { status: 500 }
    )
  }
}

