import { 
  Brain, 
  Calendar, 
  FileText, 
  BookOpen, 
  Home,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  Clock,
  Zap
} from "lucide-react"
import * as React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useUserStats } from "@/hooks/useUserStats"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const mainItems = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: Home, 
    description: "Visão geral dos seus estudos"
  },
  { 
    title: "Grade de Estudos IA", 
    url: "/study-plan", 
    icon: Brain, 
    description: "Planos personalizados com IA"
  },
  { 
    title: "Calendário", 
    url: "/calendario", 
    icon: Calendar, 
    description: "Organize suas atividades"
  },
  { 
    title: "Simulados", 
    url: "/simulados", 
    icon: FileText, 
    description: "Pratique com simulados"
  },
  { 
    title: "Banco de Questões", 
    url: "/questoes", 
    icon: BookOpen, 
    description: "Milhares de questões"
  },
]

export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const userStats = useUserStats()
  const currentPath = location.pathname

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (!isExpanded && window.innerWidth >= 768) {
      setIsExpanded(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (window.innerWidth >= 768) {
      setIsExpanded(false)
    }
  }

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  const isActive = (path: string) => currentPath === path

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleProfile = () => {
    navigate('/perfil')
  }

  const sidebarWidth = isExpanded ? 280 : 64

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isExpanded && window.innerWidth < 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={cn(
          "fixed top-0 left-0 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/60 z-50",
          "flex flex-col shadow-xl",
          isExpanded ? "shadow-2xl" : "shadow-lg"
        )}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/60 bg-white/80">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={isExpanded ? "/LOGO-COM NOME-APROVA.AE.png" : "/Logo.AAPROVE.AE.png"}
                alt="APROVA.AE" 
                className={cn(
                  "object-contain transition-all duration-300",
                  isExpanded 
                    ? "h-10 w-auto" 
                    : "h-8 w-8 rounded-lg"
                )}
              />
            </motion.div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  <span className="text-sm font-bold text-gray-900 tracking-tight">
                    APROVA.AE
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Sua aprovação é nossa meta
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100 md:hidden"
            onClick={toggleSidebar}
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                  Menu Principal
                </h2>
              </motion.div>
            )}
          </AnimatePresence>
          
          <nav className="space-y-2">
            {mainItems.map((item, index) => {
              const Icon = item.icon
              const active = isActive(item.url)
              
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-12 px-3 rounded-xl transition-all duration-200 group relative",
                      active
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm hover:bg-blue-100"
                        : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                    )}
                    onClick={() => navigate(item.url)}
                  >
                    <div className={cn(
                      "p-2 rounded-lg transition-all duration-200 mr-3",
                      active 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col items-start flex-1 min-w-0"
                        >
                          <span className="font-medium text-sm truncate">
                            {item.title}
                          </span>
                          <span className="text-xs text-gray-500 truncate">
                            {item.description}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {active && (
                      <motion.div
                        className="absolute right-2 w-1 h-6 bg-blue-500 rounded-full"
                        layoutId="activeIndicator"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Button>
                </motion.div>
              )
            })}
          </nav>
        </div>

        {/* Stats Cards */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="stats-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SidebarGroup className="py-2 sm:py-3 border-t border-border">
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 sm:mb-3">
                  Estatísticas
                </SidebarGroupLabel>
                <SidebarGroupContent className="space-y-3 sm:space-y-4">
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200/30 shadow-xs sm:rounded-xl sm:p-4"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <p className="text-xs font-medium text-green-700">Progresso Geral</p>
                      <motion.div 
                        className="p-1 bg-green-200/70 rounded-full"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <TrendingUp className="h-3 w-3 text-green-600 sm:h-4 sm:w-4" />
                      </motion.div>
                    </div>
                    <motion.p 
                      className="text-lg font-bold text-green-800 sm:text-xl"
                      key={`progress-${userStats.loading}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {userStats.loading ? "Carregando..." : `${userStats.overallProgress}%`}
                    </motion.p>
                  </motion.div>

                  <motion.div 
                    className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200/30 shadow-xs sm:rounded-xl sm:p-4"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <p className="text-xs font-medium text-blue-700">Meta Mensal</p>
                      <div className="p-1 bg-blue-200/70 rounded-full">
                        <Trophy className="h-3 w-3 text-blue-600 sm:h-4 sm:w-4" />
                      </div>
                    </div>
                    <motion.p 
                      className="text-lg font-bold text-blue-800 sm:text-xl"
                      key={`monthly-${userStats.loading}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {userStats.loading ? "Carregando..." : `${userStats.monthlyGoalCurrent}/${userStats.monthlyGoalTarget}`}
                    </motion.p>
                  </motion.div>

                  <motion.div 
                    className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200/30 shadow-xs sm:rounded-xl sm:p-4"
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <p className="text-xs font-medium text-purple-700">Atividades Hoje</p>
                      <div className="p-1 bg-purple-200/70 rounded-full">
                        <Clock className="h-3 w-3 text-purple-600 sm:h-4 sm:w-4" />
                      </div>
                    </div>
                    <motion.p 
                      className="text-lg font-bold text-purple-800 sm:text-xl"
                      key={`today-${userStats.loading}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {userStats.loading ? "Carregando..." : `${userStats.todayActivities}`}
                    </motion.p>
                  </motion.div>
                </SidebarGroupContent>
              </SidebarGroup>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              key="actions-section"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
            >
              <SidebarGroup className="py-2 sm:py-3 border-t border-border mt-2 sm:mt-3">
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 sm:mb-3">
                  Ações Rápidas
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <motion.button
                      className="h-10 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/30 rounded-lg hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30 transition-all duration-200 sm:h-12 sm:rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/study-plan')}
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs font-medium truncate px-1 sm:px-2">Nova Grade</span>
                    </motion.button>
                    <motion.button
                      className="h-10 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-green-50 to-green-100 border border-green-200/30 rounded-lg hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/30 transition-all duration-200 sm:h-12 sm:rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/calendario')}
                    >
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs font-medium truncate px-1 sm:px-2">Agendar</span>
                    </motion.button>
                    <motion.button
                      className="h-10 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200/30 rounded-lg hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/30 transition-all duration-200 sm:h-12 sm:rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/simulados')}
                    >
                      <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs font-medium truncate px-1 sm:px-2">Simulado</span>
                    </motion.button>
                    <motion.button
                      className="h-10 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/30 rounded-lg hover:bg-purple-500/10 hover:text-purple-600 hover:border-purple-500/30 transition-all duration-200 sm:h-12 sm:rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/questoes')}
                    >
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-xs font-medium truncate px-1 sm:px-2">Questões</span>
                    </motion.button>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings */}
        <SidebarGroup className="mt-auto py-2 sm:py-3">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="h-10 sm:h-12 rounded-lg sm:rounded-xl">
                  <motion.div 
                    className={`p-2 rounded-md transition-all duration-200 sm:rounded-lg bg-accent/30 text-foreground hover:bg-accent/50
                    ${isExpanded ? '' : 'mx-auto'}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span 
                        className="font-medium text-sm truncate"
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        Configurações
                      </motion.span>
                    )}
                  </AnimatePresence>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border bg-gradient-to-r from-background to-background/95 py-4 sm:py-6 px-2 sm:px-4">
        <div className="space-y-3 sm:space-y-4">
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 border border-border/30 sm:gap-4 sm:rounded-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <Avatar className="h-8 w-8 ring-2 ring-primary/20 sm:h-10 sm:w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                    {user?.email?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.user_metadata?.full_name || user?.email || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || 'Plano Gratuito'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className={`flex gap-2 ${isExpanded ? 'flex-row sm:flex-row' : 'flex-col'}`}> 
            <Button
              variant="ghost" 
              size={isExpanded ? "sm" : "icon"}
              className={`
                ${isExpanded ? 'flex-1 h-10 sm:h-11' : 'h-10 w-10 sm:h-12 sm:w-12'} 
                justify-start gap-2 sm:gap-3 rounded-lg hover:bg-accent/50 transition-all duration-200 sm:rounded-xl
              `}
              onClick={handleProfile}
            >
              <motion.div 
                className="p-1.5 rounded-md bg-accent/30 sm:rounded-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    className="font-medium text-sm truncate"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    Perfil
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            <Button 
              variant="ghost" 
              size={isExpanded ? "sm" : "icon"}
              className={`
                ${isExpanded ? 'flex-1 h-10 sm:h-11' : 'h-10 w-10 sm:h-12 sm:w-12'} 
                justify-start gap-2 sm:gap-3 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200 sm:rounded-xl
              `}
              onClick={handleLogout}
            >
              <motion.div 
                className="p-1.5 rounded-md bg-accent/30 sm:rounded-lg"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </motion.div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    className="font-medium text-sm truncate"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    Sair
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}