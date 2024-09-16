'use client'

import { Button } from "@/components/ui/button"
import { useHeader } from "@/contexts/header-context";
import { User } from "lucide-react"

export function HeaderComponent() {
  const { headerText } = useHeader();

  return (
    <header className="flex justify-between items-center p-4 bg-card border-b">
      <h1 className="text-2xl font-bold">{headerText}</h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="text-primary">
          Uzman
          <User className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}