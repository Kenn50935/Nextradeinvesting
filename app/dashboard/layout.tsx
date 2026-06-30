'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard, Wallet, TrendingUp, Users, History, Ticket, Settings,
  LogOut, Menu, X, Bell, ChevronDown, Shield, BarChart3,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const navItems = [
  { href: '/dashboard/overview', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/deposit', label: 'Deposit', icon: Wallet },
  { href: '/dashboard/invest', label: 'Invest', icon: TrendingUp },
  { href: '/dashboard/withdraw', label: 'Withdraw', icon: Wallet },
  { href: '/dashboard/referrals', label: 'Referrals', icon: Users },
  { href: '/dashboard/history', label: 'History', icon: History },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (!loading && profile?.is_blocked) router.push('/blocked');
  }, [user, loading, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
            <BarChart3 className="w-7 h-7 text-primary" />
          </div>
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><BarChart3 className="w-6 h-6 text-primary-foreground" /></div>
              <span className="text-xl font-bold text-foreground">Nextradeinvest</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href === '/dashboard/overview' && pathname === '/dashboard');
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={isActive ? 'sidebar-link active' : 'sidebar-link'}>
                  <item.icon className="w-5 h-5" />{item.label}
                </Link>
              );
            })}
            {profile.is_admin && (
              <>
                <div className="pt-4 pb-2"><p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin</p></div>
                <Link href="/admin" onClick={() => setSidebarOpen(false)} className="sidebar-link"><Shield className="w-5 h-5" />Admin Panel</Link>
              </>
            )}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                {profile.full_name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{profile.full_name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"><Menu className="w-6 h-6" /></button>
            <div className="flex-1 lg:flex-none" />
            <div className="flex items-center gap-4">
              <div className="hidden sm:block px-4 py-2 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-sm font-semibold text-foreground">${profile.wallet_balance.toFixed(2)}</p>
              </div>
              <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                <Bell className="w-5 h-5" /><span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
              </button>
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
                    {profile.full_name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                </button>
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl border border-border shadow-lg z-50 py-2">
                      <Link href="/dashboard/settings" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"><Settings className="w-4 h-4" />Settings</Link>
                      <button onClick={() => { setShowUserMenu(false); signOut(); }} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-destructive hover:bg-secondary/50 transition-colors"><LogOut className="w-4 h-4" />Sign Out</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}