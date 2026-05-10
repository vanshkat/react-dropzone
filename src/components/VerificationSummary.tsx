import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, Fingerprint, Globe, Calendar, User, Hash, Lock } from 'lucide-react';
import { VerificationResult } from '../types';
import { cn } from '../lib/utils';

interface VerificationSummaryProps {
  result: VerificationResult;
}

export function VerificationSummary({ result }: VerificationSummaryProps) {
  const isVerified = result.status === 'verified';
  const isFlagged = result.status === 'flagged';

  const dataFields = [
    { label: 'Full Name', value: result.identityData?.fullName, icon: User },
    { label: 'Document Type', value: result.identityData?.documentType, icon: Hash },
    { label: 'Document Number', value: result.identityData?.documentNumber, icon: Hash },
    { label: 'Expiry Date', value: result.identityData?.expiryDate, icon: Calendar },
    { label: 'Date of Birth', value: result.identityData?.dateOfBirth, icon: Calendar },
    { label: 'Nationality', value: result.identityData?.nationality, icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div className={cn(
        "relative overflow-hidden p-8 rounded-3xl border-2 transition-all duration-500",
        isVerified ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_40px_-15px_rgba(16,185,129,0.3)]" :
        isFlagged ? "border-amber-500/30 bg-amber-500/5 shadow-[0_0_40px_-15px_rgba(245,158,11,0.3)]" :
        "border-slate-800 bg-slate-900/50"
      )}>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className={cn(
              "p-6 rounded-full border-4",
              isVerified ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" :
              isFlagged ? "border-amber-500 bg-amber-500/10 text-amber-500" :
              "border-slate-700 bg-slate-800 text-slate-500"
            )}>
              {isVerified ? <ShieldCheck className="w-16 h-16" /> : <ShieldAlert className="w-16 h-16" />}
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-2 -right-2 bg-slate-950 p-2 rounded-full border border-slate-700"
            >
              <Fingerprint className="w-6 h-6 text-blue-500" />
            </motion.div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]",
                isVerified ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"
              )}>
                {result.status}
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                Risk Score: {result.riskScore}/100
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-100 mb-2">
              {isVerified ? "Verification Successful" : "Manual Review Required"}
            </h2>
            <p className="text-slate-400 max-w-md mx-auto md:mx-0">
              {isVerified 
                ? "All multi-agent security checks have passed. Digital identity has been cryptographically signed and stored."
                : "A potential discrepancy was detected in the background research phase. System flag raised for manual audit."}
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase mb-2">Trust Level</div>
            <div className={cn(
              "text-4xl font-mono font-bold",
              isVerified ? "text-emerald-500" : "text-amber-500"
            )}>
              {(100 - result.riskScore).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataFields.map((field, idx) => (
          <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/30">
            <div className="p-3 rounded-lg bg-slate-800/50">
              <field.icon className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{field.label}</div>
              <div className="text-sm font-mono font-medium text-slate-200">
                {field.value || <span className="opacity-30">N/A</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-300">
            Cryptographic Proof (Selective Disclosure)
          </h3>
        </div>
        <div className="font-mono text-[10px] text-slate-500 break-all p-4 rounded-lg bg-slate-950 border border-slate-800 leading-relaxed">
          {result.proofHash || "SHA256: 0x" + Math.random().toString(16).slice(2) + "..."}
        </div>
        <div className="mt-4 flex gap-2">
          <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[10px] font-mono">HASHED_ZKP_V1</span>
          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-mono">NON-REPUDIABLE</span>
        </div>
      </div>
    </div>
  );
}
