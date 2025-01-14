import { NextResponse } from 'next/server'
import { getBackupContent } from '@/lib/google-drive'

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const accessToken = request.headers.get('Authorization')?.split(' ')[1]
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token' }, { status: 401 })
    }

    const content = await getBackupContent(params.fileId, accessToken)
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get backup' }, { status: 500 })
  }
} 