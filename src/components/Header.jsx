import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetForm, saveComplaintToLogs } from '../store/complaintSlice';
import { 
  Hexagon, 
  ShieldCheck, 
  RotateCcw, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Send,
  Sparkles,
  Database
} from 'lucide-react';

export default function Header({ onOpenImportModal, onShowToast }) {
  const dispatch = useDispatch();
  const statusBadge = useSelector((state) => state.complaint.statusBadge);
  const formData = useSelector((state) => state.complaint.formData);

  const handleReset = () => {
    dispatch(resetForm());
    if (onShowToast) onShowToast('Workspace reset to initial blank state', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.productName && !formData.customerName) {
      if (onShowToast) onShowToast('Please fill in or extract complaint details before submitting', 'warning');
      return;
    }
    dispatch(saveComplaintToLogs());
    if (onShowToast) onShowToast('QMS Complaint Record successfully submitted to GxP audit database!', 'success');
  };

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 text-white px-4 sm:px-6 py-3 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left Brand Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-violet-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/10">
              <Hexagon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-white">PharmaPulse AI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700/80">
                  v2.4 QMS API/FDF
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-normal">Automated Pharmacovigilance & Complaint Triage</p>
            </div>
          </div>

          {/* Mobile status indicator */}
          <div className="md:hidden">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
              statusBadge === 'Triaged & Logged'
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                : 'bg-amber-950/80 text-amber-300 border-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                statusBadge === 'Triaged & Logged' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
              }`}></span>
              {statusBadge}
            </span>
          </div>
        </div>

        {/* Center System Telemetry & Status Indicators */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Regulated GxP Env: <strong className="text-zinc-100 font-medium">Active</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60">
            <span className="text-zinc-400">Triage Status:</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
              statusBadge === 'Triaged & Logged'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {statusBadge === 'Triaged & Logged' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <Clock className="w-3 h-3 text-amber-400" />
              )}
              {statusBadge}
            </span>
          </div>
        </div>

        {/* Right Action Triggers */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onOpenImportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            Import Document
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reset Workspace"
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 hover:text-white transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold tracking-wide transition-all shadow-sm shadow-indigo-600/30 border border-indigo-500/40"
          >
            <Send className="w-3.5 h-3.5" />
            Export / Submit QMS Record
          </button>
        </div>

      </div>
    </header>
  );
}
