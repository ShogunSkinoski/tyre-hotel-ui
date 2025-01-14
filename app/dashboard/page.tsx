"use client"
import { CarListComponent } from "../../components/car_list"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { useHeader } from "@/contexts/header-context"
import { useEffect } from "react"

export default function TyreDashboard() {
  const { setHeaderText } = useHeader()
  
  useEffect(() => {
    setHeaderText('Dashboard')
  }, [setHeaderText])

  return (
    <div className="space-y-6">
      <AnalyticsDashboard />
    </div>
  )
}