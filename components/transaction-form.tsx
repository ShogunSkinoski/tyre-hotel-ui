import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TransactionFormProps {
  onSave: (data: any) => void
  onCancel: () => void
}

const categories = [
  'Lastik Satışı',
  'Servis Ücreti',
  'Depolama Ücreti',
  'Diğer Gelir',
  'Malzeme Gideri',
  'Personel Gideri',
  'Kira Gideri',
  'Diğer Gider'
]

export function TransactionForm({ onSave, onCancel }: TransactionFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    
    onSave({
      type: formData.get('type'),
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category'),
      description: formData.get('description'),
      date: formData.get('date')
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg shadow-lg">
      <div>
        <Label htmlFor="type">İşlem Tipi</Label>
        <Select name="type" required>
          <SelectTrigger>
            <SelectValue placeholder="İşlem tipini seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Gelir</SelectItem>
            <SelectItem value="EXPENSE">Gider</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="amount">Tutar</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
        />
      </div>

      <div>
        <Label htmlFor="category">Kategori</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Kategori seçin" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Açıklama</Label>
        <Input
          id="description"
          name="description"
          placeholder="İşlem açıklaması"
        />
      </div>

      <div>
        <Label htmlFor="date">Tarih</Label>
        <Input
          id="date"
          name="date"
          type="date"
          required
          defaultValue={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit">
          Kaydet
        </Button>
      </div>
    </form>
  )
} 