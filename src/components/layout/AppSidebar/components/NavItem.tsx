import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { NavItem as NavItemType } from '../types';

interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  isExpanded: boolean;
  onClick: (url: string) => void;
}

/**
 * Componente de item de navegação da sidebar
 */
export function NavItem({ item, isActive, isExpanded, onClick }: NavItemProps) {
  const { title, url, icon: Icon, description } = item;
  
  const content = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", isExpanded ? "mr-3" : "mx-auto")} />
      {isExpanded && <span>{title}</span>}
    </motion.div>
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(url);
  };

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to={url} onClick={handleClick} className="w-full">
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
