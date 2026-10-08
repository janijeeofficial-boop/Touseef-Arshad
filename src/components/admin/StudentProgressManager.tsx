import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { Student, ExamRecord } from '../../types';
import {
  GraduationCap,
  Search,
  Filter,
  Plus,
  Printer,
  ChevronRight,
  Award,
  BookOpen,
  UserPlus,
  Key,
  Copy,
  Check,
  MessageSquare,
  ArrowLeft,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { PrintableReportCard } from '../common/PrintableReportCard';
import { AddStudentModal } from './AddStudentModal';
import { AddExamModal } from './AddExamModal';

interface StudentProgressManagerProps {
  onBack?: () => void;
}

export const StudentProgressManager: React.FC<StudentProgressManagerProps> = ({ onBack }) => {
  const { students, exams, attendance, updateStudent, language } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(students[0] || null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [printingExam, setPrintingExam] = useState<{ student: Student; exam: ExamRecord } | null>(null);
  const [copiedCreds, setCopiedCreds] = useState(false);

  // Editing credentials
  const [isEditingCreds, setIsEditingCreds] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const handleStartEditCreds = () => {
    if (!selectedStudent) return;
    setEditUsername(selectedStudent.parentUsername);
    setEditPassword(selectedStudent.parentPassword);
    setIsEditingCreds(true);
  };

  const handleSaveCreds = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !editUsername.trim() || !editPassword.trim()) return;
    const updated: Student = {
      ...selectedStudent,
      parentUsername: editUsername.trim(),
      parentPassword: editPassword.trim(),
    };
    updateStudent(updated);
    setSelectedStudent(updated);
    setIsEditingCreds(false);
  };

  // Filter students
  const filteredStudents = students.filter((std) => {
    const matchesClass = selectedClass === 'All' || std.classGrade.includes(selectedClass);
    const matchesSearch =
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (std.urduName && std.urduName.includes(searchQuery)) ||
      std.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch;
  });

  // Get exams for current selected student
  const studentExams = selectedStudent
    ? exams.filter((e) => e.studentId === selectedStudent.id)
    : [];

  // Calculate attendance rate for student
  const studentAttendance = selectedStudent
    ? attendance.filter((a) => a.studentId === selectedStudent.id)
    : [];
  const presentDays = studentAttendance.filter((a) => a.status === 'Present').length;
  const totalDays = studentAttendance.length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  return (
    <div className="space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-indigo-600 text-xs font-semibold transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isUrdu ? '← ڈیش بورڈ پر واپس جائیں' : 'Back to Main Dashboard'}</span>
        </button>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-lg font-bold text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
            {tr.academicProgress}
          </h2>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? 'طلباء کے امتحانی ریکارڈ، ماہانہ ٹیسٹ نمبرات، گریڈنگ اور آفیشل رپورٹ کارڈ کا انتظام۔'
              : 'Track student exams, test scores, grading metrics, and generate printable report cards.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
          >
            <UserPlus className="w-4 h-4 text-slate-600" />
            <span>{isUrdu ? 'نیا طالب علم' : 'Enroll Student'}</span>
          </button>
          <button
            onClick={() => setIsAddExamOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>{tr.addTestResult}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Student List on Left, Selected Profile & Exams on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Student Roster */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col h-[650px]">
          {/* Filters */}
          <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/50">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={tr.searchStudent}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-slate-900 focus:outline-hidden w-full text-xs"
              />
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent text-slate-900 focus:outline-hidden w-full text-xs"
              >
                <option value="All">{tr.allClasses}</option>
                <option value="Class 9">Class 9 (Science)</option>
                <option value="Class 10">Class 10 (Matric)</option>
                <option value="Pre-Medical">F.Sc (Pre-Medical)</option>
                <option value="Pre-Engineering">F.Sc (Pre-Engineering)</option>
                <option value="ICS">ICS (Computer)</option>
              </select>
            </div>
          </div>

          {/* Student Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
            {filteredStudents.map((std) => {
              const isSelected = selectedStudent?.id === std.id;
              const stdLatestExam = exams.find((e) => e.studentId === std.id);

              return (
                <div
                  key={std.id}
                  onClick={() => setSelectedStudent(std)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 shadow-2xs'
                      : 'bg-white border-slate-100 hover:bg-slate-50/70 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-slate-900">{std.name}</div>
                      {std.urduName && (
                        <div className="text-[11px] text-slate-500 font-urdu">{std.urduName}</div>
                      )}
                    </div>
                    <span className="font-mono text-xs font-semibold text-indigo-600">
                      {std.rollNumber}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>{std.classGrade}</span>
                    {stdLatestExam && (
                      <span className="font-mono font-bold text-emerald-700">
                        {stdLatestExam.overallPercentage}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Student's Detailed Academic Track */}
        <div className="lg:col-span-2 space-y-6">
          {selectedStudent ? (
            <>
              {/* Profile Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{selectedStudent.name}</h3>
                      {selectedStudent.urduName && (
                        <span className="text-xs text-slate-500 font-urdu">
                          ({selectedStudent.urduName})
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Father: <span className="font-medium text-slate-700">{selectedStudent.fatherName}</span> · Roll #{' '}
                      <span className="font-mono font-semibold text-indigo-600">{selectedStudent.rollNumber}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-md">
                      {selectedStudent.classGrade} (Sec {selectedStudent.section})
                    </span>
                  </div>
                </div>

                {/* Key Numbers */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block mb-0.5">Attendance</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {attendancePercentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {presentDays}/{totalDays} days
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block mb-0.5">Assessments</span>
                    <span className="font-mono font-bold text-indigo-700 text-sm">
                      {studentExams.length}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Evaluated</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block mb-0.5">Latest Score</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">
                      {studentExams[0]?.overallPercentage || 0}%
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      Rank #{studentExams[0]?.classRank || '-'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block mb-0.5">Parent Contact</span>
                    <span className="font-mono text-slate-800 text-[11px] block truncate">
                      {selectedStudent.parentPhone}
                    </span>
                    <span className="text-[10px] text-emerald-600 block">WhatsApp Active</span>
                  </div>
                </div>

                {/* Parent Portal Access Credentials Issued by Academy */}
                <div className="mt-4 p-3 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Key className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-indigo-950">
                            Parent Portal Credentials (ادارہ کی طرف سے جاری لاگ ان)
                          </span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-mono">
                            Active
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-slate-600 text-[11px] mt-0.5 font-mono">
                          <span>Username: <strong className="text-indigo-900 select-all">{selectedStudent.parentUsername}</strong></span>
                          <span>·</span>
                          <span>Password: <strong className="text-slate-900 select-all">{selectedStudent.parentPassword}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleStartEditCreds}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                        title="Edit Parent Username or Password"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const credText = `Intelligence Academy - Parent Portal Login\nStudent: ${selectedStudent.name} (Roll #${selectedStudent.rollNumber})\nUsername: ${selectedStudent.parentUsername}\nPassword: ${selectedStudent.parentPassword}\nHelpline: 03185423896`;
                          navigator.clipboard.writeText(credText);
                          setCopiedCreds(true);
                          setTimeout(() => setCopiedCreds(false), 2000);
                        }}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                      >
                        {copiedCreds ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{copiedCreds ? 'Copied' : 'Copy'}</span>
                      </button>

                      <a
                        href={`https://wa.me/${selectedStudent.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `محترم والدین! انٹیلی جنس اکیڈمی کی طرف سے آپ کے بچے ${selectedStudent.name} (رول نمبر: ${selectedStudent.rollNumber}) کے لیے پورٹل لاگ ان:\nیوزر نیم: ${selectedStudent.parentUsername}\nپاس ورڈ: ${selectedStudent.parentPassword}\nپورٹل پر لاگ ان ہو کر روزانہ حاضری اور رزلٹ ملاحظہ فرمائیں۔ ہیلپ لائن: 03185423896`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Inline Edit Form for Credentials */}
                  {isEditingCreds && (
                    <form onSubmit={handleSaveCreds} className="pt-2 border-t border-indigo-200 flex flex-wrap items-end gap-3 bg-white p-3 rounded-lg">
                      <div className="flex-1 min-w-[130px]">
                        <label className="block text-[10px] text-slate-600 font-semibold mb-1">
                          Parent Username:
                        </label>
                        <input
                          type="text"
                          required
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="w-full px-2.5 py-1 border border-slate-300 rounded text-xs font-mono font-bold text-indigo-900 focus:outline-indigo-500"
                        />
                      </div>
                      <div className="flex-1 min-w-[130px]">
                        <label className="block text-[10px] text-slate-600 font-semibold mb-1">
                          Parent Password:
                        </label>
                        <input
                          type="text"
                          required
                          value={editPassword}
                          onChange={(e) => setEditPassword(e.target.value)}
                          className="w-full px-2.5 py-1 border border-slate-300 rounded text-xs font-mono font-bold text-slate-900 focus:outline-indigo-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-xs flex items-center gap-1"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingCreds(false)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Exams / Test History */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Academic Exam & Test History</span>
                  </h3>
                  <button
                    onClick={() => setIsAddExamOpen(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    + Enter New Assessment
                  </button>
                </div>

                {studentExams.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No examination records added yet. Click "+ Enter New Assessment" to record test marks.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {studentExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors bg-slate-50/30"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{exam.examTitle}</h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded">
                                {exam.examType}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">Date: {exam.date}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-sm font-bold font-mono text-emerald-700">
                                {exam.overallPercentage}%
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">
                                ({exam.totalObtained}/{exam.totalPossible})
                              </span>
                            </div>
                            <button
                              onClick={() => setPrintingExam({ student: selectedStudent, exam })}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
                            >
                              <Printer className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{tr.printReportCard}</span>
                            </button>
                          </div>
                        </div>

                        {/* Subject Marks Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                          {exam.subjectScores.map((sub, i) => (
                            <div key={i} className="bg-white p-2 rounded border border-slate-200">
                              <span className="text-[11px] text-slate-600 block truncate font-medium">
                                {sub.subject}
                              </span>
                              <div className="flex items-baseline justify-between mt-1">
                                <span className="font-mono font-bold text-slate-900 text-xs">
                                  {sub.obtainedMarks}/{sub.totalMarks}
                                </span>
                                <span className={`text-[10px] font-bold font-mono ${
                                  sub.grade === 'A+' || sub.grade === 'A'
                                    ? 'text-emerald-700'
                                    : 'text-blue-700'
                                }`}>
                                  {sub.grade}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Remarks */}
                        <div className="text-xs text-slate-600 italic bg-white p-2.5 rounded border border-slate-200">
                          <span className="font-semibold text-slate-700 not-italic block text-[11px]">
                            Teacher's Remark:
                          </span>
                          "{exam.teacherRemarks}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select a student from the roster to view academic reports and exam scores.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />

      <AddExamModal
        isOpen={isAddExamOpen}
        defaultStudentId={selectedStudent?.id}
        onClose={() => setIsAddExamOpen(false)}
      />

      {printingExam && (
        <PrintableReportCard
          student={printingExam.student}
          exam={printingExam.exam}
          language={language}
          onClose={() => setPrintingExam(null)}
        />
      )}
    </div>
  );
};
