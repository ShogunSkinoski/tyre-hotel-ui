import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tyrePack = await prisma.tyrePack.delete({
      where: { id: params.id }
    })
    return NextResponse.json(tyrePack)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tyre pack' }, { status: 500 })
  }
} 