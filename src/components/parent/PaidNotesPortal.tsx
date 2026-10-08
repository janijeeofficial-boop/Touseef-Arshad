import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import {
  NoteClass,
  NoteSubject,
  PaidSubjectNote,
  NOTE_CLASSES,
  NOTE_SUBJECTS,
  NOTE_CLASSES_URDU,
  NOTE_SUBJECTS_URDU,
  ACADEMY_INFO,
} from '../../types';
import {
  BookOpen,
  MessageCircle,
  Sparkles,
  CheckCircle,
  FileText,
  Eye,
  ShoppingCart,
  Phone,
  ShieldCheck,
  Search,
  Filter,
  Download,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  CreditCard,
  Send,
  Star,
  Zap,
} from 'lucide-react';
import logoUrl from '../../assets/images/academy_official_logo_1791469588319.jpg';

interface PaidNotesPortalProps {
  onBack?: () => void;
  initialClass?: NoteClass;
}

export const PaidNotesPortal: React.FC<PaidNotesPortalProps> = ({ onBack, initialClass }) => {
  const { paidNotes, activeStudent, language } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  // Determine initial active class:
  const getAutoClass = (): NoteClass => {
    if (initialClass) return initialClass;
    if (activeStudent?.classGrade) {
      if (activeStudent.classGrade.includes('9')) return 'Class 9';
      if (activeStudent.classGrade.includes('10')) return 'Class 10';
      if (activeStudent.classGrade.includes('11') || activeStudent.classGrade.toLowerCase().includes('part 1')) return 'Class 11';
      if (activeStudent.classGrade.includes('12') || activeStudent.classGrade.toLowerCase().includes('part 2')) return 'Class 12';
    }
    return 'Class 9';
  };

  const [selectedClass, setSelectedClass] = useState<NoteClass>(getAutoClass);
  const [selectedSubject, setSelectedSubject] = useState<NoteSubject | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [guessPaperOnly, setGuessPaperOnly] = useState(false);

  // Cart / Multi-chapter selection
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [previewNote, setPreviewNote] = useState<PaidSubjectNote | null>(null);
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);

  // Filter notes by class & subject
  const currentClassNotes = paidNotes.filter((note) => note.classGrade === selectedClass);

  const filteredNotes = currentClassNotes.filter((note) => {
    if (selectedSubject !== 'all' && note.subject !== selectedSubject) {
      return false;
    }
    if (guessPaperOnly && !note.isGuessPaper) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        note.title.toLowerCase().includes(q) ||
        (note.urduTitle && note.urduTitle.toLowerCase().includes(q)) ||
        (note.chapterNumber && String(note.chapterNumber).toLowerCase().includes(q)) ||
        note.subject.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Selected notes list for cart
  const cartNotes = paidNotes.filter((n) => selectedNoteIds.includes(n.id));
  const cartTotalPrice = cartNotes.reduce((sum, n) => sum + (n.price || 300), 0);

  const toggleSelectNote = (id: string) => {
    setSelectedNoteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Build WhatsApp order link for a single note
  const getSingleNoteWhatsAppUrl = (note: PaidSubjectNote) => {
    const studentInfo = activeStudent
      ? `طالب علم: ${activeStudent.name} (رول نمبر: ${activeStudent.rollNumber})`
      : 'خریدار: محترم والدین / طالب علم';

    const message = [
      `السلام علیکم! میں Intelligence Academy سے پیڈ نوٹس آرڈر کرنا چاہتا ہوں:`,
      `━━━━━━━━━━━━━━━━━━`,
      studentInfo,
      `کلاس: ${note.classGrade} (${NOTE_CLASSES_URDU[note.classGrade]})`,
      `مضمون: ${note.subject} (${NOTE_SUBJECTS_URDU[note.subject]})`,
      `چیپٹر / گیس پیپر: ${note.chapterNumber || note.title}`,
      `عنوان: ${note.title}`,
      `قیمت: 300 روپے فی چیپٹر`,
      `━━━━━━━━━━━━━━━━━━`,
      `برائے مہربانی مجھے ایزی پیسہ (EasyPaisa) / جاز کیش (JazzCash) / بینک اکاؤنٹ نمبر اور ادائیگی کی تفصیلات فراہم کریں تاکہ میں 300 روپے فیس ادا کر کے PDF نوٹس اسی واٹس ایپ نمبر پر وصول کر سکوں۔ شکریہ!`,
    ].join('\n');

    return `https://wa.me/${ACADEMY_INFO.intlPhone}?text=${encodeURIComponent(message)}`;
  };

  // Build WhatsApp order link for cart / multi-chapter order
  const getCartWhatsAppUrl = () => {
    if (cartNotes.length === 0) return '#';

    const studentInfo = activeStudent
      ? `طالب علم: ${activeStudent.name} (رول نمبر: ${activeStudent.rollNumber})`
      : 'خریدار: محترم والدین / طالب علم';

    const itemsList = cartNotes
      .map(
        (n, idx) =>
          `${idx + 1}. [${n.classGrade} - ${n.subject}] ${n.chapterNumber || n.title} (Rs. ${n.price || 300})`
      )
      .join('\n');

    const message = [
      `السلام علیکم! میں Intelligence Academy کے درج ذیل پیڈ نوٹس آرڈر کرنا چاہتا ہوں:`,
      `━━━━━━━━━━━━━━━━━━`,
      studentInfo,
      `منتخب کردہ نوٹس (${cartNotes.length} چیپٹرز):`,
      itemsList,
      `━━━━━━━━━━━━━━━━━━`,
      `کل قیمت: Rs. ${cartTotalPrice} روپے (فی چیپٹر 300 روپے)`,
      `━━━━━━━━━━━━━━━━━━`,
      `برائے مہربانی مجھے ایزی پیسہ / جاز کیش / بینک اکاؤنٹ کی تفصیلات فراہم کریں تاکہ میں فیس ادا کر کے ان نوٹس کی پی ڈی ایف (PDF) فائلز حاصل کر سکوں۔ شکریہ!`,
    ].join('\n');

    return `https://wa.me/${ACADEMY_INFO.intlPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {onBack && (
                  <button
                    onClick={onBack}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'پورٹل پر واپس جائیں' : 'Back to Portal'}</span>
                  </button>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Official Academy Solved Notes</span>
                </span>
                <span className="text-xs text-amber-300 font-semibold font-mono hidden sm:inline">
                  Fixed: Rs. 300 / Chapter
                </span>
              </div>

              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? 'پیڈ تمام مضامین کے نوٹس (Paid All Subject Notes)' : 'Paid All Subject Notes'}
              </h1>

              <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
                {isUrdu
                  ? 'کلاس 9، کلاس 10، کلاس 11 اور کلاس 12 کے تمام مضامین (فزکس، کیمسٹری، کمپیوٹر، بائیو، انگلش اور اردو) کے مستند حل شدہ نوٹس اور انگلش گیس پیپرز۔ فی چیپٹر صرف 300 روپے، آرڈر براہ راست واٹس ایپ پر کریں۔'
                  : 'Complete solved chapter notes and target board Guess Papers for Class 9, 10, 11, and 12 across Physics, Chemistry, Computer, Biology, English & Urdu. Standard fee: Rs. 300 per chapter with instant WhatsApp ordering.'}
              </p>
            </div>

            {/* Quick WhatsApp order badge card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 sm:max-w-xs shrink-0 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto mb-2 shadow-inner">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">
                {isUrdu ? 'آرڈر واٹس ایپ پر کریں' : 'Instant WhatsApp Order'}
              </div>
              <div className="text-xs text-amber-300 font-mono font-bold mt-0.5">
                {ACADEMY_INFO.phone}
              </div>
              <p className="text-[11px] text-indigo-200 mt-1">
                {isUrdu
                  ? 'ادائیگی کے بعد پی ڈی ایف فوری واٹس ایپ پر بھیج دی جاتی ہے۔'
                  : 'Fast delivery on WhatsApp via EasyPaisa, JazzCash or Bank'}
              </p>
            </div>
          </div>

          {/* Value Props Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-indigo-100">100% Solved Exercises & MCQs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-indigo-100">Past 10 Years Board Numericals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-indigo-100">English Board Guess Papers Included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-indigo-100">Per Chapter Notes: <strong>Rs. 300</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Class Selector Tabs (Class 9, Class 10, Class 11, Class 12) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 space-y-4">
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            {isUrdu ? '1. اپنی کلاس منتخب کریں:' : '1. Select Your Target Class:'}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {NOTE_CLASSES.map((cls) => {
              const count = paidNotes.filter((n) => n.classGrade === cls).length;
              const isSelected = selectedClass === cls;
              return (
                <button
                  key={cls}
                  onClick={() => {
                    setSelectedClass(cls);
                    setSelectedSubject('all');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform -translate-y-0.5'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold">{cls}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count} Notes
                    </span>
                  </div>
                  <div
                    className={`text-xs mt-1 ${isSelected ? 'text-indigo-100 font-urdu' : 'text-slate-500 font-urdu'}`}
                  >
                    {NOTE_CLASSES_URDU[cls]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Filter Bar */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isUrdu ? '2. مضمون منتخب کریں:' : '2. Filter By Subject:'}
            </div>

            {/* Guess Papers dedicated button for English / all */}
            <button
              onClick={() => {
                setGuessPaperOnly(!guessPaperOnly);
                if (!guessPaperOnly) {
                  setSelectedSubject('English'); // Highlight English as requested!
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                guessPaperOnly
                  ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>
                {isUrdu ? 'انگلش گیس پیپرز (English Guess Papers)' : 'English Guess Papers (گیس پیپرز)'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => {
                setSelectedSubject('all');
                setGuessPaperOnly(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedSubject === 'all' && !guessPaperOnly
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isUrdu ? 'تمام مضامین' : 'All Subjects'}
            </button>

            {NOTE_SUBJECTS.map((subj) => {
              const isSelected = selectedSubject === subj;
              const hasGuess = subj === 'English';
              return (
                <button
                  key={subj}
                  onClick={() => {
                    setSelectedSubject(subj);
                    setGuessPaperOnly(false);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{subj}</span>
                  <span className="text-[10px] opacity-75 font-urdu">
                    ({NOTE_SUBJECTS_URDU[subj]})
                  </span>
                  {hasGuess && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar & Multi-Select info */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isUrdu
                  ? 'چیپٹر، عنوان، فزکس، کیمسٹری، گیس پیپرز تلاش کریں...'
                  : 'Search by chapter, topic, formulas, or guess paper...'
              }
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {selectedNoteIds.length > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-700">
                {selectedNoteIds.length} chapters selected (Rs. {cartTotalPrice})
              </span>
              <button
                onClick={() => setIsCheckoutDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>View Selected & Order</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-slate-600">
            Showing <strong className="text-slate-900">{filteredNotes.length}</strong> available notes for{' '}
            <strong className="text-indigo-600">{selectedClass}</strong>
            {selectedSubject !== 'all' && ` · ${selectedSubject}`}
          </span>

          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Per Chapter: Rs. 300 Fixed
          </span>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No notes found for current filter</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Please choose a different subject or reset filters to see all available notes.
            </p>
            <button
              onClick={() => {
                setSelectedSubject('all');
                setGuessPaperOnly(false);
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => {
              const isSelected = selectedNoteIds.includes(note.id);
              const isGuess = note.isGuessPaper;
              const whatsAppUrl = getSingleNoteWhatsAppUrl(note);

              return (
                <div
                  key={note.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-2xs hover:shadow-md ${
                    isGuess
                      ? 'border-amber-300 ring-1 ring-amber-200'
                      : isSelected
                      ? 'border-indigo-500 ring-2 ring-indigo-200'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-[11px] border border-indigo-100">
                          {note.classGrade}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                          {note.subject}
                        </span>
                        {isGuess && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-[11px] flex items-center gap-1 border border-amber-300">
                            <Sparkles className="w-3 h-3 text-amber-600" />
                            <span>Guess Paper 2026</span>
                          </span>
                        )}
                      </div>

                      {/* Checkbox for cart */}
                      <button
                        onClick={() => toggleSelectNote(note.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200'
                        }`}
                        title={isSelected ? 'Remove from selection' : 'Select chapter'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                      <span>{note.chapterNumber || 'Full Syllabus'}</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-mono font-bold text-xs">
                        Rs. {note.price}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {note.title}
                    </h3>

                    {note.urduTitle && (
                      <p className="text-xs font-urdu text-slate-600 mt-1 line-clamp-1 dir-rtl text-right">
                        {note.urduTitle}
                      </p>
                    )}

                    {note.description && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {note.description}
                      </p>
                    )}

                    {/* Features checklist */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Complete Board Solved Numericals & Q/A</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>High-Yield MCQs & Important Board Topics</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span className="truncate">{note.fileName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action footer */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                    <button
                      onClick={() => setPreviewNote(note)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isUrdu ? 'تفصیل' : 'Preview'}</span>
                    </button>

                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>{isUrdu ? 'واٹس ایپ پر آرڈر کریں' : 'Order on WhatsApp (Rs. 300)'}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar if notes selected */}
      {selectedNoteIds.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-4xl mx-auto z-40 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-bounce-once">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center shrink-0">
              {selectedNoteIds.length}
            </div>
            <div>
              <div className="text-sm font-bold">
                {selectedNoteIds.length} Chapter Notes Selected
              </div>
              <div className="text-xs text-indigo-200">
                Total Price: <span className="font-bold text-amber-300 font-mono">Rs. {cartTotalPrice}</span> (Rs. 300 per chapter)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedNoteIds([])}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold"
            >
              Clear
            </button>
            <a
              href={getCartWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isUrdu ? 'تمام نوٹس واٹس ایپ پر آرڈر کریں' : `Order All on WhatsApp (Rs. ${cartTotalPrice})`}</span>
            </a>
          </div>
        </div>
      )}

      {/* Note Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {previewNote.classGrade} · {previewNote.subject}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {previewNote.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setPreviewNote(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {previewNote.urduTitle && (
                <div className="p-3 bg-slate-50 rounded-xl text-right font-urdu text-slate-700 dir-rtl">
                  {previewNote.urduTitle}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Unit / Chapter:</span>
                  <span className="font-bold text-slate-900 text-xs">
                    {previewNote.chapterNumber || 'General Chapter'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">Per Chapter Price:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    Rs. {previewNote.price}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  <span>Document Contents & Syllabus Covered:</span>
                </div>
                <p className="text-indigo-900 leading-relaxed">
                  {previewNote.description ||
                    'Comprehensive Intelligence Academy notes with complete solved questions, conceptual MCQs, definitions, and board patterns.'}
                </p>
                <div className="pt-2 border-t border-indigo-200/50 flex items-center justify-between text-[11px] text-indigo-800">
                  <span>File: <strong>{previewNote.fileName}</strong></span>
                  <span>{previewNote.fileSize || 'PDF Format'}</span>
                </div>
              </div>

              {/* Payment Instructions Box */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-amber-950">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Payment & Delivery Process:</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  1. Click "Order on WhatsApp" below to message the academy administration.<br />
                  2. Send Rs. {previewNote.price} via JazzCash / EasyPaisa / Bank Transfer.<br />
                  3. Receive the complete HD printable PDF immediately on WhatsApp.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={getSingleNoteWhatsAppUrl(previewNote)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp (Rs. {previewNote.price})</span>
                </a>
                <button
                  onClick={() => setPreviewNote(null)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Checkout Drawer / Modal */}
      {isCheckoutDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Selected Chapter Notes</h3>
                  <p className="text-[11px] text-slate-500">{cartNotes.length} items ready to order</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {cartNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-200"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{note.title}</div>
                      <div className="text-[10px] text-slate-500">
                        {note.classGrade} · {note.subject} · {note.chapterNumber || 'General'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-emerald-700 font-mono">Rs. {note.price}</span>
                      <button
                        onClick={() => toggleSelectNote(note.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Total Amount ({cartNotes.length} Chapters):</span>
                <span className="text-base font-mono text-emerald-700">Rs. {cartTotalPrice}</span>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={getCartWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order to WhatsApp ({ACADEMY_INFO.phone})</span>
                </a>
                <button
                  onClick={() => setIsCheckoutDrawerOpen(false)}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
