import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: 'desc'
      }
    })
    return NextResponse.json(transactions)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log(data)
    const transaction = await prisma.transaction.create({
      data: {
        type: data.type,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: new Date(data.date || Date.now())
      }
    })
    return NextResponse.json(transaction)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
} 