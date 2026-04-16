import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { TopNavbar } from "@/components/top-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-background">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopNavbar />
        <main className="flex-1 px-5 pb-24 pt-8 sm:px-6 lg:px-10 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
