import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface IdentityUploadProps {
  onUpload: (base64: string, mimeType: string) => void;
  isProcessing: boolean;
}

export function IdentityUpload({ onUpload, isProcessing }: IdentityUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onUpload(base64, file.type);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false,
    disabled: isProcessing
  } as any);

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          "relative group border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center",
          isDragActive ? "border-blue-500 bg-blue-500/5" : "border-slate-800 hover:border-slate-700",
          isProcessing && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative z-10 w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-slate-700 shadow-2xl">
            <img src={preview} alt="ID Document Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium">Replace Document</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-500 transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Upload Identity Document</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-[240px]">
                Support for Passport, Driver License, or National ID. (PNG, JPG)
              </p>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <span className="text-lg font-mono font-medium tracking-tight animate-pulse text-blue-400">
              INITIATING NEURAL OCR SCAN...
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Format</div>
            <div className="text-sm font-mono text-slate-300">BIO-DOC/SEC-V1</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <ImageIcon className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Standard</div>
            <div className="text-sm font-mono text-slate-300">ICAO/9303-INT</div>
          </div>
        </div>
      </div>
    </div>
  );
}
