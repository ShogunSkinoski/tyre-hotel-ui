import { NextResponse } from 'next/server'
import { uploadToDrive } from '@/lib/google-drive'
import path from 'path'
import fs from 'fs/promises'
    
export async function POST(request: Request) {
  try {
    const { fileName, accessToken } = await request.json()
    const filePath = path.join(process.cwd(), 'backups', fileName)
    const content = await fs.readFile(filePath, 'utf-8')
    await uploadToDrive(fileName, content, accessToken)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload to Google Drive' }, { status: 500 })
  }
} 