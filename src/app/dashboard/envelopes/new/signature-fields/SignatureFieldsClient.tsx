'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Main } from 'next/document';
import { ChevronDown } from 'lucide-react';
import { getDocuments } from '@/utils/documentStorage';

type FieldType = 
  | 'signature' 
  | 'initial' 
  | 'stamp' 
  | 'dateSigned' 
  | 'firstName' 
  | 'lastName' 
  | 'companyEmail' 
  | 'company';

type Recipient = {
  id: string;
  email: string;
  name: string;
  role: 'Signer' | 'CC' | 'Approver';
  signingOrder: number;
};

type SignatureField = {
  id: string;
  type: FieldType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  recipientId?: string;
  documentIndex: number;
  pageNumber?: number;
};

type DocumentData = {
  name: string;
  dataUrl: string;
  type: string;
};

const RECIPIENT_COLORS = [
  { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-500', text: 'text-blue-700 dark:text-blue-300', label: 'bg-blue-200 dark:bg-blue-700' },
  { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-500', text: 'text-green-700 dark:text-green-300', label: 'bg-green-200 dark:bg-green-700' },
  { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-500', text: 'text-purple-700 dark:text-purple-300', label: 'bg-purple-200 dark:bg-purple-700' },
  { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-500', text: 'text-pink-700 dark:text-pink-300', label: 'bg-pink-200 dark:bg-pink-700' },
  { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-500', text: 'text-amber-700 dark:text-amber-300', label: 'bg-amber-200 dark:bg-amber-700' },
  { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-500', text: 'text-red-700 dark:text-red-300', label: 'bg-red-200 dark:bg-red-700' },
];

const fieldTypes: Array<{ type: FieldType; label: string; color: string }> = [
  { type: 'signature', label: 'Signature', color: 'bg-blue-500' },
  { type: 'initial', label: 'Initial', color: 'bg-purple-500' },
  { type: 'stamp', label: 'Stamp', color: 'bg-orange-500' },
  { type: 'dateSigned', label: 'Date Signed', color: 'bg-green-500' },
  { type: 'firstName', label: 'First Name', color: 'bg-indigo-500' },
  { type: 'lastName', label: 'Last Name', color: 'bg-indigo-500' },
  { type: 'companyEmail', label: 'Company Email', color: 'bg-cyan-500' },
  { type: 'company', label: 'Company', color: 'bg-teal-500' },
];

export default function SignatureFieldsClient() {
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType | null>(null);
  const [placedFields, setPlacedFields] = useState<SignatureField[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  useEffect(() => {
    const loadDocuments = async () => {
      const storedMeta = localStorage.getItem('uploadedDocumentsMeta');
      if (storedMeta) {
        try {
          const metaList: Array<{ id: string; name: string; type: string }> = JSON.parse(storedMeta);
          const storedDocs = await getDocuments();
          const docMap = new Map(storedDocs.map((doc) => [doc.id, doc]));

          const docs = metaList
            .map((meta) => {
              const match = docMap.get(meta.id);
              if (!match) return null;
              return {
                name: meta.name,
                dataUrl: URL.createObjectURL(match.blob),
                type: meta.type,
              };
            })
            .filter(Boolean) as Array<{ name: string; dataUrl: string; type: string }>;

          setDocuments(docs);
          return;
        } catch (error) {
          console.error('Failed to load documents from storage:', error);
        }
      }

      const storedDocs = localStorage.getItem('uploadedDocuments');
      if (storedDocs) {
        try {
          const parsedDocs = JSON.parse(storedDocs);
          setDocuments(parsedDocs);
        } catch (error) {
          console.error('Failed to parse documents:', error);
        }
      }
    };

    void loadDocuments();

    // Load recipients from localStorage
    const storedRecipients = localStorage.getItem('envelopeRecipients');
    if (storedRecipients) {
      try {
        setRecipients(JSON.parse(storedRecipients));
      } catch (error) {
        console.error('Failed to parse recipients:', error);
      }
    }
  }, []);

  const handleFieldTypeClick = (type: FieldType) => {
    setSelectedFieldType(type);
  };

  const getRecipientColor = (recipientId?: string) => {
    if (!recipientId) return RECIPIENT_COLORS[0];
    const index = recipients.findIndex((r) => r.id === recipientId);
    return RECIPIENT_COLORS[index >= 0 ? index % RECIPIENT_COLORS.length : 0];
  };

  const handleDocumentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedFieldType || !selectedRecipient) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const fieldConfig = fieldTypes.find((f) => f.type === selectedFieldType);
    if (!fieldConfig) return;

    const newField: SignatureField = {
      id: `field-${Date.now()}`,
      type: selectedFieldType,
      label: fieldConfig.label,
      x,
      y,
      width: selectedFieldType === 'signature' ? 200 : selectedFieldType === 'initial' ? 80 : 150,
      height: selectedFieldType === 'signature' ? 60 : selectedFieldType === 'initial' ? 60 : 40,
      recipientId: selectedRecipient,
      documentIndex: selectedDocIndex,
    };

    setPlacedFields((prev) => [...prev, newField]);
    setSelectedFieldType(null);
  };

  const handleFieldClick = (event: React.MouseEvent, fieldId: string) => {
    event.stopPropagation();
    setSelectedField(fieldId);
  };

  const handleFieldMouseDown = (event: React.MouseEvent, fieldId: string, field: SignatureField) => {
    event.stopPropagation();
    setDraggingField(fieldId);
    setSelectedField(fieldId);
    setDragOffset({
      x: event.clientX - field.x,
      y: event.clientY - field.y,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingField) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - dragOffset.x;
    const y = event.clientY - rect.top - dragOffset.y;

    setPlacedFields((prev) =>
      prev.map((field) =>
        field.id === draggingField
          ? { ...field, x: Math.max(0, Math.min(x, rect.width - field.width)), y: Math.max(0, Math.min(y, rect.height - field.height)) }
          : field
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingField(null);
  };

  const handleDeleteField = () => {
    if (selectedField) {
      setPlacedFields((prev) => prev.filter((field) => field.id !== selectedField));
      setSelectedField(null);
    }
  };

  const canContinue = placedFields.length > 0;

  useEffect(() => {
    // Save to localStorage for review page
    localStorage.setItem('signatureFields', JSON.stringify(placedFields));
  }, [placedFields]);

  useEffect(() => {
    // Save recipients to localStorage
    const storedRecipients = localStorage.getItem('envelopeRecipients');
    if (!storedRecipients) {
      // If no recipients found, they should have been saved from previous page
      const recipientsData = sessionStorage.getItem('currentRecipients');
      if (recipientsData) {
        localStorage.setItem('envelopeRecipients', recipientsData);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-2xl font-semibold">Place Signature Fields</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Select a field type and recipient, then click on the document to place the field. Fields are color-coded by recipient for easy tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Field Types Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 sticky top-6">
              {/* Recipient Selector - Always visible at top */}
              {recipients.length > 0 && (
                <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold mb-3">Select Recipient</label>
                  <select
                    value={selectedRecipient || ''}
                    onChange={(e) => setSelectedRecipient(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-900"
                  >
                    <option value="">-- Choose recipient --</option>
                    {recipients.map((r, idx) => {
                      const color = RECIPIENT_COLORS[idx % RECIPIENT_COLORS.length];
                      return (
                        <option key={r.id} value={r.id}>
                          #{r.signingOrder} - {r.name}
                        </option>
                      );
                    })}
                  </select>
                  {selectedRecipient && (
                    <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Selected: <strong>{recipients.find((r) => r.id === selectedRecipient)?.name}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <h2 className="text-base font-semibold mb-4">Field Types</h2>
              <div className="space-y-2">
                {fieldTypes.map((field) => {
                  return (
                    <button
                      key={field.type}
                      onClick={() => handleFieldTypeClick(field.type)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${
                        selectedFieldType === field.type
                          ? 'border-[#2d7bc9] bg-[#eff6ff] dark:bg-slate-700 text-[#2d7bc9]'
                          : 'border-slate-200 dark:border-slate-700 hover:border-[#2d7bc9]/50 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {field.label}
                    </button>
                  );
                })}
              </div>

              {selectedFieldType && !selectedRecipient && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    ⚠️ Please select a recipient above first
                  </p>
                </div>
              )}

              {selectedFieldType && selectedRecipient && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    ✓ Click on the document to place this field
                  </p>
                </div>
              )}

              {selectedField && (
                <button
                  onClick={handleDeleteField}
                  className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600"
                >
                  Delete Selected Field
                </button>
              )}

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p>• Select a field type</p>
                  <p>• Select a recipient</p>
                  <p>• Click on document to place</p>
                  <p>• Drag fields to reposition</p>
                  <p>• Click field to select/delete</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Document Preview Area */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-lg font-semibold">Document Preview</h2>
                <div className="flex items-center gap-3">
                  {documents.length > 1 && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-slate-600 dark:text-slate-400">Document:</label>
                      <select
                        value={selectedDocIndex}
                        onChange={(e) => setSelectedDocIndex(Number(e.target.value))}
                        className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-sm bg-white dark:bg-slate-900"
                      >
                        {documents.map((doc, idx) => (
                          <option key={idx} value={idx}>
                            {idx + 1}. {doc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="text-sm text-slate-500">
                    {placedFields.filter((f) => f.documentIndex === selectedDocIndex).length} field{placedFields.filter((f) => f.documentIndex === selectedDocIndex).length !== 1 ? 's' : ''} on this doc
                  </div>
                </div>
              </div>

              {/* Document Canvas Wrapper */}
              <div className="border-2 border-dashed rounded-lg overflow-auto max-h-[900px] bg-gray-50 dark:bg-slate-700/30">
                <div
                  onClick={handleDocumentClick}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className={`relative bg-white dark:bg-slate-900 rounded-lg min-h-[800px] w-full ${
                    selectedFieldType
                      ? 'cursor-crosshair'
                      : ''
                  }`}
                  style={{ aspectRatio: '8.5 / 11' }}
                >
                {/* Recipients List - Top Right Corner */}
                {recipients.length > 0 && (
                  <div className="absolute top-4 right-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10 max-w-xs">
                    <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-sm font-semibold">Recipients</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {recipients.map((recipient, idx) => {
                        const color = RECIPIENT_COLORS[idx % RECIPIENT_COLORS.length];
                        const fieldCount = placedFields.filter((f) => f.recipientId === recipient.id).length;
                        return (
                          <div
                            key={recipient.id}
                            className={`px-4 py-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                              selectedRecipient === recipient.id ? color.bg : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecipient(recipient.id);
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${color.border.replace('border-', 'bg-')}`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  <span className="inline-block bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded text-xs font-bold mr-2">
                                    #{recipient.signingOrder}
                                  </span>
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 truncate">{recipient.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-500 truncate">{recipient.email}</div>
                                {recipient.role !== 'Signer' && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    <span className="inline-block bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">
                                      {recipient.role}
                                    </span>
                                  </div>
                                )}
                                {fieldCount > 0 && (
                                  <div className="text-xs mt-1 text-blue-600 dark:text-blue-400 font-medium">
                                    {fieldCount} field{fieldCount !== 1 ? 's' : ''} assigned
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Display uploaded document or placeholder */}
                {documents.length > 0 && documents[selectedDocIndex] ? (
                  <div className="w-full pointer-events-none">
                    {documents[selectedDocIndex].type === 'application/pdf' || documents[selectedDocIndex].dataUrl.startsWith('data:application/pdf') ? (
                      <iframe
                        src={documents[selectedDocIndex].dataUrl}
                        className="w-full border-0"
                        style={{ height: '1200px' }}
                        title="Document Preview"
                      />
                    ) : (
                      <img
                        src={documents[selectedDocIndex].dataUrl}
                        alt="Document Preview"
                        className="w-full h-auto object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <div className="p-12 text-slate-400 dark:text-slate-600 text-sm space-y-4">
                    <div className="text-center py-20">
                      <p className="text-lg mb-2">No document uploaded</p>
                      <p className="text-sm">Please upload a document first</p>
                    </div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="mt-8 h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
                  </div>
                )}

                {/* Placed Fields */}
                {placedFields
                  .filter((field) => field.documentIndex === selectedDocIndex)
                  .map((field) => {
                    const color = getRecipientColor(field.recipientId);
                    return (
                      <div
                        key={field.id}
                        onMouseDown={(e) => handleFieldMouseDown(e, field.id, field)}
                        onClick={(e) => handleFieldClick(e, field.id)}
                        className={`absolute flex items-center justify-center px-3 border-2 rounded transition-all select-none ${
                          selectedField === field.id
                            ? `${color.border} ${color.bg} cursor-move ring-2 ring-offset-1`
                            : `${color.border} ${color.bg} hover:opacity-80 cursor-move`
                        }`}
                        style={{
                          left: field.x,
                          top: field.y,
                          width: field.width,
                        height: field.height,
                      }}
                    >
                      <span className={`text-xs font-medium pointer-events-none ${color.text}`}>{field.label}</span>
                    </div>
                  );
                })}
              </div>
              </div>

              {/* Document Summary */}
              {documents.length > 1 && (
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <h3 className="text-sm font-semibold mb-2">Field Summary Across All Documents</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {documents.map((doc, idx) => {
                      const fieldCount = placedFields.filter((f) => f.documentIndex === idx).length;
                      return (
                        <div
                          key={idx}
                          className="text-xs p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-600"
                        >
                          <div className="font-medium truncate" title={doc.name}>
                            {idx + 1}. {doc.name}
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 mt-1">
                            {fieldCount} field{fieldCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard/envelopes/new/review"
                  className={`rounded-lg px-6 py-2.5 text-sm font-semibold ${
                    canContinue
                      ? 'bg-[#2d7bc9] text-white hover:bg-[#2563a0]'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  Continue to Review
                </Link>
                <Link
                  href="/dashboard/envelopes/new/recipients"
                  className="text-sm text-slate-500 hover:text-[#2d7bc9] px-4 py-2"
                >
                  Back to Recipients
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
