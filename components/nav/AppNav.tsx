// File: /components/nav/AppNav.tsx
// ============================================================================
// Enhanced App Navigation Component - Blueprint Compliant
// ============================================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Search, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FolderOpen,
  FileText,
  Upload,
  Quote,
  BarChart2,
  Users,
  Brain,
  Sparkles
} from 'lucide-react';
import { ROUTES, isRouteActive } from '../../lib/routes';

/**
 * Navigation item interface
 */
interface NavItem {
  name: string;
  href: string;
  icon: typeof Home;
  badge?: number;
  children?: NavItem[];
  description?: string;
}

/**
 * Main navigation items - 根据蓝图调整
 * 注意：画布(Canvas)不是独立项，而是项目的一部分
 */
const mainNavItems: NavItem[] = [
  { 
    name: 'Dashboard', 
    href: ROUTES.DASHBOARD, 
    icon: Home,
    description: 'Project intelligence hub'
  },
  { 
    name: 'Projects', 
    href: ROUTES.PROJECTS, 
    icon: FolderOpen,
    description: 'Research workspaces'
  },
  { 
    name: 'Search', 
    href: ROUTES.SEARCH, 
    icon: Search,
    badge: 3, // Example: new search results
    description: 'Unified knowledge search'
  },
  { 
    name: 'Library', 
    href: ROUTES.LIBRARY, 
    icon: BookOpen,
    description: 'Document management',
    children: [
      { name: 'All Documents', href: ROUTES.DOCUMENTS, icon: FileText },
      { name: 'Upload', href: ROUTES.UPLOAD, icon: Upload },
      { name: 'Citations', href: ROUTES.CITATIONS, icon: Quote },
    ]
  },
  { 
    name: 'Analytics', 
    href: ROUTES.ANALYTICS, 
    icon: BarChart2,
    description: 'Research insights'
  },
  { 
    name: 'Collaborate', 
    href: ROUTES.COLLABORATE, 
    icon: Users,
    description: 'Team workspace'
  },
];

const bottomNavItems: NavItem[] = [
  { 
    name: 'AI Assistant', 
    href: '#',
    icon: Brain,
    description: 'Research AI help'
  },
  { 
    name: 'Settings', 
    href: ROUTES.SETTINGS, 
    icon: Settings,
    description: 'Preferences'
  },
];

/**
 * Enhanced App Navigation Component
 * Features:
 * - Responsive collapsible sidebar
 * - Keyboard navigation support
 * - Active route highlighting
 * - Accessibility features
 * - Smooth animations
 * - Tooltips when collapsed
 */
export function AppNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nav-collapsed');
    if (saved !== null) {
      setIsCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save collapsed state to localStorage
  const toggleCollapsed = useCallback(() => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('nav-collapsed', JSON.stringify(newState));
  }, [isCollapsed]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileOpen]);

  // Toggle expanded state for items with children
  const toggleExpanded = (itemName: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedItems(newExpanded);
  };

  // Render navigation item
  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = isRouteActive(pathname, item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.name);

    return (
      <li key={item.href} role="none" className="relative">
        <Link
          href={item.href}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpanded(item.name);
            }
          }}
          className={`
            group flex items-center px-2 py-2 text-sm font-medium rounded-md
            transition-all duration-200 relative
            ${level > 0 ? 'pl-10' : ''}
            ${isActive 
              ? 'bg-indigo-800 text-white' 
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }
            focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white
          `}
          aria-current={isActive ? 'page' : undefined}
          title={isCollapsed && level === 0 ? `${item.name} - ${item.description}` : undefined}
        >
          <item.icon
            className={`
              flex-shrink-0 h-5 w-5 transition-colors duration-200
              ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}
              ${isCollapsed && level === 0 ? 'mx-auto' : 'mr-3'}
            `}
            aria-hidden="true"
          />
          {(!isCollapsed || level > 0) && (
            <>
              <span className="flex-1">{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <ChevronRight
                  className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              )}
            </>
          )}
          {isCollapsed && level === 0 && (
            <span className="sr-only">{item.name}</span>
          )}
        </Link>
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && level === 0 && !isMobileOpen && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md 
                          opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity
                          whitespace-nowrap z-50">
            {item.name}
            {item.description && (
              <span className="block text-gray-400 text-xs mt-0.5">{item.description}</span>
            )}
          </div>
        )}
        
        {/* Render children if expanded */}
        {hasChildren && isExpanded && !isCollapsed && (
          <ul className="mt-1 space-y-1" role="list">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Navigation sidebar */}
      <nav
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col
          bg-gray-800 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:inset-0
        `}
        aria-label="Main navigation"
      >
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-400" />
              <h1 className="text-xl font-semibold text-white">
                ResearchMateAI
              </h1>
            </div>
          )}
          {isCollapsed && (
            <Sparkles className="h-6 w-6 text-indigo-400 mx-auto" />
          )}
          <button
            onClick={toggleCollapsed}
            className="hidden md:block p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ml-auto"
            aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Main navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 px-2 py-4 space-y-1">
            <ul role="list" className="space-y-1">
              {mainNavItems.map(item => renderNavItem(item))}
            </ul>
          </div>

          {/* Bottom navigation */}
          <div className="px-2 py-4 border-t border-gray-700">
            <ul role="list" className="space-y-1">
              {bottomNavItems.map(item => renderNavItem(item))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}