'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Users,
  BookOpen,
  Settings,
  Bell,
  User,
  LogOut,
  Home,
  Plus,
  Menu,
  ChevronLeft,
  ChevronRight,
  Search,
  Activity,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface AdminLayoutProps {
  children: React.ReactNode
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: number
}

// Navigation items
const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Termine',
    href: '/admin/appointments',
    icon: Calendar,
    badge: 3,
  },
  {
    title: 'Buchungen',
    href: '/admin/bookings',
    icon: BookOpen,
    badge: 12,
  },
  {
    title: 'Nutzer',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Einstellungen',
    href: '/admin/settings',
    icon: Settings,
  },
]

// Sidebar Component
function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'bg-background relative flex h-full flex-col border-r transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center border-b px-4">
        {!collapsed && <div className="font-semibold">Termin App</div>}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn('h-8 w-8 p-0', collapsed ? 'mx-auto' : 'ml-auto')}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn('w-full justify-start', collapsed && 'px-2')}
                size={collapsed ? 'sm' : 'default'}
              >
                <Icon className={cn('h-4 w-4', !collapsed && 'mr-2')} />
                {!collapsed && (
                  <>
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Quick Actions */}
      {!collapsed && (
        <>
          <Separator />
          <div className="p-4">
            <h4 className="mb-2 text-sm font-medium">Schnellaktionen</h4>
            <Button
              variant="outline"
              className="w-full justify-start"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Neuer Termin
            </Button>
          </div>
        </>
      )}

      {/* User Info at bottom */}
      <div className="border-t p-4">
        {collapsed ? (
          <Button variant="ghost" size="sm" className="w-full p-2">
            <User className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-muted-foreground truncate text-xs">
                admin@termin-app.com
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Header Component
function Header({
  sidebarCollapsed,
  onMenuClick,
}: {
  sidebarCollapsed: boolean
  onMenuClick: () => void
}) {
  const pathname = usePathname()

  // Get page title from pathname
  const getPageTitle = () => {
    switch (pathname) {
      case '/admin':
        return 'Dashboard'
      case '/admin/appointments':
        return 'Termine'
      case '/admin/bookings':
        return 'Buchungen'
      case '/admin/users':
        return 'Nutzer'
      case '/admin/settings':
        return 'Einstellungen'
      default:
        return 'Admin'
    }
  }

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="flex h-14 items-center px-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="mr-2 md:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Page Title */}
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>

        <div className="ml-auto flex items-center space-x-2">
          {/* Search */}
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>

          {/* Activity */}
          <Button variant="ghost" size="sm">
            <Activity className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-8 w-8 rounded-full"
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    System Administrator
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    admin@termin-app.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Einstellungen</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Abmelden</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

// Mobile Sidebar Overlay
function MobileSidebar({
  open,
  onClose,
  collapsed,
  onToggle,
}: {
  open: boolean
  onClose: () => void
  collapsed: boolean
  onToggle: () => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="bg-background/80 fixed inset-0 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed top-0 left-0 h-full">
        <Sidebar collapsed={false} onToggle={onToggle} />
      </div>
    </div>
  )
}

// Main Layout Component
export function AdminLayout({ children, className }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="bg-background flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onMenuClick={toggleMobileMenu}
        />
        <main className={cn('flex-1 overflow-y-auto p-6', className)}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
