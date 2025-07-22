import { Brain, Calendar, FileText, BookOpen, Home, Settings, LogOut, TrendingUp, Target, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useUserStats } from "@/hooks/useUserStats"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: Home
  },
  { 
    title: "Grade de Estudos", 
    url: "/study-plan", 
    icon: Brain
  },
  { 
    title: "Calendário", 
    url: "/calendario", 
    icon: Calendar
  },
  { 
    title: "Simulados", 
    url: "/simulados", 
    icon: FileText
  },
  { 
    title: "Questões", 
    url: "/questoes", 
    icon: BookOpen
  },
]

export function AppSidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const userStats = useUserStats()

  // Manter sempre colapsado, expandir apenas no hover (desktop)
  const shouldShowExpanded = isExpanded || (isHovered && window.innerWidth >= 768)

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsExpanded(false)
      }
      // Não expandir automaticamente no desktop - manter colapsado
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 h-full bg-background/95 backdrop-blur-sm border-r border-border/10",
        "flex flex-col z-50 sidebar-transition",
        shouldShowExpanded ? "w-[280px]" : "w-[70px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-center h-16 px-2 border-b border-border/10">
        <Link to="/" className="flex items-center justify-center">
          <motion.img
            src={shouldShowExpanded ? "/LOGO-COM NOME-APROVA.AE.png" : "/Logo.AAPROVE.AE.png"}
            alt="APROVA.AE"
            className={cn(
              "transition-all duration-300 object-contain",
              shouldShowExpanded ? "h-10" : "h-8 rounded-full"
            )}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-visible py-2 px-1.5 space-y-0.5 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
        {navigationItems.map((item, index) => {
          const Icon = item.icon
          const active = location.pathname === item.url

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.02 * index,
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              className="relative"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-10 px-2 transition-all duration-150 group relative overflow-visible rounded-lg",
                      active
                        ? "text-foreground bg-accent/10"
                        : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                    )}
                    onClick={() => navigate(item.url)}
                  >
                    <div className="p-1 rounded-md transition-all">
                      <Icon className={cn(
                        "h-[18px] w-[18px] transition-transform",
                        active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )} />
                    </div>

                    <AnimatePresence mode="wait">
                      {shouldShowExpanded ? (
                        <motion.span
                          key="expanded"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.15 }}
                          className="sidebar-text text-sm font-normal ml-2"
                        >
                          {item.title}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </Button>
                </TooltipTrigger>
                {!shouldShowExpanded && (
                  <TooltipContent side="right" sideOffset={8} className="text-xs">
                    {item.title}
                  </TooltipContent>
                )}
              </Tooltip>
            </motion.div>
          )
        })}
      </nav>

      {/* Statistics Cards - Only when expanded */}
      <AnimatePresence>
        {shouldShowExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="px-2 py-3 space-y-2 border-t border-border/10 overflow-visible"
          >
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
              Estatísticas
            </h3>
            
            {userStats.loading ? (
              // Loading skeleton
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {/* Overall Progress */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-3 border border-primary/10 hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-primary/20">
                        <TrendingUp className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-xs font-medium text-foreground">Progresso Geral</span>
                    </div>
                    <span className="text-xs font-bold text-primary">{userStats.overallProgress}%</span>
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-1.5">
                    <motion.div 
                      className="bg-primary h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(userStats.overallProgress, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </div>

                {/* Monthly Goal */}
                <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-3 border border-accent/10 hover:border-accent/20 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-accent/20">
                        <Target className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-xs font-medium text-foreground">Meta Mensal</span>
                    </div>
                    <span className="text-xs font-bold text-accent">
                      {userStats.monthlyGoalCurrent}/{userStats.monthlyGoalTarget}
                    </span>
                  </div>
                  <div className="w-full bg-accent/10 rounded-full h-1.5">
                    <motion.div 
                      className="bg-accent h-1.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min((userStats.monthlyGoalCurrent / userStats.monthlyGoalTarget) * 100, 100)}%` 
                      }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    />
                  </div>
                </div>

                {/* Today's Activities */}
                <div className="bg-gradient-to-r from-green-500/10 to-green-400/5 rounded-lg p-3 border border-green-500/10 hover:border-green-500/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-green-500/20">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-xs font-medium text-foreground">Atividades Hoje</span>
                    </div>
                    <span className="text-xs font-bold text-green-600">
                      {userStats.todayActivities}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="border-t border-border/10 p-2 mt-auto bg-background/50">
        {shouldShowExpanded ? (
          // Expandido: Informações completas do usuário + botões
          <>
            {/* User Info */}
            <div className="flex items-center space-x-2 mb-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-xs">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 flex-1"
              >
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-center text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => navigate('/perfil')}
                  >
                    <Settings className="h-4 w-4" />
                    <span className="ml-2 text-xs">Perfil</span>
                  </Button>
                </TooltipTrigger>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-center text-muted-foreground hover:text-destructive transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="ml-2 text-xs">Sair</span>
                  </Button>
                </TooltipTrigger>
              </Tooltip>
            </div>
          </>
        ) : (
          // Colapsado: Apenas preview do usuário (avatar)
          <div className="flex flex-col items-center space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-pointer">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="text-sm font-medium">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8} className="text-xs">
                <div className="text-center">
                  <p className="font-medium">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}
                  </p>
                  <p className="text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
            
            {/* Botões de ação compactos */}
            <div className="flex flex-col space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => navigate('/perfil')}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} className="text-xs">
                  Perfil
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8} className="text-xs">
                  Sair
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}
        
        {/* Toggle button for mobile */}
        <div className="mt-2 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 md:hidden"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
