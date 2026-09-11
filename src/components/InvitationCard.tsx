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
  ChevronRight,
  ExternalLink,
  Heart,
  Sparkles,
  Phone,
  Flame,
  Check,
  Music,
  UserCheck
} from 'lucide-react';
import { InvitationDetails, FamilyMember } from '../types';
import { templeAudio } from '../utils/audio';

interface InvitationCardProps {
  data: InvitationDetails;
  onReopenDoors: () => void;
  onOpenCustomize: () => void;
  onOpenRsvp: () => void;
  onShowerPetals: () => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  data,
  onReopenDoors,
  onOpenCustomize,
  onOpenRsvp,
  onShowerPetals,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // Check if ambient audio is running
    setIsPlayingAudio(templeAudio.isAmbientActive());
  }, []);

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

  const currentMember: FamilyMember = data.familyMembers[selectedMemberIndex] || data.familyMembers[0];

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚩 *|| श्री गणेशाय नमः ||*\n\n` +
      `*बाप्पाचे आगमन २०२५*\n` +
      `${data.familyHeading} सस्नेह आमंत्रण!\n\n` +
      `विघ्नहर्त्या गणरायाचे आगमन आमच्या घरी होत आहे.\n` +
      `📅 तारीख: ${data.startDate}\n` +
      `📍 ठिकाण: ${data.venueName}, ${data.fullAddress}\n\n` +
      `आपण सर्वांनी सपरिवार उपस्थित राहून बाप्पांचे दर्शन व प्रसादाचा लाभ घ्यावा ही नम्र विनंती!\n\n` +
      `डिजिटल निमंत्रण पत्रिका पाहण्यासाठी येथे क्लिक करा:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
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
    <div className="min-h-screen bg-[#04120a] text-stone-100 flex flex-col items-center selection:bg-amber-500 selection:text-stone-950 pb-28">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 w-full max-w-md bg-[#05170d]/90 backdrop-blur-md border-b border-[#d4af37]/30 px-4 py-3 flex items-center justify-between shadow-lg shadow-black/40">
        <div className="flex items-center space-x-2">
          <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold text-xs shadow-md shadow-amber-950">
            卐
          </span>
          <p className="text-xs sm:text-sm font-serif tracking-widest text-[#fef08a] font-bold drop-shadow">
            || श्री गणेशाय नमः ||
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Temple Bell */}
          <button
            onClick={() => {
              templeAudio.ringBell();
              onShowerPetals();
            }}
            className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition active:scale-95"
            title="शुभ घंटा नाद (Ring Temple Bell)"
          >
            <Bell className="w-4 h-4 text-amber-400" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full border transition active:scale-95 flex items-center justify-center ${
              isPlayingAudio
                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-stone-900/80 text-stone-400 border-stone-700'
            }`}
            title={isPlayingAudio ? 'Mute Music' : 'Play Devotional Music'}
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
            className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition active:scale-95"
            title="दार पुन्हा बंद करा (Replay Door Opening)"
          >
            <DoorClosed className="w-4 h-4 text-amber-400" />
          </button>

          {/* Settings / Customize */}
          <button
            onClick={onOpenCustomize}
            className="p-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition active:scale-95"
            title="माहिती बदला (Customize Family Details)"
          >
            <Settings className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </header>

      {/* Main Luxury Invitation Container (Mobile Dimension Aesthetic matching Video) */}
      <main className="w-full max-w-md px-4 sm:px-5 pt-4 space-y-7">
        {/* ============================================================ */}
        {/* SECTION 1: HERO COVER (Video 00:06 - 00:10)                  */}
        {/* ============================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#082215] via-[#05190f] to-[#04120a] border-2 border-[#d4af37]/50 shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-center p-5 pt-7"
        >
          {/* Subtle golden background radiating burst */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Subtitle */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold tracking-wider font-serif mb-3">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>आगमनाची तारीख • {data.startDate}</span>
          </div>

          {/* Main Title: बाप्पाचे आगमन */}
          <h1 className="text-3xl sm:text-4xl font-black font-yatra tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fff4b8] via-[#f59e0b] to-[#ffd700] drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)] mb-5">
            बाप्पाचे आगमन
          </h1>

          {/* The Grand Ornate Temple Prabhavali Arch & Divine Murti (As in Video at 00:08) */}
          <div className="relative mx-auto max-w-[290px] mb-5">
            {/* Prabhavali Temple Arch SVG Frame */}
            <div className="relative rounded-t-[140px] rounded-b-2xl p-2.5 bg-gradient-to-b from-[#fef08a] via-[#ca8a04] to-[#854d0e] shadow-[0_0_35px_rgba(212,175,55,0.4)]">
              {/* Inner Arch with glowing backlight */}
              <div className="relative rounded-t-[130px] rounded-b-xl overflow-hidden aspect-[4/5] bg-gradient-to-b from-[#1a0808] to-[#04120a] border border-[#fef08a]/60 flex items-center justify-center">
                {/* Radiant Halo behind Bappa */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/40 via-amber-700/20 to-transparent" />
                
                {/* Bappa Murti Image */}
                <img
                  src={data.bappaImageUrl}
                  alt="Ganapati Bappa"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-700 filter contrast-105 brightness-105"
                  onError={(e) => {
                    // Fallback to trusted high-res Ganapati image if custom url fails
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1567591974584-f1832d98c6a0?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {/* Subtle soft lighting vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#04120a] via-transparent to-black/30 pointer-events-none" />

                {/* Bottom Diya Embers / Auspicious Tag */}
                <div className="absolute bottom-2.5 inset-x-0 flex justify-center">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/40 text-[10px] text-amber-200 font-serif font-bold">
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
        {/* SECTION 2: सस्नेह आमंत्रण INVITATION PROSE (Video 00:10)      */}
        {/* ============================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/80 via-[#05190f]/90 to-[#04120a] border border-[#d4af37]/35 p-6 shadow-xl text-center"
        >
          {/* Traditional Auspicious Header Motif */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="text-xs font-serif font-bold text-amber-400 tracking-widest">
              || निमंत्रण ||
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-400" />
          </div>

          <h2 className="text-2xl font-bold font-yatra text-transparent bg-clip-text bg-gradient-to-r from-[#fff4b8] via-[#eab308] to-[#ca8a04] mb-3">
            सस्नेह आमंत्रण
          </h2>

          <p className="text-xs sm:text-sm text-stone-200 font-serif leading-relaxed text-justify sm:text-center px-1">
            {data.invitationMessage}
          </p>

          <div className="mt-5 pt-4 border-t border-amber-500/20 flex items-center justify-around text-center">
            <div>
              <span className="text-amber-400 text-base">🌺</span>
              <p className="text-[11px] font-serif text-amber-200/90 font-semibold mt-0.5">पुष्पवृष्टी</p>
            </div>
            <div>
              <span className="text-amber-400 text-base">🪔</span>
              <p className="text-[11px] font-serif text-amber-200/90 font-semibold mt-0.5">दीपोत्सव</p>
            </div>
            <div>
              <span className="text-amber-400 text-base">🥟</span>
              <p className="text-[11px] font-serif text-amber-200/90 font-semibold mt-0.5">मोदक प्रसाद</p>
            </div>
            <div>
              <span className="text-amber-400 text-base">🥁</span>
              <p className="text-[11px] font-serif text-amber-200/90 font-semibold mt-0.5">ढोल-ताशा</p>
            </div>
          </div>
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 3: YOUR FAMILY, BEAUTIFULLY INTRODUCED (Video 00:13)  */}
        {/* ============================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/90 via-[#05190f] to-[#04120a] border border-[#d4af37]/40 p-5 sm:p-6 shadow-xl text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-serif font-bold text-amber-300 tracking-wider">
              || निमंत्रक ||
            </span>
          </div>

          <h2 className="text-xl font-bold font-serif text-white mb-4">
            आपले नम्र निमंत्रक
          </h2>

          {/* Family Member Spotlight Card (As shown in video at 00:13 "राजेश देशपांडे") */}
          <div className="relative mx-auto max-w-[240px] mb-4">
            <div className="rounded-2xl p-2 bg-gradient-to-tr from-amber-600/70 via-[#ffd700] to-amber-700/70 shadow-[0_0_25px_rgba(212,175,55,0.35)]">
              <div className="rounded-xl overflow-hidden aspect-[3/4] bg-stone-900 relative">
                <img
                  src={currentMember.photoUrl}
                  alt={currentMember.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                {/* Subtle soft gradient over image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-2 inset-x-2 text-center">
                  <span className="text-[10px] text-amber-200/90 font-serif bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {currentMember.relation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Name in glowing Marathi script */}
          <h3 className="text-lg sm:text-xl font-bold font-yatra text-amber-200 tracking-wide">
            {currentMember.name}
          </h3>
          {currentMember.blessing && (
            <p className="text-xs text-stone-300 font-serif italic mt-1 max-w-xs mx-auto">
              "{currentMember.blessing}"
            </p>
          )}

          {/* Family Member Switcher Tabs */}
          {data.familyMembers.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-amber-500/20">
              {data.familyMembers.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMemberIndex(idx)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-serif transition ${
                    selectedMemberIndex === idx
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                      : 'bg-stone-900/80 text-stone-400 hover:text-amber-200 border border-stone-800'
                  }`}
                >
                  {m.name.split(' ')[0]}
                </button>
              ))}
            </div>
          )}
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 4: ALL EVENTS DETAILS / गणेश उत्सव (Video 00:16)      */}
        {/* ============================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/90 via-[#05190f] to-[#04120a] border border-[#d4af37]/40 p-5 sm:p-6 shadow-xl"
        >
          <div className="text-center mb-5">
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

          {/* Schedule Events List */}
          <div className="space-y-3">
            {data.schedule.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl bg-[#04120a]/80 border border-amber-500/20 p-3.5 flex items-start justify-between gap-3 hover:border-amber-500/40 transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-serif text-[#fef08a]">
                        {item.marathiTitle}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-300 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-amber-400 font-serif bg-amber-950/70 px-2 py-1 rounded-lg border border-amber-500/30 block">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add to Calendar button */}
          <div className="mt-4 pt-3 border-t border-amber-500/20 text-center">
            <button
              onClick={handleAddToCalendar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold font-serif transition active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>कॅलेंडरमध्ये जोडा (Add to Google Calendar)</span>
            </button>
          </div>
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 5: ONE TAP. GET DIRECTIONS / ठिकाण (Video 00:18)      */}
        {/* ============================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/95 via-[#05190f] to-[#04120a] border border-[#d4af37]/45 p-5 sm:p-6 shadow-xl text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="text-xs font-serif font-bold text-amber-300 tracking-wider">
              || उत्सव स्थळ ||
            </span>
          </div>

          <h2 className="text-2xl font-bold font-yatra text-transparent bg-clip-text bg-gradient-to-r from-[#fff4b8] via-[#eab308] to-[#ca8a04] mb-3">
            ठिकाण
          </h2>

          <div className="p-4 rounded-2xl bg-[#04120a]/90 border border-amber-500/30 mb-4">
            <h3 className="text-base sm:text-lg font-bold font-serif text-white mb-1">
              {data.venueName}
            </h3>
            <p className="text-xs sm:text-sm text-stone-200 font-serif leading-relaxed mb-2">
              {data.fullAddress}
            </p>
            {data.landmark && (
              <p className="text-[11px] text-amber-300/80 font-serif italic">
                (लँडमार्क: {data.landmark})
              </p>
            )}
          </div>

          {/* One-Tap Navigation Button (Focal Point from Video) */}
          <a
            href={data.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm font-serif shadow-xl shadow-amber-950/70 flex items-center justify-center gap-2 transition duration-200 active:scale-95 group"
          >
            <MapPin className="w-4 h-4 text-stone-950 group-hover:scale-110 transition" />
            <span>गुगल मॅप्स वर मार्ग पहा (Get Directions 📍)</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-950/70" />
          </a>
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 6: आगमनाची तयारी (Video 00:20 - 4 photo moments)     */}
        {/* ============================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/90 via-[#05190f] to-[#04120a] border border-[#d4af37]/40 p-5 sm:p-6 shadow-xl"
        >
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
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

          {/* 4 Photo Grid (As seen in Video at 00:20) */}
          <div className="grid grid-cols-2 gap-2.5">
            {data.preparations.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden aspect-square border border-amber-500/30 bg-stone-900 shadow-md"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500 filter brightness-95 group-hover:brightness-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-2 sm:p-2.5">
                  <p className="text-[11px] sm:text-xs font-bold font-serif text-white leading-tight drop-shadow">
                    {item.title}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-amber-200/80 font-serif truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ============================================================ */}
        {/* SECTION 7: CLOSING BENEDICTION (Video 00:22)                  */}
        {/* ============================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-b from-[#082215]/60 via-[#05190f] to-[#04120a] border border-[#d4af37]/30 p-6 text-center shadow-lg"
        >
          <span className="text-2xl block mb-2">🙏</span>
          <p className="text-sm sm:text-base font-serif italic text-amber-100 font-medium leading-relaxed max-w-xs mx-auto">
            "{data.closingQuote}"
          </p>
          <div className="mt-3 pt-3 border-t border-amber-500/20">
            <p className="text-sm font-bold font-serif text-amber-400">
              — {data.familyName}
            </p>
            {data.contactNumber && (
              <p className="text-xs text-stone-400 mt-1 flex items-center justify-center gap-1.5 font-mono">
                <Phone className="w-3 h-3 text-amber-400" />
                <span>{data.contactNumber}</span>
              </p>
            )}
          </div>
        </motion.section>
      </main>

      {/* ============================================================ */}
      {/* FIXED BOTTOM FLOATING QUICK ACTION BAR                        */}
      {/* ============================================================ */}
      <div className="fixed bottom-3 inset-x-3 max-w-md mx-auto z-30">
        <div className="rounded-2xl bg-[#061e12]/95 backdrop-blur-xl border border-amber-500/40 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2">
          {/* WhatsApp Share Button */}
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-950"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp वर पाठवा</span>
          </button>

          {/* RSVP Button */}
          <button
            onClick={onOpenRsvp}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-amber-950"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>दर्शन उपस्थिती (RSVP)</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="p-2.5 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-300 hover:bg-stone-800 transition active:scale-95 shrink-0"
            title="Copy Invitation Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
