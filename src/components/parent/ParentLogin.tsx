import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import {
  ShieldCheck,
  Key,
  User,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  Phone,
  Lock,
  BookOpen,
} from 'lucide-react';
import logoUrl from '../../assets/images/academy_official_logo_1791469588319.jpg';
import { AdminLoginModal } from '../admin/AdminLoginModal';

interface ParentLoginProps {
  onOpenPaidNotes?: () => void;
}

export const ParentLogin: React.FC<ParentLoginProps> = ({ onOpenPaidNotes }) => {
  const { students, loginAsParent, loginAsAdmin, language } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCredentialsList, setShowCredentialsList] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setErrorMsg(
        isUrdu
          ? 'برائے مہربانی یوزر نیم اور پاس ورڈ دونوں درج فرمائیں۔'
          : 'Please enter both your allocated Username and Password.'
      );
      return;
    }

    // Match student by parentUsername or rollNumber
    const student = students.find((s) => {
      const uMatch =
        (s.parentUsername && s.parentUsername.toLowerCase() === cleanUsername) ||
        (s.rollNumber && s.rollNumber.toLowerCase() === cleanUsername);
      return uMatch;
    });

    if (!student) {
      setErrorMsg(
        isUrdu
          ? 'یہ یوزر نیم ادارہ کے ریکارڈ میں موجود نہیں ہے۔ برائے مہربانی ادارہ سے جاری کردہ درست یوزر نیم درج فرمائیں۔'
          : 'Username not found in Intelligence Academy records. Please check the username provided by the academy.'
      );
      return;
    }

    if (student.parentPassword !== cleanPassword) {
      setErrorMsg(
        isUrdu
          ? 'غلط پاس ورڈ! برائے مہربانی ادارہ سے فراہم کردہ درست پاس ورڈ درج کریں، یا اکیڈمی ہیلپ لائن (03185423896) پر رابطہ کریں۔'
          : 'Incorrect Password! Please enter the exact password issued by the academy or contact helpline at 03185423896.'
      );
      return;
    }

    // Successful login
    loginAsParent(student.id);
  };

  const handleQuickFill = (sUsername: string, sPassword: string) => {
    setUsername(sUsername);
    setPassword(sPassword);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-amber-400/60 bg-[#0a1931] shadow-xl flex items-center justify-center mb-3 p-0.5">
            <img
              src={logoUrl}
              alt="Intelligence Academy Official Crest"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block mb-1">
            {tr.academyName}
          </span>
          <h2 className={`text-2xl font-bold tracking-tight text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
            {isUrdu ? 'والدین لاگ ان پورٹل (Parent Portal)' : 'Parent Portal Login'}
          </h2>
          <p className="mt-1 text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            {isUrdu
              ? 'ادارہ (انٹیلی جنس اکیڈمی) کی طرف سے فراہم کردہ یوزر نیم اور پاس ورڈ درج کر کے لاگ ان ہوں۔'
              : 'Sign in using the official Username and Password provided by Intelligence Academy administration.'}
          </p>
        </div>

        {/* Paid All Subject Notes Direct Access Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 rounded-2xl p-4 text-slate-950 shadow-md border border-amber-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md">
                    Official Solved Notes
                  </span>
                  <span className="text-[11px] font-extrabold text-slate-900 font-mono">
                    Rs. 300 / Chapter
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-950 mt-0.5">
                  {isUrdu
                    ? 'پیڈ تمام مضامین کے نوٹس (کلاس 9، 10، 11، 12)'
                    : 'Paid All Subject Notes (Class 9-12)'}
                </h3>
                <p className="text-[11px] text-slate-900 font-medium">
                  {isUrdu
                    ? 'فزکس، کیمسٹری، کمپیوٹر، بائیو، انگلش (گیس پیپرز)، اردو۔ آرڈر واٹس ایپ پر!'
                    : 'All subjects solved + English Guess Papers. Order directly on WhatsApp.'}
                </p>
              </div>
            </div>

            {onOpenPaidNotes && (
              <button
                onClick={onOpenPaidNotes}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'نوٹس دیکھیں و آرڈر کریں' : 'Browse Notes & Order'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {isUrdu ? 'والدین اکاؤنٹ لاگ ان' : 'Enter Academy Credentials'}
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Secure Access</span>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {/* Username Input */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 flex items-center justify-between">
                <span>{isUrdu ? 'یوزر نیم (Allocated Username)' : 'Parent Username (Issued by Academy)'} *</span>
                <span className="text-[10px] text-slate-400 font-normal">e.g. IA-HAMZA</span>
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="Enter Username (مثلاً IA-HAMZA)"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="bg-transparent text-slate-900 focus:outline-hidden w-full text-xs font-mono font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 flex items-center justify-between">
                <span>{isUrdu ? 'پاس ورڈ (Password)' : 'Password / PIN'} *</span>
                <span className="text-[10px] text-slate-400 font-normal">Default: pass@2026</span>
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                <Key className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="bg-transparent text-slate-900 focus:outline-hidden w-full text-xs font-mono font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-hidden"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMsg}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors shadow-2xs flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isUrdu ? 'پورٹل میں لاگ ان کریں' : 'Sign In to Parent Portal'}</span>
            </button>
          </form>

          {/* Quick Credential Test Helper for Demo */}
          <div className="pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCredentialsList(!showCredentialsList)}
              className="w-full flex items-center justify-between text-xs text-indigo-700 hover:text-indigo-900 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100 font-medium transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {isUrdu
                    ? 'ادارہ کی طرف سے جاری کردہ لاگ ان لسٹ دیکھیں (Sample Credentials)'
                    : 'View Academy-Issued Student Credentials (Demo)'}
                </span>
              </div>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-indigo-200 font-mono">
                {showCredentialsList ? 'Hide' : 'Show'}
              </span>
            </button>

            {showCredentialsList && (
              <div className="mt-3 space-y-2 max-h-56 overflow-y-auto p-1 text-[11px]">
                <p className="text-slate-500 text-[10px] px-1">
                  Click any student below to automatically fill their issued username & password:
                </p>
                {students.map((std) => (
                  <div
                    key={std.id}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-indigo-50/40 hover:border-indigo-200 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block">{std.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        User: <strong className="text-indigo-700">{std.parentUsername}</strong> · Pass: <strong className="text-slate-700">{std.parentPassword}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickFill(std.parentUsername, std.parentPassword)}
                      className="px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 rounded font-semibold text-[10px] transition-colors shadow-2xs text-indigo-700"
                    >
                      Fill
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Helpline / Forgotten Password Assistance */}
        <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-2">
          <div className="flex items-center justify-between font-semibold text-slate-800">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isUrdu ? 'لاگ ان معلومات حاصل کرنے کے لیے رابطہ' : 'Need Login Credentials?'}</span>
            </span>
            <a href="tel:03185423896" className="text-emerald-700 font-mono font-bold flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>03185423896</span>
            </a>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {isUrdu
              ? 'اگر آپ کو اپنا یوزر نیم یا پاس ورڈ معلوم نہیں ہے، تو انٹیلی جنس اکیڈمی ایڈمن آفس سے رابطہ فرمائیں۔'
              : 'If you have not received your Parent Portal credentials or forgot your password, contact Intelligence Academy admin.'}
          </p>
          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex flex-wrap justify-between gap-1">
            <span>Holy Family Rd, St 2, NW 40, Rawalpindi</span>
            <span>Campuses: Rawalpindi · Islamabad · Sohawa</span>
          </div>
        </div>

        {/* Switch to Admin Control - Protected by Admin Key */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
            className="text-xs text-slate-500 hover:text-indigo-700 font-medium inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white/70 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>{isUrdu ? 'اکیڈمی ایڈمن لاگ ان (مخصوص اسٹاف)' : 'Academy Admin & Faculty Portal (PIN Required)'}</span>
          </button>
        </div>
      </div>

      {/* Admin Verification Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};
