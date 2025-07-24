import { ReactNode } from 'react';
import { User } from '@supabase/supabase-js';

export interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  priority: number;
}

export interface QuickAction {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
  color: string;
  description: string;
}

export interface UserStats {
  loading: boolean;
  overallProgress: number;
  completedEvents: number;
  monthlyGoalCurrent: number;
  monthlyGoalTarget: number;
  todayActivities: number;
}

export interface SidebarSectionProps {
  isExpanded: boolean;
  children: ReactNode;
  title?: string;
}

export interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  isExpanded: boolean;
  onClick: (url: string) => void;
}

export interface QuickActionItemProps {
  action: QuickAction;
  isExpanded: boolean;
  onClick: (url: string) => void;
}

export interface UserStatsSectionProps {
  userStats: UserStats;
}

export interface UserFooterProps {
  isExpanded: boolean;
  user: User | null;
  handleLogout: () => void;
  handleLinkClick: (url: string) => void;
  onToggleExpand?: () => void;
}

export interface AppSidebarProps {
  className?: string;
}
