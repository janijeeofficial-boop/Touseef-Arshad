import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { Bell, ShieldCheck, UserCheck, Languages, ArrowLeft, Lock, BookOpen } from 'lucide-react';
import logoUrl from '../assets/images/academy_official_logo_1791469588319.jpg';
import { AdminLoginModal } from './admin/AdminLoginModal';

interface HeaderProps {
  onOpenNotifications: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, activeTab, setActiveTab }) => {
  const { role, setRole, language, setLanguage, activeStudent, currentStudentId, unreadNotifsCount, logout, logoutAdmin } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const canGoBack = role === 'admin' || (role === 'parent' && Boolean(currentStudentId));

  const handleGoBack = () => {
    if (role === 'admin') {
      if (activeTab && activeTab !== 'dashboard' && setActiveTab) {
        setActiveTab('dashboard');
      } else {
        logoutAdmin();
      }
    } else if (role === 'parent') {
      logout();
    }
  };

  const backButtonLabel = () => {
    if (role === 'admin') {
      if (activeTab && activeTab !== 'dashboard') {
        return isUrdu ? 'ڈیش بورڈ' : 'Dashboard';
      }
      return isUrdu ? 'والدین پورٹل' : 'Exit Admin';
    }
    return isUrdu ? 'لاگ ان پیج' : 'Back';
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark with crest and Back action */}
          <div className="flex items-center gap-2 sm:gap-3">
            {canGoBack && (
              <button
                onClick={handleGoBack}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition-colors text-xs font-semibold shrink-0 shadow-2xs"
                title={isUrdu ? 'پچھلے پیج پر واپس جائیں' : 'Back to previous page'}
                aria-label="Back"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{backButtonLabel()}</span>
              </button>
            )}

            <div className="w-11 h-11 rounded-full overflow-hidden border border-amber-400/40 shadow-xs bg-slate-900 flex items-center justify-center shrink-0">
              <img
                src={logoUrl}
                alt="Intelligence Academy Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-lg font-bold tracking-tight text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
                {tr.academyName}
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                {role === 'admin' ? tr.adminPortal : `${tr.parentPortal} · ${activeStudent ? activeStudent.name : ''}`}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (for Admin) */}
          {role === 'admin' && setActiveTab && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`transition-colors pb-1 text-sm ${
                  activeTab === 'dashboard'
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900'
                } ${isUrdu ? 'font-urdu' : ''}`}
              >
                {tr.dashboard}
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`transition-colors pb-1 text-sm ${
                  activeTab === 'attendance'
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900'
                } ${isUrdu ? 'font-urdu' : ''}`}
              >
                {tr.attendance}
              </button>
              <button
                onClick={() => setActiveTab('academic')}
                className={`transition-colors pb-1 text-sm ${
                  activeTab === 'academic'
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900'
                } ${isUrdu ? 'font-urdu' : ''}`}
              >
                {tr.academicProgress}
              </button>
              <button
                onClick={() => setActiveTab('fees')}
                className={`transition-colors pb-1 text-sm ${
                  activeTab === 'fees'
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900'
                } ${isUrdu ? 'font-urdu' : ''}`}
              >
                {tr.feeManagement}
              </button>
              <button
                onClick={() => setActiveTab('notices')}
                className={`transition-colors pb-1 text-sm ${
                  activeTab === 'notices'
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900'
                } ${isUrdu ? 'font-urdu' : ''}`}
              >
                {tr.announcements}
              </button>
              <button
                onClick={() => setActiveTab('paid-notes')}
                className={`transition-colors pb-1 text-sm font-semibold flex items-center gap-1.5 ${
                  activeTab === 'paid-notes'
                    ? 'text-amber-600 border-b-2 border-amber-500 font-bold'
                    : 'text-amber-700 hover:text-amber-800'
                } ${isUrdu ? 'font-urdu' : ''}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>{tr.paidNotes}</span>
              </button>
            </nav>
          )}

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Direct Link to Paid All Subject Notes for Parents & Visitors */}
            {role === 'parent' && setActiveTab && (
              <button
                onClick={() => setActiveTab('paid-notes')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                  activeTab === 'paid-notes'
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                }`}
                title="Paid All Subject Notes (Class 9-12, Rs. 300/Ch)"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">
                  {isUrdu ? 'پیڈ تمام مضامین کے نوٹس' : 'Paid All Subject Notes'}
                </span>
                <span className="sm:hidden font-mono">
                  Rs. 300
                </span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              title="Toggle Language / زبان تبدیل کریں"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Portal Switcher with Password Gate */}
            {role === 'admin' ? (
              <button
                onClick={logoutAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
                title={isUrdu ? 'ایڈمن سیشن بند کریں اور والدین پورٹل پر جائیں' : 'Lock Admin and switch to Parent Portal'}
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>{isUrdu ? 'ایڈمن لاگ آؤٹ' : 'Exit Admin'}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap"
                title={isUrdu ? 'صرف اکیڈمی اسٹاف کے لیے مخصوص' : 'Restricted to academy authorized personnel'}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>{tr.loginAsAdmin}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </header>
  );
};
