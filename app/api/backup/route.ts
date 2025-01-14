import { NextResponse } from 'next/server'
import { backupDatabase, restoreDatabase } from '@/lib/backup'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    const backupDir = path.join(process.cwd(), 'backups')
    const files = await fs.readdir(backupDir)
    return NextResponse.json(files)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list backups' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const fileName = await backupDatabase()
    return NextResponse.json({ fileName })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create backup' }, { status: 500 })
  }
} 