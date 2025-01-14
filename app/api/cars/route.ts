import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cars = await prisma.car.findMany()
    return NextResponse.json(cars)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log(data)
    const car = await prisma.car.create({
      data: {
        plate: data.plate,
        brand: data.brand,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
      },
    })
    return NextResponse.json(car)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
} 