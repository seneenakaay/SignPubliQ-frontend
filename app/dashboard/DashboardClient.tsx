'use client';

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardClient({ username = 'Jane Admin' }: { username?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((s) => !s);

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

  return (
    <div className="flex">
      {/* Mobile overlay drawer (shown only on small screens) */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} aria-hidden={!sidebarOpen}>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/40" onClick={toggleSidebar} />

        {/* Drawer */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} role="dialog" aria-modal="true">
          <div className="p-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">Quick Actions</div>
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
        <Header username={username} onToggleSidebar={toggleSidebar} />

        <main className="p-6">
          {/* Top banner */}
          <div className="mb-6">
            <div className="rounded-lg overflow-hidden shadow-md">
              <div className="bg-gradient-to-r from-[#3e95e5] to-[#2d7bc9] text-white py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <h1 className="text-xl md:text-2xl font-semibold">Welcome back, Jane</h1>
                    <p className="text-sm opacity-90 mt-1">Manage your documents, envelopes and templates</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="bg-white/10 text-white border border-white/30 px-3 py-2 rounded-md text-sm">Start ▾</button>
                    <button className="bg-white/10 text-white border border-white/30 px-3 py-2 rounded-md text-sm">Create an Envelope Template</button>
                    <button className="bg-white/10 text-white border border-white/30 px-3 py-2 rounded-md text-sm">Sign a Document</button>
                    <button className="bg-white text-[#3e95e5] px-3 py-2 rounded-md text-sm font-semibold">Send an Envelope</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Create your proposal</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Hi Jane 👋</div>
                </div>

                <div className="mt-4 p-4 border border-dashed border-slate-200 rounded-md bg-[#f3fbff] dark:bg-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">Upload documents</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You can upload files directly or from Google Drive, OneDrive & Dropbox</p>
                    </div>
                    <button className="bg-[#3e95e5] hover:bg-[#2d7bc9] text-white px-3 py-2 rounded-md text-sm">Upload</button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-white border border-slate-100 rounded">
                    <div className="text-sm text-slate-400">Drafts</div>
                    <div className="text-xl font-semibold text-slate-900 mt-2">1</div>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded">
                    <div className="text-sm text-slate-400">To Sign</div>
                    <div className="text-xl font-semibold text-slate-900 mt-2">1</div>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded">
                    <div className="text-sm text-slate-400">Waiting for Others</div>
                    <div className="text-xl font-semibold text-slate-900 mt-2">0</div>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded">
                    <div className="text-sm text-slate-400">Total Signed</div>
                    <div className="text-xl font-semibold text-slate-900 mt-2">0</div>
                  </div>
                </div>
              </div>

              <section className="mt-6 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Overview</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Use the navigation on the left to access different areas of your account. This dashboard is a starting point for managing all documents, envelopes and templates.</p>
              </section>
            </div>

            <aside className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200">Insights</h4>
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-[#f8fbff] rounded border border-slate-100">
                  <div className="text-xs text-slate-400">Drafts</div>
                  <div className="text-lg font-semibold mt-2">1</div>
                </div>

                <div className="p-3 bg-[#f8fbff] rounded border border-slate-100">
                  <div className="text-xs text-slate-400">To Sign</div>
                  <div className="text-lg font-semibold mt-2">1</div>
                </div>

                <div className="p-3 bg-[#f8fbff] rounded border border-slate-100">
                  <div className="text-xs text-slate-400">Waiting for Others</div>
                  <div className="text-lg font-semibold mt-2">0</div>
                </div>
              </div>
            </aside>
          </div>

        </main>
      </div>
    </div>
  );
}
