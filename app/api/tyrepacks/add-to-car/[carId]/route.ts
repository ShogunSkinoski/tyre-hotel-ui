import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: { carId: string } }
) {
  try {
    const data = await request.json()
    const tyrePack = await prisma.tyrePack.create({
      data: {
        location: data.location,
        brand: data.brand,
        size: data.size,
        season: data.season,
        count: data.count,
        carId: params.carId,
      },
    })
    return NextResponse.json(tyrePack)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add tyre pack to car' }, { status: 500 })
  }
} 