"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    // Auto-dismiss after 3 seconds
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-6"
          >
            <div className={`
              flex items-center gap-4 p-4 border backdrop-blur-md shadow-2xl
              ${toast.type === 'error' 
                ? 'bg-red-950/80 border-red-500/50 text-red-200' 
                : 'bg-zinc-900/80 border-brand-neon/50 text-brand-neon'}
            `}>
              {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
              
              <div className="flex-1">
                <h4 className="text-xs font-black uppercase tracking-widest mb-1">
                  {toast.type === 'error' ? 'System Error' : 'Success'}
                </h4>
                <p className="text-xs font-mono text-white/80">{toast.message}</p>
              </div>

              <button onClick={() => setToast(null)}><X size={14} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}