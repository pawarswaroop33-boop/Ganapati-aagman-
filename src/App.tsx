import React, { useState, useEffect } from 'react';
import { TempleDoor } from './components/TempleDoor';
import { InvitationCard } from './components/InvitationCard';
import { PetalCanvas } from './components/PetalCanvas';
import { CustomizeModal } from './components/CustomizeModal';
import { defaultInvitationData } from './data/defaultData';
import { InvitationDetails } from './types';
import { subscribeToInvitation, saveInvitation } from './utils/firebase';

export default function App() {
  // Start with closed temple door just like in the video at 00:00
  const [isOpenDoor, setIsOpenDoor] = useState(false);
  const [data, setData] = useState<InvitationDetails>(defaultInvitationData);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [customizeTab, setCustomizeTab] = useState<'photos' | 'family' | 'details'>('photos');
  const [burstTrigger, setBurstTrigger] = useState(0);
  const [isSavedInCloud, setIsSavedInCloud] = useState(false);

  // Read invitation ID from URL query parameters so links work across devices
  const [inviteId] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('invite') || params.get('id') || 'main';
    } catch {
      return 'main';
    }
  });

  // Real-time synchronization with Firebase Firestore
  useEffect(() => {
    const unsubscribe = subscribeToInvitation(
      inviteId,
      (remoteData) => {
        if (remoteData) {
          setData(remoteData);
          setIsSavedInCloud(true);
        } else if (inviteId === 'main') {
          // Initialize first-time default invitation in Firestore
          saveInvitation('main', defaultInvitationData)
            .then(() => setIsSavedInCloud(true))
            .catch((err) => console.warn('First-time Firestore seeding note:', err));
        }
      },
      (err) => {
        console.warn('Firestore subscription status:', err);
      }
    );

    return () => unsubscribe();
  }, [inviteId]);

  const handleOpenDoor = () => {
    setIsOpenDoor(true);
  };

  const handleShowerPetals = () => {
    setBurstTrigger((prev) => prev + 1);
  };

  const handleOpenCustomizeWithTab = (tab: 'photos' | 'family' | 'details' = 'photos') => {
    setCustomizeTab(tab);
    setIsCustomizeOpen(true);
  };

  const handleSaveInvitation = async (updated: InvitationDetails) => {
    setData(updated);
    try {
      await saveInvitation(inviteId, updated);
      setIsSavedInCloud(true);
    } catch (err) {
      console.error('Failed to save invitation to Firebase:', err);
      throw err;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030d07] text-stone-100 overflow-x-hidden font-sans">
      {/* Falling Marigold & Rose Petals Canvas */}
      <PetalCanvas burstTrigger={burstTrigger} />

      {/* Ornate Temple Doors with Central Golden Seal */}
      <TempleDoor
        isOpen={isOpenDoor}
        onOpen={handleOpenDoor}
        onShower={handleShowerPetals}
        familyHeading={data.familyHeading}
        familyName={data.familyName}
      />

      {/* Main Mobile-Optimized Invitation View (Clean, Buttery Smooth, No Phone Mockup) */}
      <div className="w-full flex justify-center">
        <InvitationCard
          data={data}
          inviteId={inviteId}
          isSavedInCloud={isSavedInCloud}
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
        onSave={handleSaveInvitation}
        initialTab={customizeTab}
      />
    </div>
  );
}
