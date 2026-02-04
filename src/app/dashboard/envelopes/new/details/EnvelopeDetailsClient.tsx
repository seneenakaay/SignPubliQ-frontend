'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Upload, FileText } from 'lucide-react';
import { saveDocuments } from '@/utils/documentStorage';

const MAX_FILE_MB = 25;
const ACCEPTED_EXTS = ['pdf', 'png', 'jpg', 'jpeg'];
const ACCEPTED_MIME = ['application/pdf', 'image/png', 'image/jpeg'];

type UploadItem = {
  file: File;
  dataUrl?: string;
};

export default function EnvelopeDetailsClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [envelopeName, setEnvelopeName] = useState('');
  const [message, setMessage] = useState('');
  const [isSavingDocs, setIsSavingDocs] = useState(false);

  const totalBytes = useMemo(() => files.reduce((sum, item) => sum + item.file.size, 0), [files]);
  const totalMb = totalBytes / 1024 / 1024;

  const getExtension = (file: File) => {
    const parts = file.name.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  };

  const isAccepted = (file: File) => {
    const ext = getExtension(file);
    return ACCEPTED_MIME.includes(file.type) || ACCEPTED_EXTS.includes(ext);
  };

  const saveFilesToStorage = async (items: UploadItem[]) => {
    setIsSavingDocs(true);
    try {
      const metaList = await saveDocuments(items.map((item) => item.file));
      localStorage.setItem('uploadedDocumentsMeta', JSON.stringify(metaList));
    } catch (saveError) {
      setError('Failed to process documents. Please try again.');
    } finally {
      setIsSavingDocs(false);
    }
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming || incoming.length === 0) return;
    setError('');

    const incomingItems: UploadItem[] = [];
    const rejected: string[] = [];

    Array.from(incoming).forEach((file) => {
      if (!isAccepted(file)) {
        rejected.push(`${file.name} (unsupported format)`);
        return;
      }

      const fileMb = file.size / 1024 / 1024;
      if (fileMb > MAX_FILE_MB) {
        rejected.push(`${file.name} (${fileMb.toFixed(2)} MB exceeds ${MAX_FILE_MB} MB)`);
        return;
      }

      incomingItems.push({ file });
    });

    if (rejected.length > 0) {
      setError(`Some files were not added: ${rejected.join(', ')}`);
    }

    const nextItems = [...files, ...incomingItems];
    setFiles(nextItems);

    if (nextItems.length > 0) {
      void saveFilesToStorage(nextItems);
    }
  };

  const onPickFiles = () => inputRef.current?.click();

  const canContinue = envelopeName.trim().length > 0 && files.length > 0 && !isSavingDocs;

  const handleContinue = () => {
    localStorage.setItem('envelopeName', envelopeName.trim());
    localStorage.setItem('envelopeMessage', message.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-2xl font-semibold">New Envelope</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Upload documents and add envelope details before sending.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upload Documents</h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  PDF, PNG, JPG (max {MAX_FILE_MB} MB)
                </span>
              </div>

              <div
                className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center transition ${
                  dragOver ? 'border-[#2d7bc9] bg-[#eff6ff]' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragOver(false);
                  handleFiles(event.dataTransfer.files);
                }}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
                  <Upload className="w-5 h-5 text-[#2d7bc9]" />
                </div>
                <p className="mt-3 text-sm font-medium">Drag & drop your documents here</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">PDF, PNG, JPG</p>
                <button
                  type="button"
                  onClick={onPickFiles}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2d7bc9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563a0]"
                >
                  <FileText className="w-4 h-4" />
                  Choose file
                </button>
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                  multiple
                  onChange={(event) => handleFiles(event.target.files)}
                />
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {isSavingDocs && (
                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                  Processing documents... Please wait before continuing.
                </div>
              )}

              {files.length > 0 && (
                <div className="mt-6 space-y-2">
                  {files.map((item) => (
                    <div
                      key={`${item.file.name}-${item.file.lastModified}`}
                      className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3"
                    >
                      <div>
                        <div className="text-sm font-medium">{item.file.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {(item.file.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#2d7bc9]">Ready</span>
                    </div>
                  ))}
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Total size: {totalMb.toFixed(2)} MB
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold">Envelope Details</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Envelope Name or Subject
                  </label>
                  <input
                    type="text"
                    value={envelopeName}
                    onChange={(event) => setEnvelopeName(event.target.value)}
                    placeholder="e.g. Vendor Agreement - Q1 2026"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Message to all recipients
                  </label>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Add a message that all recipients will see..."
                    rows={5}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 h-fit">
            <h3 className="text-sm font-semibold">Next Steps</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#2d7bc9]" />
                Add recipients and assign roles.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-300" />
                Place signature and date fields for each signer.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-slate-300" />
                Review and send your envelope.
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-2">
              <Link
                href="/dashboard/envelopes/new/recipients"
                onClick={handleContinue}
                className={`rounded-lg px-4 py-2 text-center text-sm font-semibold ${
                  canContinue
                    ? 'bg-[#2d7bc9] text-white hover:bg-[#2563a0]'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed pointer-events-none'
                }`}
              >
                Continue to Recipients
              </Link>
              <Link href="/dashboard" className="text-center text-sm text-slate-500 hover:text-[#2d7bc9]">
                Cancel and return to dashboard
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
