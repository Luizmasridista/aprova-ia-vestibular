import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { motion } from 'framer-motion';
import { AppSidebar } from "@/components/layout/AppSidebar";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { UserProfile } from "@/components/auth/UserProfile";

export function Layout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detectar hover no sidebar
  useEffect(() => {
    const sidebar = document.querySelector('[data-sidebar]');
    if (!sidebar || isMobile) return;

    const handleMouseEnter = () => setSidebarExpanded(true);
    const handleMouseLeave = () => setSidebarExpanded(false);

    sidebar.addEventListener('mouseenter', handleMouseEnter);
    sidebar.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      sidebar.removeEventListener('mouseenter', handleMouseEnter);
      sidebar.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      
      {/* Conteúdo principal com ajuste responsivo */}
      <motion.div
        style={{ marginLeft: isMobile ? 0 : 'var(--sidebar-width, 96px)' }}
        className="flex flex-col min-h-screen transition-[margin] duration-300"
      >
        {/* Top Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-16 flex items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40"
        >
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex items-center gap-4"
          >
            {/* Espaço para logo ou título */}
          </motion.div>
          
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="relative hover:bg-accent transition-all duration-200">
                <Search className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon" className="relative hover:bg-accent transition-all duration-200">
                <Bell className="h-4 w-4" />
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"
                />
              </Button>
            </motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <UserProfile />
            </motion.div>
          </motion.div>
        </motion.header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </motion.div>
    </div>
  )
}