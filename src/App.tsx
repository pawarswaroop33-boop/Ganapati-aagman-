import React, { useState, useEffect } from 'react';
import { TempleDoor } from './components/TempleDoor';
import { InvitationCard } from './components/InvitationCard';
import { PetalCanvas } from './components/PetalCanvas';
import { CustomizeModal } from './components/CustomizeModal';
import { PasswordModal } from './components/PasswordModal';
import { defaultInvitationData } from './data/defaultData';
import { InvitationDetails } from './types';
import { subscribeToInvitation, saveInvitation } from './utils/firebase';

export default function App() {
  // Start with closed temple door just like in the video at 00:00
  const [isOpenDoor, setIsOpenDoor] = useState(false);
  const [data, setData] = useState<InvitationDetails>(defaultInvitationData);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [customizeTab, setCustomizeTab] = useState<'door' | 'photos' | 'family' | 'details'>('door');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingCustomizeTab, setPendingCustomizeTab] = useState<'door' | 'photos' | 'family' | 'details'>('door');
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

  // Lock scroll completely on door page so visitors cannot scroll down to preview invitation content
  useEffect(() => {
    if (!isOpenDoor) {
      window.scrollTo(0, 0);
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      const prevBodyHeight = document.body.style.height;
      const prevTouchAction = document.body.style.touchAction;

      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.touchAction = 'none';

      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
        document.body.style.height = prevBodyHeight;
        document.body.style.touchAction = prevTouchAction;
      };
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
    }
  }, [isOpenDoor]);

  const handleOpenDoor = () => {
    setIsOpenDoor(true);
  };

  const handleShowerPetals = () => {
    setBurstTrigger((prev) => prev + 1);
  };

  const handleOpenCustomizeWithTab = (tab: 'door' | 'photos' | 'family' | 'details' = 'door') => {
    setPendingCustomizeTab(tab);
    if (isAdminUnlocked) {
      setCustomizeTab(tab);
      setIsCustomizeOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    setIsAdminUnlocked(true);
    setIsPasswordModalOpen(false);
    setCustomizeTab(pendingCustomizeTab);
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
    <div
      className={`relative min-h-screen bg-[#030d07] text-stone-100 font-sans ${
        !isOpenDoor ? 'h-screen max-h-screen overflow-hidden' : 'overflow-x-hidden'
      }`}
    >
      {/* Falling Marigold & Rose Petals Canvas */}
      <PetalCanvas burstTrigger={burstTrigger} />

      {/* Ornate Temple Doors with Central Golden Seal */}
      <TempleDoor
        isOpen={isOpenDoor}
        onOpen={handleOpenDoor}
        onShower={handleShowerPetals}
        familyHeading={data.familyHeading}
        familyName={data.familyName}
        onOpenCustomize={handleOpenCustomizeWithTab}
      />

      {/* Main Mobile-Optimized Invitation View (Locked to 1 screen when door is closed) */}
      <div
        className={`w-full flex justify-center ${
          !isOpenDoor ? 'h-screen max-h-screen overflow-hidden pointer-events-none select-none' : ''
        }`}
      >
        <InvitationCard
          data={data}
          inviteId={inviteId}
          isSavedInCloud={isSavedInCloud}
          onReopenDoors={() => {
            window.scrollTo(0, 0);
            setIsOpenDoor(false);
          }}
          onOpenCustomize={handleOpenCustomizeWithTab}
          onShowerPetals={handleShowerPetals}
        />
      </div>

      {/* Password Verification Modal to Protect Settings */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
        currentPassword={data.adminPassword ?? '1234'}
      />

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
