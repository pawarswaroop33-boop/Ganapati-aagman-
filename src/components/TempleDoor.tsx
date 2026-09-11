import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Bell, Volume2 } from 'lucide-react';
import { templeAudio } from '../utils/audio';

interface TempleDoorProps {
  isOpen: boolean;
  onOpen: () => void;
  familyHeading?: string;
  familyName?: string;
}

export const TempleDoor: React.FC<TempleDoorProps> = ({
  isOpen,
  onOpen,
  familyHeading = 'देशपांडे परिवाराकडून',
  familyName = 'देशपांडे परिवार',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpeningAnim, setIsOpeningAnim] = useState(false);

  const handleDoorClick = () => {
    if (isOpeningAnim || isOpen) return;
    setIsOpeningAnim(true);

    // Audio effects: Brass bell chime + Shankh
    templeAudio.ringBell();
    setTimeout(() => {
      templeAudio.soundShankh();
    }, 400);

    // Start ambient devotional background music
    templeAudio.startDevotionalAmbient();

    // Trigger open state
    setTimeout(() => {
      onOpen();
      setIsOpeningAnim(false);
    }, 700);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="temple-door-wrapper"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.6 } }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#04120a]"
        >
          {/* Subtle golden ambient background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-600/20 via-[#071d13]/80 to-[#030e07] pointer-events-none" />

          {/* Left Door Panel */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpeningAnim ? { x: '-100%', rotateY: -15 } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#031008] via-[#082217] to-[#0d3121] border-r border-[#d4af37]/60 shadow-2xl flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden"
            style={{
              transformOrigin: 'left center',
              perspective: 1000,
            }}
          >
            {/* Traditional filigree vertical borders */}
            <div className="absolute top-0 bottom-0 right-4 w-1.5 bg-gradient-to-b from-[#ca8a04] via-[#fef08a] to-[#ca8a04] opacity-70" />
            <div className="absolute top-6 bottom-6 right-8 w-px border-r border-dashed border-[#d4af37]/40" />

            {/* Corner Ornamental Mandalas */}
            <div className="text-[#d4af37]/40 text-4xl sm:text-6xl font-serif">
              <svg className="w-16 h-16 sm:w-24 sm:h-24 text-amber-500/30" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z" />
                <circle cx="20" cy="20" r="4" />
                <path d="M5,15 Q15,15 15,5" stroke="currentColor" fill="none" strokeWidth="2" />
              </svg>
            </div>

            {/* Traditional Marathi auspicious mantra watermark */}
            <div className="my-auto pl-2 sm:pl-8 space-y-4 opacity-75">
              <span className="text-[#fef08a] font-serif text-sm sm:text-xl tracking-widest block drop-shadow">
                || वक्रतुण्ड महाकाय ||
              </span>
              <p className="text-xs sm:text-sm text-amber-200/60 font-serif leading-relaxed max-w-[200px] hidden sm:block">
                सूर्यकोटि समप्रभ । <br />
                निर्विघ्नं कुरु मे देव <br />
                सर्वकार्येषु सर्वदा ॥
              </p>
            </div>

            <div className="text-[#d4af37]/40 text-4xl sm:text-6xl font-serif rotate-90 origin-bottom-left">
              <svg className="w-16 h-16 sm:w-24 sm:h-24 text-amber-500/30" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z" />
                <circle cx="20" cy="20" r="4" />
              </svg>
            </div>
          </motion.div>

          {/* Right Door Panel */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpeningAnim ? { x: '100%', rotateY: 15 } : { x: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#031008] via-[#082217] to-[#0d3121] border-l border-[#d4af37]/60 shadow-2xl flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden items-end"
            style={{
              transformOrigin: 'right center',
              perspective: 1000,
            }}
          >
            {/* Traditional filigree vertical borders */}
            <div className="absolute top-0 bottom-0 left-4 w-1.5 bg-gradient-to-b from-[#ca8a04] via-[#fef08a] to-[#ca8a04] opacity-70" />
            <div className="absolute top-6 bottom-6 left-8 w-px border-l border-dashed border-[#d4af37]/40" />

            {/* Corner Ornamental Mandalas */}
            <div className="text-[#d4af37]/40 text-4xl sm:text-6xl font-serif rotate-90 origin-top-right">
              <svg className="w-16 h-16 sm:w-24 sm:h-24 text-amber-500/30" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z" />
                <circle cx="20" cy="20" r="4" />
              </svg>
            </div>

            <div className="my-auto pr-2 sm:pr-8 text-right space-y-4 opacity-75">
              <span className="text-[#fef08a] font-serif text-sm sm:text-xl tracking-widest block drop-shadow">
                || गणेशाय नमः ||
              </span>
              <p className="text-xs sm:text-sm text-amber-200/60 font-serif leading-relaxed max-w-[200px] hidden sm:block">
                शुभ लाभ । <br />
                आनंद मंगल । <br />
                सुख समृद्धी ॥
              </p>
            </div>

            <div className="text-[#d4af37]/40 text-4xl sm:text-6xl font-serif -rotate-90 origin-bottom-right">
              <svg className="w-16 h-16 sm:w-24 sm:h-24 text-amber-500/30" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 L40,0 C30,10 20,20 10,40 L0,40 Z" />
                <circle cx="20" cy="20" r="4" />
              </svg>
            </div>
          </motion.div>

          {/* Center Ornate Golden Seal / Lock (The Exact Focal Point from the Video) */}
          <div className="relative z-50 flex flex-col items-center">
            {/* Top Invocation text above seal */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6 px-4"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wider font-serif shadow-lg shadow-black/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>|| श्री गणेशाय नमः ||</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold font-serif text-amber-100 mt-2 drop-shadow-md">
                {familyHeading}
              </h2>
              <p className="text-xs sm:text-sm text-amber-300/80 font-serif tracking-widest">
                गणपती आगमन २०२५
              </p>
            </motion.div>

            {/* The Golden Medallion */}
            <motion.button
              id="open-temple-door-btn"
              onClick={handleDoorClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="group relative cursor-pointer focus:outline-none"
              title="निमंत्रण उघडण्यासाठी टॅप करा (Tap to open)"
            >
              {/* Outer Pulsing Golden Halo Rings */}
              <div className="absolute -inset-6 rounded-full bg-amber-500/20 blur-xl animate-pulse group-hover:bg-amber-400/30" />
              <div className="absolute -inset-2 rounded-full border-2 border-dashed border-amber-400/50 animate-spin" style={{ animationDuration: '24s' }} />
              <div className="absolute -inset-4 rounded-full border border-amber-300/30 animate-ping" style={{ animationDuration: '3s' }} />

              {/* Medallion Body */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-[#996515] via-[#ffd700] to-[#fef08a] p-1.5 shadow-[0_0_50px_rgba(212,175,55,0.6)] flex items-center justify-center">
                {/* Inner Ring with Decorative Studs */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5a3a0e] via-[#855314] to-[#3a2205] border-2 border-[#fef08a] flex flex-col items-center justify-center p-2 text-center shadow-inner relative overflow-hidden">
                  {/* Subtle radiating rays */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-amber-400/30 via-transparent to-transparent" />

                  {/* Embossed Ganapati Motif / Om */}
                  <div className="relative z-10 text-amber-200">
                    <span className="text-3xl sm:text-4xl block transform group-hover:scale-110 transition duration-300 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      🕉️
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold text-amber-200 uppercase tracking-widest font-serif mt-1 block">
                      प्रवेश करा
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Bottom Callout & Instruction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-6 px-4 flex flex-col items-center gap-2.5"
            >
              <button
                id="door-callout-btn"
                onClick={handleDoorClick}
                className="cursor-pointer inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-300 bg-[#072418]/90 hover:bg-[#0c3a28] border border-amber-500/40 px-5 py-2 rounded-full shadow-lg backdrop-blur-md transition transform active:scale-95"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span>दार उघडण्यासाठी टॅप करा • Tap to Open</span>
              </button>
              <button
                id="direct-view-btn"
                onClick={() => onOpen()}
                className="cursor-pointer text-[12px] text-amber-200/70 hover:text-amber-100 underline underline-offset-4 transition"
              >
                थेट निमंत्रण पत्रिका पहा (Directly View Invitation) →
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
