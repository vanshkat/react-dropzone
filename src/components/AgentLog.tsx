import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AgentLogEntry } from '../types';
import { cn } from '../lib/utils';
import { useEffect, useRef } from 'react';

interface AgentLogProps {
  logs: AgentLogEntry[];
}

export function AgentLog({ logs }: AgentLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full glass-card rounded-2xl overflow-hidden border border-slate-800">
      <div className="flex items-center justify-between px-6 py-4 border-bottom border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
            Multi-Agent Process Log
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Live Analysis</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-hide font-mono text-sm leading-relaxed"
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-50">
              <Shield className="w-12 h-12 mb-4" />
              <p className="text-xs uppercase tracking-widest">Waiting for session start...</p>
            </div>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 p-3 rounded-lg bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 transition-colors"
              >
                <div className={cn(
                  "mt-1 p-1 rounded",
                  log.type === 'success' ? "bg-emerald-500/10 text-emerald-500" :
                  log.type === 'warning' ? "bg-amber-500/10 text-amber-500" :
                  log.type === 'error' ? "bg-rose-500/10 text-rose-500" :
                  "bg-blue-500/10 text-blue-500"
                )}>
                  {log.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                   log.type === 'warning' ? <AlertCircle className="w-3.5 h-3.5" /> :
                   log.type === 'error' ? <Zap className="w-3.5 h-3.5" /> :
                   <Shield className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase text-slate-500">[{log.agentName}]</span>
                    <span className="text-[10px] text-slate-600">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-300 break-words">{log.message}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <div className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
          Runtime: V0.9.2-AGENTIC-BETA
        </div>
        <div className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
          Encryption: AES-256-GCM
        </div>
      </div>
    </div>
  );
}
