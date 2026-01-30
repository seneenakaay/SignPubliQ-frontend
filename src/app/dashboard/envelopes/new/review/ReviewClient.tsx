'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, Mail, Users, FileText, Send } from 'lucide-react';

type Recipient = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  designation: string;
  role: 'Signer' | 'CC' | 'Viewer';
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

  useEffect(() => {
    // Retrieve data from localStorage
    const storedRecipients = localStorage.getItem('envelopeRecipients');
    const storedFields = localStorage.getItem('signatureFields');
    const storedDoc = localStorage.getItem('uploadedDocument');

    if (storedRecipients) setRecipients(JSON.parse(storedRecipients));
    if (storedFields) setSignatureFields(JSON.parse(storedFields));
    if (storedDoc) setDocumentUrl(storedDoc);
  }, []);

  const handleSendEnvelope = async () => {
    setIsSending(true);
    
    // Simulate API call to send envelope
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setSendSuccess(true);
      
      // Create envelope record for manage page
      const newEnvelope = {
        id: `env-${Date.now()}`,
        documentName: 'New Document Envelope',
        sharedWith: recipients.map(r => r.email),
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
        owner: 'You',
        status: 'Sent' as const,
      };
      
      localStorage.setItem('lastSentEnvelope', JSON.stringify(newEnvelope));
      
      // Clear envelope data after successful send
      localStorage.removeItem('envelopeRecipients');
      localStorage.removeItem('signatureFields');
      localStorage.removeItem('uploadedDocument');
      
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
  const viewers = recipients.filter((r) => r.role === 'Viewer');

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
                              <p className="font-medium text-sm">
                                {recipient.firstName} {recipient.lastName}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{recipient.email}</p>
                              {recipient.designation && (
                                <p className="text-xs text-slate-500 dark:text-slate-500">{recipient.designation}</p>
                              )}
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
                              <p className="font-medium text-sm">
                                {recipient.firstName} {recipient.lastName}
                              </p>
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

                  {/* Viewers */}
                  {viewers.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                        Viewers ({viewers.length})
                      </h3>
                      <div className="space-y-2">
                        {viewers.map((recipient) => (
                          <div
                            key={recipient.id}
                            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {recipient.firstName} {recipient.lastName}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{recipient.email}</p>
                            </div>
                            <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                              Viewer
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
                    {viewers.length > 0 && (
                      <p>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{viewers.length}</span> viewer{viewers.length !== 1 ? 's' : ''}
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
