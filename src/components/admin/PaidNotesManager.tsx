import React, { useState, useRef } from 'react';
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
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  Eye,
  FileCheck,
  Search,
  Filter,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  MessageCircle,
  Download,
  AlertCircle,
  Tag,
  BookOpen,
  DollarSign,
} from 'lucide-react';

interface PaidNotesManagerProps {
  onBack?: () => void;
}

export const PaidNotesManager: React.FC<PaidNotesManagerProps> = ({ onBack }) => {
  const { paidNotes, addPaidNote, deletePaidNote, language } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  // Filters
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyGuessPapersFilter, setOnlyGuessPapersFilter] = useState(false);

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewNote, setPreviewNote] = useState<PaidSubjectNote | null>(null);

  // Form state
  const [formClass, setFormClass] = useState<NoteClass>('Class 9');
  const [formSubject, setFormSubject] = useState<NoteSubject>('Physics');
  const [formIsGuessPaper, setFormIsGuessPaper] = useState(false);
  const [formChapter, setFormChapter] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formUrduTitle, setFormUrduTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(300); // 300 PKR per chapter
  const [formFaculty, setFormFaculty] = useState('Intelligence Academy Faculty');
  
  // File upload state
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFileSize, setSelectedFileSize] = useState('');
  const [selectedFileDataUrl, setSelectedFileDataUrl] = useState<string | undefined>(undefined);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    // calculate size in MB/KB
    const sizeInKb = Math.round(file.size / 1024);
    const sizeStr = sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;
    setSelectedFileSize(sizeStr);

    // If title is empty, prefill friendly title
    if (!formTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setFormTitle(cleanName);
    }

    // Read file as Data URL
    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFileDataUrl(reader.result as string);
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      setIsReadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenUploadModal = (prefillClass?: NoteClass, prefillSubject?: NoteSubject, isGuess = false) => {
    if (prefillClass) setFormClass(prefillClass);
    if (prefillSubject) setFormSubject(prefillSubject);
    setFormIsGuessPaper(isGuess);
    setFormChapter(isGuess ? 'Guess Paper' : 'Chapter 1');
    setFormTitle('');
    setFormUrduTitle('');
    setFormDescription('');
    setFormPrice(300);
    setSelectedFileName('');
    setSelectedFileSize('');
    setSelectedFileDataUrl(undefined);
    setFormError('');
    setIsUploadModalOpen(true);
  };

  const handleSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formTitle.trim()) {
      setFormError(isUrdu ? 'براہ کرم نوٹس کا عنوان درج کریں۔' : 'Please enter note title.');
      return;
    }

    const fileNameToUse = selectedFileName || `${formClass}_${formSubject}_${formChapter || 'Notes'}.pdf`;
    const fileSizeToUse = selectedFileSize || '3.2 MB';

    addPaidNote({
      classGrade: formClass,
      subject: formSubject,
      isGuessPaper: formIsGuessPaper,
      chapterNumber: formChapter.trim() || (formIsGuessPaper ? 'Guess Paper' : 'Full Book'),
      title: formTitle.trim(),
      urduTitle: formUrduTitle.trim() || undefined,
      description: formDescription.trim() || 'Comprehensive Intelligence Academy solved notes, numericals, short/long questions.',
      price: Number(formPrice) || 300,
      fileName: fileNameToUse,
      fileSize: fileSizeToUse,
      fileDataUrl: selectedFileDataUrl,
      authorOrFaculty: formFaculty || 'Intelligence Academy Faculty',
    });

    setUploadSuccessMessage(isUrdu ? 'PDF فائل کامیابی سے اپلوڈ ہو گئی ہے!' : 'PDF Note uploaded successfully!');
    setTimeout(() => setUploadSuccessMessage(''), 3000);
    setIsUploadModalOpen(false);
  };

  // Filtered notes
  const filteredNotes = paidNotes.filter((note) => {
    if (selectedClassFilter !== 'all' && note.classGrade !== selectedClassFilter) {
      return false;
    }
    if (selectedSubjectFilter !== 'all' && note.subject !== selectedSubjectFilter) {
      return false;
    }
    if (onlyGuessPapersFilter && !note.isGuessPaper) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        note.title.toLowerCase().includes(q) ||
        (note.urduTitle && note.urduTitle.toLowerCase().includes(q)) ||
        (note.chapterNumber && String(note.chapterNumber).toLowerCase().includes(q)) ||
        note.subject.toLowerCase().includes(q) ||
        note.classGrade.toLowerCase().includes(q) ||
        note.fileName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Calculate statistics
  const totalNotesCount = paidNotes.length;
  const guessPapersCount = paidNotes.filter((n) => n.isGuessPaper).length;
  const standardPrice = 300;

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {onBack && (
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-semibold text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'ڈیش بورڈ' : 'Dashboard'}</span>
                </button>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Tag className="w-3 h-3" />
                <span>Admin Master Portion</span>
              </span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight text-white ${isUrdu ? 'font-urdu' : ''}`}>
              {isUrdu ? 'پیڈ تمام مضامین کے نوٹس (Paid All Subject Notes)' : 'Paid All Subject Notes'}
            </h1>
            <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
              {isUrdu
                ? 'ایڈمن یہاں لامحدود پی ڈی ایف (PDF) نوٹس اور گیس پیپرز اپلوڈ کر سکتے ہیں۔ کلاس 9، 10، 11، اور 12 کے تمام مضامین کے نوٹس فی چیپٹر 300 روپے میں والدین پورٹل پر دستیاب ہیں۔'
                : 'Admin repository for unlimited PDF chapter notes and Guess Papers for Class 9, 10, 11, and 12. Standard price: Rs. 300 per chapter with instant WhatsApp ordering.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleOpenUploadModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
            >
              <Upload className="w-4 h-4 text-slate-950" />
              <span>{isUrdu ? 'نیا PDF نوٹ اپلوڈ کریں' : 'Upload New PDF Note'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-indigo-200">Total Notes Available</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{totalNotesCount}</div>
            <span className="text-[10px] text-indigo-300">Unlimited PDF storage</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-indigo-200">Standard Price</span>
            <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">Rs. {standardPrice}</div>
            <span className="text-[10px] text-amber-200">Per chapter notes</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-indigo-200">English Guess Papers</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{guessPapersCount}</div>
            <span className="text-[10px] text-emerald-200">Special board prediction</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-indigo-200">Order Channel</span>
            <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>WhatsApp Direct</span>
            </div>
            <span className="text-[10px] text-indigo-300">{ACADEMY_INFO.phone}</span>
          </div>
        </div>
      </div>

      {uploadSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 shadow-xs animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">{uploadSuccessMessage}</span>
        </div>
      )}

      {/* Class Quick Switcher Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Class:</span>
            <button
              onClick={() => setSelectedClassFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedClassFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isUrdu ? 'تمام کلاسز' : 'All Classes'}
            </button>
            {NOTE_CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClassFilter(cls)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  selectedClassFilter === cls
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cls} {isUrdu && `(${NOTE_CLASSES_URDU[cls]})`}
              </button>
            ))}
          </div>

          {/* Quick upload for active filter */}
          <button
            onClick={() =>
              handleOpenUploadModal(
                selectedClassFilter !== 'all' ? (selectedClassFilter as NoteClass) : 'Class 9',
                selectedSubjectFilter !== 'all' ? (selectedSubjectFilter as NoteSubject) : 'Physics'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors border border-indigo-200 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>
              {isUrdu
                ? `نوٹ شامل کریں (${selectedClassFilter !== 'all' ? selectedClassFilter : 'Class 9'})`
                : `+ Upload for ${selectedClassFilter !== 'all' ? selectedClassFilter : 'Class 9'}`}
            </span>
          </button>
        </div>

        {/* Subject Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 pb-1">
          <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Subject:</span>
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
              selectedSubjectFilter === 'all'
                ? 'bg-slate-800 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Subjects
          </button>
          {NOTE_SUBJECTS.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubjectFilter(subj)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0 ${
                selectedSubjectFilter === subj
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {subj} {isUrdu && `(${NOTE_SUBJECTS_URDU[subj]})`}
            </button>
          ))}

          {/* Guess Paper Quick Filter */}
          <button
            onClick={() => setOnlyGuessPapersFilter(!onlyGuessPapersFilter)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 ml-auto ${
              onlyGuessPapersFilter
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Guess Papers Only</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isUrdu
                ? 'عنوان، چیپٹر، مضمون یا کلاس کے نام سے تلاش کریں...'
                : 'Search notes by chapter, title, subject or keywords...'
            }
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Notes Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-800">{filteredNotes.length}</strong> notes in repository
          </span>
          <span className="text-[11px] text-slate-400">
            Per Chapter Fixed Price: <strong className="text-emerald-700">Rs. 300</strong>
          </span>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700">No notes found for current selection</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click the upload button above to add PDF files for this class and subject.
            </p>
            <button
              onClick={() => handleOpenUploadModal()}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF Now</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Header ribbon */}
                <div className="p-4 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-100">
                        {note.classGrade}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {note.subject}
                      </span>
                      {note.isGuessPaper && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1 border border-amber-200">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          <span>Guess Paper</span>
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Rs. {note.price}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-500 mb-1">
                    {note.chapterNumber || 'General Chapter'}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  {note.urduTitle && (
                    <p className="text-xs font-urdu text-slate-600 mt-1 line-clamp-1 dir-rtl text-right">
                      {note.urduTitle}
                    </p>
                  )}

                  {note.description && (
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                      {note.description}
                    </p>
                  )}
                </div>

                {/* Footer details & Actions */}
                <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 mt-auto">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
                    <div className="flex items-center gap-1 truncate max-w-[180px]">
                      <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate font-mono">{note.fileName}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400 shrink-0">
                      {note.fileSize || 'PDF'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPreviewNote(note)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
                        title="Preview PDF Details"
                      >
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span>Preview</span>
                      </button>

                      {/* WhatsApp test link */}
                      <a
                        href={`https://wa.me/${ACADEMY_INFO.intlPhone}?text=${encodeURIComponent(
                          `السلام علیکم! میں Intelligence Academy سے ${note.classGrade} کا سبجیکٹ ${note.subject} (${note.chapterNumber || note.title}) کے پیڈ نوٹس (قیمت: 300 روپے) خریدنا چاہتا ہوں۔ برائے مہربانی ایزی پیسہ / جاز کیش اکاؤنٹ تفصیل بھیجیں۔`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium transition-colors"
                        title="Test WhatsApp Order Link"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp Link</span>
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete note "${note.title}"?`)) {
                          deletePaidNote(note.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload New Note Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isUrdu ? 'نیا PDF نوٹ اپلوڈ کریں' : 'Upload New Subject PDF Note'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isUrdu ? 'کلاس، مضمون اور چیپٹر منتخب کر کے فائل شامل کریں' : 'Select Class, Subject, Chapter and attach PDF file'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitUpload} className="space-y-4 text-xs">
              {/* Class and Subject Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Class <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value as NoteClass)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {NOTE_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls} ({NOTE_CLASSES_URDU[cls]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value as NoteSubject)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {NOTE_SUBJECTS.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj} ({NOTE_SUBJECTS_URDU[subj]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guess Paper Toggle & Chapter Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Chapter / Unit Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formChapter}
                    onChange={(e) => setFormChapter(e.target.value)}
                    placeholder="e.g. Chapter 1, Chapter 2, Full Book..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Per Chapter Price (PKR) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-400 font-semibold">Rs.</span>
                    <input
                      type="number"
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Standard requirement: Rs. 300 per chapter</span>
                </div>
              </div>

              {/* Special Guess Papers Checkbox */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-bold text-amber-950 block">Mark as Guess Paper (گیس پیپر)</span>
                    <span className="text-[11px] text-amber-800">
                      Highlighted for English & board target exams
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formIsGuessPaper}
                  onChange={(e) => {
                    setFormIsGuessPaper(e.target.checked);
                    if (e.target.checked && !formChapter) {
                      setFormChapter('Guess Paper');
                    }
                  }}
                  className="w-4 h-4 text-amber-600 rounded-sm focus:ring-amber-500"
                />
              </div>

              {/* Note Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Note Title (English) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Physical Quantities and Measurement (Complete Solved)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Urdu Title */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Note Title (Urdu - اختیاری)
                </label>
                <input
                  type="text"
                  value={formUrduTitle}
                  onChange={(e) => setFormUrduTitle(e.target.value)}
                  placeholder="مثال: طبی مقداریں اور پیمائش - مکمل حل شدہ نوٹس"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-urdu text-right"
                  dir="rtl"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Brief Overview / Topics Included
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Includes MCQs, short answers, long derivations, and board solved numericals..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Faculty Author */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Faculty / Compiler
                </label>
                <input
                  type="text"
                  value={formFaculty}
                  onChange={(e) => setFormFaculty(e.target.value)}
                  placeholder="Prof. Touseef Ali (Intelligence Academy)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* File Attachment Area */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload PDF Document (لامحدود PDF فائلز سپورٹ)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/30 rounded-xl p-4 text-center cursor-pointer transition-colors"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,application/pdf"
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 mb-2">
                    <FileText className="w-5 h-5" />
                  </div>
                  {selectedFileName ? (
                    <div className="space-y-0.5">
                      <span className="font-semibold text-indigo-900 block truncate max-w-xs mx-auto">
                        {selectedFileName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        File attached ({selectedFileSize}) {isReadingFile ? '· Processing...' : '· Ready to upload'}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-semibold text-indigo-900 block">Click to select PDF from your device</span>
                      <span className="text-[11px] text-slate-500">Supports all standard PDF documents & chapter notes</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReadingFile}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'فائل اپلوڈ کریں' : 'Save & Publish Note'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Note Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    {previewNote.classGrade} · {previewNote.subject}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{previewNote.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setPreviewNote(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {previewNote.urduTitle && (
                <div className="p-3 bg-slate-50 rounded-lg text-right font-urdu text-slate-700" dir="rtl">
                  {previewNote.urduTitle}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Chapter / Unit:</span>
                  <span className="font-semibold text-slate-900">{previewNote.chapterNumber || 'General'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Price per chapter:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">Rs. {previewNote.price}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="text-[10px] text-slate-400 block mb-0.5">File Details:</span>
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-800">
                  <span className="truncate max-w-[260px]">{previewNote.fileName}</span>
                  <span className="text-slate-500">{previewNote.fileSize || 'PDF Document'}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Author: {previewNote.authorOrFaculty || 'Intelligence Academy Senior Faculty'}
                </span>
              </div>

              {previewNote.description && (
                <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Syllabus Coverage:</span>
                  <p>{previewNote.description}</p>
                </div>
              )}

              {/* Sample simulated content box */}
              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Intelligence Academy Verified Content</span>
                </div>
                <p className="text-[11px] text-indigo-800">
                  Includes past 10 years solved board MCQs, short answers with diagrams, long derivations, and numerical practice questions.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <a
                  href={`https://wa.me/${ACADEMY_INFO.intlPhone}?text=${encodeURIComponent(
                    `السلام علیکم! مجھے Intelligence Academy کے پیڈ نوٹس خریدنے ہیں:\nکلاس: ${previewNote.classGrade}\nمضمون: ${previewNote.subject}\nچیپٹر: ${previewNote.chapterNumber || previewNote.title}\nقیمت: 300 روپے فی چیپٹر\nبرائے مہربانی مجھے ایزی پیسہ / جاز کیش اکاؤنٹ تفصیلات بھیجیں۔`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp (Rs. {previewNote.price})</span>
                </a>

                <button
                  onClick={() => setPreviewNote(null)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
