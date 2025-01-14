import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  ArcElement,
} from 'chart.js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
)

interface Transaction {
  id: string
  date: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  category: string
  description?: string
}

interface FinancialSummaryProps {
  transactions: Transaction[]
  onDelete: (id: string) => void
}

const CATEGORY_COLORS = {
  'Lastik Satışı': 'rgba(34, 197, 94, 0.5)',   // green
  'Servis Ücreti': 'rgba(59, 130, 246, 0.5)',  // blue
  'Depolama Ücreti': 'rgba(139, 92, 246, 0.5)', // purple
  'Diğer Gelir': 'rgba(249, 115, 22, 0.5)',    // orange
  'Malzeme Gideri': 'rgba(239, 68, 68, 0.5)',  // red
  'Personel Gideri': 'rgba(234, 179, 8, 0.5)', // yellow
  'Kira Gideri': 'rgba(236, 72, 153, 0.5)',    // pink
  'Diğer Gider': 'rgba(75, 85, 99, 0.5)',      // gray
} as const

export function FinancialSummary({ transactions, onDelete }: FinancialSummaryProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('tr-TR', { month: 'long' })
    if (!acc[month]) acc[month] = { income: 0, expense: 0 }
    if (t.type === 'INCOME') acc[month].income += t.amount
    else acc[month].expense += t.amount
    return acc
  }, {} as Record<string, { income: number, expense: number }>)

  const barData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Gelir',
        data: Object.values(monthlyData).map(d => d.income),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'Gider',
        data: Object.values(monthlyData).map(d => d.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  }

  const categoryData = transactions.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = 0
    acc[t.category] += t.amount
    return acc
  }, {} as Record<string, number>)

  const doughnutData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: Object.keys(categoryData).map(category => 
        CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || 'rgba(156, 163, 175, 0.5)'
      ),
    }],
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Toplam Gelir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {totalIncome.toLocaleString('tr-TR')} ₺
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Toplam Gider</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {totalExpense.toLocaleString('tr-TR')} ₺
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Durum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {(totalIncome - totalExpense).toLocaleString('tr-TR')} ₺
            </div>
          </CardContent>
        </Card>
      </div>
 <Card>
        <CardHeader>
          <CardTitle>İşlem Geçmişi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarih</TableHead>
                <TableHead>Tip</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Açıklama</TableHead>
                <TableHead className="text-right">Tutar</TableHead>
                <TableHead>İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell>
                    <span className={transaction.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}>
                      {transaction.type === 'INCOME' ? 'Gelir' : 'Gider'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={{ 
                      color: CATEGORY_COLORS[transaction.category as keyof typeof CATEGORY_COLORS] 
                        ?.replace('0.5', '1') 
                        || 'currentColor'
                    }}>
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={transaction.type === 'INCOME' ? 'text-green-500' : 'text-red-500'}>
                      {transaction.amount.toLocaleString('tr-TR')} ₺
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
                          onDelete(transaction.id)
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Aylık Gelir/Gider Grafiği</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barData} options={{ responsive: true }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategori Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={doughnutData} options={{ responsive: true }} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 