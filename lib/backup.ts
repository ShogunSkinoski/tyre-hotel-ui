import { prisma } from './prisma'
import fs from 'fs/promises'
import path from 'path'

export async function backupDatabase() {
  try {
    // Get all data
    const [cars, tyrePacks, transactions] = await Promise.all([
      prisma.car.findMany(),
      prisma.tyrePack.findMany(),
      prisma.transaction.findMany(),
    ])

    // Create backup object
    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        cars,
        tyrePacks,
        transactions
      }
    }

    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups')
    await fs.mkdir(backupDir, { recursive: true })

    // Save backup file
    const fileName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    await fs.writeFile(
      path.join(backupDir, fileName),
      JSON.stringify(backup, null, 2)
    )

    return fileName
  } catch (error) {
    console.error('Backup failed:', error)
    throw error
  }
}

export async function restoreDatabase(fileName: string) {
  try {
    const backupPath = path.join(process.cwd(), 'backups', fileName)
    const backupData = JSON.parse(await fs.readFile(backupPath, 'utf-8'))

    // Clear existing data
    await prisma.$transaction([
      prisma.tyrePack.deleteMany(),
      prisma.transaction.deleteMany(),
      prisma.car.deleteMany(),
    ])

    // Restore data
    await prisma.$transaction([
      prisma.car.createMany({ data: backupData.data.cars }),
      prisma.tyrePack.createMany({ data: backupData.data.tyrePacks }),
      prisma.transaction.createMany({ data: backupData.data.transactions }),
    ])

    return true
  } catch (error) {
    console.error('Restore failed:', error)
    throw error
  }
} 