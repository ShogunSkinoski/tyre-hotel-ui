import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

interface BackupDetailsProps {
  backup: any
  fileName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BackupDetailsDialog({ backup, fileName, open, onOpenChange }: BackupDetailsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-muted">
        <DialogHeader>
          <DialogTitle>Yedek Detayları - {fileName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Oluşturulma Tarihi</h3>
            <p>{new Date(backup.timestamp).toLocaleString('tr-TR')}</p>
          </div>
          <div>
            <h3 className="font-semibold">İçerik Özeti</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Araç Sayısı: {backup.data.cars.length}</li>
              <li>Lastik Sayısı: {backup.data.tyrePacks.length}</li>
              <li>İşlem Sayısı: {backup.data.transactions.length}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Dosya Boyutu</h3>
            <p>{(JSON.stringify(backup).length / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 