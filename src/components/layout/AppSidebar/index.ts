// Re-export everything from AppSidebar
export * from './AppSidebar';

// Re-export types
export type { NavItem, QuickAction, UserStats } from './types';

// Re-export configurations
export { NAVIGATION_ITEMS, QUICK_ACTIONS } from './config';

// Re-export components
export { UserFooter } from './components/UserFooter';
export { SidebarSection } from './components/SidebarSection';
export { NavItem as NavItemComponent } from './components/NavItem';
export { QuickActionItem } from './components/QuickActionItem';
export { UserStatsSection } from './components/UserStatsSection';
