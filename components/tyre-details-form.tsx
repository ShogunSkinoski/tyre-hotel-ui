'use client'

import React from 'react'
import { X, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Tire {
  location: string;
  brand: string;
  size: string;
  season: string;
  count: number;
}

interface TireDetailsFormProps {
  tire?: Tire;
  onSave: (tire: Tire) => void;
  onCancel: () => void;
}

const seasons = [
  { label: "Yaz", value: "Yaz" },
  { label: "Kış", value: "Kıs" },
  { label: "Dört Mevsim", value: "Her Mevsim" },
]

export function TyreDetailsForm({ tire, onSave, onCancel }: TireDetailsFormProps) {
  const [formData, setFormData] = React.useState<Tire>(tire || {
    location: '',
    brand: '',
    size: '',
    season: '',
    count: 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'count' ? parseInt(e.target.value, 10) : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSeasonChange = (value: string) => {
    setFormData({ ...formData, season: value })
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
          <h2 className="text-xl font-semibold">Lastik Bilgilerini Giriniz</h2>
        </div>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <Label htmlFor="location">Lokasyonu</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Lastik lokasyonunu giriniz lütfen"
            required
          />
        </div>

        <div>
          <Label htmlFor="brand">Markası</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Lastik markası giriniz lütfen"
            required
          />
        </div>

        <div>
          <Label htmlFor="size">Boyutu</Label>
          <Input
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="Lastik Boyutunu giriniz"
            required
          />
        </div>

        <div>
          <Label htmlFor="season">Sezon</Label>
          <Select value={formData.season} onValueChange={handleSeasonChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sezon seçiniz" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season.value} value={season.value}>
                  {season.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="count">Adet</Label>
          <Input
            id="count"
            name="count"
            type="number"
            value={formData.count.toString()}
            onChange={handleChange}
            placeholder="Adet giriniz"
            required
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
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