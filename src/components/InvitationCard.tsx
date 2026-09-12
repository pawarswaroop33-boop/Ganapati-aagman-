import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Volume2,
  VolumeX,
  MapPin,
  Calendar,
  Clock,
  Share2,
  Bell,
  DoorClosed,
  Settings,
  ExternalLink,
  Sparkles,
  Phone,
  Check,
  Users,
  Flower2
} from 'lucide-react';
import { InvitationDetails } from '../types';
import { defaultInvitationData } from '../data/defaultData';
import { templeAudio } from '../utils/audio';
import { FamilyCarousel } from './FamilyCarousel';
import { normalizeGoogleMapsUrl } from '../utils/navigation';

interface InvitationCardProps {
  data: InvitationDetails;
  onReopenDoors: () => void;
  onOpenCustomize: (tab?: 'door' | 'photos' | 'family' | 'details' | 'preparations') => void;
  onShowerPetals: () => void;
  inviteId?: string;
  isSavedInCloud?: boolean;
}

// Ultra-refined, cinematic optical lens reveal ("Upcoming is softly blurred -> smoothly resolves into crystal focus")
const upcomingBlurVariant = {
  blurred: {
    opacity: 0.32,
    filter: 'blur(10px)',
    y: 20,
    scale: 0.98,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  focused: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    scale: 1,
    transition: {
      duration: 0.95,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const InvitationCard: React.FC<InvitationCardProps> = ({
  data,
  onReopenDoors,
  onOpenCustomize,
  onShowerPetals,
  inviteId,
  isSavedInCloud,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setIsPlayingAudio(templeAudio.isAmbientActive());
  }, []);

  const getShareableUrl = () => {
    if (inviteId && inviteId !== 'main') {
      return `${window.location.origin}${window.location.pathname}?invite=${encodeURIComponent(inviteId)}`;
    }
    return window.location.href;
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      templeAudio.stopDevotionalAmbient();
      setIsPlayingAudio(false);
    } else {
      templeAudio.startDevotionalAmbient();
      templeAudio.ringBell();
      setIsPlayingAudio(true);
    }
  };

  const handleShareWhatsApp = () => {
    const shareUrl = getShareableUrl();
    const text = encodeURIComponent(
      `🚩 *|| श्री गणेशाय नमः ||*\n\n` +
      `*बाप्पाचे आगमन २०२५*\n` +
      `${data.familyHeading} सस्नेह आमंत्रण!\n\n` +
      `विघ्नहर्त्या गणरायाचे आगमन आमच्या घरी होत आहे.\n` +
      `📅 तारीख: ${data.startDate}\n` +
      `📍 ठिकाण: ${data.venueName}, ${data.fullAddress}\n\n` +
      `आपण सर्वांनी सपरिवार उपस्थित राहून बाप्पांचे दर्शन व प्रसादाचा लाभ घ्यावा ही नम्र विनंती!\n\n` +
      `— ${data.familyName}\n\n` +
      `डिजिटल निमंत्रण पत्रिका पाहण्यासाठी येथे क्लिक करा:\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareableUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddToCalendar = () => {
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      `गणपती आगमन - ${data.familyName}`
    )}&dates=20250827T083000Z/20250827T163000Z&details=${encodeURIComponent(
      `गणपती बाप्पांचे आगमन व दर्शन - ${data.familyName}\n${data.fullAddress}`
    )}&location=${encodeURIComponent(data.fullAddress)}`;
    window.open(calendarUrl, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-[#04120a] text-stone-100 flex flex-col items-center selection:bg-amber-500 selection:text-stone-950 pb-36">
      {/* ============================================================ */}
      {/* STICKY TOP APP BAR (Optimized for Mobile)                    */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-30 w-full max-w-md bg-[#05170d]/95 backdrop-blur-md border-b border-[#d4af37]/30 px-3.5 py-2.5 flex items-center justify-between shadow-lg shadow-black/40">
        <div className="flex items-center space-x-2">
          <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold text-xs shadow-md shadow-amber-950">
            卐
          </span>
          <div>
            <p className="text-xs font-serif tracking-wider text-[#fef08a] font-bold drop-shadow">
              || श्री गणेशाय नमः ||
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Temple Bell */}
          <button
            onClick={() => {
              templeAudio.ringBell();
              onShowerPetals();
            }}
            className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition active:scale-95 cursor-pointer"
            title="घंटा नाद व पुष्पवृष्टी (Ring Bell & Petals)"
          >
            <Bell className="w-4 h-4 text-amber-400" />
          </button>

          {/* Devotional Music Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full border transition active:scale-95 flex items-center justify-center cursor-pointer ${
              isPlayingAudio
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-stone-900/80 text-stone-400 border-stone-700'
            }`}
            title={isPlayingAudio ? 'संगीत बंद करा (Mute)' : 'भक्तिमय संगीत सुरू करा (Play)'}
          >
            {isPlayingAudio ? (
              <Volume2 className="w-4 h-4 text-stone-950 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Re-close doors button */}
          <button
            onClick={onReopenDoors}
            className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition active:scale-95 cursor-pointer"
            title="दार पुन्हा बंद करा (Replay Sanctum Doors)"
          >
            <DoorClosed className="w-4 h-4 text-amber-400" />
          </button>

          {/* Settings / Customize - Tiny & Inconspicuous (not noticeable to visitors) */}
          <button
            onClick={() => onOpenCustomize('door')}
            className="p-1.5 rounded-full text-stone-500/20 hover:text-amber-300 transition-opacity duration-300 opacity-20 hover:opacity-100 cursor-pointer shrink-0"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5 text-stone-400/40" />
          </button>
        </div>
      </header>

      {/* ============================================================ */}
      {/* MOBILE INVITATION CONTENT CONTAINER                          */}
      {/* ============================================================ */}
      <main className="w-full max-w-md px-3.5 sm:px-4 pt-3.5 space-y-7">
        {/* ============================================================ */}
        {/* SECTION 1: HERO COVER WITH BAPPA'S IMAGE (1st Image)        */}
        {/* Smooth Blur-to-Clear as doors part                           */}
        {/* ============================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 15, filter: 'blur(16px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#082215] via-[#05190f] to-[#04120a] border-2 border-[#d4af37]/50 shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-center p-4 sm:p-5 pt-6 will-change-transform"
        >
          {/* Subtle golden ambient glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Subtitle */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold tracking-wider font-serif mb-2.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>आगमनाची तारीख • {data.startDate}</span>
          </div>

          {/* Main Title: बाप्पाचे आगमन */}
          <h1 className="text-3xl sm:text-4xl font-black font-yatra tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fff4b8] via-[#f59e0b] to-[#ffd700] drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)] mb-4">
            बाप्पाचे आगमन
          </h1>

          {/* 1st IMAGE: THE GRAND ORNATE TEMPLE ARCH FRAMING BAPPA */}
          <div className="relative mx-auto max-w-[280px] mb-4">
            <div className="relative rounded-t-[140px] rounded-b-2xl p-2 bg-gradient-to-b from-[#fef08a] via-[#ca8a04] to-[#854d0e] shadow-[0_0_35px_rgba(212,175,55,0.45)]">
              <div className="relative rounded-t-[130px] rounded-b-xl overflow-hidden aspect-[4/5] bg-[#1a0808] border border-[#fef08a]/60 flex items-center justify-center group">
                {/* Backlight Halo */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/40 via-amber-700/20 to-transparent" />

                {/* Ganapati Bappa's Divine Image */}
                <img
                  src={data.bappaImageUrl}
                  alt="श्री गणपती बाप्पा (Ganapati Bappa)"
                  className="w-full h-full object-cover object-center transform transition duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1567591974584-f1832d98c6a0?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {/* Soft lighting vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#04120a] via-transparent to-black/30 pointer-events-none" />

                {/* Bottom Auspicious Tag */}
                <div className="absolute bottom-2.5 inset-x-0 flex justify-center">
                  <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/50 text-[10px] text-amber-200 font-serif font-bold tracking-wider shadow-lg">
                    || विघ्नहर्ता प्रसन्न ||
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Under-frame Family Header Tag */}
          <div className="pt-2 border-t border-amber-500/20">
            <p className="text-sm font-serif font-bold text-amber-200 tracking-wide">
              {data.familyHeading}
            </p>
            <p className="text-xs text-[#fef08a] font-serif tracking-widest uppercase mt-0.5 font-semibold">
              सस्नेह आमंत्रण
            </p>
          </div>
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 2: सस्नेह आमंत्रण INVITATION PROSE                   */}
        {/* (Smooth Blur-to-Clear as reached during scrolling)           */}
        {/* ============================================================ */}
        <motion.section
          variants={upcomingBlurVariant}
          initial="blurred"
          whileInView="focused"
          viewport={{ once: false, amount: 0.16, margin: '0px 0px -55px 0px' }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/85 via-[#05190f]/90 to-[#04120a] border border-[#d4af37]/35 p-5 shadow-xl text-center transform-gpu will-change-[filter,opacity,transform]"
        >
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-xs font-serif font-bold text-amber-400 tracking-widest">
              || निमंत्रण ||
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400" />
          </div>

          <h2 className="text-2xl font-bold font-yatra text-transparent bg-clip-text bg-gradient-to-r from-[#fff4b8] via-[#eab308] to-[#ca8a04] mb-2.5">
            सस्नेह आमंत्रण
          </h2>

          <p className="text-xs sm:text-sm text-stone-200 font-serif leading-relaxed text-center px-1">
            {data.invitationMessage}
          </p>

          <div className="mt-4 pt-3.5 border-t border-amber-500/20 grid grid-cols-4 gap-1 text-center">
            <button
              type="button"
              onClick={onShowerPetals}
              className="cursor-pointer group flex flex-col items-center hover:scale-105 active:scale-95 transition"
              title="पुष्पवृष्टी करा (Shower Flowers)"
            >
              <span className="text-amber-400 text-lg block group-hover:animate-bounce">🌺</span>
              <p className="text-[10px] font-serif text-amber-200 font-semibold mt-0.5">पुष्पवृष्टी</p>
            </button>
            <div className="flex flex-col items-center opacity-95">
              <span className="text-amber-400 text-lg block">🪔</span>
              <p className="text-[10px] font-serif text-amber-200 font-semibold mt-0.5">दीपोत्सव</p>
            </div>
            <button
              type="button"
              onClick={() => templeAudio.ringBell()}
              className="cursor-pointer group flex flex-col items-center hover:scale-105 active:scale-95 transition"
              title="घंटा नाद (Ring Bell)"
            >
              <span className="text-amber-400 text-lg block group-hover:rotate-12 transition">🔔</span>
              <p className="text-[10px] font-serif text-amber-200 font-semibold mt-0.5">घंटा नाद</p>
            </button>
            <div className="flex flex-col items-center opacity-90">
              <span className="text-amber-400 text-lg block">🥟</span>
              <p className="text-[10px] font-serif text-amber-200 font-semibold mt-0.5">मोदक प्रसाद</p>
            </div>
          </div>
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 3: INVITATORS' SLIDING PHOTO GALLERY & FAMILY MEMBERS */}
        {/* (Smooth Blur-to-Clear with Interactive Page Slider)          */}
        {/* ============================================================ */}
        <motion.section
          variants={upcomingBlurVariant}
          initial="blurred"
          whileInView="focused"
          viewport={{ once: false, amount: 0.16, margin: '0px 0px -55px 0px' }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/95 via-[#05190f] to-[#04120a] border border-[#d4af37]/45 p-4 sm:p-5 shadow-xl text-center transform-gpu will-change-[filter,opacity,transform]"
        >
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-serif font-bold text-amber-300 tracking-wider">
              || निमंत्रक व परिवार ||
            </span>
          </div>

          <h2 className="text-xl font-bold font-serif text-white mb-1">
            आपले नम्र निमंत्रक
          </h2>
          <p className="text-[11px] text-amber-200/75 font-serif mb-3.5">
            परिवारातील सदस्यांचे फोटो व नावे पाहण्यासाठी डावीकडे/उजवीकडे स्वाइप करा
          </p>

          {/* Interactive Sliding Family Carousel */}
          <FamilyCarousel
            hostName={data.hostName}
            defaultInviterImage={data.inviterImageUrl}
            familyMembers={data.familyMembers}
          />
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 4: ALL EVENTS SCHEDULE / गणेश उत्सव                  */}
        {/* (Smooth Blur-to-Clear as reached during scrolling)           */}
        {/* ============================================================ */}
        <motion.section
          variants={upcomingBlurVariant}
          initial="blurred"
          whileInView="focused"
          viewport={{ once: false, amount: 0.16, margin: '0px 0px -55px 0px' }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/90 via-[#05190f] to-[#04120a] border border-[#d4af37]/40 p-4 sm:p-5 shadow-xl transform-gpu will-change-[filter,opacity,transform]"
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-semibold font-serif mb-1.5">
              <Calendar className="w-3 h-3 text-amber-400" />
              <span>{data.tithi}</span>
            </div>
            <h2 className="text-2xl font-bold font-yatra text-transparent bg-clip-text bg-gradient-to-r from-[#fff4b8] via-[#eab308] to-[#ca8a04]">
              गणेश उत्सव
            </h2>
            <p className="text-xs text-amber-200/80 font-serif font-semibold mt-0.5">
              {data.startDate} ते {data.endDate}
            </p>
          </div>

          <div className="space-y-2.5">
            {data.schedule.map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-[#04120a]/80 border border-amber-500/20 p-3 flex items-start justify-between gap-2.5 hover:border-amber-500/40 transition"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold font-serif text-[#fef08a] truncate">
                        {item.marathiTitle}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium shrink-0">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-300 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-amber-400 font-serif bg-amber-950/70 px-2 py-0.5 rounded-lg border border-amber-500/30 shrink-0">
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          {/* Add to Calendar button */}
          <div className="mt-3.5 pt-3 border-t border-amber-500/20 text-center">
            <button
              onClick={handleAddToCalendar}
              className="cursor-pointer w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold font-serif transition active:scale-95 flex items-center justify-center gap-2 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>कॅलेंडरमध्ये जोडा (Add to Google Calendar)</span>
            </button>
          </div>
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 5: ONE-TAP GET DIRECTIONS / ठिकाण                   */}
        {/* (Smooth Blur-to-Clear as reached during scrolling)           */}
        {/* ============================================================ */}
        <motion.section
          variants={upcomingBlurVariant}
          initial="blurred"
          whileInView="focused"
          viewport={{ once: false, amount: 0.16, margin: '0px 0px -55px 0px' }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/95 via-[#05190f] to-[#04120a] border border-[#d4af37]/45 p-4 sm:p-5 shadow-xl text-center transform-gpu will-change-[filter,opacity,transform]"
        >
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-xs font-serif font-bold text-amber-300 tracking-wider">
              || उत्सव स्थळ ||
            </span>
          </div>

          <h2 className="text-2xl font-bold font-yatra text-transparent bg-clip-text bg-gradient-to-r from-[#fff4b8] via-[#eab308] to-[#ca8a04] mb-2.5">
            ठिकाण
          </h2>

          <div className="p-3.5 rounded-2xl bg-[#04120a]/90 border border-amber-500/30 mb-3.5 text-left sm:text-center">
            <h3 className="text-base font-bold font-serif text-white mb-1">
              {data.venueName}
            </h3>
            <p className="text-xs text-stone-200 font-serif leading-relaxed mb-1">
              {data.fullAddress}
            </p>
            {data.landmark && (
              <p className="text-[11px] text-amber-300/80 font-serif italic">
                (लँडमार्क: {data.landmark})
              </p>
            )}
          </div>

          {/* One-Tap Navigation Button */}
          <a
            href={normalizeGoogleMapsUrl(data.googleMapsUrl, data.venueName, data.fullAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm font-serif shadow-lg shadow-amber-950/70 flex items-center justify-center gap-2 transition duration-200 active:scale-95 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-stone-950" />
            <span>गुगल मॅप्स वर मार्ग पहा (Get Directions 📍)</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-950/70" />
          </a>
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 6: आगमनाची तयारी GALLERY                            */}
        {/* (Smooth Blur-to-Clear as reached during scrolling)           */}
        {/* ============================================================ */}
        <motion.section
          variants={upcomingBlurVariant}
          initial="blurred"
          whileInView="focused"
          viewport={{ once: false, amount: 0.16, margin: '0px 0px -55px 0px' }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/90 via-[#05190f] to-[#04120a] border border-[#d4af37]/40 p-4 sm:p-5 shadow-xl transform-gpu will-change-[filter,opacity,transform]"
        >
          <div className="text-center mb-3.5">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-serif font-bold text-amber-300 tracking-wider">
                || क्षणचित्रे ||
              </span>
            </div>
            <h2 className="text-2xl font-bold font-yatra text-transparent bg-clip-text bg-gradient-to-r from-[#fff4b8] via-[#eab308] to-[#ca8a04]">
              आगमनाची तयारी
            </h2>
            <p className="text-xs text-stone-300 font-serif mt-0.5">
              बाप्पांच्या स्वागताची प्रेमळ तयारी
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(data.preparations && data.preparations.length > 0
              ? data.preparations
              : defaultInvitationData.preparations
            ).map((item, idx) => (
              <div
                key={item.id || idx}
                className="group relative rounded-xl overflow-hidden aspect-square border border-amber-500/30 bg-stone-900 shadow-md"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 filter brightness-95"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2">
                  <p className="text-[11px] font-bold font-serif text-white leading-tight drop-shadow truncate">
                    {item.title}
                  </p>
                  <p className="text-[9px] text-amber-200/80 font-serif truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 7: CLOSING BENEDICTION                               */}
        {/* (Smooth Blur-to-Clear as reached during scrolling)           */}
        {/* ============================================================ */}
        <motion.section
          variants={upcomingBlurVariant}
          initial="blurred"
          whileInView="focused"
          viewport={{ once: false, amount: 0.16, margin: '0px 0px -55px 0px' }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/60 via-[#05190f] to-[#04120a] border border-[#d4af37]/30 p-5 text-center shadow-lg transform-gpu will-change-[filter,opacity,transform]"
        >
          <span className="text-2xl block mb-1.5">🙏</span>
          <p className="text-xs sm:text-sm font-serif italic text-amber-100 font-medium leading-relaxed max-w-xs mx-auto">
            "{data.closingQuote}"
          </p>
          <div className="mt-3 pt-2.5 border-t border-amber-500/20">
            <p className="text-sm font-bold font-serif text-amber-400">
              — {data.familyName}
            </p>
            {data.hostName && (
              <p className="text-xs text-amber-200/90 font-serif mt-0.5">
                (निमंत्रक: {data.hostName})
              </p>
            )}
            {data.contactNumber && (
              <div className="mt-2 flex items-center justify-center gap-2">
                <a
                  href={`tel:${data.contactNumber.replace(/[^0-9+]/g, '')}`}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 px-3.5 py-1.5 rounded-full font-mono font-semibold transition active:scale-95 shadow-sm"
                  title="थेट कॉल करा"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{data.contactNumber} (कॉल करा 📞)</span>
                </a>
              </div>
            )}
          </div>
        </motion.section>
      </main>

      {/* ============================================================ */}
      {/* FIXED BOTTOM FLOATING QUICK ACTION BAR                        */}
      {/* ============================================================ */}
      <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-30">
        <div className="rounded-2xl bg-[#061e12]/95 backdrop-blur-xl border border-amber-500/40 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.85)] flex items-center justify-between gap-2">
          {/* Prominent WhatsApp Share Button */}
          <button
            onClick={handleShareWhatsApp}
            className="cursor-pointer flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-md shadow-emerald-950 font-serif"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp वर पाठवा</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="cursor-pointer p-3 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-300 hover:bg-stone-800 transition active:scale-95 shrink-0"
            title="निमंत्रण लिंक कॉपी करा"
          >
            {copiedLink ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
