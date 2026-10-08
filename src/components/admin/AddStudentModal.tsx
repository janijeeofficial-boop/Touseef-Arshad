import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { X, UserPlus, Save, Key, UserCheck, MessageSquare, Copy, Check, Sparkles } from 'lucide-react';
import { Student, Campus } from '../../types';
import logoUrl from '../../assets/images/academy_official_logo_1791469588319.jpg';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { addStudent, language } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  const defaultRoll = `IA-2026-00${Math.floor(Math.random() * 90) + 10}`;

  const [formData, setFormData] = useState({
    name: '',
    urduName: '',
    fatherName: '',
    urduFatherName: '',
    rollNumber: defaultRoll,
    classGrade: 'Class 10 - Matric Science',
    section: 'A',
    campus: 'Rawalpindi' as Campus,
    gender: 'Male' as 'Male' | 'Female',
    phone: '0318-5423896',
    parentPhone: '0300-7654321',
    parentEmail: '',
    parentUsername: `IA-${defaultRoll.replace('IA-', '')}`,
    parentPassword: 'pass@2026',
    admissionDate: new Date().toISOString().split('T')[0],
    monthlyFee: 6500,
  });

  const [createdStudent, setCreatedStudent] = useState<Student | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    const cleanName = val.trim().replace(/\s+/g, '').toUpperCase();
    setFormData((prev) => ({
      ...prev,
      name: val,
      parentUsername: cleanName ? `IA-${cleanName}` : `IA-${prev.rollNumber.replace('IA-', '')}`,
    }));
  };

  const handleRollChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      rollNumber: val,
      parentUsername: prev.name.trim() ? prev.parentUsername : `IA-${val.replace(/[^A-Za-z0-9]/g, '')}`,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.fatherName.trim()) return;

    const newStudent = addStudent({
      ...formData,
      status: 'Active',
    });

    setCreatedStudent(newStudent);
  };

  const handleCopyCredentials = () => {
    if (!createdStudent) return;
    const text = `Intelligence Academy - Parent Portal Login\nStudent: ${createdStudent.name} (Roll #${createdStudent.rollNumber})\nUsername: ${createdStudent.parentUsername}\nPassword: ${createdStudent.parentPassword}\nHelpline: 03185423896`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDone = () => {
    setCreatedStudent(null);
    const nextRoll = `IA-2026-00${Math.floor(Math.random() * 90) + 10}`;
    setFormData({
      name: '',
      urduName: '',
      fatherName: '',
      urduFatherName: '',
      rollNumber: nextRoll,
      classGrade: 'Class 10 - Matric Science',
      section: 'A',
      campus: 'Rawalpindi' as Campus,
      gender: 'Male',
      phone: '0318-5423896',
      parentPhone: '0300-7654321',
      parentEmail: '',
      parentUsername: `IA-${nextRoll.replace('IA-', '')}`,
      parentPassword: 'pass@2026',
      admissionDate: new Date().toISOString().split('T')[0],
      monthlyFee: 6500,
    });
    onClose();
  };

  const whatsappMessage = createdStudent
    ? `محترم والدین! انٹیلی جنس اکیڈمی کی طرف سے آپ کے بچے ${createdStudent.name} (رول نمبر: ${createdStudent.rollNumber}) کا لاگ ان پورٹل تیار کر دیا گیا ہے۔\n\nوالدین پورٹل لاگ ان تفصیلات:\n👤 یوزر نیم (Username): ${createdStudent.parentUsername}\n🔑 پاس ورڈ (Password): ${createdStudent.parentPassword}\n\nاس پورٹل کے ذریعے آپ روزانہ حاضری، ٹیسٹ رزلٹ اور فیس چیک کر سکتے ہیں۔ کسی بھی معلومات کے لیے 03185423896 پر رابطہ فرمائیں۔`
    : '';

  const whatsappUrl = createdStudent
    ? `https://wa.me/${createdStudent.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/50 bg-slate-900 flex items-center justify-center shrink-0">
              <img
                src={logoUrl}
                alt="Intelligence Academy"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className={`font-bold text-slate-900 text-sm ${isUrdu ? 'font-urdu' : ''}`}>
              {createdStudent
                ? (isUrdu ? 'طالب علم کامیابی سے شامل ہو گیا!' : 'Student Successfully Enrolled!')
                : (isUrdu ? 'نیا طالب علم داخل کریں اور پورٹل کریڈینشلز بنائیں' : 'Enroll Student & Issue Parent Credentials')}
            </h3>
          </div>
          <button
            onClick={createdStudent ? handleDone : onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {createdStudent ? (
          /* SUCCESS SCREEN WITH CREDENTIALS CARD */
          <div className="p-6 space-y-5 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <span className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2 text-lg font-bold">
                ✓
              </span>
              <h4 className="text-base font-bold text-emerald-950">
                {isUrdu ? 'طالب علم کا ایڈمشن مکمل ہو گیا!' : 'Student Enrollment Successful!'}
              </h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                {createdStudent.name} has been enrolled in {createdStudent.classGrade} ({createdStudent.campus || 'Rawalpindi'}).
              </p>
            </div>

            {/* Issued Credentials Box */}
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                    Official Parent Portal Credentials (ادارہ کی طرف سے لاگ ان)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Share with Parents</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider">
                    Parent Username (یوزر نیم)
                  </span>
                  <span className="font-mono font-bold text-white text-sm select-all">
                    {createdStudent.parentUsername}
                  </span>
                </div>

                <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                  <span className="text-[10px] text-slate-400 block mb-0.5 uppercase tracking-wider">
                    Parent Password (پاس ورڈ)
                  </span>
                  <span className="font-mono font-bold text-amber-300 text-sm select-all">
                    {createdStudent.parentPassword}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                والدین اب والدین پورٹل پر جا کر یہی یوزر نیم اور پاس ورڈ درج کر کے اپنے بچے کی روزانہ حاضری، فیس اور نتائج دیکھ سکتے ہیں۔
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Credentials on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopyCredentials}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition-colors border border-slate-200 flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleDone}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
            {/* Student Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Daniyal Khan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 font-urdu">
                  طالب علم کا اردو نام
                </label>
                <input
                  type="text"
                  value={formData.urduName}
                  onChange={(e) => setFormData({ ...formData, urduName: e.target.value })}
                  placeholder="مثلاً دانیال خان"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-urdu focus:bg-white focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Father's Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Father's Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  placeholder="e.g. Aslam Khan"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 font-urdu">
                  والد کا نام (اردو)
                </label>
                <input
                  type="text"
                  value={formData.urduFatherName}
                  onChange={(e) => setFormData({ ...formData, urduFatherName: e.target.value })}
                  placeholder="مثلاً اسلم خان"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-urdu focus:bg-white focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Roll, Class, Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Roll Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.rollNumber}
                  onChange={(e) => handleRollChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-indigo-700 focus:bg-white focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Class / Grade *
                </label>
                <select
                  value={formData.classGrade}
                  onChange={(e) => setFormData({ ...formData, classGrade: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
                >
                  <option value="Class 9 - Science">Class 9 - Science</option>
                  <option value="Class 10 - Matric Science">Class 10 - Matric Science</option>
                  <option value="F.Sc Part 1 - Pre-Medical">F.Sc Part 1 - Pre-Medical</option>
                  <option value="F.Sc Part 2 - Pre-Engineering">F.Sc Part 2 - Pre-Engineering</option>
                  <option value="ICS Part 1 - Computer Science">ICS Part 1 - Computer Science</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Section
                </label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
                />
              </div>
            </div>

            {/* Campus & Parent Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Campus Location *
                </label>
                <select
                  value={formData.campus}
                  onChange={(e) => setFormData({ ...formData, campus: e.target.value as Campus })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500 font-medium text-slate-900"
                >
                  <option value="Rawalpindi">Rawalpindi Campus (Main Branch)</option>
                  <option value="Islamabad">Islamabad Campus</option>
                  <option value="Sohawa">Sohawa Campus</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Parent WhatsApp / Mobile *
                </label>
                <input
                  type="text"
                  required
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  placeholder="0300-1234567"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-indigo-500"
                />
                <span className="text-[10px] text-slate-400">Used for WhatsApp attendance alerts & credential delivery</span>
              </div>
            </div>

            {/* DEDICATED PARENT CREDENTIALS ISSUED BY ACADEMY */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-700" />
                <h4 className="font-bold text-indigo-950 text-xs">
                  Parent Portal Credentials (ادارہ کی طرف سے والدین کو دینے کا یوزر نیم اور پاس ورڈ)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Allocated Username (یوزر نیم) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentUsername}
                    onChange={(e) => setFormData({ ...formData, parentUsername: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-lg text-xs font-mono font-bold text-indigo-800 focus:outline-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500">Parents will use this to sign into the portal</span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Allocated Password (پاس ورڈ) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentPassword}
                    onChange={(e) => setFormData({ ...formData, parentPassword: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-indigo-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-indigo-500"
                  />
                  <span className="text-[10px] text-slate-500">Issued by academy for parent access</span>
                </div>
              </div>
            </div>

            {/* Fee & Student Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Monthly Tuition Fee (PKR)
                </label>
                <input
                  type="number"
                  value={formData.monthlyFee}
                  onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Admission Date
                </label>
                <input
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium"
              >
                {tr.cancel}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
              >
                <Save className="w-4 h-4" />
                <span>Save Student & Issue Credentials</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
