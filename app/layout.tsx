import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { HeaderComponent } from "@/components/header";
import { SidebarComponent } from "@/components/sidebar";
import { HeaderProvider } from "@/contexts/header-context";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Suspense } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div>Loading...</div>}>
        <HeaderProvider>
          <SidebarProvider>
            <TooltipProvider>
              <div className="flex h-screen bg-background">
                <SidebarComponent />
                <div className="flex-1 flex flex-col overflow-hidden">
                  <HeaderComponent />
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-3 md:p-6">
                    {children}
                  </main>
                </div>
              </div>
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </SidebarProvider>
        </HeaderProvider>
        </Suspense>
      </body>
    </html>
  );
}