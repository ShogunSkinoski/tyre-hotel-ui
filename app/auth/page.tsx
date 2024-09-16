import { HeaderComponent } from "@/components/header";
import { SidebarComponent } from "@/components/sidebar";

export default function AuthPage() {
  return (
    <div className="flex h-screen bg-background">
      <SidebarComponent />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderComponent />
        
      </div>
    </div>
  )
}