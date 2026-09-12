import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bell, Settings } from 'lucide-react';
import { templeAudio } from '../utils/audio';

interface TempleDoorProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpeningStart?: () => void;
  onShower?: () => void;
  familyHeading: string;
  familyName: string;
  onOpenCustomize?: (tab?: 'door' | 'photos' | 'family' | 'details' | 'preparations') => void;
}

export const TempleDoor: React.FC<TempleDoorProps> = ({
  isOpen,
  onOpen,
  onOpeningStart,
  onShower,
  familyHeading = 'देशपांडे परिवाराकडून',
  familyName = 'देशपांडे परिवार',
  onOpenCustomize,
}) => {
  const [isSwaying, setIsSwaying] = useState(false);
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpeningAnim) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setTilt({
      x: -y * 8, // slight 3D perspective tilt X (up to ~4 deg)
      y: x * 10, // slight 3D perspective tilt Y (up to ~5 deg)
    });
    setCursorPos({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setCursorPos({ x: 50, y: 50 });
  };

  const handleDoorClick = () => {
    if (isSwaying || isOpeningAnim || isOpen) return;

    // 1. Trigger natural decaying sway animation to door handles first
    setIsSwaying(true);

    // Audio effects: Bell chime immediately as handles swing and strike
    templeAudio.ringBell();

    // 2. After knocker strike resonates naturally (520ms), commence the grand stately opening sequence
    setTimeout(() => {
      setIsOpeningAnim(true);
      if (onOpeningStart) {
        onOpeningStart();
      }

      // Iconic Maharashtrian Tutari Fanfare heralding Ganapati Bappa's Aagman
      templeAudio.playTutari();

      // Trigger flower shower cascading down as doors open
      if (onShower) onShower();

      // Start ambient devotional background music
      templeAudio.startDevotionalAmbient();
    }, 520);

    // 3. Complete transition into the patrika after doors have fully swung open smoothly (3300ms total)
    setTimeout(() => {
      onOpen();
      setIsOpeningAnim(false);
      setIsSwaying(false);
    }, 3300);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="temple-door-wrapper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] } }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{ perspective: '1200px' }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#04120a] select-none cursor-pointer touch-none overscroll-none"
          onClick={handleDoorClick}
        >
          {/* 3D Perspective Stage Container */}
          <motion.div
            animate={{
              rotateX: tilt.x,
              rotateY: tilt.y,
            }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 24,
              mass: 1,
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="relative w-full h-full flex items-center justify-center pointer-events-auto"
          >
            {/* Subtle golden ambient background glow & dynamic cursor lighting sheen */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/15 via-[#061910]/90 to-[#020b06] pointer-events-none" />
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 500px at ${cursorPos.x}% ${cursorPos.y}%, rgba(254, 240, 138, 0.22), transparent 70%)`,
              }}
            />

            {/* Tiny & Inconspicuous Admin Settings Button in Top-Right Corner (Not noticeable to visitors) */}
            {onOpenCustomize && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCustomize('door');
                }}
                className="absolute top-3 right-3 z-50 cursor-pointer p-1.5 rounded-full text-stone-500/20 hover:text-amber-300/80 hover:bg-black/40 transition-opacity duration-300 opacity-20 hover:opacity-100"
                title="Settings"
              >
                <Settings className="w-3 h-3 text-stone-500/40" />
              </button>
            )}

            {/* Divine Sanctum Golden Radiance emerging smoothly as doors part slowly */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                isOpeningAnim
                  ? {
                      opacity: [0, 0.95, 0.6, 0],
                      scale: [0.5, 1.3, 2.4, 3.6],
                    }
                  : { opacity: 0, scale: 0.5 }
              }
              transition={{ duration: 2.8, ease: [0.32, 0.08, 0.24, 1] }}
              className="absolute inset-0 m-auto w-96 h-96 rounded-full bg-[radial-gradient(circle,_rgba(254,240,138,0.8)_0%,_rgba(245,158,11,0.5)_35%,_transparent_72%)] pointer-events-none z-10"
            />

            {/* Left Door Panel - Heavy Carved Teakwood Swing Physics */}
            <motion.div
              initial={{ x: 0, rotateY: 0 }}
              animate={
                isOpeningAnim
                  ? { x: '-106%', rotateY: -34 }
                  : { x: 0, rotateY: 0 }
              }
              transition={{ duration: 2.8, ease: [0.32, 0.08, 0.24, 1] }}
              style={{ transformOrigin: 'left center' }}
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#031008] via-[#082217] to-[#0a291b] border-r border-[#d4af37]/60 shadow-2xl flex flex-col justify-between p-5 sm:p-10 overflow-hidden will-change-transform z-20"
            >
              {/* Dynamic light falloff shadow as door panel swings outward */}
              <motion.div
                animate={{ opacity: isOpeningAnim ? 0.45 : 0 }}
                transition={{ duration: 2.8, ease: [0.32, 0.08, 0.24, 1] }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-black/25 to-black/75 pointer-events-none z-10"
              />
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

              {/* Left Door Antique Brass Ring Handle (कडी) */}
              <div className="absolute right-3 sm:right-6 md:right-10 top-[60%] -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none">
                {/* Brass Rosette Backplate */}
                <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#ffd700] via-[#b48316] to-[#5a3a0e] p-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.8)] border border-[#fef08a]/60 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#3d2407] border border-[#d4af37]/50 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#ca8a04] to-[#fef08a] shadow-inner" />
                  </div>
                </div>

                {/* Swinging Brass Drop Ring with Natural Decaying Sway Physics */}
                <motion.div
                  style={{ transformOrigin: 'top center' }}
                  animate={
                    isSwaying
                      ? {
                          rotate: [0, -26, 20, -12, 7, -3, 1, 0],
                        }
                      : {
                          rotate: [0, -1.5, 1.5, 0],
                        }
                  }
                  transition={
                    isSwaying
                      ? {
                          duration: 1.1,
                          ease: [0.25, 0.1, 0.25, 1],
                        }
                      : {
                          repeat: Infinity,
                          repeatType: 'reverse',
                          duration: 4.5,
                          ease: 'easeInOut',
                        }
                  }
                  className="-mt-3 relative w-10 h-14 sm:w-12 sm:h-16 flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 60 80"
                    className="w-full h-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.85)] filter"
                  >
                    <defs>
                      <linearGradient id="brassGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="30%" stopColor="#eab308" />
                        <stop offset="70%" stopColor="#a16207" />
                        <stop offset="100%" stopColor="#713f12" />
                      </linearGradient>
                      <radialGradient id="studGradLeft" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#854d0e" />
                      </radialGradient>
                    </defs>
                    {/* Ring Mount Bracket */}
                    <rect x="23" y="2" width="14" height="12" rx="3" fill="url(#brassGradLeft)" stroke="#fef08a" strokeWidth="1" />
                    {/* Heavy Brass Ring Knocker */}
                    <circle cx="30" cy="46" r="26" fill="none" stroke="url(#brassGradLeft)" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="30" cy="46" r="26" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="2 3" opacity="0.8" />
                    {/* Bottom Striking Stud */}
                    <circle cx="30" cy="72" r="5" fill="url(#studGradLeft)" stroke="#fef08a" strokeWidth="0.8" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Door Panel - Heavy Carved Teakwood Swing Physics */}
            <motion.div
              initial={{ x: 0, rotateY: 0 }}
              animate={
                isOpeningAnim
                  ? { x: '106%', rotateY: 34 }
                  : { x: 0, rotateY: 0 }
              }
              transition={{ duration: 2.8, ease: [0.32, 0.08, 0.24, 1] }}
              style={{ transformOrigin: 'right center' }}
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#031008] via-[#082217] to-[#0a291b] border-l border-[#d4af37]/60 shadow-2xl flex flex-col justify-between p-5 sm:p-10 overflow-hidden items-end will-change-transform z-20"
            >
              {/* Dynamic light falloff shadow as door panel swings outward */}
              <motion.div
                animate={{ opacity: isOpeningAnim ? 0.45 : 0 }}
                transition={{ duration: 2.8, ease: [0.32, 0.08, 0.24, 1] }}
                className="absolute inset-0 bg-gradient-to-l from-transparent via-black/25 to-black/75 pointer-events-none z-10"
              />
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

              {/* Right Door Antique Brass Ring Handle (कडी) */}
              <div className="absolute left-3 sm:left-6 md:left-10 top-[60%] -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none">
                {/* Brass Rosette Backplate */}
                <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#ffd700] via-[#b48316] to-[#5a3a0e] p-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.8)] border border-[#fef08a]/60 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#3d2407] border border-[#d4af37]/50 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#ca8a04] to-[#fef08a] shadow-inner" />
                  </div>
                </div>

                {/* Swinging Brass Drop Ring with Natural Decaying Sway Physics */}
                <motion.div
                  style={{ transformOrigin: 'top center' }}
                  animate={
                    isSwaying
                      ? {
                          rotate: [0, 26, -20, 12, -7, 3, -1, 0],
                        }
                      : {
                          rotate: [0, 1.5, -1.5, 0],
                        }
                  }
                  transition={
                    isSwaying
                      ? {
                          duration: 1.1,
                          ease: [0.25, 0.1, 0.25, 1],
                        }
                      : {
                          repeat: Infinity,
                          repeatType: 'reverse',
                          duration: 4.5,
                          ease: 'easeInOut',
                        }
                  }
                  className="-mt-3 relative w-10 h-14 sm:w-12 sm:h-16 flex items-center justify-center"
                >
                  <svg
                    viewBox="0 0 60 80"
                    className="w-full h-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.85)] filter"
                  >
                    <defs>
                      <linearGradient id="brassGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="30%" stopColor="#eab308" />
                        <stop offset="70%" stopColor="#a16207" />
                        <stop offset="100%" stopColor="#713f12" />
                      </linearGradient>
                      <radialGradient id="studGradRight" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="100%" stopColor="#854d0e" />
                      </radialGradient>
                    </defs>
                    {/* Ring Mount Bracket */}
                    <rect x="23" y="2" width="14" height="12" rx="3" fill="url(#brassGradRight)" stroke="#fef08a" strokeWidth="1" />
                    {/* Heavy Brass Ring Knocker */}
                    <circle cx="30" cy="46" r="26" fill="none" stroke="url(#brassGradRight)" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="30" cy="46" r="26" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="2 3" opacity="0.8" />
                    {/* Bottom Striking Stud */}
                    <circle cx="30" cy="72" r="5" fill="url(#studGradRight)" stroke="#fef08a" strokeWidth="0.8" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {/* Center Ornate Golden Seal / Lock with Graceful Blur-Dissolve on Opening */}
            <motion.div
              animate={
                isOpeningAnim
                  ? {
                      opacity: [1, 0.9, 0],
                      scale: [1, 1.08, 1.2],
                      filter: ['blur(0px)', 'blur(3px)', 'blur(16px)'],
                      pointerEvents: 'none' as const,
                    }
                  : { opacity: 1, scale: 1, filter: 'blur(0px)' }
              }
              transition={{ duration: 1.4, ease: [0.32, 0.08, 0.24, 1] }}
              className="relative z-50 flex flex-col items-center pointer-events-auto"
            >
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
                <p className="text-xs sm:text-sm text-amber-300/80 font-serif tracking-widest mt-1">
                  गणपती आगमन २०२५
                </p>
              </motion.div>

              {/* The Golden Medallion */}
              <motion.button
                id="open-temple-door-btn"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDoorClick();
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                animate={
                  isSwaying
                    ? {
                        scale: [1, 1.1, 0.98, 1],
                        rotate: [0, -5, 5, -2, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
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

              {/* Bottom Callout button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mt-6 px-4"
              >
                <button
                  id="door-callout-btn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDoorClick();
                  }}
                  className="cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 bg-[#072418]/95 hover:bg-[#0c3a28] border border-amber-500/40 px-5 py-2.5 rounded-full shadow-lg transition active:scale-95 hover:border-amber-400"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>दार उघडण्यासाठी टॅप करा • Tap to Open</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

