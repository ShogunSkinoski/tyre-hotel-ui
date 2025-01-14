import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const car = await prisma.car.findUnique({
      where: { id: params.id },
      include: { tyrePacks: true },
    })
    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }
    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Delete associated tyre packs first
    await prisma.tyrePack.deleteMany({
      where: { carId: params.id }
    })
    
    // Then delete the car
    const car = await prisma.car.delete({
      where: { id: params.id }
    })
    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 })
  }
} 