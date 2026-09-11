import React, { useState } from 'react';
import { TempleDoor } from './components/TempleDoor';
import { InvitationCard } from './components/InvitationCard';
import { PetalCanvas } from './components/PetalCanvas';
import { CustomizeModal } from './components/CustomizeModal';
import { defaultInvitationData } from './data/defaultData';
import { InvitationDetails } from './types';

export default function App() {
  // Start with closed temple door just like in the video at 00:00
  const [isOpenDoor, setIsOpenDoor] = useState(false);
  const [data, setData] = useState<InvitationDetails>(defaultInvitationData);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [customizeTab, setCustomizeTab] = useState<'photos' | 'family' | 'details'>('photos');
  const [burstTrigger, setBurstTrigger] = useState(0);

  const handleOpenDoor = () => {
    setIsOpenDoor(true);
    // Burst rose and marigold petals on door open
    setBurstTrigger((prev) => prev + 1);
  };

  const handleShowerPetals = () => {
    setBurstTrigger((prev) => prev + 1);
  };

  const handleOpenCustomizeWithTab = (tab: 'photos' | 'family' | 'details' = 'photos') => {
    setCustomizeTab(tab);
    setIsCustomizeOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#030d07] text-stone-100 overflow-x-hidden font-sans">
      {/* Falling Marigold & Rose Petals Canvas */}
      <PetalCanvas burstTrigger={burstTrigger} />

      {/* Ornate Temple Doors with Central Golden Seal (00:00 in video) */}
      <TempleDoor
        isOpen={isOpenDoor}
        onOpen={handleOpenDoor}
        familyHeading={data.familyHeading}
        familyName={data.familyName}
      />

      {/* Main Mobile-Optimized Invitation View (Clean, Buttery Smooth, No Phone Mockup) */}
      <div className="w-full flex justify-center">
        <InvitationCard
          data={data}
          onReopenDoors={() => setIsOpenDoor(false)}
          onOpenCustomize={handleOpenCustomizeWithTab}
          onShowerPetals={handleShowerPetals}
        />
      </div>

      {/* 2-Upload and Family Customization Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        data={data}
        onSave={(updated) => setData(updated)}
        initialTab={customizeTab}
      />
    </div>
  );
}
