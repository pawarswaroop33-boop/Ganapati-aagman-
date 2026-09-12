import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Save,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Users,
  Sparkles,
  Camera,
  MapPin,
  Calendar,
  Phone,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { InvitationDetails, FamilyMember } from '../types';
import { defaultInvitationData } from '../data/defaultData';
import { compressImageFile } from '../utils/firebase';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationDetails;
  onSave: (updated: InvitationDetails) => Promise<void> | void;
  initialTab?: 'door' | 'photos' | 'family' | 'details';
}

// Curated authentic Ganapati Bappa murtis presets for quick selection
const BAPPA_PRESETS = [
  {
    name: 'पारंपरिक शाडू मूर्ती',
    url: 'https://images.unsplash.com/photo-1567591974584-f1832d98c6a0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'सुवर्ण सिंहासन मूर्ती',
    url: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'दीपावली व मखर आरती',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'मंगलमूर्ती रूप',
    url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1200&q=80',
  },
];

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  initialTab = 'door',
}) => {
  const [formData, setFormData] = useState<InvitationDetails>({ ...data });
  const [activeTab, setActiveTab] = useState<'door' | 'photos' | 'family' | 'details'>(initialTab);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberPhotoUrl, setNewMemberPhotoUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...data });
      setActiveTab(initialTab);
      setSaveSuccess(false);
      setUploadError(null);
    }
  }, [isOpen, initialTab, data]);

  if (!isOpen) return null;

  const handleFileUpload = async (
    field: 'bappaImageUrl' | 'inviterImageUrl',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsCompressing(field);
    try {
      // Compress to high-quality, lightweight base64 Data URL so it persists in Firebase Firestore
      const compressedDataUrl = await compressImageFile(file, 1000, 0.82);
      setFormData((prev) => ({
        ...prev,
        [field]: compressedDataUrl,
      }));
    } catch (err) {
      console.error('Image compression error:', err);
      setUploadError(err instanceof Error ? err.message : 'फोटो लोड करताना त्रुटी आली');
    } finally {
      setIsCompressing(null);
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      relation: newMemberRelation.trim() || 'कुटुंब सदस्य',
      photoUrl: newMemberPhotoUrl.trim() || undefined,
    };
    setFormData((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember],
    }));
    setNewMemberName('');
    setNewMemberRelation('');
    setNewMemberPhotoUrl('');
  };

  const handleRemoveMember = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((m) => m.id !== id),
    }));
  };

  const handleMemberChange = (
    id: string,
    name: string,
    relation: string,
    photoUrl?: string,
    blessing?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.map((m) =>
        m.id === id
          ? {
              ...m,
              name,
              relation,
              photoUrl: photoUrl !== undefined ? photoUrl : m.photoUrl,
              blessing: blessing !== undefined ? blessing : m.blessing,
            }
          : m
      ),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      setSaveSuccess(true);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error('Error saving invitation:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...defaultInvitationData });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-lg bg-gradient-to-b from-[#092217] via-[#061910] to-[#04120a] border border-amber-500/40 rounded-3xl p-4 sm:p-6 text-stone-100 shadow-2xl my-4 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪔</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-white">
                पत्रिका कस्टमाईज करा
              </h3>
              <p className="text-[11px] text-amber-300/80 font-serif">
                फोटो, कुटुंबातील नावे व उत्सव माहिती बदला
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 my-3 p-1 rounded-2xl bg-[#030e07] border border-amber-500/20 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('door')}
            className={`py-1.5 px-1.5 rounded-xl text-[11px] font-serif font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
              activeTab === 'door'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <span>🚪</span>
            <span className="truncate">नाव व सुरक्षा</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-1.5 px-1.5 rounded-xl text-[11px] font-serif font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
              activeTab === 'photos'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Camera className="w-3 h-3 shrink-0" />
            <span className="truncate">२ फोटो</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className={`py-1.5 px-1.5 rounded-xl text-[11px] font-serif font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
              activeTab === 'family'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Users className="w-3 h-3 shrink-0" />
            <span className="truncate">कुटुंब सदस्य</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-1.5 px-1.5 rounded-xl text-[11px] font-serif font-bold transition flex flex-col sm:flex-row items-center justify-center gap-1 text-center ${
              activeTab === 'details'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="truncate">स्थळ व वेळ</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm flex-1">
          {/* ======================================================== */}
          {/* TAB 0: DOOR NAME, FAMILY NAME, CALL NUMBER & HOST       */}
          {/* ======================================================== */}
          {activeTab === 'door' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-500/30">
                <h4 className="text-xs sm:text-sm font-bold font-serif text-amber-200 flex items-center gap-1.5">
                  <span>🚪</span>
                  <span>दारावरील नाव, निमंत्रक व संपर्क तपशील</span>
                </h4>
                <p className="text-[11px] text-stone-300 font-serif mt-1 leading-relaxed">
                  येथे केलेले बदल मुख्य दरवाजा उघडण्यापूर्वी दिसणाऱ्या नावावर, निमंत्रण पत्रिकेत आणि खालील संपर्क नंबरवर त्वरित अपडेट होतात.
                </p>
              </div>

              {/* Door Opening Heading */}
              <div className="p-3 rounded-xl bg-[#04120a] border border-amber-500/30 space-y-1">
                <label className="block text-amber-200 font-serif text-xs font-bold">
                  दारावरील मुख्य शीर्षक (Door Opening Heading) <span className="text-amber-400">*</span>
                </label>
                <p className="text-[10px] text-stone-400 font-serif mb-1">
                  (उदा. 'देशपांडे परिवाराकडून' किंवा 'पवार परिवाराकडून' - हे नाव सुरुवातीला मंदिर दरवाजावर दिसते)
                </p>
                <input
                  type="text"
                  value={formData.familyHeading}
                  onChange={(e) =>
                    setFormData({ ...formData, familyHeading: e.target.value })
                  }
                  placeholder="उदा. पवार परिवाराकडून"
                  className="w-full px-3 py-2 rounded-xl bg-[#071a10] border border-amber-500/40 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Family Name */}
              <div className="p-3 rounded-xl bg-[#04120a] border border-amber-500/30 space-y-1">
                <label className="block text-amber-200 font-serif text-xs font-bold">
                  कुटुंबाचे नाव (Family Name) <span className="text-amber-400">*</span>
                </label>
                <p className="text-[10px] text-stone-400 font-serif mb-1">
                  (उदा. 'देशपांडे परिवार' किंवा 'पवार परिवार' - हे नाव पत्रिकेच्या शेवटी स्वाक्षरीमध्ये दिसते)
                </p>
                <input
                  type="text"
                  value={formData.familyName}
                  onChange={(e) =>
                    setFormData({ ...formData, familyName: e.target.value })
                  }
                  placeholder="उदा. पवार परिवार"
                  className="w-full px-3 py-2 rounded-xl bg-[#071a10] border border-amber-500/40 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Host Name & Contact Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-[#04120a] border border-amber-500/30 space-y-1">
                  <label className="block text-amber-200 font-serif text-xs font-bold">
                    मुख्य निमंत्रक नाव (Main Host Name)
                  </label>
                  <p className="text-[10px] text-stone-400 font-serif mb-1">
                    (उदा. श्री. राजेश देशपांडे)
                  </p>
                  <input
                    type="text"
                    value={formData.hostName}
                    onChange={(e) =>
                      setFormData({ ...formData, hostName: e.target.value })
                    }
                    placeholder="उदा. श्री. स्वरूप पवार"
                    className="w-full px-3 py-2 rounded-xl bg-[#071a10] border border-amber-500/40 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#04120a] border border-amber-500/30 space-y-1">
                  <label className="block text-amber-200 font-serif text-xs font-bold">
                    संपर्क / फोन नंबर (Call / Mobile No) <span className="text-amber-400">*</span>
                  </label>
                  <p className="text-[10px] text-stone-400 font-serif mb-1">
                    (पाहुणे यावर थेट कॉल करू शकतील)
                  </p>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, contactNumber: e.target.value })
                    }
                    placeholder="उदा. +91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-[#071a10] border border-amber-500/40 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Closing Quote / Benediction */}
              <div className="p-3 rounded-xl bg-[#04120a] border border-amber-500/30 space-y-1">
                <label className="block text-amber-200 font-serif text-xs font-bold">
                  समारोप सस्नेह संदेश / आशीर्वाद (Closing Benediction)
                </label>
                <p className="text-[10px] text-stone-400 font-serif mb-1">
                  (पत्रिकेच्या तळाशी दिसणारा भक्तिमय संदेश)
                </p>
                <textarea
                  rows={2}
                  value={formData.closingQuote}
                  onChange={(e) =>
                    setFormData({ ...formData, closingQuote: e.target.value })
                  }
                  placeholder="उदा. आपली उपस्थिती हेच आमचे भाग्य, बाप्पांच्या आशीर्वादाने आपले जीवन सुख-समृद्धीने भरून जावो हीच प्रार्थना!"
                  className="w-full px-3 py-2 rounded-xl bg-[#071a10] border border-amber-500/40 text-white text-xs focus:outline-none focus:border-amber-400 leading-relaxed font-serif"
                />
              </div>

              {/* Settings Admin Password Configuration (Changeable in settings) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#071d12] to-[#030e07] border-2 border-amber-500/50 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <label className="text-amber-200 font-serif text-xs font-bold">
                      सेटिंग्ज ॲक्सेस पासवर्ड (Settings Password)
                    </label>
                  </div>
                  <span className="text-[10px] text-amber-300 font-serif font-semibold bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    🔐 बदलण्यायोग्य
                  </span>
                </div>

                <p className="text-[11px] text-stone-300 font-serif leading-relaxed">
                  हा पासवर्ड सेट केल्यास कोणीही इतर व्यक्ती तुमच्या निमंत्रणात परस्पर बदल करू शकणार नाही. पुढील वेळी सेटिंग्ज उघडण्यासाठी हा पासवर्ड आवश्यक असेल.
                </p>

                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    value={formData.adminPassword ?? '1234'}
                    onChange={(e) =>
                      setFormData({ ...formData, adminPassword: e.target.value })
                    }
                    placeholder="नवीन पासवर्ड प्रविष्ट करा (उदा. 1234 किंवा आपला गुप्त कोड)..."
                    className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#030e07] border border-amber-500/50 text-white text-xs sm:text-sm font-sans tracking-wider focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-amber-300 transition"
                    title={showAdminPassword ? 'पासवर्ड लपवा' : 'पासवर्ड दाखवा'}
                  >
                    {showAdminPassword ? (
                      <EyeOff className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-stone-400" />
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-amber-300/80 font-serif">
                  * बदल जतन करण्यासाठी खालील <strong>'बदल जतन करा'</strong> बटणावर नक्की क्लिक करा.
                </p>
              </div>
            </div>
          )}
          {/* ======================================================== */}
          {/* TAB 1: 2 UPLOAD INTERFACE (BAPPA & INVITATOR)            */}
          {/* ======================================================== */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              {/* Cloud Persistence Assurance Banner */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-[11px] text-amber-200/90 font-serif">
                <span className="text-amber-400 mt-0.5">☁️</span>
                <div>
                  <span className="font-bold text-amber-300">क्लाउडमध्ये कायमस्वरूपी सुरक्षित: </span>
                  आपण अपलोड केलेले दोन्ही फोटो थेट Firebase डेटाबेसमध्ये सेव्ह होतात. इतर कोणत्याही मोबाईलवरून निमंत्रण लिंक उघडल्यास फोटो दिसतील.
                </div>
              </div>

              {uploadError && (
                <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs font-serif">
                  ⚠️ {uploadError}
                </div>
              )}

              {/* UPLOAD 1: GANAPATI BAPPA'S IMAGE */}
              <div className="p-3.5 rounded-2xl bg-[#04120a] border border-amber-500/35 shadow-inner">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                    १
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold font-serif text-amber-200">
                      श्री गणपती बाप्पांचा फोटो (Ganapati Bappa Photo)
                    </h4>
                    <p className="text-[10px] text-stone-400 font-serif">
                      निमंत्रण पत्रिकेच्या सर्वात वर दर्शविला जाणारा पहिला फोटो
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  {/* Current Preview */}
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-400/60 shrink-0 bg-stone-900 shadow-md">
                    <img
                      src={formData.bappaImageUrl}
                      alt="Ganapati Bappa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center text-amber-200 py-0.5 font-serif">
                      बाप्पा
                    </div>
                    {isCompressing === 'bappaImageUrl' && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-[9px] text-amber-300 font-serif p-1 text-center">
                        <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-1" />
                        <span>अपलोड होत आहे...</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2">
                    <label className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed text-xs font-bold font-serif transition active:scale-95 cursor-pointer ${
                      isCompressing === 'bappaImageUrl'
                        ? 'bg-stone-800 text-stone-400 border-stone-600 pointer-events-none'
                        : 'bg-gradient-to-r from-amber-500/20 to-amber-600/30 border-amber-400 text-amber-300 hover:bg-amber-500/30'
                    }`}>
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>{isCompressing === 'bappaImageUrl' ? 'फोटो तयार होत आहे...' : 'बाप्पांचा नवीन फोटो निवडा'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isCompressing !== null}
                        className="hidden"
                        onChange={(e) => handleFileUpload('bappaImageUrl', e)}
                      />
                    </label>

                    {/* Or URL input */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={formData.bappaImageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, bappaImageUrl: e.target.value })
                        }
                        placeholder="किंवा फोटो URL पेस्ट करा"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#071a10] border border-amber-500/25 text-white text-[11px] focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="mt-3 pt-2.5 border-t border-amber-500/15">
                  <p className="text-[10px] text-amber-300/80 font-serif mb-1.5">
                    किंवा लोकप्रिय बाप्पा मूर्ती निवडा:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {BAPPA_PRESETS.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setFormData({ ...formData, bappaImageUrl: p.url })}
                        className={`p-1.5 rounded-lg text-[10px] font-serif border transition text-left truncate ${
                          formData.bappaImageUrl === p.url
                            ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                            : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:border-amber-500/40'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* UPLOAD 2: INVITATOR'S IMAGE */}
              <div className="p-3.5 rounded-2xl bg-[#04120a] border border-amber-500/35 shadow-inner">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                    २
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold font-serif text-amber-200">
                      निमंत्रक / कुटुंब फोटो (Invitator's & Family Photo)
                    </h4>
                    <p className="text-[10px] text-stone-400 font-serif">
                      बाप्पांच्या फोटोच्या खाली निमंत्रक विभागात दर्शविला जाणारा फोटो
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  {/* Current Preview */}
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden border-2 border-amber-400/60 shrink-0 bg-stone-900 shadow-md">
                    <img
                      src={formData.inviterImageUrl}
                      alt="Inviter"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center text-amber-200 py-0.5 font-serif">
                      निमंत्रक
                    </div>
                    {isCompressing === 'inviterImageUrl' && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-[9px] text-amber-300 font-serif p-1 text-center">
                        <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-1" />
                        <span>अपलोड होत आहे...</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2">
                    <label className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed text-xs font-bold font-serif transition active:scale-95 cursor-pointer ${
                      isCompressing === 'inviterImageUrl'
                        ? 'bg-stone-800 text-stone-400 border-stone-600 pointer-events-none'
                        : 'bg-gradient-to-r from-amber-500/20 to-amber-600/30 border-amber-400 text-amber-300 hover:bg-amber-500/30'
                    }`}>
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>{isCompressing === 'inviterImageUrl' ? 'फोटो तयार होत आहे...' : 'निमंत्रक फोटो निवडा / बदला'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isCompressing !== null}
                        className="hidden"
                        onChange={(e) => handleFileUpload('inviterImageUrl', e)}
                      />
                    </label>

                    {/* Or URL input */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={formData.inviterImageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, inviterImageUrl: e.target.value })
                        }
                        placeholder="किंवा फोटो URL पेस्ट करा"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#071a10] border border-amber-500/25 text-white text-[11px] focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: FAMILY MEMBERS NAMES (BELOW INVITATOR'S IMAGE)   */}
          {/* ======================================================== */}
          {activeTab === 'family' && (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-200 font-serif leading-relaxed">
                  ✦ निमंत्रक फोटोच्या खाली दिसणाऱ्या <strong>कुटुंबातील सर्व सदस्यांची नावे</strong> येथे जोडा किंवा संपादित करा.
                </p>
              </div>

              {/* Family heading & Family Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-amber-200 font-serif text-xs font-semibold mb-1">
                    कुटुंबाचे नाव (उदा. देशपांडे परिवार)
                  </label>
                  <input
                    type="text"
                    value={formData.familyName}
                    onChange={(e) =>
                      setFormData({ ...formData, familyName: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-amber-200 font-serif text-xs font-semibold mb-1">
                    शीर्षक ओळ (उदा. देशपांडे परिवाराकडून)
                  </label>
                  <input
                    type="text"
                    value={formData.familyHeading}
                    onChange={(e) =>
                      setFormData({ ...formData, familyHeading: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Existing Members List */}
              <div className="space-y-2">
                <label className="block text-amber-200 font-serif text-xs font-semibold">
                  कुटुंब सदस्य यादी ({formData.familyMembers.length})
                </label>

                {formData.familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-xl bg-[#04120a] border border-amber-500/25 space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative w-9 h-11 rounded-lg overflow-hidden border border-amber-400/50 bg-stone-900 shrink-0">
                        <img
                          src={member.photoUrl || formData.inviterImageUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            handleMemberChange(
                              member.id,
                              e.target.value,
                              member.relation,
                              member.photoUrl,
                              member.blessing
                            )
                          }
                          placeholder="नाव (उदा. सौ. सुवर्णा देशपांडे)"
                          className="px-2 py-1 rounded-lg bg-[#071a10] border border-stone-800 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="text"
                          value={member.relation}
                          onChange={(e) =>
                            handleMemberChange(
                              member.id,
                              member.name,
                              e.target.value,
                              member.photoUrl,
                              member.blessing
                            )
                          }
                          placeholder="पद / नाते (उदा. कुटुंबप्रमुख)"
                          className="px-2 py-1 rounded-lg bg-[#071a10] border border-stone-800 text-amber-300 text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="हटवा"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Member photo URL & blessing quote */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      <input
                        type="text"
                        value={member.photoUrl || ''}
                        onChange={(e) =>
                          handleMemberChange(
                            member.id,
                            member.name,
                            member.relation,
                            e.target.value,
                            member.blessing
                          )
                        }
                        placeholder="फोटो URL (ऐच्छिक)"
                        className="px-2 py-1 rounded-lg bg-[#071a10] border border-stone-800 text-stone-300 text-[10px] focus:outline-none focus:border-amber-400 truncate"
                      />
                      <input
                        type="text"
                        value={member.blessing || ''}
                        onChange={(e) =>
                          handleMemberChange(
                            member.id,
                            member.name,
                            member.relation,
                            member.photoUrl,
                            e.target.value
                          )
                        }
                        placeholder="शुभेच्छा संदेश (उदा. स्वागतम्)"
                        className="px-2 py-1 rounded-lg bg-[#071a10] border border-stone-800 text-amber-200/80 text-[10px] focus:outline-none focus:border-amber-400 truncate"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Member Input */}
              <div className="p-3 rounded-2xl bg-[#030d07] border border-dashed border-amber-500/40 space-y-2">
                <span className="text-[11px] font-serif font-bold text-amber-300 block">
                  + नवीन सदस्य जोडा:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="सदस्याचे पूर्ण नाव"
                    className="px-2.5 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    placeholder="नाते / शीर्षक (उदा. कन्या)"
                    className="px-2.5 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <input
                  type="text"
                  value={newMemberPhotoUrl}
                  onChange={(e) => setNewMemberPhotoUrl(e.target.value)}
                  placeholder="सदस्याचा फोटो URL (उदा. https://... ऐच्छिक)"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-stone-300 text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="w-full py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold font-serif flex items-center justify-center gap-1 transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>यादीत जोडा (Add to Family List)</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: ADDRESS, DATES & INVITATION MESSAGE              */}
          {/* ======================================================== */}
          {activeTab === 'details' && (
            <div className="space-y-3">
              <div>
                <label className="block text-amber-200 font-semibold mb-1">
                  उत्सव स्थळ / निवास नाव (Venue Name)
                </label>
                <input
                  type="text"
                  value={formData.venueName}
                  onChange={(e) =>
                    setFormData({ ...formData, venueName: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-200 font-semibold mb-1">
                  संपूर्ण पत्ता (Full Address)
                </label>
                <textarea
                  rows={2}
                  value={formData.fullAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, fullAddress: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-amber-200 font-semibold mb-1">
                    लँडमार्क (Landmark)
                  </label>
                  <input
                    type="text"
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({ ...formData, landmark: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-amber-200 font-semibold mb-1">
                    संपर्क क्रमांक (Contact Number)
                  </label>
                  <input
                    type="text"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, contactNumber: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-amber-200 font-semibold mb-1">
                    सुरुवात तारीख (Start Date)
                  </label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-amber-200 font-semibold mb-1">
                    तिथी / कालावधी (Tithi)
                  </label>
                  <input
                    type="text"
                    value={formData.tithi}
                    onChange={(e) =>
                      setFormData({ ...formData, tithi: e.target.value })
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-200 font-semibold mb-1">
                  सस्नेह आमंत्रण संदेश (Invitation Prose)
                </label>
                <textarea
                  rows={3}
                  value={formData.invitationMessage}
                  onChange={(e) =>
                    setFormData({ ...formData, invitationMessage: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-amber-500/20 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition"
              >
                रद्द करा
              </button>
              <button
                type="submit"
                disabled={isSaving || isCompressing !== null}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition active:scale-95 ${
                  saveSuccess
                    ? 'bg-emerald-500 text-stone-950 shadow-emerald-950/60'
                    : isSaving
                    ? 'bg-amber-600/70 text-stone-950 shadow-amber-950/60 cursor-wait'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-950/60'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>क्लाउडमध्ये जतन होत आहे...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <span>✓</span>
                    <span>क्लाउडवर सुरक्षित झाले!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-stone-950" />
                    <span>जतन करा (Save to Cloud)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
