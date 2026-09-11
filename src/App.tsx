import React, { useState } from 'react';
import { TempleDoor } from './components/TempleDoor';
import { InvitationCard } from './components/InvitationCard';
import { PetalCanvas } from './components/PetalCanvas';
import { CustomizeModal } from './components/CustomizeModal';
import { RsvpModal } from './components/RsvpModal';
import { defaultInvitationData } from './data/defaultData';
import { InvitationDetails } from './types';
import { Smartphone, Monitor, Sparkles } from 'lucide-react';

export default function App() {
  // Start with the closed temple door just like in the video at 00:00!
  const [isOpenDoor, setIsOpenDoor] = useState(false);
  const [data, setData] = useState<InvitationDetails>(defaultInvitationData);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  const handleOpenDoor = () => {
    setIsOpenDoor(true);
    // Burst rose and marigold petals on door open
    setBurstTrigger((prev) => prev + 1);
  };

  const handleShowerPetals = () => {
    setBurstTrigger((prev) => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-[#030d07] text-stone-100 overflow-x-hidden font-sans">
      {/* Falling Marigold & Rose Petals Canvas */}
      <PetalCanvas burstTrigger={burstTrigger} />

      {/* Ornate Temple Doors with Glowing Golden Seal */}
      <TempleDoor
        isOpen={isOpenDoor}
        onOpen={handleOpenDoor}
        familyHeading={data.familyHeading}
        familyName={data.familyName}
      />

      {/* Desktop view switcher banner (shown only when door is open and on large screens) */}
      {isOpenDoor && (
        <div className="hidden lg:flex fixed top-3 left-4 z-40 items-center gap-2 px-3 py-1.5 rounded-full bg-[#072216]/90 border border-amber-500/30 text-xs text-amber-200 backdrop-blur-md shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-serif">Display View:</span>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`px-2.5 py-1 rounded-full transition ${
              !isPhoneFrame
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Direct Mobile Card
          </button>
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`px-2.5 py-1 rounded-full transition flex items-center gap-1 ${
              isPhoneFrame
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Phone Mockup (As in Video)</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {isPhoneFrame ? (
        /* Scenic Misty Hill Phone Mockup as showcased in the reel video */
        <div className="min-h-screen py-8 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950 via-[#031109] to-[#010603] px-4">
          <div className="relative w-full max-w-[420px] rounded-[50px] p-3.5 bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-4 border-stone-600/50">
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-stone-900 border border-stone-800 mr-2" />
              <div className="w-10 h-1 rounded-full bg-stone-800" />
            </div>

            {/* Inner Phone Screen Container */}
            <div className="rounded-[40px] overflow-hidden max-h-[85vh] overflow-y-auto relative border border-black/40">
              <InvitationCard
                data={data}
                onReopenDoors={() => setIsOpenDoor(false)}
                onOpenCustomize={() => setIsCustomizeOpen(true)}
                onOpenRsvp={() => setIsRsvpOpen(true)}
                onShowerPetals={handleShowerPetals}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Clean Direct Card Experience */
        <InvitationCard
          data={data}
          onReopenDoors={() => setIsOpenDoor(false)}
          onOpenCustomize={() => setIsCustomizeOpen(true)}
          onOpenRsvp={() => setIsRsvpOpen(true)}
          onShowerPetals={handleShowerPetals}
        />
      )}

      {/* Modals */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        data={data}
        onSave={(updated) => setData(updated)}
      />

      <RsvpModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        familyName={data.familyName}
      />
    </div>
  );
}
