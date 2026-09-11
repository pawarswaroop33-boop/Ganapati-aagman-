import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, RotateCcw, Upload, Image as ImageIcon } from 'lucide-react';
import { InvitationDetails } from '../types';
import { defaultInvitationData } from '../data/defaultData';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationDetails;
  onSave: (updated: InvitationDetails) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
}) => {
  const [formData, setFormData] = useState<InvitationDetails>({ ...data });

  if (!isOpen) return null;

  const handleImageUpload = (field: 'bappaImageUrl' | 'hostPhoto', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (field === 'bappaImageUrl') {
        setFormData({ ...formData, bappaImageUrl: url });
      } else {
        const updatedMembers = [...formData.familyMembers];
        if (updatedMembers[0]) {
          updatedMembers[0] = { ...updatedMembers[0], photoUrl: url };
        }
        setFormData({ ...formData, familyMembers: updatedMembers });
      }
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#0a2419] to-[#04120a] border border-amber-500/40 rounded-3xl p-5 sm:p-7 text-stone-100 shadow-2xl my-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20 mb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-white flex items-center gap-2">
              <span>निमंत्रण पत्रिका कस्टमाईज करा</span>
            </h3>
            <p className="text-xs text-amber-300/80">Customize family details, venue, dates, & photos</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs sm:text-sm">
          {/* Family Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-amber-200 font-semibold mb-1">
                कुटुंबाचे नाव (Family Name)
              </label>
              <input
                type="text"
                value={formData.familyName}
                onChange={(e) => setFormData({ ...formData, familyName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-1">
                निमंत्रक शीर्षक (Header text)
              </label>
              <input
                type="text"
                value={formData.familyHeading}
                onChange={(e) => setFormData({ ...formData, familyHeading: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Host & Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-amber-200 font-semibold mb-1">
                कुटुंबप्रमुख / मुख्य निमंत्रक नाव (Host Name)
              </label>
              <input
                type="text"
                value={formData.hostName}
                onChange={(e) => {
                  const updated = [...formData.familyMembers];
                  if (updated[0]) updated[0] = { ...updated[0], name: e.target.value };
                  setFormData({ ...formData, hostName: e.target.value, familyMembers: updated });
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-amber-200 font-semibold mb-1">
                निमंत्रक फोटो बदला (Upload Host Photo)
              </label>
              <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#04120a] border border-dashed border-amber-500/40 text-amber-300 cursor-pointer hover:border-amber-400 transition">
                <Upload className="w-4 h-4 text-amber-400" />
                <span className="text-xs truncate">Choose host photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload('hostPhoto', e)}
                />
              </label>
            </div>
          </div>

          {/* Bappa Murti Photo */}
          <div>
            <label className="block text-amber-200 font-semibold mb-1">
              बाप्पांच्या मूर्तीचा फोटो (Bappa Murti Photo)
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={formData.bappaImageUrl}
                onChange={(e) => setFormData({ ...formData, bappaImageUrl: e.target.value })}
                placeholder="Paste image URL or choose file"
                className="flex-1 px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400 text-xs"
              />
              <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 cursor-pointer hover:bg-amber-500/30 transition text-xs shrink-0 font-medium">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload('bappaImageUrl', e)}
                />
              </label>
            </div>
          </div>

          {/* Venue & Address */}
          <div>
            <label className="block text-amber-200 font-semibold mb-1">
              निवास / मंडळाचे नाव (Venue Name)
            </label>
            <input
              type="text"
              value={formData.venueName}
              onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-amber-200 font-semibold mb-1">
              संपूर्ण पत्ता (Full Address)
            </label>
            <textarea
              rows={2}
              value={formData.fullAddress}
              onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Google Maps URL & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-amber-200 font-semibold mb-1">
                गुगल मॅप लिंक (Google Maps Link)
              </label>
              <input
                type="text"
                value={formData.googleMapsUrl}
                onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-1">
                संपर्क क्रमांक (Contact Number)
              </label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-amber-200 font-semibold mb-1">
                सुरुवात तारीख (Start Date)
              </label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-amber-200 font-semibold mb-1">
                तिथी / कालावधी (Tithi / Duration)
              </label>
              <input
                type="text"
                value={formData.tithi}
                onChange={(e) => setFormData({ ...formData, tithi: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Invitation Prose Message */}
          <div>
            <label className="block text-amber-200 font-semibold mb-1">
              सस्नेह आमंत्रण संदेश (Invitation Message)
            </label>
            <textarea
              rows={3}
              value={formData.invitationMessage}
              onChange={(e) => setFormData({ ...formData, invitationMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#04120a] border border-amber-500/30 text-white focus:outline-none focus:border-amber-400 text-xs sm:text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-amber-500/20">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/60 transition"
              >
                <Save className="w-3.5 h-3.5 text-stone-950" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
