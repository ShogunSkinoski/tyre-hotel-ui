import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get tire sizes analytics
    const tireSizes = await prisma.tyrePack.groupBy({
      by: ['size'],
      _count: {
        size: true
      }
    })

    // Get brands analytics
    const brands = await prisma.tyrePack.groupBy({
      by: ['brand'],
      _count: {
        brand: true
      }
    })

    // Get seasonal storage data
    const seasonalStorage = await prisma.tyrePack.groupBy({
      by: ['season'],
      _count: {
        season: true
      }
    })

    // Get monthly revenue data (assuming you have a Transaction model)
    const revenue = await prisma.transaction.groupBy({
      by: ['date'],
      _sum: {
        amount: true
      }
    })

    // Get storage utilization
    const storageUtilization = await prisma.tyrePack.groupBy({
      by: ['location'],
      _count: {
        location: true
      }
    })

    // Format the data for the frontend
    const formattedData = {
      tireSizes: tireSizes.map(item => ({
        size: item.size,
        count: item._count.size
      })),
      brands: brands.map(item => ({
        brand: item.brand,
        count: item._count.brand
      })),
      seasonalStorage: seasonalStorage.map(item => ({
        month: item.season,
        count: item._count.season
      })),
      revenue: revenue.map(item => ({
        month: new Date(item.date).toLocaleDateString('tr-TR', { month: 'long' }),
        amount: item._sum.amount || 0
      })),
      storageUtilization: storageUtilization.map(item => ({
        location: item.location,
        used: item._count.location,
        total: 100 // Fixed capacity
      }))
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
} 