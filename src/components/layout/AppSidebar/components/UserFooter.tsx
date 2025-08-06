import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { User } from '@supabase/supabase-js';

interface UserFooterProps {
  isExpanded: boolean;
  user: User | null;
  handleLogout: () => void;
  handleLinkClick: (url: string) => void;
  onToggleExpand?: () => void;
}

/**
 * Componente de rodapé do usuário na sidebar
 */
export function UserFooter({ 
  isExpanded, 
  user, 
  handleLogout, 
  handleLinkClick,
  onToggleExpand
}: UserFooterProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const userEmail = user?.email || '';

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  // Render compacto (sidebar recolhida)
  if (!isExpanded) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar 
              className={cn(
                "h-10 w-10 ring-2 ring-primary/20 cursor-pointer transition-all",
                isHovered ? "ring-primary/40" : ""
              )}
              onClick={onToggleExpand}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="text-sm font-medium bg-primary/10">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            <div className="text-center">
              <p className="font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="flex flex-col space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={handleProfileClick}
              >
                <UserIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Perfil
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              Sair
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  // Render expandido
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="expanded"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-3"
      >
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-accent/30">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-sm font-medium bg-primary/10">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {userName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleProfileClick}
          >
            <UserIcon className="h-4 w-4 mr-2" />
            Perfil
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
