'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { notify } from '@/lib/utils'

export default function GoogleCallbackPage() {
  const router = useRouter()
  
  useEffect(() => {
    const handleCallback = async () => {
      // Get code and error from URL params directly
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const error = params.get('error')

      if (error) {
        notify.error('Google Drive yetkilendirme başarısız oldu')
        router.push('/backup')
        return
      }

      if (!code) {
        notify.error('Yetkilendirme kodu bulunamadı')
        router.push('/backup')
        return
      }

      try {
        // Get the pending backup from session storage
        const pendingBackupStr = sessionStorage.getItem('pendingBackup')
        if (!pendingBackupStr) {
          throw new Error('Yedek bilgisi bulunamadı')
        }

        const pendingBackup = JSON.parse(pendingBackupStr)
        
        // Exchange code for tokens and upload
        await axios.post('/api/auth/callback/google', {
          code,
          fileName: pendingBackup.fileName,
          content: pendingBackup.content
        })

        sessionStorage.removeItem('pendingBackup')
        notify.success('Yedek Google Drive\'a yüklendi')
      } catch (error) {
        console.error('Upload error:', error)
        notify.error('Yedek yüklenirken hata oluştu')
      } finally {
        router.push('/backup')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Google Drive Yetkilendirme</h2>
        <p>İşleminiz devam ediyor, lütfen bekleyin...</p>
      </div>
    </div>
  )
}