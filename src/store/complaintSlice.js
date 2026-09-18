import { createSlice } from '@reduxjs/toolkit';

const initialFormData = {
  complaintSource: '',
  customerName: '',
  productName: '',
  productStrengthGrade: '',
  batchLotNumber: '',
  mfgDate: '',
  expiryDate: '',
  quantityAffected: '',
  quantityUnit: 'kg',
  complaintType: '',
  complaintDate: '',
  detailedDescription: '',
  initialSeverity: '',
  priority: '',
};

const initialState = {
  formData: { ...initialFormData },
  statusBadge: 'Pending Triage',
  trackingId: null, // e.g. "CMP-2026-0042"
  aiConfidence: {},
  completenessInfo: {
    completenessScore: 100,
    missingMandatoryFields: [],
    actionRequired: null,
  },
  duplicateInfo: {
    isDuplicateBatch: false,
    priorComplaintIds: [],
    duplicateAlert: null,
  },
  extraction: {
    isExtracting: false,
    progress: 0,
    statusMessage: '',
    currentStep: 0,
  },
  triageSummary: null,
  messages: [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: 'Welcome to PharmaPulse Copilot. Drop a pharmacovigilance report, quality audit, or email to automatically parse batch traceability and run GxP triage.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  savedLogs: [],
};

const complaintSlice = createSlice({
  name: 'complaint',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      if (field in state.formData) {
        state.formData[field] = value;
        if (state.aiConfidence[field]) {
          delete state.aiConfidence[field];
        }
      }
    },
    setAllFormData: (state, action) => {
      const { data, confidence } = action.payload;
      state.formData = {
        ...state.formData,
        ...(data || action.payload),
      };
      if (confidence) {
        state.aiConfidence = { ...confidence };
      } else {
        const newConf = {};
        Object.keys(data || action.payload).forEach((k) => {
          if (data?.[k] || action.payload[k]) {
            newConf[k] = Math.floor(92 + Math.random() * 7);
          }
        });
        state.aiConfidence = newConf;
      }
    },
    dismissConfidence: (state, action) => {
      const field = action.payload;
      if (state.aiConfidence[field]) {
        delete state.aiConfidence[field];
      }
    },
    setCompletenessInfo: (state, action) => {
      state.completenessInfo = {
        completenessScore: action.payload?.completenessScore ?? 100,
        missingMandatoryFields: action.payload?.missingMandatoryFields || [],
        actionRequired: action.payload?.actionRequired || null,
      };
    },
    setDuplicateInfo: (state, action) => {
      state.duplicateInfo = {
        isDuplicateBatch: Boolean(action.payload?.isDuplicateBatch),
        priorComplaintIds: action.payload?.priorComplaintIds || [],
        duplicateAlert: action.payload?.duplicateAlert || null,
      };
    },
    setTrackingId: (state, action) => {
      state.trackingId = action.payload;
      state.statusBadge = `Logged & Triaged (${action.payload})`;
    },
    resetForm: (state) => {
      state.formData = { ...initialFormData };
      state.statusBadge = 'Pending Triage';
      state.trackingId = null;
      state.aiConfidence = {};
      state.triageSummary = null;
      state.completenessInfo = {
        completenessScore: 100,
        missingMandatoryFields: [],
        actionRequired: null,
      };
      state.duplicateInfo = {
        isDuplicateBatch: false,
        priorComplaintIds: [],
        duplicateAlert: null,
      };
      state.extraction = {
        isExtracting: false,
        progress: 0,
        statusMessage: '',
        currentStep: 0,
      };
      state.messages = [
        {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: 'Form reset to blank initial state. Ready for next document ingestion.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ];
    },
    setExtractionProgress: (state, action) => {
      const { progress, statusMessage, isExtracting, currentStep } = action.payload;
      if (progress !== undefined) state.extraction.progress = progress;
      if (statusMessage !== undefined) state.extraction.statusMessage = statusMessage;
      if (currentStep !== undefined) state.extraction.currentStep = currentStep;
      
      if (isExtracting !== undefined) {
        state.extraction.isExtracting = isExtracting;
      } else if (progress > 0 && progress < 100) {
        state.extraction.isExtracting = true;
      } else if (progress === 100 || progress === 0) {
        state.extraction.isExtracting = false;
      }
    },
    setTriageSummary: (state, action) => {
      state.triageSummary = action.payload;
    },
    addChatMessage: (state, action) => {
      const { sender, text } = action.payload;
      state.messages.push({
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: sender || 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    },
    setStatusBadge: (state, action) => {
      state.statusBadge = action.payload;
    },
    saveComplaintToLogs: (state, action) => {
      const trackingId = action.payload || `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      state.trackingId = trackingId;
      state.savedLogs.unshift({
        id: trackingId,
        data: { ...state.formData },
        triageSummary: state.triageSummary,
        status: 'Logged & Triaged',
        timestamp: new Date().toISOString(),
      });
      state.statusBadge = `Logged & Triaged (${trackingId})`;
    }
  },
});

export const {
  updateFormField,
  setAllFormData,
  dismissConfidence,
  setCompletenessInfo,
  setDuplicateInfo,
  setTrackingId,
  resetForm,
  setExtractionProgress,
  setTriageSummary,
  addChatMessage,
  setStatusBadge,
  saveComplaintToLogs,
} = complaintSlice.actions;

export default complaintSlice.reducer;
