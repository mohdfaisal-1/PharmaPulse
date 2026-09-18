import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setAllFormData, 
  setExtractionProgress, 
  addChatMessage, 
  setStatusBadge 
} from '../store/complaintSlice';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  Info, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import PasteTextModal from './PasteTextModal';

export default function RightPanel({ onShowToast }) {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.complaint.messages);
  const extraction = useSelector((state) => state.complaint.extraction);
  const formData = useSelector((state) => state.complaint.formData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const chatBottomRef = useRef(null);

  // Auto-scroll chat stream to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, extraction]);

  // Simulated AI Extraction Progress engine
  const startExtractionSimulation = (sampleData, documentName) => {
    dispatch(setExtractionProgress({ isExtracting: true, progress: 10, statusMessage: 'Reading document and parsing structure...' }));
    
    // Add initial message
    dispatch(addChatMessage({
      sender: 'assistant',
      text: `Started intake analysis for "${documentName}". Extracting product specifications, batch numbers, dates, and severity assessment...`
    }));

    setTimeout(() => {
      dispatch(setExtractionProgress({ progress: 35, statusMessage: 'Extracting product & batch numbers (B2026-X9)...' }));
    }, 600);

    setTimeout(() => {
      dispatch(setExtractionProgress({ progress: 65, statusMessage: 'Detecting manufacturing/expiry dates and quantity affected...' }));
    }, 1300);

    setTimeout(() => {
      dispatch(setExtractionProgress({ progress: 85, statusMessage: 'Evaluating initial severity & classifying priority level...' }));
    }, 2000);

    setTimeout(() => {
      // Set extracted form data
      dispatch(setAllFormData(sampleData));
      dispatch(setExtractionProgress({ isExtracting: false, progress: 100, statusMessage: 'Extraction completed successfully! Form fields populated.' }));
      dispatch(setStatusBadge('Pending Triage'));

      dispatch(addChatMessage({
        sender: 'assistant',
        text: `Extraction Complete! I have populated the complaint form with details extracted from "${documentName}":\n\n• Product: ${sampleData.productName} (${sampleData.productStrengthGrade})\n• Batch: ${sampleData.batchLotNumber}\n• Severity: ${sampleData.initialSeverity} | Priority: ${sampleData.priority}\n• Quantity: ${sampleData.quantityAffected} kg\n\nPlease review the left panel and click "Save Complaint" to finalize.`
      }));

      if (onShowToast) {
        onShowToast(`AI successfully extracted details from ${documentName}!`, 'success');
      }
    }, 2700);
  };

  // Handle Drag & Drop file upload simulation
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleSimulatedExtraction(file.name);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleSimulatedExtraction(files[0].name);
    }
  };

  const handleSimulatedExtraction = (fileName) => {
    // Default realistic pharmaceutical sample data
    const pharmaSample = {
      complaintSource: 'Customer Quality Email Intake',
      customerName: 'BioPharma Care Ltd. (UK Facility)',
      productName: 'Paracetamol Micronized API',
      productStrengthGrade: '500mg USP/EP Grade A',
      batchLotNumber: 'B2026-X9',
      mfgDate: '2026-01-15',
      expiryDate: '2029-01-14',
      quantityAffected: '250',
      complaintType: 'Foreign Particulate Contamination (Dark Metallic Specks)',
      complaintDate: '2026-03-12',
      detailedDescription: `Dark specks (>150 microns) observed in drum #04 of Batch B2026-X9 during incoming QC receipt inspection. Metallurgical analysis confirmed stainless steel milling fragment. Immediate quarantine of 250 kg shipment executed. Requesting root cause analysis & CAPA.`,
      initialSeverity: 'Critical',
      priority: 'Urgent',
    };

    startExtractionSimulation(pharmaSample, fileName || 'Complaint_Document.pdf');
  };

  // Handle extracted text from Paste Modal
  const handleExtractFromPastedText = (rawText) => {
    let sample = {
      complaintSource: 'Pasted Customer Email',
      customerName: 'Apex Healthcare Distributors',
      productName: 'Amoxicillin Trihydrate',
      productStrengthGrade: '500mg USP Capsules',
      batchLotNumber: 'AMX-88402-L',
      mfgDate: '2025-11-10',
      expiryDate: '2027-11-09',
      quantityAffected: '1200',
      complaintType: 'Out of Specification (OOS) - Dissolution Failure',
      complaintDate: '2026-02-28',
      detailedDescription: rawText.length > 250 ? rawText.substring(0, 250) + '...' : rawText,
      initialSeverity: 'Major',
      priority: 'High',
    };

    if (rawText.toLowerCase().includes('paracetamol')) {
      sample = {
        complaintSource: 'Pasted Email Communication',
        customerName: 'BioPharma Care Ltd. (UK Plant)',
        productName: 'Paracetamol Active Ingredient (API)',
        productStrengthGrade: '500mg Micronized Grade A',
        batchLotNumber: 'B2026-X9',
        mfgDate: '2026-01-15',
        expiryDate: '2029-01-14',
        quantityAffected: '250',
        complaintType: 'Physical Contamination / Foreign Particulates',
        complaintDate: '2026-03-12',
        detailedDescription: rawText,
        initialSeverity: 'Critical',
        priority: 'Urgent',
      };
    } else if (rawText.toLowerCase().includes('metformin')) {
      sample = {
        complaintSource: 'Pasted Pharmacy Hotline Incident',
        customerName: 'CarePharm National Chains',
        productName: 'Metformin HCl Sustained Release',
        productStrengthGrade: '850mg SR Grade',
        batchLotNumber: 'MTF-9921-A',
        mfgDate: '2025-12-01',
        expiryDate: '2028-11-30',
        quantityAffected: '85',
        complaintType: 'Packaging Defect & Discoloration',
        complaintDate: '2026-03-05',
        detailedDescription: rawText,
        initialSeverity: 'Major',
        priority: 'Medium',
      };
    }

    startExtractionSimulation(sample, 'Pasted_Complaint_Text.txt');
  };

  // Handle user sending chat messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    const userText = promptText.trim();
    dispatch(addChatMessage({ sender: 'user', text: userText }));
    setPromptText('');

    // Dynamic Contextual AI Assistant Response
    setTimeout(() => {
      let reply = "I am analyzing your query against current QMS data.";
      const lower = userText.toLowerCase();

      if (lower.includes('capa') || lower.includes('action') || lower.includes('recommend')) {
        reply = `**Recommended CAPA (Corrective & Preventive Action):**\n1. Issue immediate **Stop-Shipment & Quarantine Notice** for Batch ${formData.batchLotNumber || 'B2026-X9'}.\n2. Audit milling equipment sieve mesh logs from ${formData.mfgDate || '2026-01-15'}.\n3. Perform retention sample testing for physical contamination and OOS dissolution.`;
      } else if (lower.includes('severity') || lower.includes('critical') || lower.includes('risk')) {
        reply = `**Initial Severity Evaluation:** Current rating is set to **${formData.initialSeverity || 'Critical'}**. Reason: Foreign particulate contaminants (>150µm) in active pharmaceutical ingredients present direct patient safety risks and violate cGMP compliance guidelines.`;
      } else if (lower.includes('batch') || lower.includes('product') || lower.includes('details')) {
        reply = `**Extracted QMS Summary:**\n• Product: ${formData.productName || 'Paracetamol API'}\n• Batch: ${formData.batchLotNumber || 'B2026-X9'}\n• Customer: ${formData.customerName || 'BioPharma Care'}\n• Affected Qty: ${formData.quantityAffected || '250'} kg`;
      } else {
        reply = `Regarding your query about "${userText}": Based on extracted complaint parameters for batch ${formData.batchLotNumber || 'B2026-X9'}, all documented findings match standard ISO 9001 & EU GMP Annex 16 complaint logging guidelines. Let me know if you would like me to draft an investigation report!`;
      }

      dispatch(addChatMessage({ sender: 'assistant', text: reply }));
    }, 700);
  };

  return (
    <div className="lg:col-span-5 flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col h-full min-h-[640px] relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                AI Complaint Intake Assistant
              </h2>
              <p className="text-xs text-slate-500">Automated QMS Document Parser & Classifier</p>
            </div>
          </div>
          
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-blue-50 text-blue-700 border border-blue-200 uppercase">
            BETA
          </span>
        </div>

        {/* Upload & Intake Section */}
        <div className="mt-4 space-y-3">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center relative ${
              isDragging 
                ? 'border-blue-500 bg-blue-50/70 scale-[0.99]' 
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <input
              type="file"
              accept=".pdf,.docx,.txt,.eml"
              onChange={handleFileSelect}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="p-3 rounded-full bg-white shadow-sm border border-slate-100 text-blue-600 mb-2">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Drag & drop complaint document here or <span className="text-blue-600 underline">click to browse</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Supports PDF, DOCX, TXT, EML up to 10MB</p>
          </div>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">OR</span>
          </div>

          {/* Secondary Action: Paste Complaint Text / Email */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 text-xs font-semibold text-slate-700 transition-all shadow-sm group"
          >
            <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
            Paste Complaint Text / Email
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 ml-auto" />
          </button>

          {/* Info Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 px-1 pt-1">
            <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Supported formats: PDF, DOCX, TXT, EML | Max file size: 10MB</span>
          </div>
        </div>

        {/* EXTRACTION PROGRESS SECTION */}
        {(extraction.isExtracting || extraction.progress > 0) && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="uppercase tracking-wider flex items-center gap-1.5 text-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" /> EXTRACTION PROGRESS
              </span>
              <span className="text-blue-700 font-mono">{extraction.progress}%</span>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${extraction.progress}%` }}
              ></div>
            </div>

            {/* Status Message */}
            <p className="text-[11px] text-slate-600 font-medium leading-tight">
              {extraction.statusMessage || "Analyzing document content and extracting key details... Please wait, this may take a few moments."}
            </p>
          </div>
        )}

        {/* AI ASSISTANT CHAT STREAM AREA */}
        <div className="mt-4 flex-1 flex flex-col min-h-[220px] max-h-[320px] border border-slate-100 rounded-xl bg-slate-50/40 overflow-hidden">
          
          <div className="px-3 py-2 bg-slate-100/60 border-b border-slate-100 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
            <span>LIVE ASSISTANT STREAM</span>
            <span className="text-[10px] text-slate-400 font-normal">Encrypted QMS Protocol</span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`block text-[9px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
        </div>

        {/* BOTTOM PROMPT INPUT */}
        <form onSubmit={handleSendMessage} className="mt-3 space-y-2">
          <div className="relative flex items-center">
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ask me anything about this complaint..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              type="submit"
              disabled={!promptText.trim()}
              className="absolute right-1.5 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:hover:bg-blue-600 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-center text-slate-400">
            AI responses may contain errors. Please verify information.
          </p>
        </form>

      </div>

      {/* PASTE TEXT MODAL */}
      <PasteTextModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExtractText={handleExtractFromPastedText}
      />
    </div>
  );
}
