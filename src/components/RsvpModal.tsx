import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Users, Clock, Phone, Heart, Sparkles } from 'lucide-react';
import { templeAudio } from '../utils/audio';

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyName: string;
}

export const RsvpModal: React.FC<RsvpModalProps> = ({ isOpen, onClose, familyName }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [count, setCount] = useState(2);
  const [slot, setSlot] = useState('सायंकाळची महाआरती (७:३० PM)');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    templeAudio.ringBell();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setCount(2);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-gradient-to-b from-[#0a2318] via-[#061910] to-[#04120a] border border-amber-500/40 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl shadow-amber-950/80 overflow-hidden"
      >
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-serif text-white">
                दर्शन व प्रसादासाठी नोंदणी
              </h3>
              <p className="text-xs text-amber-300/80 font-serif mt-1">
                {familyName} कडून सस्नेह आमंत्रण
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-amber-200 mb-1">
                  आपले नाव (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="उदा. राहुल आणि परिवार"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    व्यक्तींची संख्या (Guests)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={25}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-stone-100 focus:outline-none focus:border-amber-400 text-sm"
                    />
                    <Users className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200 mb-1">
                    संपर्क क्रमांक (Mobile)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-400 text-sm"
                    />
                    <Phone className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-200 mb-1">
                  अपेक्षित वेळ (Preferred Aarti / Darshan)
                </label>
                <div className="relative">
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-stone-100 focus:outline-none focus:border-amber-400 text-sm"
                  >
                    <option>मूर्ती आगमन सोहळा (दुपारी २:०० PM)</option>
                    <option>सकाळची मंगल आरती (८:०० AM)</option>
                    <option>दुपारचे दर्शन व भेट (१:०० PM)</option>
                    <option>सायंकाळची महाआरती (७:३० PM)</option>
                    <option>महाप्रसाद भोजन (रात्री ८:३० PM)</option>
                  </select>
                  <Clock className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-950/60 transition duration-200 active:scale-95 mt-2"
              >
                उपस्थिती निश्चित करा (Confirm Darshan)
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold font-serif text-white mb-1">
              आपली उपस्थिती नोंदवली गेली आहे!
            </h4>
            <p className="text-sm text-amber-200/90 font-serif mb-2">
              धन्यवाद <span className="font-bold text-white">{name}</span>!
            </p>
            <div className="p-4 rounded-2xl bg-[#04120a]/80 border border-amber-500/20 text-left text-xs space-y-1.5 mb-6 text-stone-300">
              <p>• व्यक्तींची संख्या: <span className="text-amber-400 font-semibold">{count} सदस्य</span></p>
              <p>• दर्शन वेळ: <span className="text-amber-400 font-semibold">{slot}</span></p>
              <p className="text-stone-400 text-[11px] pt-1 border-t border-stone-800">
                बाप्पांच्या आशीर्वादाने आपले स्वागत करण्यास आम्ही उत्सुक आहोत.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
            >
              पूर्ण झाले (Close)
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
