import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { ShieldCheck, Key, Eye, EyeOff, Lock, X, AlertCircle } from 'lucide-react';
import logoUrl from '../../assets/images/academy_official_logo_1791469588319.jpg';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAsAdminWithPassword, language } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password.trim()) {
      setErrorMsg(isUrdu ? 'برائے مہربانی ایڈمن پاس ورڈ درج فرمائیں۔' : 'Please enter the admin password.');
      return;
    }

    const success = loginAsAdminWithPassword(password);
    if (success) {
      setPassword('');
      onClose();
    } else {
      setErrorMsg(
        isUrdu
          ? 'غلط پاس ورڈ! ایڈمن رسائی صرف ادارہ انتظامیہ کے لیے مخصوص ہے۔ درست پاس ورڈ درج فرمائیں۔'
          : 'Invalid Admin Password! Access is restricted to Intelligence Academy staff only.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-400/50 bg-slate-900 flex items-center justify-center shrink-0">
              <img
                src={logoUrl}
                alt="Intelligence Academy Logo"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">
                {isUrdu ? 'اکیڈمی ایڈمن لاگ ان (Admin Verification)' : 'Academy Admin Authentication'}
              </h3>
              <p className="text-[10px] text-indigo-200">Restricted Faculty Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="text-slate-600 leading-relaxed text-xs">
            <p>
              {isUrdu
                ? 'عام صارفین اور والدین صرف والدین پورٹل دیکھ سکتے ہیں۔ حاضری لگانے، فیس تبدیل کرنے اور ریکارڈ سنبھالنے کے لیے ایڈمن پاس ورڈ درج کریں:'
                : 'General users and parents only have access to the Parent Portal. Enter your Academy Admin Secret Key to access management records:'}
            </p>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1.5 flex items-center justify-between">
              <span>Admin Secret Key / Password *</span>
              <span className="text-[10px] text-slate-400 font-mono">PIN Protected</span>
            </label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 focus-within:border-indigo-600 focus-within:bg-white transition-all">
              <Key className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                placeholder="Enter Admin Password"
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

          {errorMsg && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          )}

          {/* Quick hint for the user */}
          <div className="bg-indigo-50/70 p-3 rounded-lg border border-indigo-100 text-[11px] text-indigo-900 flex items-center justify-between">
            <span>
              Academy Admin Key: <strong className="font-mono text-indigo-800">intelligence2026</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setPassword('intelligence2026');
                setErrorMsg('');
              }}
              className="px-2 py-0.5 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded font-semibold text-[10px] text-indigo-700 transition-colors shadow-2xs"
            >
              Auto-Fill
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium"
            >
              {isUrdu ? 'منسوخ کریں (واپس والدین پورٹل)' : 'Cancel (Stay on Parent Portal)'}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isUrdu ? 'ایڈمن پورٹل کھولیں' : 'Authenticate & Unlock'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
