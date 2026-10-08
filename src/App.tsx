import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AttendanceManager } from './components/admin/AttendanceManager';
import { StudentProgressManager } from './components/admin/StudentProgressManager';
import { FeeManager } from './components/admin/FeeManager';
import { NoticeManager } from './components/admin/NoticeManager';
import { PaidNotesManager } from './components/admin/PaidNotesManager';
import { ParentPortal } from './components/parent/ParentPortal';
import { ParentLogin } from './components/parent/ParentLogin';
import { PaidNotesPortal } from './components/parent/PaidNotesPortal';
import { ParentAnnouncementTicker } from './components/parent/ParentAnnouncementTicker';
import { t } from './utils/translations';
import { Phone, Mail, MapPin, Shield, Heart } from 'lucide-react';
import logoUrl from './assets/images/academy_official_logo_1791469588319.jpg';

const AppContent: React.FC = () => {
  const { role, currentStudentId, language } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${isUrdu ? 'dir-rtl' : ''}`}>
      {/* 3-Zone Header Contract */}
      <Header
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Urdu Scrolling Ticker Strip for Parents Portal */}
      {role === 'parent' && <ParentAnnouncementTicker />}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {role === 'admin' ? (
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboard onNavigateTab={(tab) => setActiveTab(tab)} />
            )}
            {activeTab === 'attendance' && (
              <AttendanceManager onBack={() => setActiveTab('dashboard')} />
            )}
            {activeTab === 'academic' && (
              <StudentProgressManager onBack={() => setActiveTab('dashboard')} />
            )}
            {activeTab === 'fees' && (
              <FeeManager onBack={() => setActiveTab('dashboard')} />
            )}
            {activeTab === 'notices' && (
              <NoticeManager onBack={() => setActiveTab('dashboard')} />
            )}
            {activeTab === 'paid-notes' && (
              <PaidNotesManager onBack={() => setActiveTab('dashboard')} />
            )}
          </>
        ) : (
          <>
            {activeTab === 'paid-notes' ? (
              <PaidNotesPortal onBack={() => setActiveTab(currentStudentId ? 'portal' : 'dashboard')} />
            ) : currentStudentId ? (
              <ParentPortal onOpenPaidNotes={() => setActiveTab('paid-notes')} />
            ) : (
              <ParentLogin onOpenPaidNotes={() => setActiveTab('paid-notes')} />
            )}
          </>
        )}
      </main>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
      />

      {/* Institutional Footer */}
      <footer className="no-print bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100 text-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-300/40 bg-slate-900 shadow-sm shrink-0">
                <img
                  src={logoUrl}
                  alt="Intelligence Academy Official Emblem"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {isUrdu ? 'انٹیلی جنس اکیڈمی' : 'Intelligence Academy'}
                  </span>
                  <span>·</span>
                  <span className="text-slate-500">
                    {isUrdu ? 'تمام حقوق محفوظ ہیں © 2026' : '© 2026 All Rights Reserved'}
                  </span>
                </div>
                <p className="text-slate-500 mt-1 max-w-xl">
                  {isUrdu
                    ? 'ہولی فیملی روڈ نزد طارق غنی کلینک، بیک سائیڈ گلی نمبر 2، مکان نمبر NW 40، انٹیلی جنس اکیڈمی'
                    : 'Holy Family Road near Tariq Ghani Clinic, Back Side Street 2, House No. NW 40, Intelligence Academy'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-semibold text-slate-700">
                    {isUrdu ? 'ہمارے کیمپسز:' : 'Our Campuses:'}
                  </span>
                  <span className="font-medium text-indigo-700">
                    Rawalpindi (Main Campus) · Islamabad · Sohawa
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-slate-600 shrink-0">
              <a
                href="tel:03185423896"
                className="flex items-center gap-1.5 hover:text-emerald-700 font-mono font-medium transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>03185423896</span>
              </a>
              <a
                href="mailto:touseefali599@gmail.com"
                className="flex items-center gap-1.5 hover:text-indigo-700 font-mono transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-indigo-600" />
                <span>touseefali599@gmail.com</span>
              </a>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
            <span>Intelligence Academy · Student Progress & Parent Portal</span>
            <span>Campuses: Rawalpindi | Islamabad | Sohawa</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
