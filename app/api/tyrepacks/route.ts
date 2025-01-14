import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const carId = searchParams.get('carId')

  try {
    const tyrePacks = await prisma.tyrePack.findMany({
      where: {
        carId: carId || undefined
      }
    })
    return NextResponse.json(tyrePacks)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tyre packs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log(data)
    const tyrePack = await prisma.tyrePack.create({
      data: {
        location: data.location,
        brand: data.brand,
        size: data.size,
        season: data.season,
        count: data.count,
        carId: data.carId,
      },
    })
    return NextResponse.json(tyrePack)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tyre pack' }, { status: 500 })
  }
} 