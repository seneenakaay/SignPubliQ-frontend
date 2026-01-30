'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from './Sidebar';
import Header from './Header';
import * as AuthService from '@/services/auth.service';
import * as DashboardService from '@/services/dashboard.service';

export default function DashboardClient({ username: initialUsername = 'User' }: { username?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  useEffect(() => {
    const userData = AuthService.getUser();
    if (userData) {
      setUser(userData);
      console.log('[Dashboard] Fetching summary for user:', userData.user_id);
      DashboardService.getSummary(userData.user_id).then(data => {
        console.log('[Dashboard] Summary response:', data);
        setStats(data);
      });
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKey);

    // Lock body scroll when overlay (mobile) drawer is open
    const updateBodyOverflow = () => {
      if (typeof window !== 'undefined' && sidebarOpen && window.innerWidth < 1024) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    updateBodyOverflow();
    window.addEventListener('resize', updateBodyOverflow);

    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', updateBodyOverflow);
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const displayName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email : initialUsername;
  const firstName = user?.first_name || displayName.split(' ')[0];

  // Compute initials: 1st letter of First Name + 1st letter of Last Name
  const getInitials = () => {
    if (!user) {
      if (initialUsername === 'User') return 'U';
      return initialUsername.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    const f = user.first_name?.[0] || '';
    const l = user.last_name?.[0] || '';
    return (f + l).toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
  };
  const initials = getInitials();

  const dueItems = [
    { id: 1, title: 'Contract - Acme Co.', assignee: 'alice@example.com', due: '2026-02-02' },
    { id: 2, title: 'NDA - Beta Partners', assignee: 'bob@example.com', due: '2026-02-06' },
    { id: 3, title: 'Agreement - Vendor X', assignee: 'carol@example.com', due: '2026-02-13' },
  ];

  const daysLeft = (d: string) => {
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const pctFor = (days: number, maxDays = 30) => Math.min(100, Math.round((days / maxDays) * 100));

  return (
    <div className="flex">
      {/* Mobile overlay drawer (shown only on small screens) */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} aria-hidden={!sidebarOpen}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/40" onClick={toggleSidebar} />

        {/* Drawer */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} role="dialog" aria-modal="true">
          <div className="p-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">Menu</div>
            <button onClick={toggleSidebar} aria-label="Close sidebar" className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">✕</button>
          </div>

          <Sidebar />
        </div>
      </div>

      {/* Persistent sidebar for large screens (pushes content when open) */}
      <div className={`${sidebarOpen ? 'block lg:block' : 'hidden lg:hidden'} lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-shrink-0`}>
        <Sidebar />
      </div>

      <div className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header username={initials} onToggleSidebar={toggleSidebar} />

        <main className="p-6">
          {/* Top banner */}
          <div className="mb-6">
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-[#3e95e5] to-[#2d7bc9] text-white py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col items-center justify-center text-center gap-4">
                  <div className="text-center">
                    <h1 className="text-xl md:text-2xl font-semibold">Welcome back, {firstName}</h1>
                    <p className="text-sm opacity-90 mt-1">Manage your documents, envelopes and templates</p>
                  </div>

                  <div className="w-full flex items-center justify-center mt-2">
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                      <Link aria-label="Upload Document" href="/dashboard/envelopes/new" className="bg-white text-[#2d7bc9] px-4 py-2 rounded-lg text-sm font-semibold shadow hover:shadow-md transition flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V8m0 0l-4 4m4-4 4 4" />
                        </svg>
                        <span>Upload Document</span>
                      </Link>

                      <button aria-label="New Envelope" className="bg-white text-[#2d7bc9] px-4 py-2 rounded-lg text-sm font-semibold shadow hover:shadow-md transition flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m0 0v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                        <span>New Envelope</span>
                      </button>

                      <button aria-label="Use Template" className="bg-white text-[#2d7bc9] px-4 py-2 rounded-lg text-sm font-semibold shadow hover:shadow-md transition flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h6l4 4v7a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h5" />
                        </svg>
                        <span>Use Template</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Insights</h3>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs font-medium text-white bg-[#2d7bc9] rounded hover:bg-[#2563a0] transition">30 days</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition">3 months</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition">6 months</button>
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition">Custom</button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="relative p-3 bg-[#f8fbff] rounded border border-slate-100 h-28 flex flex-col justify-center overflow-hidden hover:shadow-sm transition-transform transform hover:-translate-y-1">
                    <div className="absolute -top-4 -right-4 w-24 h-24 text-slate-300 opacity-10 pointer-events-none">
                      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full"><path d="M8 44c0-9 7-16 16-16s16 7 16 16" /></svg>
                    </div>
                    <div className="relative z-10">
                      <div className="text-xs text-slate-400">Drafts</div>
                      <div className="text-xs text-slate-500 mt-1">Not sent yet</div>
                      <div className="text-lg font-semibold mt-2">{stats?.drafts_count || 0}</div>
                    </div>
                  </div>

                  <div className="relative p-3 bg-[#f8fbff] rounded border border-slate-100 h-28 flex flex-col justify-center overflow-hidden hover:shadow-sm transition-transform transform hover:-translate-y-1">
                    <div className="absolute -top-4 -right-4 w-24 h-24 text-slate-300 opacity-10 pointer-events-none">
                      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full"><path d="M8 32 L32 8 L56 32" /></svg>
                    </div>
                    <div className="relative z-10">
                      <div className="text-xs text-slate-400">Sent</div>
                      <div className="text-xs text-slate-500 mt-1">Waiting for signature</div>
                      <div className="text-lg font-semibold mt-2">{stats?.sent_count || 0}</div>
                    </div>
                  </div>

                  <div className="relative p-3 bg-[#f8fbff] rounded border border-slate-100 h-28 flex flex-col justify-center overflow-hidden hover:shadow-sm transition-transform transform hover:-translate-y-1">
                    <div className="absolute -top-4 -right-4 w-24 h-24 text-slate-300 opacity-10 pointer-events-none">
                      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full"><path d="M16 32 L28 44 L48 20" /></svg>
                    </div>
                    <div className="relative z-10">
                      <div className="text-xs text-slate-400">Completed</div>
                      <div className="text-xs text-slate-500 mt-1">Signed</div>
                      <div className="text-lg font-semibold mt-2">{stats?.completed_count || 0}</div>
                    </div>
                  </div>

                  <div className="relative p-3 bg-[#f8fbff] rounded border border-slate-100 h-28 flex flex-col justify-center overflow-hidden hover:shadow-sm transition-transform transform hover:-translate-y-1">
                    <div className="absolute -top-4 -right-4 w-24 h-24 text-slate-300 opacity-10 pointer-events-none">
                      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full"><path d="M20 20 L44 44 M44 20 L20 44" stroke="currentColor" strokeWidth="4" /></svg>
                    </div>
                    <div className="relative z-10">
                      <div className="text-xs text-slate-400">Declined</div>
                      <div className="text-xs text-slate-500 mt-1">Declined by recipient</div>
                      <div className="text-lg font-semibold mt-2">{stats?.declined_count || 0}</div>
                    </div>
                  </div>

                  <div className="relative p-3 bg-[#f8fbff] rounded border border-slate-100 h-28 flex flex-col justify-center overflow-hidden hover:shadow-sm transition-transform transform hover:-translate-y-1">
                    <div className="absolute -top-4 -right-4 w-24 h-24 text-slate-300 opacity-10 pointer-events-none">
                      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full"><path d="M32 12v20l10 6" /></svg>
                    </div>
                    <div className="relative z-10">
                      <div className="text-xs text-slate-400">Expired</div>
                      <div className="text-xs text-slate-500 mt-1">Past due</div>
                      <div className="text-lg font-semibold mt-2">{stats?.expired_count || 0}</div>
                    </div>
                  </div>

                  <div className="relative p-3 bg-[#f8fbff] rounded border border-slate-100 h-28 flex flex-col justify-center overflow-hidden hover:shadow-sm transition-transform transform hover:-translate-y-1">
                    <div className="absolute -top-4 -right-4 w-24 h-24 text-slate-300 opacity-10 pointer-events-none">
                      <svg viewBox="0 0 64 64" fill="currentColor" className="w-full h-full"><path d="M12 20h40v28H12z M20 28h24" /></svg>
                    </div>
                    <div className="relative z-10">
                      <div className="text-xs text-slate-400">Total Envelope</div>
                      <div className="text-xs text-slate-500 mt-1">All envelopes</div>
                      <div className="text-lg font-semibold mt-2">{stats?.total_envelopes || 0}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 border border-dashed border-slate-200 rounded-md bg-[#f3fbff] dark:bg-slate-800">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">Quick Actions</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use the buttons above to quickly add documents, create envelopes or pick templates.</p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">Due Dates</h4>
                    <div className="text-xs text-slate-400">Upcoming expirations</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dueItems.map((item) => {
                      const days = daysLeft(item.due);
                      const pct = pctFor(days);
                      const color = days <= 3 ? 'bg-red-500' : days <= 7 ? 'bg-amber-500' : 'bg-slate-400';

                      return (
                        <div key={item.id} className="bg-white dark:bg-slate-800 rounded border border-slate-100 p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.title}</div>
                              <div className="text-xs text-slate-400 mt-1">Assigned to: {item.assignee}</div>
                            </div>

                            <div className="text-right">
                              <div className="text-sm font-semibold text-slate-900 dark:text-white">In {days} days</div>
                              <div className="text-xs text-slate-400" suppressHydrationWarning>{new Date(item.due).toLocaleDateString()}</div>
                            </div>
                          </div>

                          <div className="mt-3 h-2 rounded bg-slate-100 overflow-hidden">
                            <div className={`${color} h-full`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 text-right">
                    <button className="text-sm text-[#2d7bc9] hover:underline">View all due dates</button>
                  </div>
                </div>
              </div>

              <section className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Documents</h3>
                  <div className="text-xs text-slate-400">Quick access to latest sent or signed files</div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded p-3">
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Proposal - Acme Co.</div>
                      <div className="text-xs text-slate-400 mt-1">Sent • 2 signers</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-400">Jan 20, 2026</div>
                      <button className="text-sm text-[#2d7bc9] hover:underline">Open</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded p-3">
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Agreement - Vendor X</div>
                      <div className="text-xs text-slate-400 mt-1">Signed • 1 signer</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-400">Jan 15, 2026</div>
                      <button className="text-sm text-[#2d7bc9] hover:underline">Open</button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded p-3">
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200">NDA - Beta Partners</div>
                      <div className="text-xs text-slate-400 mt-1">Sent • 3 signers</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-slate-400">Jan 12, 2026</div>
                      <button className="text-sm text-[#2d7bc9] hover:underline">Open</button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-right">
                  <button className="text-sm text-[#2d7bc9] hover:underline">View all documents</button>
                </div>
              </section>
            </div>


          </div>

        </main>
      </div>
    </div>
  );
}
