'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, UserPlus } from 'lucide-react';

type Recipient = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  designation: string;
  role: 'Signer' | 'CC' | 'Viewer';
  signingOrder: number;
};

const createRecipient = (id: number): Recipient => ({
  id: `recipient-${id}`,
  email: '',
  firstName: '',
  lastName: '',
  designation: '',
  role: 'Signer',
  signingOrder: id,
});

export default function RecipientsClient() {
  const [recipients, setRecipients] = useState<Recipient[]>([createRecipient(1)]);

  const addRecipient = () => {
    setRecipients((prev) => [...prev, createRecipient(prev.length + 1)]);
  };

  const removeRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((recipient) => recipient.id !== id));
  };

  const updateRecipient = (id: string, field: keyof Recipient, value: string | number) => {
    setRecipients((prev) =>
      prev.map((recipient) => (recipient.id === id ? { ...recipient, [field]: value } : recipient))
    );
  };

  const canContinue = recipients.every((recipient) =>
    recipient.email && recipient.firstName && recipient.lastName && recipient.role
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-2xl font-semibold">Add Recipients & Roles</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Add the people who need to sign or receive a copy. You can assign roles and signing order.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#2d7bc9]" />
              <h2 className="text-lg font-semibold">Recipients</h2>
            </div>
            <button
              type="button"
              onClick={addRecipient}
              className="inline-flex items-center gap-2 rounded-lg border border-[#2d7bc9] px-3 py-2 text-sm font-semibold text-[#2d7bc9] hover:bg-[#eff6ff]"
            >
              <Plus className="w-4 h-4" />
              Add recipient
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {recipients.map((recipient, index) => (
              <div key={recipient.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-semibold">Recipient {index + 1}</div>
                  {recipients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRecipient(recipient.id)}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={recipient.email}
                      onChange={(event) => updateRecipient(recipient.id, 'email', event.target.value)}
                      placeholder="name@example.com"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role</label>
                    <select
                      value={recipient.role}
                      onChange={(event) => updateRecipient(recipient.id, 'role', event.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
                    >
                      <option value="Signer">Signer</option>
                      <option value="CC">CC</option>
                      <option value="Viewer">Viewer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First name</label>
                    <input
                      type="text"
                      value={recipient.firstName}
                      onChange={(event) => updateRecipient(recipient.id, 'firstName', event.target.value)}
                      placeholder="Enter your first name"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last name</label>
                    <input
                      type="text"
                      value={recipient.lastName}
                      onChange={(event) => updateRecipient(recipient.id, 'lastName', event.target.value)}
                      placeholder="Enter your last name"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Designation</label>
                    <input
                      type="text"
                      value={recipient.designation}
                      onChange={(event) => updateRecipient(recipient.id, 'designation', event.target.value)}
                      placeholder="Legal Counsel"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Signing order</label>
                    <input
                      type="number"
                      min={1}
                      value={recipient.signingOrder}
                      onChange={(event) => updateRecipient(recipient.id, 'signingOrder', Number(event.target.value))}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${canContinue ? 'bg-[#2d7bc9] text-white hover:bg-[#2563a0]' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
              disabled={!canContinue}
            >
              Next Step
            </button>
            <Link href="/dashboard/envelopes/new" className="text-sm text-slate-500 hover:text-[#2d7bc9]">
              Back to upload
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
