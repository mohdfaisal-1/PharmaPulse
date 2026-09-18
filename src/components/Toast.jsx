import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { message, type } = toast;

  const typeStyles = {
    success: 'bg-emerald-900 text-emerald-100 border-emerald-700',
    warning: 'bg-amber-900 text-amber-100 border-amber-700',
    info: 'bg-blue-900 text-blue-100 border-blue-700',
  };

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-400" />,
    info: <Info className="w-4 h-4 text-blue-400" />,
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl text-xs font-medium max-w-md animate-in slide-in-from-bottom duration-300 ${typeStyles[type] || typeStyles.info}`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
