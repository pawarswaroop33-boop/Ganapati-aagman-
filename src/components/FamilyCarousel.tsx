import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Users, Sparkles, Heart } from 'lucide-react';
import { FamilyMember } from '../types';

interface FamilyCarouselProps {
  hostName: string;
  defaultInviterImage: string;
  familyMembers: FamilyMember[];
}

export const FamilyCarousel: React.FC<FamilyCarouselProps> = ({
  hostName,
  defaultInviterImage,
  familyMembers,
}) => {
  // Build normalized member list: ensure host is included, and every member has a valid slide
  const membersList: (FamilyMember & { isPrimaryHost?: boolean })[] = React.useMemo(() => {
    if (!familyMembers || familyMembers.length === 0) {
      return [
        {
          id: 'host-primary',
          name: hostName || 'कुटुंबप्रमुख',
          relation: 'मुख्य निमंत्रक',
          photoUrl: defaultInviterImage,
          isPrimaryHost: true,
          blessing: 'बाप्पांच्या कृपेने सर्वांचे जीवन सुख-समृद्धीने भरून जावो!',
        },
      ];
    }

    return familyMembers.map((m, idx) => ({
      ...m,
      isPrimaryHost: idx === 0,
      photoUrl: m.photoUrl?.trim() ? m.photoUrl : (idx === 0 ? defaultInviterImage : defaultInviterImage),
    }));
  }, [familyMembers, hostName, defaultInviterImage]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);

  // Keep index within bounds if family members change
  useEffect(() => {
    if (currentIndex >= membersList.length) {
      setCurrentIndex(0);
    }
  }, [membersList.length, currentIndex]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = membersList.length - 1;
      if (next >= membersList.length) next = 0;
      return next;
    });
  };

  const jumpToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  const currentMember = membersList[currentIndex] || membersList[0];

  // Touch swipe handling
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        paginate(1); // Swipe left -> Next
      } else {
        paginate(-1); // Swipe right -> Prev
      }
    }
    setTouchStartX(null);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 70 : -70,
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -70 : 70,
      opacity: 0,
      scale: 0.94,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    }),
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Slide Navigation Hint / Counter */}
      <div className="flex items-center justify-between w-full max-w-[270px] mb-2 text-xs font-serif">
        <span className="inline-flex items-center gap-1 text-[11px] text-amber-300/90 font-medium">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>स्वाइप करा • स्लाइड करा</span>
        </span>
        <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
          {currentIndex + 1} / {membersList.length}
        </span>
      </div>

      {/* Main Slide Card Container with Touch Support */}
      <div
        className="relative w-full max-w-[270px] aspect-[3/4] touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full h-full rounded-2xl p-2 bg-gradient-to-tr from-amber-600/70 via-[#ffd700] to-amber-700/70 shadow-[0_8px_30px_rgba(212,175,55,0.4)]">
          <div className="w-full h-full rounded-xl overflow-hidden bg-stone-900 relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentMember.id || currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full flex flex-col justify-between"
              >
                {/* Member Photo */}
                <img
                  src={currentMember.photoUrl || defaultInviterImage}
                  alt={currentMember.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = defaultInviterImage;
                  }}
                />

                {/* Subtle top & bottom shadow gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

                {/* Top Auspicious Tag */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-serif font-bold text-amber-200 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span>सस्नेह निमंत्रक</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 bg-black/60 px-1.5 py-0.5 rounded-md border border-amber-400/20">
                    #{currentIndex + 1}
                  </span>
                </div>

                {/* Bottom Details Overlay: Name, Relation, Blessing */}
                <div className="absolute bottom-0 inset-x-0 p-3 pt-6 bg-gradient-to-t from-black via-black/80 to-transparent text-center">
                  <h3 className="text-sm sm:text-base font-bold font-serif text-white tracking-wide drop-shadow">
                    {currentMember.name}
                  </h3>

                  <div className="mt-1 inline-block">
                    <span className="text-[10px] sm:text-[11px] font-serif text-amber-200 bg-amber-500/25 border border-amber-400/40 px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow font-semibold">
                      {currentMember.relation}
                    </span>
                  </div>

                  {currentMember.blessing && (
                    <p className="text-[10px] text-amber-100/90 font-serif italic mt-1 line-clamp-2 px-1">
                      "{currentMember.blessing}"
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Left Arrow Button */}
            {membersList.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(-1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-amber-300 hover:text-amber-100 border border-amber-400/50 flex items-center justify-center backdrop-blur-sm transition active:scale-90 shadow-md cursor-pointer"
                aria-label="मागील सदस्य (Previous)"
                title="मागील सदस्य"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Right Arrow Button */}
            {membersList.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/65 hover:bg-black/85 text-amber-300 hover:text-amber-100 border border-amber-400/50 flex items-center justify-center backdrop-blur-sm transition active:scale-90 shadow-md cursor-pointer"
                aria-label="पुढील सदस्य (Next)"
                title="पुढील सदस्य"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Indicators (Dots / Pills) */}
      {membersList.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {membersList.map((m, idx) => (
            <button
              key={m.id || idx}
              type="button"
              onClick={() => jumpToSlide(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                idx === currentIndex
                  ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                  : 'w-1.5 bg-stone-600 hover:bg-stone-400'
              }`}
              title={m.name}
              aria-label={`Slide ${idx + 1}: ${m.name}`}
            />
          ))}
        </div>
      )}

      {/* Quick Member Thumbnail Chips (Tap to Jump to that Member) */}
      {membersList.length > 1 && (
        <div className="w-full mt-3 flex items-center justify-center flex-wrap gap-1.5 max-w-sm">
          {membersList.map((member, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={member.id || idx}
                type="button"
                onClick={() => jumpToSlide(idx)}
                className={`cursor-pointer px-2.5 py-1 rounded-full text-[11px] font-serif transition-all duration-200 flex items-center gap-1.5 border active:scale-95 ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-105'
                    : 'bg-[#051a10] text-amber-200/80 border-amber-500/25 hover:border-amber-400/50 hover:text-white'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full text-[9px] font-sans font-bold flex items-center justify-center ${
                    isSelected ? 'bg-stone-950 text-amber-300' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="truncate max-w-[110px]">{member.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
