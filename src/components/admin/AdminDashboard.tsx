import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import {
  Users,
  CalendarCheck,
  CreditCard,
  Award,
  TrendingUp,
  AlertTriangle,
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  BookOpen,
  UserPlus,
  Lock,
  Upload,
  Sparkles,
  Tag,
} from 'lucide-react';
import { AddStudentModal } from './AddStudentModal';
import logoUrl from '../../assets/images/academy_official_logo_1791469588319.jpg';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { students, attendance, exams, fees, announcements, paidNotes, dispatchAttendanceNotifications, language, logoutAdmin } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  const todayDate = '2026-10-07';
  const todayRecords = attendance.filter((a) => a.date === todayDate);
  const presentToday = todayRecords.filter((a) => a.status === 'Present').length;
  const absentToday = todayRecords.filter((a) => a.status === 'Absent').length;
  const lateToday = todayRecords.filter((a) => a.status === 'Late').length;
  const totalMarked = todayRecords.length;
  const attendanceRate = totalMarked > 0 ? Math.round((presentToday / totalMarked) * 100) : 0;

  // Fee calculation for October
  const octFees = fees.filter((f) => f.month === 'October 2026');
  const totalOctBilled = octFees.reduce((sum, f) => sum + f.totalPayable, 0);
  const totalOctCollected = octFees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalOctPending = totalOctBilled - totalOctCollected;

  // Top performers
  const topExams = [...exams].sort((a, b) => b.overallPercentage - a.overallPercentage).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Admin Controls & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={logoutAdmin}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-600 text-xs font-semibold transition-colors shadow-2xs"
          title={isUrdu ? 'ایڈمن لاگ آؤٹ اور واپس والدین پورٹل پر جائیں' : 'Exit Admin and switch back to Parent Portal'}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isUrdu ? '← ایڈمن بند کریں (واپس والدین پورٹل)' : '← Exit to Parent Portal'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isUrdu ? 'نیا طالب علم داخل کریں' : '+ Enroll New Student'}</span>
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-400/50 shadow-md shrink-0 overflow-hidden hidden sm:flex items-center justify-center">
              <img
                src={logoUrl}
                alt="Intelligence Academy Official Crest"
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block mb-1">
                {tr.academyTagline}
              </span>
              <h1 className={`text-2xl font-bold tracking-tight ${isUrdu ? 'font-urdu' : ''}`}>
                {isUrdu ? 'انٹیلی جنس اکیڈمی ایڈمن کنٹرول پینل' : 'Intelligence Academy Management Overview'}
              </h1>
              <p className="text-xs text-indigo-200 mt-1 max-w-xl">
                {isUrdu
                  ? 'طلباء کے تعلیمی ریکارڈ، روزانہ حاضری، فیس ریکوری اور والدین کو الرٹس جاری کرنے کا خودکار نظام۔'
                  : 'Central operations console for daily student tracking, academic testing, fee reconciliation, and parent notifications.'}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-white/10 text-[11px] text-indigo-200 font-mono">
                <span className="text-amber-300 font-sans font-semibold">Campuses: Rawalpindi · Islamabad · Sohawa</span>
                <span>·</span>
                <span>Helpline: 03185423896</span>
                <span>·</span>
                <span>touseefali599@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isUrdu ? 'طالب علم داخل کریں' : 'Enroll Student'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>{tr.markAttendance}</span>
            </button>
            <button
              onClick={() => onNavigateTab('fees')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors border border-white/20"
            >
              <CreditCard className="w-4 h-4" />
              <span>{tr.feeManagement}</span>
            </button>
            <button
              onClick={() => onNavigateTab('paid-notes')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isUrdu ? 'پیڈ تمام مضامین کے نوٹس' : 'Paid All Subject Notes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Students
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {students.length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Active Enrolled</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Class 9 to F.Sc & ICS batches</p>
        </div>

        {/* Card 2: Today's Attendance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today's Attendance
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {attendanceRate}%
            </span>
            <span className="text-xs text-emerald-600 font-medium font-mono">
              {presentToday}/{totalMarked} Present
            </span>
          </div>
          <p className="text-[11px] text-rose-500 mt-1 font-medium">
            {absentToday} Absent · {lateToday} Late today
          </p>
        </div>

        {/* Card 3: Fees Collected */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              October Fees
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              PKR {(totalOctCollected / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / {(totalOctBilled / 1000).toFixed(1)}k
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            Pending: PKR {totalOctPending.toLocaleString()}
          </p>
        </div>

        {/* Card 4: Academic Assessments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Exams Evaluated
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
              {exams.length}
            </span>
            <span className="text-xs text-indigo-600 font-medium">Reports Online</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Average batch score: 85.3%</p>
        </div>
      </div>

      {/* Dedicated Section: Paid All Subject Notes (Class 9-12) */}
      <div className="bg-gradient-to-r from-amber-50 via-indigo-50 to-amber-50 rounded-2xl border-2 border-amber-300/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-sm shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded-md">
                  Admin Master Module
                </span>
                <span className="text-xs font-bold text-slate-600 font-mono">
                  {paidNotes.length} PDF Notes Active
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Rs. 300 / Chapter
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {isUrdu ? 'پیڈ تمام مضامین کے نوٹس (Paid All Subject Notes)' : 'Paid All Subject Notes (Class 9, 10, 11, 12)'}
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl mt-0.5">
                {isUrdu
                  ? 'لامحدود پی ڈی ایف فائلز اپلوڈ کریں۔ تمام کلاسز کے مضامین اور انگلش گیس پیپرز فی چیپٹر 300 روپے میں لائیو ہیں، اور آرڈرز براہ راست واٹس ایپ پر موصول ہوتے ہیں۔'
                  : 'Manage unlimited PDF uploads across Class 9, 10, 11, and 12 (Physics, Chemistry, Computer, Biology, English & Urdu + Guess Papers). Standard fee: Rs. 300 per chapter with instant WhatsApp ordering.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('paid-notes')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>{isUrdu ? 'نوٹس مینیجر کھولیں' : 'Open Notes Manager'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Today's Attendance Snapshot vs Merit Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Today's Attendance Dispatch Watch */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Today's Attendance Status (07 Oct 2026)</span>
              </h3>
              <p className="text-xs text-slate-500">Live roster summary with alert trigger</p>
            </div>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {todayRecords.slice(0, 5).map((rec) => {
              const std = students.find((s) => s.id === rec.studentId);
              if (!std) return null;

              return (
                <div key={rec.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      rec.status === 'Present'
                        ? 'bg-emerald-500'
                        : rec.status === 'Absent'
                        ? 'bg-rose-500'
                        : rec.status === 'Late'
                        ? 'bg-amber-500'
                        : 'bg-blue-500'
                    }`} />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">{std.name}</span>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        {std.rollNumber} · {std.classGrade}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      rec.status === 'Present'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : rec.status === 'Absent'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : rec.status === 'Late'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      {rec.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {rec.timeIn || rec.remarks || 'Noted'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Absent students notify automatically to parents</span>
            <button
              onClick={() => {
                dispatchAttendanceNotifications(todayDate);
                onNavigateTab('attendance');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-200 text-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Today's WhatsApp Alerts</span>
            </button>
          </div>
        </div>

        {/* Right Column: Top Performing Students & Merit */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Academic Merit & High Achievers</span>
              </h3>
              <p className="text-xs text-slate-500">Highest scores across recent monthly assessments</p>
            </div>
            <button
              onClick={() => onNavigateTab('academic')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topExams.map((exam, idx) => {
              const std = students.find((s) => s.id === exam.studentId);
              if (!std) return null;

              return (
                <div key={exam.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center font-bold font-mono text-amber-800 text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-900 block">{std.name}</span>
                      <span className="text-[11px] text-slate-500 block">
                        {std.classGrade} · {exam.examTitle}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold font-mono text-emerald-700">
                      {exam.overallPercentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {exam.totalObtained}/{exam.totalPossible}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Notice Banner */}
          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-lg text-xs flex items-center justify-between">
            <span className="text-slate-600">
              Active Circular: <span className="font-semibold text-slate-800">{announcements[0]?.title}</span>
            </span>
            <button
              onClick={() => onNavigateTab('notices')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Open Notice Board
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />
    </div>
  );
};
