'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useHeader } from "@/contexts/header-context"
import { FinancialSummary } from '@/components/financial-summary'
import { TransactionForm } from '@/components/transaction-form'
import { Button } from '@/components/ui/button'
import { Plus, FileText } from 'lucide-react'
import { notify } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PDFDownloadLink } from '@react-pdf/renderer'
import { TransactionPDF } from '@/components/transaction-pdf'

interface Transaction {
  id: string
  date: string
  type: 'INCOME' | 'EXPENSE'
  amount: number
  category: string
  description?: string
}

export default function TransactionsPage() {
  const { setHeaderText } = useHeader()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setHeaderText('Finansal İşlemler')
    fetchTransactions()
  }, [setHeaderText])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await axios.get<Transaction[]>('/api/transactions')
      setTransactions(response.data)
    } catch (error) {
      notify.error('İşlemler yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTransaction = async (data: any) => {
    try {
      const response = await axios.post<Transaction>('/api/transactions', data)
      setTransactions([...transactions, response.data])
      setShowForm(false)
      notify.success('İşlem başarıyla kaydedildi')
    } catch (error) {
      notify.error('İşlem kaydedilirken bir hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/transactions/${id}`)
      setTransactions(transactions.filter(t => t.id !== id))
      notify.success('İşlem başarıyla silindi')
    } catch (error) {
      notify.error('İşlem silinirken bir hata oluştu')
    }
  }

  if (loading) return <div>Yükleniyor...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Finansal Özet</h2>
        <div className="flex space-x-2">
          <PDFDownloadLink
            document={<TransactionPDF transactions={transactions as any} />}
            fileName={`islemler_${new Date().toLocaleDateString('tr-TR')}.pdf`}
          >
            {({ loading }) => (
              <Button
                variant="outline"
                disabled={loading}
              >
                <FileText className="mr-2 h-4 w-4" />
                {loading ? 'PDF Hazırlanıyor...' : 'PDF İndir'}
              </Button>
            )}
          </PDFDownloadLink>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="mr-2 h-4 w-4" />
            Yeni İşlem
          </Button>
        </div>
      </div>
     

      <FinancialSummary 
        transactions={transactions} 
        onDelete={handleDelete}
      />

      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <TransactionForm
              onSave={handleSaveTransaction}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
} 