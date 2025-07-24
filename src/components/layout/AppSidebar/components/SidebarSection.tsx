import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { SidebarSectionProps } from '../types';

/**
 * Componente para agrupar seções da sidebar com título animado
 */
export function SidebarSection({ isExpanded, children, title }: SidebarSectionProps) {
  return (
    <div className="px-3 py-2">
      {isExpanded && title && (
        <motion.h3 
          className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
      )}
      <div className={cn("space-y-1", !isExpanded && 'flex flex-col items-center')}>
        {children}
      </div>
    </div>
  );
}
