import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, LayoutDashboard, History, Settings, Bell, Search, User as UserIcon, RefreshCcw } from 'lucide-react';
import { IdentityUpload } from './components/IdentityUpload';
import { AgentLog } from './components/AgentLog';
import { VerificationSummary } from './components/VerificationSummary';
import { geminiService } from './services/geminiService';
import { VerificationResult, AgentLogEntry, IdentityData } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState<AgentLogEntry[]>([]);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleUpload = async (base64: string, mimeType: string) => {
    setIsProcessing(true);
    setLogs([]);
    setResult(null);

    try {
      // Step 1: OCR Extraction
      const identityData = await geminiService.extractIdentity(base64, mimeType);
      
      // Step 2: Agentic Verification
      const { status, riskScore } = await geminiService.runAgenticVerification(
        identityData,
        (newLog) => setLogs(prev => [...prev, newLog])
      );

      setResult({
        id: Math.random().toString(36).substr(2, 9),
        status,
        identityData,
        riskScore,
        logs: [], // Actual logs are in specialized state for live display
      });
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#0A0B10] text-[#F8FAFC] tech-grid selection:bg-blue-500/30">
      {/* Navigation Rail */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 border-r border-slate-800 flex flex-col items-center py-8 z-50 glass-card">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-12 shadow-lg shadow-blue-500/20">
          <Shield className="w-7 h-7 text-white" />
        </div>
        
        <nav className="flex flex-col gap-6">
          <NavItem icon={LayoutDashboard} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={History} active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <NavItem icon={Settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <NavItem icon={Bell} />
          <div className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden">
            <UserIcon className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pl-20 min-h-screen">
        {/* Header */}
        <header className="h-20 border-b border-slate-800 flex items-center justify-between px-12 glass-card fixed top-0 left-20 right-0 z-40">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight">VeriSmart AI Control</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-mono">Digital Identity Protocol v1.4.2</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Identity Hub..." 
                className="bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-blue-500 transition-all font-mono"
              />
            </div>
            {result && (
              <button 
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                NEW SESSION
              </button>
            )}
          </div>
        </header>

        <div className="pt-28 pb-12 px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Actions & Results */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-8">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold">Start Verification</h2>
                    <p className="text-slate-500 max-w-lg">Initiate a secure, multi-agent background verification. Upload identity documents to trigger neural OCR extraction.</p>
                    </div>
                    <IdentityUpload onUpload={handleUpload} isProcessing={isProcessing} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="summary"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    <VerificationSummary result={result} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Agent Activity Log */}
            <div className="lg:col-span-12 xl:col-span-5 h-[calc(100vh-250px)] sticky top-32">
              <AgentLog logs={logs} />
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-blue-600/5 blur-[128px] -z-10 pointer-events-none" />
      <div className="fixed top-0 left-20 w-64 h-64 bg-emerald-600/5 blur-[100px] -z-10 pointer-events-none" />
    </div>
  );
}

function NavItem({ icon: Icon, active, onClick }: { icon: any, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 group",
        active ? "bg-blue-500/10 text-blue-500" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
      )}
    >
      <Icon className="w-6 h-6 z-10" />
      {active && (
        <motion.div 
          layoutId="nav-active"
          className="absolute inset-0 bg-blue-500/10 rounded-xl border border-blue-500/20"
        />
      )}
      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        TAB NAME
      </div>
    </button>
  );
}
