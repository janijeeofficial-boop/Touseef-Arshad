import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { Student, ExamRecord, FeeRecord } from '../../types';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  CreditCard,
  Printer,
  MessageSquare,
  FileText,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Phone,
  BookOpen,
  ChevronRight,
  Send,
  Sparkles,
} from 'lucide-react';
import { PrintableReportCard } from '../common/PrintableReportCard';
import { PrintableFeeReceipt } from '../common/PrintableFeeReceipt';
import { LeaveRequestModal } from './LeaveRequestModal';
import { PaidNotesPortal } from './PaidNotesPortal';
import logoUrl from '../../assets/images/academy_official_logo_1791469588319.jpg';

interface ParentPortalProps {
  onOpenPaidNotes?: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ onOpenPaidNotes }) => {
  const {
    students,
    currentStudentId,
    setCurrentStudentId,
    attendance,
    exams,
    fees,
    notifications,
    announcements,
    language,
    logout,
  } = useApp();

  const tr = t(language);
  const isUrdu = language === 'ur';

  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'academic' | 'fees' | 'paid-notes'>('overview');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [printingExam, setPrintingExam] = useState<ExamRecord | null>(null);
  const [printingFee, setPrintingFee] = useState<FeeRecord | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [mockPaymentSuccess, setMockPaymentSuccess] = useState(false);

  // Active student
  const student = students.find((s) => s.id === currentStudentId) || students[0];

  if (!student) {
    return (
      <div className="py-20 text-center text-slate-500">
        No student record selected.
      </div>
    );
  }

  // Attendance stats for student
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);
  const todayRecord = studentAttendance.find((a) => a.date === '2026-10-07');
  const presentDays = studentAttendance.filter((a) => a.status === 'Present').length;
  const absentDays = studentAttendance.filter((a) => a.status === 'Absent').length;
  const lateDays = studentAttendance.filter((a) => a.status === 'Late').length;
  const totalMarkedDays = studentAttendance.length;
  const attendanceRate = totalMarkedDays > 0 ? Math.round((presentDays / totalMarkedDays) * 100) : 100;

  // Exams for student
  const studentExams = exams.filter((e) => e.studentId === student.id);
  const latestExam = studentExams[0];

  // Fees for student
  const studentFees = fees.filter((f) => f.studentId === student.id);
  const currentMonthFee = studentFees.find((f) => f.month === 'October 2026') || studentFees[0];

  // Notifications for student
  const studentNotifs = notifications.filter((n) => !n.studentId || n.studentId === student.id);

  const handleMockPay = () => {
    setMockPaymentSuccess(true);
    setTimeout(() => {
      setMockPaymentSuccess(false);
      setIsPayModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Child Identity Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-400/50 overflow-hidden shrink-0 shadow-md">
              <img
                src={logoUrl}
                alt="Intelligence Academy Official Crest"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                  {tr.parentPortal} · والدین پورٹل
                </span>
              </div>
              <h1 className={`text-2xl font-bold tracking-tight flex items-baseline gap-2 ${isUrdu ? 'font-urdu' : ''}`}>
                <span>{student.name}</span>
                {student.urduName && (
                  <span className="text-lg font-urdu text-indigo-200">({student.urduName})</span>
                )}
              </h1>
              <p className="text-xs text-indigo-200 mt-1">
                Father: <span className="font-semibold text-white">{student.fatherName}</span> · Roll No:{' '}
                <span className="font-mono font-bold text-amber-300">{student.rollNumber}</span> ·{' '}
                <span>{student.classGrade} (Sec {student.section})</span>
              </p>
            </div>
          </div>

          {/* Child Switcher & Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20 whitespace-nowrap shadow-2xs"
              title={isUrdu ? 'لاگ ان پیج پر واپس جائیں' : 'Back to Login Page'}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'لاگ ان پر واپس جائیں' : 'Back to Login'}</span>
            </button>

            <div className="bg-white/10 p-1.5 rounded-xl border border-white/15 flex items-center gap-2">
              <span className="text-[11px] text-indigo-200 pl-2">Switch Student:</span>
              <select
                value={student.id}
                onChange={(e) => setCurrentStudentId(e.target.value)}
                className="bg-slate-800 text-white text-xs font-medium rounded-lg px-2.5 py-1 focus:outline-hidden border border-white/20"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>{tr.submitLeave}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/10 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-indigo-950 shadow-sm font-bold'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            {isUrdu ? 'مجموعی جائزہ' : 'Overview Summary'}
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'attendance'
                ? 'bg-white text-indigo-950 shadow-sm font-bold'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            {tr.dailyAttendance || 'Daily Attendance'}
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'academic'
                ? 'bg-white text-indigo-950 shadow-sm font-bold'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            {tr.academicProgress}
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'fees'
                ? 'bg-white text-indigo-950 shadow-sm font-bold'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            {tr.feeStatus}
          </button>
          <button
            onClick={() => setActiveTab('paid-notes')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'paid-notes'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                : 'text-amber-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isUrdu ? 'پیڈ تمام مضامین کے نوٹس' : 'Paid All Subject Notes'}</span>
            <span className="text-[10px] bg-amber-500/30 text-amber-950 px-1.5 py-0.5 rounded-md font-mono font-bold">
              Rs. 300
            </span>
          </button>
        </div>
      </div>

      {/* When activeTab is paid-notes */}
      {activeTab === 'paid-notes' && (
        <PaidNotesPortal onBack={() => setActiveTab('overview')} />
      )}

      {/* Sub-tab Back Navigation for other tabs */}
      {activeTab !== 'overview' && activeTab !== 'paid-notes' && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTab('overview')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-xs font-semibold transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isUrdu ? '← بنیادی جائزہ پر واپس جائیں' : '← Back to Overview Summary'}</span>
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Intelligence Academy · Parent Portal
          </span>
        </div>
      )}

      {/* Only show student details and overview cards if NOT in paid-notes */}
      {activeTab !== 'paid-notes' && (
        <>
      {/* TODAY'S ATTENDANCE ALERT HERO CARD */}
      <div className={`rounded-xl border p-5 shadow-xs transition-colors ${
        todayRecord?.status === 'Present'
          ? 'bg-emerald-50/70 border-emerald-200'
          : todayRecord?.status === 'Absent'
          ? 'bg-rose-50 border-rose-200'
          : todayRecord?.status === 'Late'
          ? 'bg-amber-50 border-amber-200'
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              todayRecord?.status === 'Present'
                ? 'bg-emerald-600 text-white'
                : todayRecord?.status === 'Absent'
                ? 'bg-rose-600 text-white'
                : todayRecord?.status === 'Late'
                ? 'bg-amber-600 text-white'
                : 'bg-blue-600 text-white'
            }`}>
              {todayRecord?.status === 'Present' && <CheckCircle className="w-6 h-6" />}
              {todayRecord?.status === 'Absent' && <XCircle className="w-6 h-6" />}
              {todayRecord?.status === 'Late' && <Clock className="w-6 h-6" />}
              {todayRecord?.status === 'Leave' && <Calendar className="w-6 h-6" />}
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Today's Daily Attendance Status (07 Oct 2026)
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {todayRecord?.status === 'Present' && (
                  <span>Student is Safely Present at Academy ({todayRecord.timeIn || '08:12 AM'})</span>
                )}
                {todayRecord?.status === 'Absent' && (
                  <span className="text-rose-700">Attendance Alert: Student is Marked ABSENT Today!</span>
                )}
                {todayRecord?.status === 'Late' && (
                  <span className="text-amber-800">Student Arrived Late at {todayRecord.timeIn || '08:42 AM'}</span>
                )}
                {todayRecord?.status === 'Leave' && (
                  <span className="text-blue-800">Approved Leave Record</span>
                )}
              </h3>
              <p className={`text-xs mt-1 text-slate-600 ${isUrdu ? 'font-urdu' : ''}`}>
                {todayRecord?.status === 'Present' && (
                  isUrdu
                    ? 'آپ کا بچہ آج اکیڈمی باقاعدگی سے حاضر ہے۔ کلاس ورک جاری ہے۔'
                    : 'Muhammad Hamza arrived on time and is actively participating in today’s sessions.'
                )}
                {todayRecord?.status === 'Absent' && (
                  isUrdu
                    ? 'محترم والدین، آپ کا بچہ آج اکیڈمی سے غیر حاضر ہے۔ برائے مہربانی فوری رابطہ فرمائیں یا رخصت کی درخواست جمع کرائیں۔'
                    : 'The student was absent during morning attendance roll call. Please contact the coordinator if uninformed.'
                )}
                {todayRecord?.status === 'Late' && (
                  isUrdu
                    ? 'آپ کا بچہ آج تاخیر سے پہنچا ہے۔ برائے مہربانی بروقت روانگی یقینی بنائیں۔'
                    : 'Late arrival recorded. Punctuality is strictly monitored for Board preparation.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/923185423896?text=Assalam-o-Alaikum%20Intelligence%20Academy%2C%20regarding%20my%20child's%20attendance."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Admin (03185423896)</span>
            </a>
          </div>
        </div>
      </div>

      {/* PAID ALL SUBJECT NOTES HERO CARD (HIGH CONVERSION BANNER) */}
      {activeTab === 'overview' && (
        <div className="bg-gradient-to-r from-amber-50 via-indigo-50 to-amber-50 rounded-2xl border-2 border-amber-300/80 p-5 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-300 text-amber-950 px-2 py-0.5 rounded-md">
                    Official Academy Notes
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Per Chapter: Rs. 300 Fixed
                  </span>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>English Guess Papers 2026</span>
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {isUrdu
                    ? 'پیڈ تمام مضامین کے نوٹس (Paid All Subject Notes) - کلاس 9، 10، 11، 12'
                    : 'Paid All Subject Notes (Class 9, 10, 11, 12) + English Guess Papers'}
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
                  {isUrdu
                    ? 'فزکس، کیمسٹری، کمپیوٹر، بائیولوجی، انگلش اور اردو کے مکمل حل شدہ نوٹس فی چیپٹر 300 روپے میں دستیاب ہیں۔ آرڈر براہ راست واٹس ایپ پر کریں۔'
                    : 'Complete solved chapters & board target guess papers for Class 9th, 10th, 11th & 12th. Solved MCQs, numericals, short/long questions. Order directly on WhatsApp.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('paid-notes')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>{isUrdu ? 'نوٹس دیکھیں و آرڈر کریں' : 'Browse Notes & Order (Rs. 300)'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW / SUMMARY TAB */}
      {(activeTab === 'overview' || activeTab === 'attendance') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Attendance Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>{tr.attendanceSummary}</span>
                </h3>
                <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {attendanceRate}% Present
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4">
                Total marked days this month: {totalMarkedDays} days
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Present Days
                  </span>
                  <span className="font-bold font-mono text-slate-900">{presentDays} days</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Absences
                  </span>
                  <span className="font-bold font-mono text-rose-700">{absentDays} days</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Late Arrivals
                  </span>
                  <span className="font-bold font-mono text-amber-700">{lateDays} times</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Board minimum: 75% required</span>
              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                + Request Leave
              </button>
            </div>
          </div>

          {/* Card 2: Academic Exam Scorecard */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{latestExam ? latestExam.examTitle : 'Latest Academic Performance'}</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Evaluation Date: {latestExam?.date || '2026-09-28'}
                </span>
              </div>

              {latestExam && (
                <button
                  onClick={() => setPrintingExam(latestExam)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
                >
                  <Printer className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{tr.viewReportCard}</span>
                </button>
              )}
            </div>

            {latestExam ? (
              <div className="space-y-4">
                {/* Score Banner */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block">Overall Score</span>
                    <div className="text-2xl font-bold font-mono text-indigo-700">
                      {latestExam.overallPercentage}%
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {latestExam.totalObtained} / {latestExam.totalPossible} Marks
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-xs text-slate-500 block">Grade</span>
                    <span className="text-2xl font-bold font-mono text-emerald-700">
                      {latestExam.overallPercentage >= 80 ? 'A+' : 'A'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Position / Rank</span>
                    <span className="text-xl font-bold font-mono text-amber-700">
                      #{latestExam.classRank || 2} in Class
                    </span>
                  </div>
                </div>

                {/* Subject Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {latestExam.subjectScores.map((sub, i) => {
                    const perc = Math.round((sub.obtainedMarks / sub.totalMarks) * 100);
                    return (
                      <div key={i} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-800">{sub.subject}</span>
                          <span className="font-mono font-bold text-slate-900">
                            {sub.obtainedMarks}/{sub.totalMarks} ({perc}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              perc >= 80 ? 'bg-emerald-600' : perc >= 70 ? 'bg-indigo-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${perc}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Teacher Remarks */}
                <div className="bg-amber-50/40 p-3 rounded-lg border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block mb-0.5">Faculty Remarks:</span>
                  <p className="italic text-slate-700">"{latestExam.teacherRemarks}"</p>
                  {latestExam.urduTeacherRemarks && (
                    <p className="text-slate-700 font-urdu mt-1">"{latestExam.urduTeacherRemarks}"</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No exam record found for this student.
              </div>
            )}
          </div>
        </div>
      )}

      {/* FEES TAB & SLIP SECTION */}
      {(activeTab === 'overview' || activeTab === 'fees') && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Monthly Academy Fee Status ({currentMonthFee.month})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Official billing statement and digital payment challan
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintingFee(currentMonthFee)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-600" />
                <span>{tr.printReceipt}</span>
              </button>

              {currentMonthFee.status !== 'Paid' && (
                <button
                  onClick={() => setIsPayModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay Now (JazzCash / EasyPaisa / Bank)</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Receipt Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {currentMonthFee.receiptNumber}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">Due Date: {currentMonthFee.dueDate}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Total Fee Amount</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                PKR {currentMonthFee.totalPayable.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                Tuition ({currentMonthFee.tuitionFee}) + Lab ({currentMonthFee.labFee})
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Paid Status</span>
              <span className={`inline-flex items-center gap-1 font-bold text-sm ${
                currentMonthFee.status === 'Paid'
                  ? 'text-emerald-700'
                  : currentMonthFee.status === 'Partial'
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}>
                {currentMonthFee.status === 'Paid' && <CheckCircle className="w-4 h-4" />}
                {currentMonthFee.status}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                Paid: PKR {currentMonthFee.paidAmount.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-1">Payment Method</span>
              <span className="font-medium text-slate-900 block">
                {currentMonthFee.paymentMethod || 'Awaiting Payment'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {currentMonthFee.paidDate ? `Settled on ${currentMonthFee.paidDate}` : 'Please clear before due date'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DAILY ATTENDANCE & ACADEMY NOTIFICATIONS LOG */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          <span>Alerts & Notifications Dispatched for {student.name}</span>
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {studentNotifs.length === 0 ? (
            <div className="py-6 text-center text-slate-400">
              No recent notifications dispatched.
            </div>
          ) : (
            studentNotifs.slice(0, 4).map((notif) => (
              <div key={notif.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {isUrdu ? notif.urduTitle : notif.title}
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                      Via {notif.channel}
                    </span>
                  </div>
                  <p className={`text-slate-600 mt-1 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? notif.urduMessage : notif.message}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                  {notif.timestamp}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* OUR CAMPUSES & OFFICIAL CONTACT CARD */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Intelligence Academy Campuses & Official Helpline</span>
            </h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              Serving students across Rawalpindi, Islamabad, and Sohawa
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:03185423896"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-semibold transition-colors shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>03185423896</span>
            </a>
            <a
              href="mailto:touseefali599@gmail.com"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono transition-colors border border-white/15"
            >
              <span>touseefali599@gmail.com</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-300">Rawalpindi Campus (Main)</span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded font-mono">
                Head Office
              </span>
            </div>
            <p className="text-indigo-100 text-[11px] leading-relaxed">
              Holy Family Road near Tariq Ghani Clinic, Back Side Street 2, House No. NW 40, Intelligence Academy
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">Islamabad Campus</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded font-mono">
                Branch
              </span>
            </div>
            <p className="text-indigo-100 text-[11px] leading-relaxed">
              Serving Federal Board & Entry Test students across Islamabad
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">Sohawa Campus</span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded font-mono">
                Branch
              </span>
            </div>
            <p className="text-indigo-100 text-[11px] leading-relaxed">
              Academic coaching & Board exam preparation center Sohawa
            </p>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Leave Modal */}
      <LeaveRequestModal
        student={student}
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
      />

      {/* Printable Report Card */}
      {printingExam && (
        <PrintableReportCard
          student={student}
          exam={printingExam}
          language={language}
          onClose={() => setPrintingExam(null)}
        />
      )}

      {/* Printable Fee Receipt */}
      {printingFee && (
        <PrintableFeeReceipt
          student={student}
          fee={printingFee}
          language={language}
          onClose={() => setPrintingFee(null)}
        />
      )}

      {/* Online Pay Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Pay Tuition Fee Online (PKR {currentMonthFee.totalPayable - currentMonthFee.paidAmount})
              </h3>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {mockPaymentSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">Payment Processed Successfully!</h4>
                  <p className="text-xs text-slate-500">Official voucher receipt updated with PAID stamp.</p>
                </div>
              ) : (
                <>
                  <p className="text-slate-600">
                    Select your preferred Pakistani mobile wallet or banking portal:
                  </p>

                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input type="radio" name="payType" defaultChecked className="text-indigo-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">JazzCash / EasyPaisa</span>
                        <span className="text-[11px] text-slate-500">Send to Academy Merchant Account: 03185423896 (Title: Intelligence Academy)</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input type="radio" name="payType" className="text-indigo-600" />
                      <div>
                        <span className="font-bold text-slate-900 block">Meezan Bank Raast / IBFT</span>
                        <span className="text-[11px] text-slate-500">Account: 0102-1234567890 (Intelligence Academy)</span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setIsPayModalOpen(false)}
                      className="px-4 py-2 text-slate-600 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleMockPay}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shadow-2xs"
                    >
                      Confirm Payment (PKR {currentMonthFee.totalPayable - currentMonthFee.paidAmount})
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
