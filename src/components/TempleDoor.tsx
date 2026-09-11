import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bell, Settings } from 'lucide-react';
import { templeAudio } from '../utils/audio';

interface TempleDoorProps {
  isOpen: boolean;
  onOpen: () => void;
  onShower?: () => void;
  familyHeading?: string;
  familyName?: string;
  onOpenCustomize?: (tab?: 'door' | 'photos' | 'family' | 'details') => void;
}

export const TempleDoor: React.FC<TempleDoorProps> = ({
  isOpen,
  onOpen,
  onShower,
  familyHeading = 'देशपांडे परिवाराकडून',
  familyName = 'देशपांडे परिवार',
  onOpenCustomize,
}) => {
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);

  const handleDoorClick = () => {
    if (isOpeningAnim || isOpen) return;
    setIsOpeningAnim(true);

    // Audio effects: Bell chime immediately
    templeAudio.ringBell();

    // Iconic Maharashtrian Tutari Fanfare heralding Ganapati Bappa's Aagman
    setTimeout(() => {
      templeAudio.playTutari();
    }, 150);

    // Trigger super smooth flower shower cascading down as doors open
    setTimeout(() => {
      if (onShower) onShower();
    }, 200);

    // Start ambient devotional background music
    templeAudio.startDevotionalAmbient();

    // Trigger open state smoothly
    setTimeout(() => {
      onOpen();
      setIsOpeningAnim(false);
    }, 580);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="temple-door-wrapper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#04120a] will-change-transform select-none"
        >
          {/* Subtle golden ambient background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/15 via-[#061910]/90 to-[#020b06] pointer-events-none" />

          {/* Top-Right Highly Visible Settings Button on Door Screen */}
          {onOpenCustomize && (
            <button
              type="button"
              onClick={() => onOpenCustomize('door')}
              className="absolute top-4 right-4 z-50 cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-stone-950 text-xs sm:text-sm font-serif font-black shadow-[0_0_25px_rgba(245,158,11,0.7)] border-2 border-amber-100 backdrop-blur-md transition-all duration-300 active:scale-95"
              title="सेटिंग्ज: दारावरील नाव, फोटो, निमंत्रण व पासवर्ड बदला"
            >
              <Settings className="w-4 h-4 text-stone-950 stroke-[2.5] animate-[spin_8s_linear_infinite]" />
              <span className="tracking-tight">⚙️ सेटिंग्ज (नाव बदला)</span>
            </button>
          )}

          {/* Left Door Panel */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpeningAnim ? { x: '-105%' } : { x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#031008] via-[#082217] to-[#0a291b] border-r border-[#d4af37]/60 shadow-2xl flex flex-col justify-between p-5 sm:p-10 overflow-hidden will-change-transform"
          >
            {/* Traditional filigree vertical borders */}
            <div className="absolute top-0 bottom-0 right-3 w-1 bg-gradient-to-b from-[#ca8a04] via-[#fef08a] to-[#ca8a04] opacity-80" />
            <div className="absolute top-4 bottom-4 right-7 w-px border-r border-dashed border-[#d4af37]/35" />

            {/* Corner Ornamental Mandalas */}
            <div className="text-amber-500/30">
              <svg className="w-12 h-12 sm:w-20 sm:h-20" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z" />
                <circle cx="20" cy="20" r="4" />
                <path d="M5,15 Q15,15 15,5" stroke="currentColor" fill="none" strokeWidth="2" />
              </svg>
            </div>

            {/* Traditional Marathi auspicious mantra watermark */}
            <div className="my-auto pl-2 sm:pl-6 space-y-3 opacity-80">
              <span className="text-[#fef08a] font-serif text-sm sm:text-lg tracking-widest block drop-shadow font-bold">
                || वक्रतुण्ड महाकाय ||
              </span>
              <p className="text-xs sm:text-sm text-amber-200/70 font-serif leading-relaxed max-w-[190px] hidden sm:block">
                सूर्यकोटि समप्रभ । <br />
                निर्विघ्नं कुरु मे देव <br />
                सर्वकार्येषु सर्वदा ॥
              </p>
            </div>

            <div className="text-amber-500/30 rotate-90 origin-bottom-left">
              <svg className="w-12 h-12 sm:w-20 sm:h-20" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z" />
                <circle cx="20" cy="20" r="4" />
              </svg>
            </div>
          </motion.div>

          {/* Right Door Panel */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpeningAnim ? { x: '105%' } : { x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#031008] via-[#082217] to-[#0a291b] border-l border-[#d4af37]/60 shadow-2xl flex flex-col justify-between p-5 sm:p-10 overflow-hidden items-end will-change-transform"
          >
            {/* Traditional filigree vertical borders */}
            <div className="absolute top-0 bottom-0 left-3 w-1 bg-gradient-to-b from-[#ca8a04] via-[#fef08a] to-[#ca8a04] opacity-80" />
            <div className="absolute top-4 bottom-4 left-7 w-px border-l border-dashed border-[#d4af37]/35" />

            {/* Corner Ornamental Mandalas */}
            <div className="text-amber-500/30 rotate-90 origin-top-right">
              <svg className="w-12 h-12 sm:w-20 sm:h-20" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z" />
                <circle cx="20" cy="20" r="4" />
              </svg>
            </div>

            <div className="my-auto pr-2 sm:pr-6 text-right space-y-3 opacity-80">
              <span className="text-[#fef08a] font-serif text-sm sm:text-lg tracking-widest block drop-shadow font-bold">
                || गणेशाय नमः ||
              </span>
              <p className="text-xs sm:text-sm text-amber-200/70 font-serif leading-relaxed max-w-[190px] hidden sm:block">
                शुभ लाभ । <br />
                आनंद मंगल । <br />
                सुख समृद्धी ॥
              </p>
            </div>

            <div className="text-amber-500/30 -rotate-90 origin-bottom-right">
              <svg className="w-12 h-12 sm:w-20 sm:h-20" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z" />
                <circle cx="20" cy="20" r="4" />
              </svg>
            </div>
          </motion.div>

          {/* Center Ornate Golden Seal / Lock */}
          <div className="relative z-50 flex flex-col items-center">
            {/* Top Invocation text above seal */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-center mb-5 px-4"
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider font-serif shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>|| श्री गणेशाय नमः ||</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold font-serif text-amber-100 mt-2 drop-shadow">
                {familyHeading}
              </h2>
              {onOpenCustomize && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCustomize('door');
                  }}
                  className="mt-1 cursor-pointer inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/30 text-[11px] font-serif text-amber-300 transition active:scale-95"
                  title="दारावरील हे नाव बदला"
                >
                  <span>✏️</span>
                  <span>नाव बदला</span>
                </button>
              )}
              <p className="text-xs sm:text-sm text-amber-300/80 font-serif tracking-widest mt-1">
                गणपती आगमन २०२५
              </p>
            </motion.div>

            {/* The Golden Medallion */}
            <motion.button
              id="open-temple-door-btn"
              onClick={handleDoorClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative cursor-pointer focus:outline-none"
              title="निमंत्रण उघडण्यासाठी टॅप करा (Tap to open)"
            >
              {/* Outer Golden Halo Rings */}
              <div className="absolute -inset-4 rounded-full bg-amber-500/25 blur-lg group-hover:bg-amber-400/35 transition" />
              <div className="absolute -inset-1 rounded-full border border-amber-400/50" />

              {/* Medallion Body */}
              <div className="relative w-28 h-28 sm:w-34 sm:h-34 rounded-full bg-gradient-to-tr from-[#996515] via-[#ffd700] to-[#fef08a] p-1.5 shadow-[0_0_35px_rgba(212,175,55,0.5)] flex items-center justify-center">
                {/* Inner Ring */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5a3a0e] via-[#855314] to-[#3a2205] border-2 border-[#fef08a] flex flex-col items-center justify-center p-2 text-center shadow-inner relative overflow-hidden">
                  <div className="relative z-10 text-amber-200">
                    <span className="text-3xl sm:text-4xl block transform group-hover:scale-110 transition duration-200 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      🕉️
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-amber-200 uppercase tracking-widest font-serif mt-1 block">
                      प्रवेश करा
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Bottom Callout button (Bypass directly view patrika completely removed as requested) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mt-6 px-4"
            >
              <button
                id="door-callout-btn"
                onClick={handleDoorClick}
                className="cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 bg-[#072418]/95 hover:bg-[#0c3a28] border border-amber-500/40 px-5 py-2.5 rounded-full shadow-lg transition active:scale-95"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>दार उघडण्यासाठी टॅप करा • Tap to Open</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
