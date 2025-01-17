'use client'

import { Button } from "@/components/ui/button"
import { useHeader } from "@/contexts/header-context";
import { useSidebar } from "@/contexts/sidebar-context";
import { User, Menu } from "lucide-react"

export function HeaderComponent() {
  const { headerText } = useHeader();
  const { isExpanded, setIsExpanded } = useSidebar();

  return (
    <header className="flex justify-between items-center p-4 bg-card border-b">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-primary"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl md:text-2xl font-bold truncate">{headerText}</h1>
      </div>
      <div className="flex items-center">
        <Button variant="ghost" className="text-primary">
          <span className="hidden md:inline mr-2">Uzman</span>
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}