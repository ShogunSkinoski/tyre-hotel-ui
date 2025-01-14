'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useHeader } from '@/contexts/header-context'
import { CarDetailsComponent } from '@/components/customer-details'

interface Car {
  id: string;
  plate: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tyrePacks: TyrePack[];
}

interface TyrePack {
  id: string;
  carId: string;
  location: string;
  brand: string;
  size: string;
  season: string;
  count: number;
}

export default function CarDetailsPage() {
  const params = useParams()
  const { setHeaderText } = useHeader()
  const router = useRouter()
  const [car, setCar] = useState<Car | null>(null)
  const [tyrePacks, setTyrePacks] = useState<TyrePack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { id } = params

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true)
        const response = await axios.get<Car>(`/api/cars/${id}`)
        setCar(response.data)
        setHeaderText(`Araç Detayları - ${response.data.plate}`)
        setTyrePacks(response.data.tyrePacks)
        setLoading(false)
      } catch (err) {
        setError('Araç detayları yüklenirken bir hata oluştu')
        setLoading(false)
      }
    }

    fetchCarDetails()

    return () => {
      setHeaderText('Lastikler')
    }
  }, [id, setHeaderText])

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  if (error || !car) {
    return <div>Hata: {error || 'Araç bulunamadı'}</div>
  }

  return (
    <CarDetailsComponent car={car} tyrePacks={tyrePacks} />
  )
}