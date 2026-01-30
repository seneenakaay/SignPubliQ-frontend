'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, User, Settings, HelpCircle, LogOut, ChevronDown, Menu } from 'lucide-react';
import * as AuthService from '@/services/auth.service';

export default function Header({ username = 'John Doe', onToggleSidebar }: { username?: string; onToggleSidebar?: () => void }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between py-4 px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} aria-label="Toggle sidebar" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
          <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />
        </button>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
          <Bell className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium leading-none text-white bg-red-500 rounded-full">3</span>
        </button>

        <div className="relative" ref={ref}>
          <button onClick={() => setOpen((s) => !s)} className="inline-flex items-center gap-2 px-3 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
            <User className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            <span className="text-sm text-slate-900 dark:text-white">{username}</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-20">
              <Link href="/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Settings</Link>
              <Link href="/help" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700">Help</Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
