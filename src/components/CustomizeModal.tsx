import React, { useState } from 'react';
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
  Phone
} from 'lucide-react';
import { InvitationDetails, FamilyMember } from '../types';
import { defaultInvitationData } from '../data/defaultData';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationDetails;
  onSave: (updated: InvitationDetails) => void;
  initialTab?: 'photos' | 'family' | 'details';
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
  initialTab = 'photos',
}) => {
  const [formData, setFormData] = useState<InvitationDetails>({ ...data });
  const [activeTab, setActiveTab] = useState<'photos' | 'family' | 'details'>(initialTab);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (
    field: 'bappaImageUrl' | 'inviterImageUrl',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        [field]: url,
      }));
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      relation: newMemberRelation.trim() || 'कुटुंब सदस्य',
    };
    setFormData((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, newMember],
    }));
    setNewMemberName('');
    setNewMemberRelation('');
  };

  const handleRemoveMember = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((m) => m.id !== id),
    }));
  };

  const handleMemberChange = (id: string, name: string, relation: string) => {
    setFormData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.map((m) =>
        m.id === id ? { ...m, name, relation } : m
      ),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
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
        <div className="flex items-center gap-1.5 my-3 p-1 rounded-2xl bg-[#030e07] border border-amber-500/20 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'photos'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>२ फोटो अपलोड</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'family'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>कुटुंब सदस्यांची नावे</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-serif font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'details'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>पत्ता व वेळ</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm flex-1">
          {/* ======================================================== */}
          {/* TAB 1: 2 UPLOAD INTERFACE (BAPPA & INVITATOR)            */}
          {/* ======================================================== */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
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
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-dashed border-amber-400 text-amber-300 cursor-pointer hover:bg-amber-500/30 transition text-xs font-bold font-serif active:scale-95">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>बाप्पांचा नवीन फोटो निवडा</span>
                      <input
                        type="file"
                        accept="image/*"
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
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-dashed border-amber-400 text-amber-300 cursor-pointer hover:bg-amber-500/30 transition text-xs font-bold font-serif active:scale-95">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>निमंत्रक फोटो निवडा / बदला</span>
                      <input
                        type="file"
                        accept="image/*"
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
                    className="p-2.5 rounded-xl bg-[#04120a] border border-amber-500/25 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          handleMemberChange(member.id, e.target.value, member.relation)
                        }
                        placeholder="नाव (उदा. श्री. राजेश देशपांडे)"
                        className="px-2 py-1 rounded-lg bg-[#071a10] border border-stone-800 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                      <input
                        type="text"
                        value={member.relation}
                        onChange={(e) =>
                          handleMemberChange(member.id, member.name, e.target.value)
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
                    placeholder="सदस्याचे पूर्ण नाव (उदा. सौ. सुवर्णा देशपांडे)"
                    className="px-2.5 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    placeholder="नाते / शीर्षक (उदा. सहधर्मचारिणी)"
                    className="px-2.5 py-1.5 rounded-xl bg-[#04120a] border border-amber-500/30 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
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
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/60 transition active:scale-95"
              >
                <Save className="w-3.5 h-3.5 text-stone-950" />
                <span>जतन करा (Save)</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
