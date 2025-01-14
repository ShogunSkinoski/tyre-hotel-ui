'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Menu, X, Package, FileText, MapIcon, Database, QrCode, LayoutDashboard } from "lucide-react"

export function SidebarComponent() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <aside className={`bg-primary text-primary-foreground transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'}`}>
      <nav className="flex flex-col items-center py-4 space-y-4">
        <Button variant="ghost" size="icon" className="text-primary-foreground w-full" onClick={toggleSidebar}>
          {isExpanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground w-full flex justify-start px-4" onClick={() => router.push('/dashboard')}>
          <LayoutDashboard className="h-6 w-6 mr-2" />
          {isExpanded && <span>Dashboard</span>}
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground w-full flex justify-start px-4" onClick={() => router.push('/cars')}>
          <Package className="h-6 w-6 mr-2" />
          {isExpanded && <span>Araçlar</span>}
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground w-full flex justify-start px-4" onClick={() => router.push('/plan')}>
          <MapIcon className="h-6 w-6 mr-2" />
          {isExpanded && <span>Depo Planları</span>}
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground w-full flex justify-start px-4" onClick={() => router.push('/transactions')}>
          <FileText className="h-6 w-6 mr-2" />
          {isExpanded && <span>İşlemler</span>}
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground w-full flex justify-start px-4" onClick={() => router.push('/backup')}>
          <Database className="h-6 w-6 mr-2" />
          {isExpanded && <span>Yedekler</span>}
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground w-full flex justify-start px-4" onClick={() => router.push('/scan')}>
          <QrCode className="h-6 w-6 mr-2" />
          {isExpanded && <span>QR Tarayıcı</span>}
        </Button>
      </nav>
    </aside>
  )
}