'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Main } from 'next/document';

type FieldType = 
  | 'signature' 
  | 'initial' 
  | 'stamp' 
  | 'dateSigned' 
  | 'firstName' 
  | 'lastName' 
  | 'companyEmail' 
  | 'company';

type SignatureField = {
  id: string;
  type: FieldType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  recipientId?: string;
};

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
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [draggingField, setDraggingField] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Retrieve uploaded document from localStorage
    const storedDoc = localStorage.getItem('uploadedDocument');
    if (storedDoc) {
      setDocumentUrl(storedDoc);
    }
  }, []);

  const handleFieldTypeClick = (type: FieldType) => {
    setSelectedFieldType(type);
  };

  const handleDocumentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedFieldType) return;

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
              Click a field type below, then click on the document to place it. You can place multiple fields.
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

              {selectedFieldType && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Click on the document preview to place this field
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
                  <p>• Click a field type</p>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Document Preview</h2>
                <div className="text-sm text-slate-500">
                  {placedFields.length} field{placedFields.length !== 1 ? 's' : ''} placed
                </div>
              </div>

              {/* Document Canvas */}
              <div
                onClick={handleDocumentClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className={`relative bg-white dark:bg-slate-900 border-2 border-dashed rounded-lg min-h-[800px] overflow-hidden ${
                  selectedFieldType
                    ? 'border-[#2d7bc9] cursor-crosshair'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
                style={{ aspectRatio: '8.5 / 11' }}
              >
                {/* Display uploaded document or placeholder */}
                {documentUrl ? (
                  <div className="w-full h-full pointer-events-none">
                    {documentUrl.startsWith('data:application/pdf') ? (
                      <iframe
                        src={documentUrl}
                        className="w-full h-full border-0"
                        title="Document Preview"
                      />
                    ) : (
                      <img
                        src={documentUrl}
                        alt="Document Preview"
                        className="w-full h-full object-contain"
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
                {placedFields.map((field) => {
                  return (
                    <div
                      key={field.id}
                      onMouseDown={(e) => handleFieldMouseDown(e, field.id, field)}
                      onClick={(e) => handleFieldClick(e, field.id)}
                      className={`absolute flex items-center justify-center px-3 border-2 rounded transition-all select-none ${
                        selectedField === field.id
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 cursor-move'
                          : 'border-[#2d7bc9] bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-move'
                      }`}
                      style={{
                        left: field.x,
                        top: field.y,
                        width: field.width,
                        height: field.height,
                      }}
                    >
                      <span className="text-xs font-medium text-[#2d7bc9] pointer-events-none">{field.label}</span>
                    </div>
                  );
                })}
              </div>

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
