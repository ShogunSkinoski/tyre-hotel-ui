'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useHeader } from '@/contexts/header-context'

export default function ScanPage() {
  const router = useRouter()
  const { setHeaderText } = useHeader()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setHeaderText('QR Kod Tara')
    
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: { width: 250, height: 250 },
      fps: 5,
    },
    true)

    scanner.render(
      (data) => {
        try {
          const carData = JSON.parse(data)
          if (carData.id) {
            router.push(`/dashboard/${carData.id}`)
          }
        } catch (err) {
          setError('Geçersiz QR kod')
        }
      },
      (err) => {
        if (err) setError('Kamera erişimi sağlanamadı')
      },
    )

    return () => {
      scanner.clear()
    }
  }, [router, setHeaderText])

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Kod Tarayıcı</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div id="reader" className="max-w-md mx-auto" />
      </CardContent>
    </Card>
  )
} 