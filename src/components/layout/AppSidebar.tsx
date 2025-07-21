import { 
  Brain, 
  Calendar, 
  FileText, 
  BookOpen, 
  Home, 
  Settings, 
  Trophy, 
  TrendingUp,
  User,
  LogOut,
  ChevronRight
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Grade de Estudos", url: "/estudos", icon: Brain, comingSoon: true },
  { title: "Calendário", url: "/calendario", icon: Calendar },
  { title: "Simulados", url: "/simulados", icon: FileText },
  { title: "Banco de Questões", url: "/questoes", icon: BookOpen },
]

const quickStats = [
  { title: "Progresso Geral", value: "68%", icon: TrendingUp },
  { title: "Meta Mensal", value: "12/20", icon: Trophy },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname

  const isCollapsed = state === "collapsed"
  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent/50 hover:text-accent-foreground"

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg text-foreground">EduVest IA</h1>
              <p className="text-xs text-muted-foreground">Sistema Inteligente</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `${getNavCls({ isActive })} relative`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <>
                          <span>{item.title}</span>
                          {item.comingSoon && (
                            <span className="ml-auto text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
                              EM BREVE
                            </span>
                          )}
                          {isActive(item.url) && (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats - Only show when expanded */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Progresso Rápido</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-3 px-3">
                {quickStats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-lg bg-gradient-card border border-border/50 space-y-1"
                  >
                    <div className="flex items-center gap-2">
                      <stat.icon className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {stat.title}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-foreground">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Settings className="h-4 w-4" />
                  {!isCollapsed && <span>Configurações</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="p-4 space-y-3">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  U
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Estudante
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Plano Gratuito
                </p>
              </div>
            </div>
          )}
          
          <div className={`flex gap-1 ${isCollapsed ? 'flex-col' : ''}`}>
            <Button
              variant="ghost" 
              size={isCollapsed ? "icon" : "sm"}
              className="flex-1 justify-start gap-2"
            >
              <User className="h-4 w-4" />
              {!isCollapsed && <span>Perfil</span>}
            </Button>
            <Button 
              variant="ghost" 
              size={isCollapsed ? "icon" : "sm"}
              className="flex-1 justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Sair</span>}
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}