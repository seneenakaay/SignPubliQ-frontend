'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';

const steps = [
  'Upload Document',
  'Add Recipients & Roles',
  'Place Signature Fields',
  'Review & Send',
];

const MAX_FILE_MB = 25;
const MAX_ENVELOPE_MB = 100;
const ACCEPTED_EXTS = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
const ACCEPTED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
];

type UploadItem = {
  file: File;
  version: number;
  willConvertToPdf: boolean;
};

export default function EnvelopeCreateClient() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string>('');

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

      const ext = getExtension(file);
      const willConvertToPdf = ['png', 'jpg', 'jpeg'].includes(ext);

      incomingItems.push({
        file,
        version: 2,
        willConvertToPdf,
      });

      // Store the document URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          localStorage.setItem('uploadedDocument', e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });

    const nextItems = [...files, ...incomingItems];
    const nextTotalMb = nextItems.reduce((sum, item) => sum + item.file.size, 0) / 1024 / 1024;

    if (nextTotalMb > MAX_ENVELOPE_MB) {
      setError(`Envelope size limit exceeded (${MAX_ENVELOPE_MB} MB total). Remove a file or add smaller files.`);
      return;
    }

    if (rejected.length > 0) {
      setError(`Some files were not added: ${rejected.join(', ')}`);
    }

    setFiles(nextItems);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    handleFiles(event.dataTransfer.files);
  };

  const onPickFiles = () => inputRef.current?.click();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-2xl font-semibold">Create Envelope</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Follow the steps below to prepare and send your document.</p>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
            {steps.map((step, index) => {
              const isActive = index === 0;
              return (
                <div key={step} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${isActive ? 'border-[#2d7bc9] bg-[#eff6ff] text-[#1f5fa5]' : 'border-slate-200 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${isActive ? 'bg-[#2d7bc9] text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {index + 1}
                  </span>
                  <span className="text-xs md:text-sm font-medium">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upload Document</h2>
              {files.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Ready to continue
                </div>
              )}
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Formats: PDF, DOCX, PNG/JPG (auto-converted to PDF). Max size: {MAX_FILE_MB} MB per file, {MAX_ENVELOPE_MB} MB per envelope.
            </div>

            <div
              className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center transition ${dragOver ? 'border-[#2d7bc9] bg-[#eff6ff]' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900'}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
                <Upload className="w-5 h-5 text-[#2d7bc9]" />
              </div>
              <p className="mt-3 text-sm font-medium">Drag & drop your documents here</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">PDF, DOCX, PNG/JPG. Multiple files will be merged into one envelope.</p>
              <button type="button" onClick={onPickFiles} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2d7bc9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563a0]">
                <FileText className="w-4 h-4" />
                Choose file
              </button>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                multiple
                onChange={(event) => handleFiles(event.target.files)}
              />
            </div>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {files.length > 0 ? (
              <div className="mt-6 space-y-3">
                {files.map((item) => (
                  <div key={`${item.file.name}-${item.file.lastModified}`} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
                    <div>
                      <div className="text-sm font-medium">{item.file.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {(item.file.size / 1024 / 1024).toFixed(2)} MB · Version v{item.version}
                        {item.willConvertToPdf ? ' · Will convert to PDF' : ''}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#2d7bc9]">Ready</span>
                  </div>
                ))}
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Total size: {totalMb.toFixed(2)} MB / {MAX_ENVELOPE_MB} MB. Files will be merged into a single envelope document.
                </div>
              </div>
            ) : (
              <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                No files uploaded yet. Upload a document to continue to recipients and signature fields.
              </div>
            )}
          </section>

          <aside className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 h-fit">
            <h3 className="text-sm font-semibold">Next Steps</h3>
            <ul className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#2d7bc9]" />
                Add recipients and assign roles once the document uploads.
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

            <div className="mt-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
              Versioning for templates and documents starts at v2+.
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {files.length > 0 ? (
                <Link
                  href="/dashboard/envelopes/new/recipients"
                  className="rounded-lg px-4 py-2 text-center text-sm font-semibold bg-[#2d7bc9] text-white hover:bg-[#2563a0]"
                >
                  Continue to Recipients
                </Link>
              ) : (
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm font-semibold bg-slate-200 text-slate-500 cursor-not-allowed"
                  disabled
                >
                  Continue to Recipients
                </button>
              )}
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
