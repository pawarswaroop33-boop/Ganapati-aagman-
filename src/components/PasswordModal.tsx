import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, X, ShieldCheck, KeyRound } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPassword?: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentPassword = '1234',
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPasswordInput('');
      setErrorMsg('');
      setShowPassword(false);
      setIsShaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = passwordInput.trim();
    const actualPassword = (currentPassword || '1234').trim();

    if (cleanInput === actualPassword) {
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('चुकीचा पासवर्ड! कृपया पुन्हा प्रयत्न करा.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: isShaking ? [-8, 8, -6, 6, -3, 3, 0] : 0,
          }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{
            duration: isShaking ? 0.4 : 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#082215] via-[#05190f] to-[#030e07] border-2 border-amber-500/50 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-center text-white"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer absolute top-4 right-4 p-1.5 rounded-full bg-black/40 hover:bg-black/70 border border-amber-500/30 text-stone-300 hover:text-white transition"
            title="बंद करा"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Golden Medallion Lock Icon */}
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-[0_0_20px_rgba(245,158,11,0.45)] mb-3.5 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#04120a] flex items-center justify-center">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <p className="text-xs font-serif font-bold tracking-widest text-amber-300 uppercase mb-1">
            || श्री गणेशाय नमः ||
          </p>
          <h3 className="text-lg font-bold font-serif text-white mb-1.5">
            सुरक्षा पडताळणी
          </h3>
          <p className="text-xs text-stone-300 font-serif leading-relaxed mb-4 px-2">
            निमंत्रण पत्रिकेत किंवा नावात बदल करण्यासाठी कृपया ॲडमिन पासवर्ड टाका.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400/80">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="पासवर्ड प्रविष्ट करा..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#030e07] border border-amber-500/40 text-white text-sm font-sans tracking-wide placeholder:text-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-amber-300 transition"
                title={showPassword ? 'पासवर्ड लपवा' : 'पासवर्ड दाखवा'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-serif font-semibold animate-pulse">
                {errorMsg}
              </p>
            )}

            {/* Hint for default password */}
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-serif text-amber-300/90 text-left flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                पहिल्या वेळी वापरत असल्यास डिफॉल्ट पासवर्ड <strong>1234</strong> आहे. हा पासवर्ड सेटिंग्ज उघडल्यानंतर कधीही बदलता येतो.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer flex-1 py-2.5 px-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-serif font-bold transition active:scale-95"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                className="cursor-pointer flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-serif font-bold shadow-lg shadow-amber-950/60 transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>प्रवेश करा</span>
                <span>🔓</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
