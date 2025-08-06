import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { User } from '@supabase/supabase-js';
import { useMediaQuery } from '../../../hooks/use-media-query';
import { useUserStats } from '../../../hooks/useUserStats';
import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../../ui/button';
import { UserFooter } from './components/UserFooter';
import { SidebarSection } from './components/SidebarSection';
import { NavItem as NavItemComponent } from './components/NavItem';
import { QuickActionItem } from './components/QuickActionItem';
import { UserStatsSection } from './components/UserStatsSection';
import { NAVIGATION_ITEMS as mainItems, QUICK_ACTIONS as quickActions } from './config';
import type { NavItem } from './types';
import { QuickAction, UserStats } from './types';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import './scrollbar.css';

export interface AppSidebarProps {
  className?: string;
  defaultCollapsed?: boolean;
}

/**
 * Barra lateral principal do aplicativo com navegação, ações rápidas e informações do usuário.
 * Responsivo e colapsável para melhor experiência em diferentes tamanhos de tela.
 */
export function AppSidebar({ className, defaultCollapsed = false }: AppSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  
  // Estatísticas do usuário obtidas via hook
  const userStats = useUserStats();
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  // Efeito para lidar com responsividade
  useEffect(() => {
    // Definir largura inicial
    updateSidebarWidth(isExpanded);

    const checkMobile = () => {
      const isMobileNow = window.innerWidth < 768;
      setIsMobile(isMobileNow);
      
      // Apenas fechar automaticamente em mobile, não forçar abertura em desktop
      if (isMobileNow && isExpanded) {
        setIsExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isExpanded]);

  // Fechar menu mobile após navegação
  const handleLinkClick = (url: string) => {
    // Fechar menu em dispositivos móveis
    if (window.innerWidth < 1024) {
      setIsExpanded(false);
    }
    navigate(url);
  };

  // Alternar estado de expansão
  const updateSidebarWidth = (expanded: boolean) => {
    const width = expanded ? 320 : 96;
    document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
  };

  // Alternar estado de expansão
  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    updateSidebarWidth(newState);
  };

  // Verificar se um item de navegação está ativo
  const isItemActive = (item: NavItem): boolean => {
    if (location.pathname === item.url) {
      return true;
    }
    return location.pathname.startsWith(item.url);
  };

  // Lidar com logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      {/* Overlay para mobile quando a sidebar está expandida */}
      {isMobile && isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar principal */}
      <motion.div
        initial={false}
        animate={{
          width: isExpanded ? 320 : 96,
          x: isMobile && !isExpanded ? -96 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r border-border",
          "h-full overflow-visible",
          isMobile ? "shadow-xl" : "",
          className
        )}
      >
        {/* Botão de expansão na borda direita */}
        {!isMobile && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  "absolute -right-3 top-1/2 z-50 h-6 w-6 rounded-full p-0 shadow-lg border-2 border-background",
                  "hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                )}
                onClick={toggleSidebar}
              >
                {isExpanded ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              {isExpanded ? 'Recolher menu' : 'Expandir menu'}
            </TooltipContent>
          </Tooltip>
        )}
        <div className="flex flex-col h-full overflow-y-auto sidebar-scrollbar">
          {/* Cabeçalho com logo */}
          <div className="flex items-center justify-center h-20 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-center w-full">
              {isExpanded ? (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center justify-center w-full"
                >
                  <img 
                    src="/LOGO-NOVA-APROVA.png" 
                    alt="APROVA.AE" 
                    className="h-40 w-auto max-w-[400px] object-contain"
                    style={{ objectFit: 'contain' }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center justify-center w-full py-4"
                >
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img 
                      src="/LOGO-CURTA-APROVA.png" 
                      alt="APROVA.AE" 
                      className="w-full h-full object-contain"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Conteúdo rolável */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {/* Menu Principal */}
            <SidebarSection title="Menu Principal" isExpanded={isExpanded}>
              <div className="space-y-1">
                {mainItems.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <NavItemComponent
                    key={item.url}
                    item={item}
                    isExpanded={isExpanded}
                    isActive={isActive}
                    onClick={() => handleLinkClick(item.url)}
                  />
                );
              })}
              </div>
            </SidebarSection>

            {/* Ações Rápidas - somente quando expandido */}
            {isExpanded && (
            <SidebarSection title="Ações Rápidas" isExpanded={isExpanded}>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <QuickActionItem
                    key={action.url}
                    action={action}
                    isExpanded={isExpanded}
                    onClick={() => handleLinkClick(action.url)}
                  />
                ))}
              </div>
            </SidebarSection>
            )}
            {/* Estatísticas do Usuário - Apenas quando expandido */}
            {isExpanded && (
              <UserStatsSection userStats={userStats} isExpanded={isExpanded} />
            )}
          </div>

          {/* Rodapé com informações do usuário */}
          <div className="border-t border-border">
            <div className="p-3">
              <UserFooter
                isExpanded={isExpanded}
                user={user}
                handleLogout={handleLogout}
                handleLinkClick={() => handleLinkClick('/')}
              />
            </div>
          </div>
        </div>

        {/* Botão de menu flutuante para mobile */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
              isExpanded ? "hidden" : "block"
            )}
          >
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
