"use client"

import { SidebarComponent } from "../../components/sidebar"
import { HeaderComponent } from "../../components/header"
import { CarListComponent } from "../../components/car_list"
import { useHeader } from "@/contexts/header-context"
import { useEffect } from "react"


export default function TyreDashboard() {
  const { setHeaderText } = useHeader()
  useEffect(() => {
    setHeaderText('Araçlar')
  },[setHeaderText])
  const customerProps = [
    {
      plate: "34 ABC 123",
      date: "12.12.2021",
      name: "Ali Veli",
      phone: "0532 123 45 67"
    }
  ]

  return (
          <CarListComponent customerProps={customerProps} />
  )
}