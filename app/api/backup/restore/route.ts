import { NextResponse } from 'next/server'
import { restoreDatabase } from '@/lib/backup'

export async function POST(request: Request) {
  try {
    const { fileName } = await request.json()
    await restoreDatabase(fileName)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to restore backup' }, { status: 500 })
  }
} 