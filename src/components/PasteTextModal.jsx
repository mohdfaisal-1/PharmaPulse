import React, { useState } from 'react';
import { X, FileText, Sparkles, Copy, Check, Info } from 'lucide-react';
import { SAMPLE_COMPLAINTS } from '../utils/sampleData';

export default function PasteTextModal({ isOpen, onClose, onExtractText }) {
  const [pastedText, setPastedText] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const handleSelectSample = (sampleObj, index) => {
    setPastedText(sampleObj.text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    onExtractText(pastedText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Paste Complaint Text or Email</h3>
              <p className="text-xs text-zinc-500">Paste raw customer communication or load a sample pharmaceutical QMS fixture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Quick Presets Bar */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Sample Test Presets:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAMPLE_COMPLAINTS.map((sample, idx) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample, idx)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all flex flex-col justify-between gap-1.5 ${
                    copiedIndex === idx
                      ? 'border-indigo-500 bg-indigo-50/80 ring-2 ring-indigo-100'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 line-clamp-1">{sample.title.split(':')[1] || sample.title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      sample.severityLabel === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sample.severityLabel}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 line-clamp-1">{sample.productName} ({sample.batchLotNumber})</span>
                  <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 pt-1">
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-indigo-600" /> Loaded into editor!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-zinc-400" /> Click to load sample
                      </>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Raw Complaint Content:
            </label>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste email text, customer report, audit finding, or technical defect notice here..."
              className="w-full text-xs font-mono bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-zinc-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>FastAPI + LangGraph backend will process this text, extract QMS parameters, and auto-fill the complaint form.</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-100 bg-zinc-50/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-800 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-all shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!pastedText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Extract & Populate Form
          </button>
        </div>

      </div>
    </div>
  );
}
