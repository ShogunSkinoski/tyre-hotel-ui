import { Button } from "@/components/ui/button"
import { useState } from "react"
import { notify } from "@/lib/utils"
import { ArrowDown } from "lucide-react"
import Script from 'next/script'

export function DriveBackupSelector({ onSelect }: { onSelect: (backup: any) => void }) {
  const [loading, setLoading] = useState(false)

  const handlePickerSelect = async (data: any) => {
    if (data.action === 'picked') {
      const file = data.docs[0]
      try {
        setLoading(true)
        const response = await fetch(file.downloadUrl, {
          headers: {
            'Authorization': `Bearer ${data.oauthToken}`
          }
        })
        const content = await response.json()
        onSelect(content)
        notify.success('Yedek başarıyla yüklendi')
      } catch (error) {
        notify.error('Yedek yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }
  }

  const openPicker = async () => {
    try {
      const authResponse = await fetch('/api/auth/google/url')
      const { url } = await authResponse.json()
      window.location.href = url
    } catch (error) {
      notify.error('Google Drive bağlantısı kurulamadı')
    }
  }

  return (
    <>
      <Script src="https://apis.google.com/js/api.js" />
      <Button variant="outline" onClick={openPicker} disabled={loading}>
        <ArrowDown className="mr-2 h-4 w-4" />
        Drive'dan Seç
      </Button>
    </>
  )
} 