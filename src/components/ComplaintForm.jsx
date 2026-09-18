import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField, resetForm } from '../store/complaintSlice';
import { persistComplaintRecord } from '../store/complaintThunks';
import FieldWrapper from './FieldWrapper';
import { 
  Building2, 
  User, 
  Package, 
  Tag, 
  Layers, 
  Calendar, 
  Scale, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  Sparkles,
  ShieldAlert,
  Tag as TagIcon,
  Check
} from 'lucide-react';

const QUICK_TAGS = [
  "Seal Broken",
  "Discoloration",
  "Foreign Particulate",
  "OOS Dissolution",
  "Labeling Error",
  "Moisture Ingress"
];

const COMPLAINT_TYPES = [
  "Contamination",
  "Packaging Defect",
  "Potency Deviation",
  "Labeling",
  "Adulteration",
  "Physical Damage"
];

export default function ComplaintForm({ onShowToast }) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.complaint.formData);
  const statusBadge = useSelector((state) => state.complaint.statusBadge);
  const trackingId = useSelector((state) => state.complaint.trackingId);
  const isExtracting = useSelector((state) => state.complaint.extraction.isExtracting);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ field: name, value }));
  };

  const handleSelectField = (field, value) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleAppendTag = (tagText) => {
    const current = formData.detailedDescription || '';
    const newText = current ? `${current} [${tagText}]` : `[${tagText}]`;
    dispatch(updateFormField({ field: 'detailedDescription', value: newText }));
  };

  const handleReset = () => {
    dispatch(resetForm());
    if (onShowToast) onShowToast('Workspace reset to initial blank state', 'info');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.productName && !formData.customerName) {
      if (onShowToast) onShowToast('Please fill in or extract complaint details before saving', 'warning');
      return;
    }

    const action = await dispatch(persistComplaintRecord());
    if (persistComplaintRecord.fulfilled.match(action)) {
      const generatedId = action.payload.trackingId;
      if (onShowToast) {
        onShowToast(`Complaint Logged: ${generatedId} - Saved to Database!`, 'success');
      }
    }
  };

  const isSec1Complete = Boolean(formData.complaintSource && formData.customerName);
  const isSec2Complete = Boolean(formData.productName && formData.batchLotNumber && formData.mfgDate);
  const isSec3Complete = Boolean(formData.complaintType && formData.detailedDescription);
  const isSec4Complete = Boolean(formData.initialSeverity && formData.priority);

  return (
    <div className="lg:col-span-7 flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm p-6 relative overflow-hidden transition-all">
        
        {/* Subtle Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600"></div>

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Log Customer Complaint</h1>
              {isExtracting && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 animate-pulse border border-indigo-200">
                  <Sparkles className="w-3 h-3 text-indigo-600 animate-spin" /> Auto-Extracting...
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-0.5 font-medium">
              API & FDF Quality Assurance Module • GxP Compliance Track
            </p>
          </div>

          <div className="self-start sm:self-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-2xs ${
              trackingId || statusBadge.includes('CMP-')
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-mono font-bold'
                : statusBadge === 'Pending Review'
                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                trackingId || statusBadge.includes('CMP-') ? 'bg-emerald-500' : 'bg-amber-500'
              }`}></span>
              {statusBadge}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="mt-6 space-y-6">

          {/* SECTION 01: INTAKE & CUSTOMER METADATA */}
          <div className="rounded-xl border border-zinc-200/80 p-4 bg-zinc-50/40 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white text-[11px] font-bold">1</span>
                <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Intake & Customer Metadata</h2>
              </div>
              {isSec1Complete && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper fieldName="complaintSource" label="Complaint Source" icon={Building2}>
                <select
                  name="complaintSource"
                  value={formData.complaintSource}
                  onChange={handleChange}
                  className={`w-full text-xs bg-white border rounded-lg px-3 py-2.5 text-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all ${
                    formData.complaintSource ? 'border-zinc-300 font-medium' : 'border-zinc-200 text-zinc-400'
                  }`}
                >
                  <option value="" disabled>Select or await AI extraction...</option>
                  <option value="Customer Quality Email Intake">Customer Quality Email Intake</option>
                  <option value="Hospital Clinical Pharmacy Department">Hospital Clinical Pharmacy Department</option>
                  <option value="Receiving Raw Material QC Inspection">Receiving Raw Material QC Inspection</option>
                  <option value="Distributor / Wholesaler">Distributor / Wholesaler</option>
                  <option value="Retail Pharmacy Network">Retail Pharmacy Network</option>
                  <option value="Regulatory Audit Portal">Regulatory Audit Portal</option>
                </select>
              </FieldWrapper>

              <FieldWrapper fieldName="customerName" label="Customer / Organization Name" icon={User}>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. BioPharma Care Ltd. (UK Facility)"
                  className="w-full text-xs bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                />
              </FieldWrapper>
            </div>
          </div>

          {/* SECTION 02: BATCH & PRODUCT TRACEABILITY */}
          <div className="rounded-xl border border-zinc-200/80 p-4 bg-zinc-50/40 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white text-[11px] font-bold">2</span>
                <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Batch & Product Traceability</h2>
              </div>
              {isSec2Complete && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper fieldName="productName" label="Product Name" icon={Package}>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g. Ceftriaxone for Injection USP 1g"
                  className="w-full text-xs bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                />
              </FieldWrapper>

              <FieldWrapper fieldName="productStrengthGrade" label="Product Strength / Grade" icon={Tag}>
                <input
                  type="text"
                  name="productStrengthGrade"
                  value={formData.productStrengthGrade}
                  onChange={handleChange}
                  placeholder="e.g. 1g Sterile Powder Vial (USP Grade)"
                  className="w-full text-xs bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                />
              </FieldWrapper>

              <FieldWrapper fieldName="batchLotNumber" label="Batch / Lot ID" icon={Layers}>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    name="batchLotNumber"
                    value={formData.batchLotNumber}
                    onChange={handleChange}
                    placeholder="e.g. CTX-2026-088"
                    className="w-full text-xs font-mono font-bold uppercase bg-white border border-indigo-200 rounded-lg px-3 py-2.5 text-indigo-950 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all tracking-wider"
                  />
                  {formData.batchLotNumber && (
                    <span className="absolute right-2.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700">
                      LOT
                    </span>
                  )}
                </div>
              </FieldWrapper>

              <FieldWrapper fieldName="quantityAffected" label="Quantity Affected" icon={Scale}>
                <div className="flex rounded-lg shadow-none">
                  <input
                    type="text"
                    name="quantityAffected"
                    value={formData.quantityAffected}
                    onChange={handleChange}
                    placeholder="0"
                    className="flex-1 min-w-0 text-xs bg-white border border-r-0 border-zinc-200 rounded-l-lg px-3 py-2.5 text-zinc-800 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                  />
                  <select
                    name="quantityUnit"
                    value={formData.quantityUnit || 'kg'}
                    onChange={handleChange}
                    className="text-xs font-semibold bg-zinc-100 border border-zinc-200 rounded-r-lg px-2.5 py-2.5 text-zinc-700 hover:bg-zinc-200/70 cursor-pointer focus:outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="vials">vials</option>
                    <option value="packs">packs</option>
                    <option value="drums">drums</option>
                  </select>
                </div>
              </FieldWrapper>

              <FieldWrapper fieldName="mfgDate" label="Manufacturing Date" icon={Calendar}>
                <input
                  type="date"
                  name="mfgDate"
                  value={formData.mfgDate}
                  onChange={handleChange}
                  className="w-full text-xs bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                />
              </FieldWrapper>

              <FieldWrapper fieldName="expiryDate" label="Expiry Date" icon={Calendar}>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full text-xs bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                />
              </FieldWrapper>
            </div>
          </div>

          {/* SECTION 03: DEFECT CHARACTERIZATION & NARRATIVE */}
          <div className="rounded-xl border border-zinc-200/80 p-4 bg-zinc-50/40 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white text-[11px] font-bold">3</span>
                <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Defect Characterization & Narrative</h2>
              </div>
              {isSec3Complete && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldWrapper fieldName="complaintType" label="Complaint Category / Type" icon={FileText}>
                <select
                  name="complaintType"
                  value={formData.complaintType}
                  onChange={handleChange}
                  className="w-full text-xs bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                >
                  <option value="" disabled>Select category...</option>
                  {COMPLAINT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </FieldWrapper>

              <FieldWrapper fieldName="complaintDate" label="Incident / Log Date" icon={Calendar}>
                <input
                  type="date"
                  name="complaintDate"
                  value={formData.complaintDate}
                  onChange={handleChange}
                  className="w-full text-xs bg-white border border-zinc-200 rounded-lg px-3 py-2.5 text-zinc-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                />
              </FieldWrapper>
            </div>

            <FieldWrapper fieldName="detailedDescription" label="Detailed Event Description" icon={FileText}>
              <div className="space-y-2">
                <textarea
                  name="detailedDescription"
                  rows={4}
                  value={formData.detailedDescription}
                  onChange={handleChange}
                  placeholder="Provide technical event narrative, batch defect symptoms, QC observations..."
                  className="w-full text-xs bg-white border border-zinc-200 rounded-lg p-3 text-zinc-800 placeholder-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
                />

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                    <TagIcon className="w-3 h-3 text-zinc-400" /> Quick tags:
                  </span>
                  {QUICK_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAppendTag(tag)}
                      className="px-2 py-0.5 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 text-[10px] font-medium text-zinc-700 transition-all shadow-2xs"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>
              </div>
            </FieldWrapper>
          </div>

          {/* SECTION 04: INITIAL AI TRIAGE & GXP SEVERITY */}
          <div className="rounded-xl border border-zinc-200/80 p-4 bg-zinc-50/40 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-900 text-white text-[11px] font-bold">4</span>
                <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Initial AI Triage & GxP Severity</h2>
              </div>
              {isSec4Complete && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <FieldWrapper fieldName="initialSeverity" label="GxP Severity Level" icon={AlertTriangle}>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-200/70 border border-zinc-200">
                  {[
                    { value: 'Minor', color: 'bg-emerald-600 text-white shadow-sm', hover: 'hover:bg-emerald-100 text-emerald-800' },
                    { value: 'Major', color: 'bg-amber-500 text-white shadow-sm', hover: 'hover:bg-amber-100 text-amber-900' },
                    { value: 'Critical', color: 'bg-rose-600 text-white shadow-sm', hover: 'hover:bg-rose-100 text-rose-900' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectField('initialSeverity', opt.value)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                        formData.initialSeverity === opt.value
                          ? opt.color
                          : `bg-white/80 text-zinc-600 ${opt.hover}`
                      }`}
                    >
                      {opt.value}
                    </button>
                  ))}
                </div>
              </FieldWrapper>

              <FieldWrapper fieldName="priority" label="Priority Tier" icon={ShieldAlert}>
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-200/70 border border-zinc-200">
                  {[
                    { label: 'P3 Normal', value: 'Low', color: 'bg-zinc-800 text-white' },
                    { label: 'P2 High', value: 'High', color: 'bg-indigo-600 text-white' },
                    { label: 'P1 Expedited', value: 'Urgent', color: 'bg-purple-600 text-white animate-pulse' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectField('priority', opt.value)}
                      className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all text-center ${
                        formData.priority === opt.value
                          ? opt.color
                          : 'bg-white/80 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </FieldWrapper>

            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-all shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
              Reset Form
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold tracking-wide transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-indigo-400" />
              {trackingId ? 'Update Logged Record' : 'Save & Log Complaint'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
