import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { UserProfile } from "@/components/auth/UserProfile";


interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground" />
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse"></span>
              </Button>
              <UserProfile />
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}