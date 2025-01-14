import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "./ui/dialog";

interface BackupCompareProps {
  backup1: {
    timestamp: string
    data: any
  }
  backup2: {
    timestamp: string
    data: any
  }
}

export function BackupCompareDialog({ backup1, backup2 }: BackupCompareProps) {
  return (
    <Dialog>
      <DialogContent className="max-w-4xl bg-muted">
        <DialogHeader>
          <DialogTitle>Yedek Karşılaştırma</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3>Yedek 1 - {new Date(backup1.timestamp).toLocaleDateString()}</h3>
            <pre>{JSON.stringify(backup1.data, null, 2)}</pre>
          </div>
          <div>
            <h3>Yedek 2 - {new Date(backup2.timestamp).toLocaleDateString()}</h3>
            <pre>{JSON.stringify(backup2.data, null, 2)}</pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 