import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  processComplaintDocument, 
  processComplaintText, 
  sendUserChatMessage 
} from '../store/complaintThunks';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  Send, 
  Bot, 
  User, 
  ChevronRight,
  AlertOctagon,
  ShieldCheck,
  FileCheck,
  Zap,
  Server,
  AlertTriangle,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import PasteTextModal from './PasteTextModal';

const API_BASE_URL = 'http://localhost:8000';

const QUICK_PROMPT_CHIPS = [
  "Summarize patient risk",
  "What is the recommended immediate containment?",
  "Draft CAPA plan",
  "Explain GxP severity classification"
];

export default function AIAssistantPanel({ onShowToast }) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.complaint.messages);
  const extraction = useSelector((state) => state.complaint.extraction);
  const triageSummary = useSelector((state) => state.complaint.triageSummary);
  const completenessInfo = useSelector((state) => state.complaint.completenessInfo);
  const duplicateInfo = useSelector((state) => state.complaint.duplicateInfo);
  const formData = useSelector((state) => state.complaint.formData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, extraction, triageSummary, duplicateInfo]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'healthy') {
          setBackendStatus('connected');
        } else {
          setBackendStatus('offline');
        }
      })
      .catch(() => setBackendStatus('offline'));
  }, []);

  const handleFileUpload = (file) => {
    if (!file) return;
    dispatch(processComplaintDocument(file));
  };

  const handleExtractPastedText = (rawText) => {
    if (!rawText || !rawText.trim()) return;
    dispatch(processComplaintText(rawText));
  };

  const handleSendPrompt = (textToSend) => {
    const text = textToSend || promptText;
    if (!text.trim()) return;
    dispatch(sendUserChatMessage(text));
    setPromptText('');
  };

  const steps = [
    { label: 'Document Ingestion', desc: 'Structure & OCR' },
    { label: 'Entity Extraction', desc: 'Product, Lot & Dates' },
    { label: 'GxP Risk Assessment', desc: 'Severity & Triage' }
  ];

  return (
    <div className="lg:col-span-5 flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-5 flex flex-col h-full min-h-[640px] relative overflow-hidden">
        
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                QMS Copilot Intelligence
              </h2>
              <p className="text-[11px] text-zinc-500">FastAPI + LangGraph + Groq LLM</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Completeness Score Gauge Badge */}
            {completenessInfo?.completenessScore !== undefined && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                completenessInfo.completenessScore === 100
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                <PieChart className="w-3 h-3" />
                {completenessInfo.completenessScore}% Complete
              </span>
            )}

            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              backendStatus === 'connected'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-zinc-100 text-zinc-600 border-zinc-200'
            }`}>
              <Server className="w-2.5 h-2.5" />
              {backendStatus === 'connected' ? 'FastAPI Connected' : 'FastAPI Ready'}
            </span>
          </div>
        </div>

        {/* DUPLICATE BATCH ALERT BANNER */}
        {duplicateInfo?.isDuplicateBatch && (
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium flex items-start gap-2.5 shadow-2xs animate-in slide-in-from-top duration-300">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-rose-950 flex items-center gap-1.5">
                ⚠️ Repeated Batch Defect Detected
              </p>
              <p className="text-[11px] leading-relaxed text-rose-800">
                {duplicateInfo.duplicateAlert || `Batch ${formData.batchLotNumber} previously reported in QMS database (${duplicateInfo.priorComplaintIds?.join(', ')}). Escalation to QA Batch Recall Review recommended.`}
              </p>
            </div>
          </div>
        )}

        {/* Upload Dropzone Card */}
        <div className="mt-4 space-y-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer?.files?.length) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center relative ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-50/60 scale-[0.99]' 
                : 'border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/60 hover:border-zinc-300'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.docx,.txt,.eml"
              onChange={(e) => e.target.files?.length && handleFileUpload(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="p-2.5 rounded-full bg-white shadow-2xs border border-zinc-200/80 text-indigo-600 mb-1.5">
              <UploadCloud className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-zinc-800">
              Drop Pharmacovigilance reports, emails, or batch PDFs here
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Supports PDF, DOCX, TXT, EML up to 10MB</p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full inline-flex items-center justify-between py-2 px-3 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100/80 text-xs font-semibold text-zinc-700 transition-all shadow-2xs group"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-600" />
              Or paste raw text / email snippet
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>

        {/* STEPPED EXTRACTION VISUALIZER */}
        <div className="mt-4 p-3.5 rounded-xl bg-zinc-900 text-white border border-zinc-800 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-zinc-300 tracking-wider uppercase flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-indigo-400" /> LangGraph Stepper
            </span>
            <span className="font-mono text-indigo-400 font-bold">{extraction.progress}%</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {steps.map((st, index) => {
              const isDone = extraction.currentStep > index || extraction.progress === 100;
              const isActive = extraction.currentStep === index && extraction.isExtracting;
              
              return (
                <div key={index} className="flex flex-col gap-1">
                  <div className={`h-1.5 rounded-full transition-all duration-300 ${
                    isDone 
                      ? 'bg-indigo-500' 
                      : isActive 
                      ? 'bg-indigo-400 animate-pulse' 
                      : 'bg-zinc-800'
                  }`} />
                  <span className={`text-[10px] font-semibold truncate ${
                    isDone ? 'text-zinc-200' : isActive ? 'text-indigo-300' : 'text-zinc-500'
                  }`}>
                    {index + 1}. {st.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          {extraction.statusMessage && (
            <p className="text-[10px] text-zinc-400 font-mono leading-tight pt-1 border-t border-zinc-800">
              ➜ {extraction.statusMessage}
            </p>
          )}
        </div>

        {/* AI COPILOT TRIAGE SUMMARY CARD */}
        {triageSummary && (
          <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/80 space-y-2.5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" /> AI Copilot Triage Summary
              </span>
              <span className="text-[9px] font-bold uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                GxP Evaluation
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-zinc-800">
              <p className="font-semibold text-indigo-900">{triageSummary.title}</p>
              <p className="text-[11px] leading-relaxed text-zinc-700">{triageSummary.summary}</p>
              
              <div className="pt-2 border-t border-indigo-100 space-y-1 text-[11px]">
                <div className="flex items-start gap-1.5 text-rose-900">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Suspected Root Cause:</strong> {triageSummary.rootCause}</span>
                </div>
                <div className="flex items-start gap-1.5 text-indigo-900">
                  <FileCheck className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Recommended CAPA:</strong> {triageSummary.recommendedAction}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHAT STREAM */}
        <div className="mt-4 flex-1 flex flex-col min-h-[180px] max-h-[260px] border border-zinc-200 rounded-xl bg-zinc-50/50 overflow-hidden">
          <div className="px-3 py-1.5 bg-zinc-100 border-b border-zinc-200 text-[10px] font-semibold text-zinc-500 flex items-center justify-between">
            <span>LIVE CHAT STREAM</span>
            <span className="font-mono text-zinc-400">LangGraph Agent Stream</span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    <Bot className="w-3 h-3" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-zinc-900 text-white rounded-br-none'
                      : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`block text-[9px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-zinc-400' : 'text-zinc-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-5 h-5 rounded-md bg-zinc-700 text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    <User className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
        </div>

        {/* PROMPT BAR & CHIPS */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }} className="mt-3 space-y-2">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_PROMPT_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSendPrompt(chip)}
                className="px-2 py-0.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 text-[10px] font-medium text-zinc-600 whitespace-nowrap transition-all shadow-2xs"
              >
                💡 {chip}
              </button>
            ))}
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ask Copilot anything about this complaint..."
              className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-xl pl-3.5 pr-10 py-2.5 text-zinc-800 placeholder-zinc-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
            />
            <button
              type="submit"
              disabled={!promptText.trim()}
              className="absolute right-1.5 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[9px] text-center text-zinc-400">
            Powered by FastAPI + LangGraph with Groq LLM & SQLAlchemy Persistence.
          </p>
        </form>

      </div>

      <PasteTextModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExtractText={handleExtractPastedText}
      />
    </div>
  );
}
