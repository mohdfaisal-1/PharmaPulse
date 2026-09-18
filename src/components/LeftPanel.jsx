import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField, resetForm, saveComplaintToLogs } from '../store/complaintSlice';
import { 
  RotateCcw, 
  Save, 
  Calendar, 
  Building2, 
  User, 
  Package, 
  Tag, 
  Layers, 
  Scale, 
  AlertTriangle, 
  FileText,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function LeftPanel({ onShowToast }) {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.complaint.formData);
  const statusBadge = useSelector((state) => state.complaint.statusBadge);
  const isExtracting = useSelector((state) => state.complaint.extraction.isExtracting);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormField({ field: name, value }));
  };

  const handleReset = () => {
    dispatch(resetForm());
    if (onShowToast) onShowToast('Form reset to initial state', 'info');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.productName && !formData.customerName) {
      if (onShowToast) onShowToast('Please fill in or extract complaint details before saving', 'warning');
      return;
    }
    dispatch(saveComplaintToLogs());
    if (onShowToast) onShowToast('Complaint successfully triaged and saved to QMS database!', 'success');
  };

  return (
    <div className="lg:col-span-7 flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 relative overflow-hidden transition-all duration-200">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>

        {/* Panel Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Log Customer Complaint</h1>
              {isExtracting && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 animate-pulse border border-blue-200">
                  <Sparkles className="w-3 h-3 text-blue-500 animate-spin" /> Auto-Filling...
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              API & FDF Quality Assurance Module • GMP Compliance Track
            </p>
          </div>

          {/* Status Badge */}
          <div className="self-start sm:self-center">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide shadow-sm border ${
              statusBadge === 'Triaged & Logged' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200/80'
            }`}>
              {statusBadge === 'Triaged & Logged' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              )}
              {statusBadge}
            </span>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSave} className="mt-5 space-y-6">

          {/* SECTION 1: ORIGIN & CUSTOMER DETAILS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
              <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Origin & Customer Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> Complaint Source
                </label>
                <input
                  type="text"
                  name="complaintSource"
                  value={formData.complaintSource}
                  onChange={handleChange}
                  placeholder="Awaiting AI extraction..."
                  className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                    formData.complaintSource ? 'border-slate-300 font-medium' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Awaiting AI extraction..."
                  className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                    formData.customerName ? 'border-slate-300 font-medium' : 'border-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PRODUCT & BATCH IDENTIFICATION */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">2</span>
              <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Product & Batch Identification</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-slate-400" /> Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Awaiting AI extraction..."
                  className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                    formData.productName ? 'border-slate-300 font-medium' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" /> Product Strength / Grade
                </label>
                <input
                  type="text"
                  name="productStrengthGrade"
                  value={formData.productStrengthGrade}
                  onChange={handleChange}
                  placeholder="Awaiting AI extraction..."
                  className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                    formData.productStrengthGrade ? 'border-slate-300 font-medium' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" /> Batch / Lot Number
                </label>
                <input
                  type="text"
                  name="batchLotNumber"
                  value={formData.batchLotNumber}
                  onChange={handleChange}
                  placeholder="Awaiting AI extraction..."
                  className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                    formData.batchLotNumber ? 'border-slate-300 font-mono font-medium' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-slate-400" /> Quantity Affected
                </label>
                <div className="relative rounded-lg shadow-none">
                  <input
                    type="text"
                    name="quantityAffected"
                    value={formData.quantityAffected}
                    onChange={handleChange}
                    placeholder="0"
                    className={`w-full text-sm bg-slate-50/70 border rounded-lg pl-3.5 pr-12 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                      formData.quantityAffected ? 'border-slate-300 font-medium' : 'border-slate-200'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-bold text-slate-400 bg-slate-100/60 my-1 mr-1 px-2 rounded">
                    kg
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Manufacturing Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="mfgDate"
                    value={formData.mfgDate}
                    onChange={handleChange}
                    className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                      formData.mfgDate ? 'border-slate-300 font-medium' : 'border-slate-200 text-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Expiry Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                      formData.expiryDate ? 'border-slate-300 font-medium' : 'border-slate-200 text-slate-400'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: COMPLAINT DETAILS */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">3</span>
              <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Complaint Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> Complaint Type
                </label>
                <input
                  type="text"
                  name="complaintType"
                  value={formData.complaintType}
                  onChange={handleChange}
                  placeholder="Awaiting AI extraction..."
                  className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                    formData.complaintType ? 'border-slate-300 font-medium' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Complaint Date
                </label>
                <input
                  type="date"
                  name="complaintDate"
                  value={formData.complaintDate}
                  onChange={handleChange}
                  className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                    formData.complaintDate ? 'border-slate-300 font-medium' : 'border-slate-200 text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Detailed Complaint Description
              </label>
              <textarea
                name="detailedDescription"
                rows={3}
                value={formData.detailedDescription}
                onChange={handleChange}
                placeholder="Awaiting AI extraction..."
                className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all leading-relaxed ${
                  formData.detailedDescription ? 'border-slate-300 font-normal' : 'border-slate-200'
                }`}
              />
            </div>
          </div>

          {/* SECTION 4: INITIAL ASSESSMENT & PRIORITY */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">4</span>
              <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Initial Assessment & Priority</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-400" /> Initial Severity
                </label>
                <div className="relative">
                  <select
                    name="initialSeverity"
                    value={formData.initialSeverity}
                    onChange={handleChange}
                    className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                      formData.initialSeverity === 'Critical'
                        ? 'border-rose-300 bg-rose-50/50 text-rose-900 font-semibold'
                        : formData.initialSeverity === 'Major'
                        ? 'border-amber-300 bg-amber-50/50 text-amber-900 font-semibold'
                        : formData.initialSeverity
                        ? 'border-slate-300 font-medium'
                        : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <option value="" disabled>Awaiting AI extraction...</option>
                    <option value="Minor">Minor (Cosmetic/Labeling)</option>
                    <option value="Major">Major (Quality Out-of-Spec)</option>
                    <option value="Critical">Critical (Safety/Contamination Risk)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-400" /> Priority
                </label>
                <div className="relative">
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className={`w-full text-sm bg-slate-50/70 border rounded-lg px-3.5 py-2.5 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${
                      formData.priority === 'Urgent'
                        ? 'border-rose-300 bg-rose-50/50 text-rose-900 font-semibold'
                        : formData.priority === 'High'
                        ? 'border-orange-300 bg-orange-50/50 text-orange-900 font-semibold'
                        : formData.priority
                        ? 'border-slate-300 font-medium'
                        : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <option value="" disabled>Awaiting AI extraction...</option>
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Urgent">Urgent / Immediate Action</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Reset Form
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold tracking-wide shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save Complaint
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
