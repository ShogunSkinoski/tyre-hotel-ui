'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Menu, X, Package, FileText, MapIcon, Database, QrCode, LayoutDashboard } from "lucide-react"
import { useSidebar } from '@/contexts/sidebar-context'

export function SidebarComponent() {
  const { isExpanded, setIsExpanded } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsExpanded]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  }

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {isMobile && isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <aside 
        className={`
          fixed md:static
          z-50 md:z-auto
          h-full
          bg-primary 
          text-primary-foreground 
          transition-all 
          duration-300
          ${isExpanded ? 'w-64' : 'w-16'}
          ${isMobile && !isExpanded ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
        `}
      >
        <nav className="flex flex-col items-center py-4 space-y-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground w-full" onClick={toggleSidebar}>
            {isExpanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground w-full flex justify-start px-4" 
            onClick={() => handleNavigation('/dashboard')}
          >
            <LayoutDashboard className="h-6 w-6 mr-2" />
            {isExpanded && <span>Dashboard</span>}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground w-full flex justify-start px-4" 
            onClick={() => handleNavigation('/cars')}
          >
            <Package className="h-6 w-6 mr-2" />
            {isExpanded && <span>Araçlar</span>}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground w-full flex justify-start px-4" 
            onClick={() => handleNavigation('/plan')}
          >
            <MapIcon className="h-6 w-6 mr-2" />
            {isExpanded && <span>Depo Planları</span>}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground w-full flex justify-start px-4" 
            onClick={() => handleNavigation('/transactions')}
          >
            <FileText className="h-6 w-6 mr-2" />
            {isExpanded && <span>İşlemler</span>}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground w-full flex justify-start px-4" 
            onClick={() => handleNavigation('/backup')}
          >
            <Database className="h-6 w-6 mr-2" />
            {isExpanded && <span>Yedekler</span>}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-primary-foreground w-full flex justify-start px-4" 
            onClick={() => handleNavigation('/scan')}
          >
            <QrCode className="h-6 w-6 mr-2" />
            {isExpanded && <span>QR Tarayıcı</span>}
          </Button>
        </nav>
      </aside>
    </>
  )
}