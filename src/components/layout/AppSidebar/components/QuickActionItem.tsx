import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { QuickAction } from '../types';

interface QuickActionItemProps {
  action: QuickAction;
  isExpanded: boolean;
  onClick: (url: string) => void;
}

/**
 * Componente de ação rápida na sidebar
 */
export function QuickActionItem({ action, isExpanded, onClick }: QuickActionItemProps) {
  const { title, icon: Icon, url, color, description } = action;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(url);
  };

  const content = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center justify-center rounded-md p-2 text-white transition-all",
        color,
        isExpanded ? "w-full space-x-2" : "h-9 w-9"
      )}
    >
      <Icon className="h-4 w-4" />
      {isExpanded && <span className="text-sm font-medium">{title}</span>}
    </motion.div>
  );

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={url} onClick={handleClick}>
            {content}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link to={url} onClick={handleClick} className="w-full">
      {content}
    </Link>
  );
}
