'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from 'qrcode.react'
import { Download, QrCode } from 'lucide-react'

interface TyrePackQRProps {
  tyrePack: {
    location: string
    brand: string
    size: string
    season: string
    count: number
    car?: {
      plate: string
      customerName: string
    }
  }
}

export function TyrePackQRDialog({ tyrePack }: TyrePackQRProps) {
  const qrData = JSON.stringify({
    location: tyrePack.location,
    brand: tyrePack.brand,
    size: tyrePack.size,
    season: tyrePack.season,
    count: tyrePack.count,
    car: {
      plate: tyrePack.car?.plate,
      customer: tyrePack.car?.customerName
    }
  })

  const downloadQR = () => {
    const svg = document.querySelector(`#tyre-qr-${tyrePack.location} svg`) as SVGElement
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `lastik-${tyrePack.location}-${tyrePack.car?.plate}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <QrCode className="h-4 w-4 mr-2" />
          QR Kod
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-muted">
        <DialogHeader>
          <DialogTitle>
            {tyrePack.car?.plate} - {tyrePack.location} Lastikleri
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div id={`tyre-qr-${tyrePack.location}`}>
            <QRCodeSVG
              value={qrData}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <Button onClick={downloadQR} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            QR Kodu İndir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 