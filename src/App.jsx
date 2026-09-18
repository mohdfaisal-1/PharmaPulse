import React, { useState } from 'react';
import Header from './components/Header';
import ComplaintForm from './components/ComplaintForm';
import AIAssistantPanel from './components/AIAssistantPanel';
import PasteTextModal from './components/PasteTextModal';
import Toast from './components/Toast';

export default function App() {
  const [toast, setToast] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navigation Bar */}
      <Header 
        onOpenImportModal={() => setIsImportModalOpen(true)} 
        onShowToast={showToast}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Form Experience (lg:col-span-7) */}
          <ComplaintForm onShowToast={showToast} />

          {/* AI Copilot Panel (lg:col-span-5) */}
          <AIAssistantPanel onShowToast={showToast} />
        </div>
      </main>

      {/* Footer / Telemetry Status */}
      <footer className="bg-white border-t border-zinc-200 py-3 px-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 PharmaPulse AI System • GxP Clinical Quality Management & Triage Suite</p>
          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
            <span>Audit Logging: ACTIVE</span>
            <span>•</span>
            <span>21 CFR Part 11 COMPLIANT</span>
          </div>
        </div>
      </footer>

      {/* Global Import Document Modal */}
      <PasteTextModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onExtractText={(text) => {
          // Triggers paste extraction in assistant panel
          const btn = document.querySelector('[data-trigger-extraction]');
          if (btn) btn.click();
        }}
      />

      {/* Toast Alerts */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
