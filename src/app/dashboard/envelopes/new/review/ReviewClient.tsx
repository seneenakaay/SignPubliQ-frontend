'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Mail, Users, FileText, Send } from 'lucide-react';
import { getDocuments, clearDocuments } from '@/utils/documentStorage';

type Recipient = {
  id: string;
  email: string;
  name: string;
  role: 'Signer' | 'CC' | 'Approver';
  signingOrder: number;
};

type SignatureField = {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function ReviewClient() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [signatureFields, setSignatureFields] = useState<SignatureField[]>([]);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  
  // Reminders & Expiry settings
  const [enableReminders, setEnableReminders] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState<number>(3);
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [expiryDays, setExpiryDays] = useState<number>(30);

  useEffect(() => {
    // Retrieve data from localStorage
    const storedRecipients = localStorage.getItem('envelopeRecipients');
    const storedFields = localStorage.getItem('signatureFields');

    const loadReviewDocument = async () => {
      const storedMeta = localStorage.getItem('uploadedDocumentsMeta');
      if (storedMeta) {
        try {
          const metaList: Array<{ id: string; name: string; type: string }> = JSON.parse(storedMeta);
          if (metaList.length > 0) {
            const storedDocs = await getDocuments();
            const docMap = new Map(storedDocs.map((doc) => [doc.id, doc]));
            const firstMeta = metaList[0];
            const match = docMap.get(firstMeta.id);
            if (match) {
              setDocumentUrl(URL.createObjectURL(match.blob));
              return;
            }
          }
        } catch (error) {
          console.error('Failed to load review document:', error);
        }
      }

      const storedDocs = localStorage.getItem('uploadedDocuments');
      if (storedDocs) {
        try {
          const docs = JSON.parse(storedDocs);
          if (docs.length > 0) {
            setDocumentUrl(docs[0].dataUrl);
            return;
          }
        } catch (error) {
          console.error('Failed to parse documents:', error);
        }
      }

      const storedDoc = localStorage.getItem('uploadedDocument');
      if (storedDoc) setDocumentUrl(storedDoc);
    };

    void loadReviewDocument();

    if (storedRecipients) setRecipients(JSON.parse(storedRecipients));
    if (storedFields) setSignatureFields(JSON.parse(storedFields));
  }, []);

  const handleSendEnvelope = async () => {
    setIsSending(true);
    
    // Simulate API call to send envelope
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setSendSuccess(true);
      
      // Create envelope record for manage page with reminder and expiry settings
      const newEnvelope = {
        id: `env-${Date.now()}`,
        documentName: 'New Document Envelope',
        sharedWith: recipients.map(r => r.email),
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
        owner: 'You',
        status: 'Sent' as const,
        reminderSettings: {
          enabled: enableReminders,
          frequency: reminderFrequency,
        },
        expirySettings: {
          enabled: enableExpiry,
          days: expiryDays,
          expiresOn: enableExpiry ? new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString() : null,
        },
      };
      
      localStorage.setItem('lastSentEnvelope', JSON.stringify(newEnvelope));
      
      // Clear envelope data after successful send
      localStorage.removeItem('envelopeRecipients');
      localStorage.removeItem('signatureFields');
      localStorage.removeItem('uploadedDocument');
      localStorage.removeItem('uploadedDocuments');
      localStorage.removeItem('uploadedDocumentsMeta');
      void clearDocuments();
      
      // Redirect to manage page after 2 seconds
      setTimeout(() => {
        window.location.href = '/dashboard/envelopes/manage';
      }, 2000);
    } catch (error) {
      console.error('Error sending envelope:', error);
      setIsSending(false);
    }
  };

  const signers = recipients.filter((r) => r.role === 'Signer');
  const ccRecipients = recipients.filter((r) => r.role === 'CC');
  const approvers = recipients.filter((r) => r.role === 'Approver');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-2xl font-semibold">Review & Send Envelope</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Review all details before sending your envelope
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {sendSuccess ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-[#eff6ff] dark:bg-[#2d7bc9]/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#2d7bc9]" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Envelope Sent Successfully!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Your document has been sent to {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Review Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Document Section */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#2d7bc9]" />
                  <h2 className="text-lg font-semibold">Document</h2>
                </div>
                {documentUrl ? (
                  <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium">Document uploaded</span>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-[#2d7bc9]" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No document uploaded</p>
                  </div>
                )}
              </div>

              {/* Signature Fields Section */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-[#2d7bc9]" />
                  <h2 className="text-lg font-semibold">Signature Fields</h2>
                  <span className="ml-auto text-sm font-medium bg-[#eff6ff] dark:bg-[#2d7bc9]/20 text-[#2d7bc9] px-2 py-1 rounded">
                    {signatureFields.length} fields
                  </span>
                </div>
                {signatureFields.length > 0 ? (
                  <div className="space-y-2">
                    {signatureFields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {field.type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <span className="text-sm font-medium">{field.label}</span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-[#2d7bc9]" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No signature fields placed</p>
                  </div>
                )}
              </div>

              {/* Recipients Section */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-[#2d7bc9]" />
                  <h2 className="text-lg font-semibold">Recipients</h2>
                  <span className="ml-auto text-sm font-medium bg-[#eff6ff] dark:bg-[#2d7bc9]/20 text-[#2d7bc9] px-2 py-1 rounded">
                    {recipients.length} total
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Signers */}
                  {signers.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Signers ({signers.length})
                      </h3>
                      <div className="space-y-2">
                        {signers.map((recipient) => (
                          <div
                            key={recipient.id}
                            className="flex items-center justify-between p-3 bg-[#eff6ff] dark:bg-[#2d7bc9]/20 rounded-lg border border-[#2d7bc9]/30 dark:border-[#2d7bc9]/50"
                          >
                            <div>
                              <p className="font-medium text-sm">{recipient.name}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{recipient.email}</p>
                            </div>
                            <span className="text-xs font-semibold bg-[#2d7bc9] text-white px-2 py-1 rounded">
                              Order #{recipient.signingOrder}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CC Recipients */}
                  {ccRecipients.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        CC ({ccRecipients.length})
                      </h3>
                      <div className="space-y-2">
                        {ccRecipients.map((recipient) => (
                          <div
                            key={recipient.id}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            <div>
                              <p className="font-medium text-sm">{recipient.name}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{recipient.email}</p>
                            </div>
                            <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                              CC
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Approvers */}
                  {approvers.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Approvers ({approvers.length})
                      </h3>
                      <div className="space-y-2">
                        {approvers.map((recipient) => (
                          <div
                            key={recipient.id}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            <div>
                              <p className="font-medium text-sm">{recipient.name}</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{recipient.email}</p>
                            </div>
                            <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                              Approver
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reminders & Expiry Section */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-5 h-5 text-[#2d7bc9]" />
                  <h2 className="text-lg font-semibold">Reminders & Expiry</h2>
                </div>

                <div className="space-y-6">
                  {/* Reminders */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Automatic Reminders
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Send automatic reminders to recipients who haven't signed
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableReminders}
                          onChange={(e) => setEnableReminders(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2d7bc9]/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[#2d7bc9]"></div>
                      </label>
                    </div>

                    {enableReminders && (
                      <div className="pl-4 border-l-2 border-[#2d7bc9]">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Reminder Frequency
                        </label>
                        <select
                          value={reminderFrequency}
                          onChange={(e) => setReminderFrequency(Number(e.target.value))}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
                        >
                          <option value={1}>Every day</option>
                          <option value={2}>Every 2 days</option>
                          <option value={3}>Every 3 days</option>
                          <option value={5}>Every 5 days</option>
                          <option value={7}>Every week</option>
                        </select>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          Recipients will receive a reminder every {reminderFrequency} day{reminderFrequency !== 1 ? 's' : ''} until they sign
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Expiry */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Expiration Date
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Set when this envelope should expire if not completed
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableExpiry}
                          onChange={(e) => setEnableExpiry(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2d7bc9]/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-[#2d7bc9]"></div>
                      </label>
                    </div>

                    {enableExpiry && (
                      <div className="pl-4 border-l-2 border-amber-500">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Expires After
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            min={1}
                            max={365}
                            value={expiryDays}
                            onChange={(e) => setExpiryDays(Number(e.target.value))}
                            className="w-24 rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
                          />
                          <span className="text-sm text-slate-600 dark:text-slate-400">days</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          This envelope will expire on {new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Document</span>
                    <CheckCircle2 className={`w-4 h-4 ${documentUrl ? 'text-[#2d7bc9]' : 'text-red-600'}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Signature Fields</span>
                    <span className="text-sm font-semibold">{signatureFields.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Recipients</span>
                    <span className="text-sm font-semibold">{recipients.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Reminders</span>
                    <span className="text-sm font-semibold">{enableReminders ? `Every ${reminderFrequency}d` : 'Off'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Expiry</span>
                    <span className="text-sm font-semibold">{enableExpiry ? `${expiryDays} days` : 'None'}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4">
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <p>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{signers.length}</span> signer{signers.length !== 1 ? 's' : ''}
                    </p>
                    {ccRecipients.length > 0 && (
                      <p>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{ccRecipients.length}</span> CC recipient{ccRecipients.length !== 1 ? 's' : ''}
                      </p>
                    )}
                    {approvers.length > 0 && (
                      <p>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{approvers.length}</span> approver{approvers.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSendEnvelope}
                  disabled={isSending || !documentUrl || recipients.length === 0}
                  className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                    isSending || !documentUrl || recipients.length === 0
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400'
                      : 'bg-[#2d7bc9] text-white hover:bg-[#2563a0]'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {isSending ? 'Sending...' : 'Send Envelope'}
                </button>

                <Link
                  href="/dashboard/envelopes/new/signature-fields"
                  className="block text-center text-sm text-slate-500 hover:text-[#2d7bc9] mt-3"
                >
                  Back to Fields
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
