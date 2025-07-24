import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AppSidebar } from './AppSidebar/AppSidebar'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarExpanded(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Detectar hover no sidebar
  useEffect(() => {
    const sidebar = document.querySelector('[data-sidebar]')
    if (!sidebar || isMobile) return

    const handleMouseEnter = () => setSidebarExpanded(true)
    const handleMouseLeave = () => setSidebarExpanded(false)

    sidebar.addEventListener('mouseenter', handleMouseEnter)
    sidebar.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      sidebar.removeEventListener('mouseenter', handleMouseEnter)
      sidebar.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isMobile])

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      
      {/* Conteúdo principal com ajuste responsivo */}
      <motion.main
        initial={false}
        animate={{
          marginLeft: isMobile ? 0 : (sidebarExpanded ? 320 : 72)
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={cn(
          "min-h-screen transition-all duration-300",
          className
        )}
      >
        {children}
      </motion.main>
    </div>
  )
}
