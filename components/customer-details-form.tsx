'use client'

import React from 'react'
import { X, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Car {
  id: string;
  plate: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  brand: string;
}

interface CustomerDetailsFormProps {
  onSave: (car: Omit<Car, 'id' | 'createdAt' >) => void;
  onCancel: () => void;
}

export function CustomerDetailsFormComponent({ onSave, onCancel }: CustomerDetailsFormProps) {
  const [formData, setFormData] = React.useState<Omit<Car, 'id' | 'createdAt' >>({
    plate: '',
    customerName: '',
    customerEmail: '',  
    customerPhone: '',
    brand: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="bg-blue-400 rounded-full p-2 mr-3">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Müşteri Bilgilerini Giriniz</h2>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <Label htmlFor="plate">Araç Plakası</Label>
          <Input
            id="plate"
            name="plate"
            value={formData.plate}
            onChange={handleChange}
            placeholder="Plakayı giriniz lütfen"
            required
          />
        </div>

        <div>
          <Label htmlFor="brand">Marka</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Markayı giriniz"
            required
          />
        </div>
        <div>
          <Label htmlFor="customerName">Müşteri İsmi</Label>
          <Input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Müşteri ismini giriniz"
            required
          />
        </div>

        <div>
          <Label htmlFor="customerPhone">Telefon Numarası</Label>
          <Input
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            placeholder="Telefon numarasını giriniz"
            required
          />
        </div>

        <div>
          <Label htmlFor="customerEmail">Mail Adresi</Label>
          <Input
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleChange}
            placeholder="Mail adresini giriniz"
            required
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onCancel}>
            İptal Et
          </Button>
          <Button type="submit">
            Kaydet
          </Button>
        </div>
      </form>
    </div>
  )
}