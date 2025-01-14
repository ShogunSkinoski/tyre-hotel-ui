'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useHeader } from "@/contexts/header-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notify } from '@/lib/utils'
import { Download, Upload, RefreshCw, CloudUpload, Trash2 } from 'lucide-react'
import { BackupDetailsDialog } from '@/components/backup-details-dialog'
import { DriveBackupSelector } from '@/components/drive-backup-selector'

export default function BackupPage() {
  const { setHeaderText } = useHeader()
  const [backups, setBackups] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [backupDetails, setBackupDetails] = useState<Record<string, any>>({})
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  useEffect(() => {
    setHeaderText('Yedekler')
    fetchBackups()
  }, [setHeaderText])

  const fetchBackups = async () => {
    try {
      const response = await axios.get('/api/backup')
      setBackups(response.data)
    } catch (error) {
      notify.error('Yedekler yüklenirken hata oluştu')
    }
  }

  const createBackup = async () => {
    try {
      setLoading(true)
      await axios.post('/api/backup')
      await fetchBackups()
      notify.success('Yedek oluşturuldu')
    } catch (error) {
      notify.error('Yedek oluşturulurken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const restoreBackup = async (fileName: string) => {
    if (!window.confirm('Bu yedeği geri yüklemek istediğinizden emin misiniz?')) return

    try {
      setLoading(true)
      await axios.post('/api/backup/restore', { fileName })
      notify.success('Yedek geri yüklendi')
    } catch (error) {
      notify.error('Yedek geri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDoubleClick = async (fileName: string) => {
    try {
      const response = await axios.get(`/api/backup/${fileName}`)
      setBackupDetails(prev => ({ ...prev, [fileName]: response.data }))
      setOpenDialog(fileName)
    } catch (error) {
      notify.error('Yedek detayları yüklenirken hata oluştu')
    }
  }

  const saveToCloud = async (fileName: string) => {
    try {
      setLoading(true)
      // First get the backup content
      const response = await axios.get(`/api/backup/${fileName}`)
      
      // Get auth URL and redirect to Google login
      const authResponse = await axios.get('/api/auth/google/url')
      const { url } = authResponse.data
      
      // Store backup info in session storage for after auth
      sessionStorage.setItem('pendingBackup', JSON.stringify({
        fileName,
        content: JSON.stringify(response.data)
      }))
      
      // Redirect to Google auth
      window.location.href = url
      
    } catch (error) {
      notify.error('Google Drive\'a yüklenirken hata oluştu')
      setLoading(false)
    }
  }

  const deleteBackup = async (fileName: string) => {
    if (!window.confirm('Bu yedeği silmek istediğinizden emin misiniz?')) return

    try {
      setLoading(true)
      await axios.delete(`/api/backup/${fileName}`)
      await fetchBackups()
      notify.success('Yedek silindi')
    } catch (error) {
      notify.error('Yedek silinirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Veri Yedekleri</h2>
        <div className="flex space-x-2">
          <DriveBackupSelector onSelect={restoreBackup} />
          <Button onClick={createBackup} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Yeni Yedek Oluştur
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mevcut Yedekler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {backups.map((backup) => (
              <div 
                key={backup} 
                className="flex justify-between items-center p-2 hover:bg-muted rounded"
                onDoubleClick={() => handleDoubleClick(backup)}
              >
                <span>{new Date(backup.split('_')[1].split('.')[0].replace('T', ' ').split(' ')[0]).toLocaleDateString('tr-TR')}</span>
                <div className="flex space-x-2">
                  {backupDetails[backup] && (
                    <BackupDetailsDialog 
                      backup={backupDetails[backup]} 
                      fileName={backup}
                      open={openDialog === backup}
                      onOpenChange={(open) => setOpenDialog(open ? backup : null)}
                    />
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveToCloud(backup)}
                    disabled={loading}
                  >
                    <CloudUpload className="h-4 w-4" />
                    <span className="ml-2">Bulut'a Yükle</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => restoreBackup(backup)}
                    disabled={loading}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Geri Yükle
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteBackup(backup)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 