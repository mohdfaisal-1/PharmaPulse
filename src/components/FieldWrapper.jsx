import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { dismissConfidence } from '../store/complaintSlice';
import { Sparkles, X } from 'lucide-react';

export default function FieldWrapper({ fieldName, label, icon: Icon, children, className = '' }) {
  const dispatch = useDispatch();
  const confidence = useSelector((state) => state.complaint.aiConfidence[fieldName]);

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
          {label}
        </label>

        {confidence !== undefined && (
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 animate-in fade-in duration-200 cursor-pointer hover:bg-indigo-100 transition-colors"
            title="Extracted by AI Copilot. Click to dismiss badge."
            onClick={() => dispatch(dismissConfidence(fieldName))}
          >
            <Sparkles className="w-2.5 h-2.5 text-indigo-500" />
            {confidence}% conf
            <X className="w-2.5 h-2.5 text-indigo-400 hover:text-indigo-700 ml-0.5" />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
