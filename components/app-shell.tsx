'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import {
  LayoutDashboard, FileText, Settings, Search, User, Shield, Menu, X, ChevronDown, Upload,
} from 'lucide-react';

const ROLES = ['Finance', 'Employee', 'Auditor', 'Admin'] as const;
type Role = (typeof ROLES)[number];

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  Finance: 'Review and act on claims',
  Employee: 'View your own claims',
  Auditor: 'Read-only audit access',
  Admin: 'Full system access',
};

const NAV_ITEMS: Record<Role, { label: string; href: string; icon: React.ReactNode }[]> = {
  Admin: [
    { label: 'Verify Expense', href: '/verify', icon: <Upload className="w-4 h-4" /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'All Claims', href: '/claims', icon: <FileText className="w-4 h-4" /> },
    { label: 'Settings', href: '/admin', icon: <Settings className="w-4 h-4" /> },
    { label: 'Audit Log', href: '/auditor', icon: <Search className="w-4 h-4" /> },
  ],
  Finance: [
    { label: 'Verify Expense', href: '/verify', icon: <Upload className="w-4 h-4" /> },
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Review Claims', href: '/claims', icon: <FileText className="w-4 h-4" /> },
    { label: 'Audit Log', href: '/auditor', icon: <Search className="w-4 h-4" /> },
  ],
  Employee: [
    { label: 'Verify Expense', href: '/verify', icon: <Upload className="w-4 h-4" /> },
    { label: 'My Claims', href: '/employee', icon: <User className="w-4 h-4" /> },
  ],
  Auditor: [
    { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'All Claims', href: '/claims', icon: <FileText className="w-4 h-4" /> },
    { label: 'Audit Report', href: '/auditor', icon: <Search className="w-4 h-4" /> },
  ],
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<Role>('Finance');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  // Close mobile menu on route change
  useEffect(() => { closeMobile(); }, [pathname, closeMobile]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMobile(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileMenuOpen, closeMobile]);

  const navItems = NAV_ITEMS[role];

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-4 py-3.5 border-b border-[var(--color-border-default)]">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="Receipt Shield home">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] transition-shadow">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-[0.8125rem] text-[var(--color-text-primary)] leading-tight">Receipt Shield</div>
            <div className="text-[0.5625rem] text-[var(--color-text-muted)] tracking-widest uppercase">Evidence · Verify · Act</div>
          </div>
        </Link>
      </div>

      {/* Role Switcher — compact dropdown */}
      <div className="px-3 py-2.5 border-b border-[var(--color-border-default)]">
        <button
          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          aria-expanded={roleDropdownOpen}
        >
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium">{role}</span>
            <span className="text-[var(--color-text-muted)]">· {ROLE_DESCRIPTIONS[role]}</span>
          </span>
          <ChevronDown className={`w-3 h-3 text-[var(--color-text-muted)] transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {roleDropdownOpen && (
          <div className="mt-1 space-y-0.5 animate-in">
            {ROLES.filter((r) => r !== role).map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setRoleDropdownOpen(false); setMobileMenuOpen(false); }}
                className="w-full text-left text-xs px-2 py-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
              >
                {r} <span className="text-[var(--color-text-muted)]">· {ROLE_DESCRIPTIONS[r]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMobile}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[var(--color-border-default)]">
        <div className="text-[0.5625rem] text-[var(--color-text-muted)] leading-relaxed tracking-wide">
          <span className="font-medium text-[var(--color-text-secondary)]">{role}</span> · Demo mode · All data is synthetic
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="sidebar-desktop w-60 flex-shrink-0 border-r border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile header */}
      <div className="mobile-header fixed top-0 left-0 right-0 z-50 items-center justify-between px-4 h-12 bg-[var(--color-bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--color-border-default)]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Shield className="w-3 h-3 text-white" />
          </div>
          <span className="font-semibold text-sm text-[var(--color-text-primary)]">Receipt Shield</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
            onClick={closeMobile}
            aria-hidden="true"
            style={{ transition: 'opacity 150ms ease' }}
          />
          <aside
            className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-[var(--color-bg-secondary)] flex flex-col animate-in shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile spacer */}
        <div className="mobile-header h-12" aria-hidden="true" />
        <div className="max-w-[68rem] mx-auto px-4 sm:px-6 py-5 sm:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
