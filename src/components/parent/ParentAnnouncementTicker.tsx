import React, { useState } from 'react';
import {
  Sparkles,
  Phone,
  MessageSquare,
  X,
  Calendar,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import logoUrl from '../../assets/images/academy_official_logo_1791469588319.jpg';

export const ParentAnnouncementTicker: React.FC = () => {
  const { language } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const announcementText =
    'اکیڈمی میں نومبر سے AI کورس شروع کروایا جا رہا ہے، یاد رہے محدود نشستیں ہیں، آج ہی رجسٹریشن کروائیں! · رابطہ نمبر: 03185423896';

  const whatsappMessage = encodeURIComponent(
    'السلام علیکم! میں انٹیلی جنس اکیڈمی کے نومبر 2026 سے شروع ہونے والے AI کورس (Artificial Intelligence Course) میں اپنے بچے کی رجسٹریشن کروانا چاہتا ہوں۔ برائے مہربانی سیٹ بکنگ اور شیڈول کی تفصیلات فراہم فرمائیں۔'
  );

  return (
    <>
      {/* Ticker strip (چلتی ہوئی پٹی) */}
      <div className="bg-gradient-to-r from-amber-500 via-indigo-900 to-indigo-950 text-white shadow-xs border-b border-indigo-700/50 relative overflow-hidden select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 text-xs">
          {/* Static Alert Badge */}
          <div className="flex items-center gap-2 shrink-0 bg-amber-400 text-slate-950 px-2.5 py-1 rounded-md font-bold text-[11px] uppercase tracking-wider shadow-xs z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <Flame className="w-3.5 h-3.5 text-rose-700 shrink-0" />
            <span className="font-urdu font-bold">اہم اعلان</span>
            <span className="hidden sm:inline text-[10px] bg-slate-900 text-amber-300 px-1 rounded font-mono">
              NEW
            </span>
          </div>

          {/* Scrolling Marquee Container */}
          <div className="flex-1 overflow-hidden relative cursor-pointer" onClick={() => setIsModalOpen(true)}>
            <div className="animate-ticker text-amber-100 font-urdu text-sm sm:text-base font-semibold tracking-wide flex items-center gap-10 whitespace-nowrap py-0.5 hover:text-white transition-colors">
              <span>{announcementText}</span>
              <span className="text-amber-400 font-mono text-xs">★</span>
              <span>{announcementText}</span>
              <span className="text-amber-400 font-mono text-xs">★</span>
              <span>{announcementText}</span>
              <span className="text-amber-400 font-mono text-xs">★</span>
              <span>{announcementText}</span>
            </div>
          </div>

          {/* Right Action Trigger */}
          <div className="flex items-center gap-2 shrink-0 z-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-amber-300 px-2.5 py-1 rounded-md font-urdu text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shadow-2xs"
              title="کورس کی تفصیلات اور سیٹ بکنگ"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>رجسٹریشن تفصیلات</span>
            </button>

            <a
              href={`https://wa.me/923185423896?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[11px] font-bold font-mono transition-colors shadow-2xs"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* AI Course Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-amber-400/50 shadow-md shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={logoUrl}
                    alt="Intelligence Academy Official Logo"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] uppercase font-mono">
                    Admissions Open · November 2026
                  </span>
                  <p className="text-indigo-200 text-xs font-urdu mt-0.5">انٹیلی جنس اکیڈمی - راولپنڈی</p>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-urdu leading-relaxed">
                اکیڈمی میں نومبر سے AI کورس کا باقاعدہ آغاز
              </h3>
              <p className="text-xs text-indigo-200 mt-1 font-urdu leading-normal">
                طلباء کے مستقبل کو جدید ٹیکنالوجی اور آرٹیفیشل انٹیلی جنس سے ہم آہنگ بنانے کے لیے خصوصی تربیتی پروگرام۔
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-xs text-slate-700">
              {/* Urdu Urgency Notice Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-amber-900 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">
                  !
                </div>
                <div>
                  <h4 className="font-bold text-amber-950 font-urdu text-sm">
                    یاد رہے! نشستیں محدود ہیں، پہلے آئیے پہلے پائیے کی بنیاد پر داخلے ہوں گے۔
                  </h4>
                  <p className="text-[11px] text-amber-800 font-urdu mt-0.5 leading-relaxed">
                    نومبر کے نئے بیچ میں طلباء کی معیاری توجہ کے لیے صرف مخصوص سیٹیں مختص کی گئی ہیں۔ تمام والدین سے گزارش ہے کہ آج ہی اپنے بچے کی سیٹ کنفرم کروائیں۔
                  </p>
                </div>
              </div>

              {/* Course Features */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>کورس کی اہم خصوصیات (Course Highlights)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 block font-urdu">پرامپٹ انجینئرنگ اور AI ٹولز</span>
                      <span className="text-[10px] text-slate-500">ChatGPT, Gemini & AI Workflows</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 block font-urdu">پائتھون اور کوڈنگ کی بنیادیں</span>
                      <span className="text-[10px] text-slate-500">Python Programming for Students</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 block font-urdu">تعلیمی و تخلیقی پروجیکٹس</span>
                      <span className="text-[10px] text-slate-500">Hands-on Real World Projects</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 block font-urdu">سرٹیفکیٹ اور اکیڈمی سپورٹ</span>
                      <span className="text-[10px] text-slate-500">Course Completion Certificate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Campus & Schedule */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-800 font-semibold">
                  <span className="flex items-center gap-1.5 font-urdu">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>کلاسز کا باقاعدہ آغاز:</span>
                  </span>
                  <span className="font-mono text-indigo-700 font-bold">1st November 2026</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-urdu">ہمارے کیمپسز:</span>
                  <span className="font-medium text-slate-800">راولپنڈی (Main) · اسلام آباد · سوہاوہ</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-urdu">مقام:</span>
                  <span className="text-slate-700">ہولی فیملی روڈ، سٹریٹ 2، NW 40، راولپنڈی</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-slate-100">
                <a
                  href={`https://wa.me/923185423896?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm font-urdu"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>واٹس ایپ پر سیٹ بک کروائیں</span>
                </a>

                <a
                  href="tel:03185423896"
                  className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors border border-slate-200 flex items-center justify-center gap-1.5 font-mono"
                >
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>03185423896</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
