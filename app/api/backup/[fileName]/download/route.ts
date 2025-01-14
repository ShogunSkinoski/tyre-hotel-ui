import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: { fileName: string } }
) {
  try {
    const backupPath = path.join(process.cwd(), 'backups', params.fileName)
    const data = await fs.readFile(backupPath)
    
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=${params.fileName}`
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to download backup' }, { status: 500 })
  }
} 