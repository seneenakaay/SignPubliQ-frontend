'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, FileText, Search, Filter, MoreVertical, Eye, Download, Trash2, Users } from 'lucide-react';

type EnvelopeStatus = 'Draft' | 'Sent' | 'In Progress' | 'Completed' | 'Declined' | 'Expired';

type Envelope = {
  id: string;
  documentName: string;
  sharedWith: string[];
  createdOn: string;
  updatedOn: string;
  owner: string;
  status: EnvelopeStatus;
};

const mockEnvelopes: Envelope[] = [
  {
    id: '1',
    documentName: 'Employment Contract - John Doe',
    sharedWith: ['john.doe@example.com', 'hr@company.com'],
    createdOn: '2026-01-28',
    updatedOn: '2026-01-30',
    owner: 'You',
    status: 'In Progress',
  },
  {
    id: '2',
    documentName: 'NDA Agreement',
    sharedWith: ['partner@vendor.com'],
    createdOn: '2026-01-25',
    updatedOn: '2026-01-29',
    owner: 'You',
    status: 'Completed',
  },
  {
    id: '3',
    documentName: 'Vendor Agreement 2026',
    sharedWith: ['legal@vendor.com', 'cfo@company.com'],
    createdOn: '2026-01-20',
    updatedOn: '2026-01-28',
    owner: 'You',
    status: 'Sent',
  },
];

const statusColors: Record<EnvelopeStatus, string> = {
  Draft: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  Sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'In Progress': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  Declined: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Expired: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

export default function ManageClient() {
  const [envelopes, setEnvelopes] = useState<Envelope[]>(mockEnvelopes);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnvelopeStatus | 'All'>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Check if there's a newly sent envelope from localStorage
    const newEnvelopeData = localStorage.getItem('lastSentEnvelope');
    if (newEnvelopeData) {
      const newEnvelope = JSON.parse(newEnvelopeData);
      setEnvelopes((prev) => [newEnvelope, ...prev]);
      localStorage.removeItem('lastSentEnvelope');
    }
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredEnvelopes = envelopes.filter((envelope) => {
    const matchesSearch =
      envelope.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      envelope.sharedWith.some((email) => email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || envelope.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: envelopes.length,
    Sent: envelopes.filter((e) => e.status === 'Sent').length,
    'In Progress': envelopes.filter((e) => e.status === 'In Progress').length,
    Completed: envelopes.filter((e) => e.status === 'Completed').length,
    Draft: envelopes.filter((e) => e.status === 'Draft').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold">Manage Envelopes</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Track and manage all your document envelopes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                href="/dashboard/envelopes/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#2d7bc9] rounded-lg hover:bg-[#2563a0] transition-colors"
              >
                <FileText className="w-4 h-4" />
                New Envelope
              </Link>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto">
            {(['All', 'Sent', 'In Progress', 'Completed', 'Draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-[#2d7bc9] text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {status} ({statusCounts[status as keyof typeof statusCounts] || 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by document name or recipient email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7bc9] focus:border-transparent"
            />
          </div>
        </div>

        {/* Envelopes Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Document Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Shared With
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Created On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Updated On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredEnvelopes.length > 0 ? (
                  filteredEnvelopes.map((envelope) => (
                    <tr
                      key={envelope.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#eff6ff] dark:bg-[#2d7bc9]/20 rounded flex items-center justify-center">
                            <FileText className="w-4 h-4 text-[#2d7bc9]" />
                          </div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {envelope.documentName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {envelope.sharedWith.length} recipient{envelope.sharedWith.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {envelope.sharedWith[0]}
                          {envelope.sharedWith.length > 1 && `, +${envelope.sharedWith.length - 1} more`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {new Date(envelope.createdOn).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {new Date(envelope.updatedOn).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {envelope.owner}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[envelope.status]
                          }`}
                        >
                          {envelope.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 text-slate-400 hover:text-[#2d7bc9] transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-[#2d7bc9] transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No envelopes found
                        </p>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="text-sm text-[#2d7bc9] hover:underline"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-6 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <p>
            Showing {filteredEnvelopes.length} of {envelopes.length} envelope{envelopes.length !== 1 ? 's' : ''}
          </p>
        </div>
      </main>
    </div>
  );
}
