import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { fileName: string } }
) {
  try {
    const backupPath = path.join(process.cwd(), 'backups', params.fileName)
    const data = await fs.readFile(backupPath, 'utf-8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read backup' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { fileName: string } }
) {
  try {
    const backupPath = path.join(process.cwd(), 'backups', params.fileName)
    await fs.unlink(backupPath)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete backup' }, { status: 500 })
  }
} 