'use client';

import Link from 'next/link';
import { Home, UserPlus, Mail, FileText, Layers, ShieldCheck, User, Settings } from 'lucide-react';

export default function Sidebar() {
  const items = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/add-user', label: 'Add User', icon: UserPlus },
    { href: '/dashboard/envelopes', label: 'My Envelopes', icon: Mail },
    { href: '/dashboard/templates', label: 'Templates', icon: FileText },
    { href: '/dashboard/manage', label: 'Manage', icon: Layers },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen">
      <div className="px-6 py-6">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Menu</div>
        <nav className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon as any;
            const isDashboard = it.label === 'Dashboard';
            return (
              <Link
                key={it.label}
                href={it.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${isDashboard ? 'bg-[#eaf6ff] text-[#3e95e5]' : 'text-slate-700 dark:text-slate-200'} hover:bg-[#e8f6ff] dark:hover:bg-slate-800`}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{it.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
