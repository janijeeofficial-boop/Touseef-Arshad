import React from 'react';
import { Student, ExamRecord, Language } from '../../types';
import { t } from '../../utils/translations';
import { Printer, X, Award, CheckCircle2 } from 'lucide-react';
import logoUrl from '../../assets/images/academy_official_logo_1791469588319.jpg';

interface PrintableReportCardProps {
  student: Student;
  exam: ExamRecord;
  language: Language;
  onClose: () => void;
}

export const PrintableReportCard: React.FC<PrintableReportCardProps> = ({
  student,
  exam,
  language,
  onClose,
}) => {
  const tr = t(language);
  const isUrdu = language === 'ur';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        {/* Controls - Hidden during print */}
        <div className="no-print bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-800">
              {isUrdu ? 'آفیشل پروگریس رپورٹ کارڈ' : 'Official Academic Report Card'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{tr.printReportCard}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="print-area p-8 text-slate-900 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-indigo-900 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={logoUrl}
                alt="Intelligence Academy Official Seal"
                className="w-16 h-16 object-cover rounded-full border-2 border-amber-400/60 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-indigo-950 font-serif">
                  INTELLIGENCE ACADEMY
                </h1>
                <p className="text-xs font-medium text-slate-600">
                  انٹیلی جنس اکیڈمی · سنٹر فار ہائر سیکنڈری و بورڈ پریپریشن
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Holy Family Road near Tariq Ghani Clinic, Back Side Street 2, House No. NW 40, Rawalpindi
                </p>
                <p className="text-[10px] text-slate-500">
                  Campuses: Rawalpindi (Main) · Islamabad · Sohawa · Contact: 03185423896 · Email: touseefali599@gmail.com
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold uppercase tracking-wider rounded">
                Official Transcript
              </span>
              <p className="text-xs text-slate-500 mt-1">Issue Date: {exam.date}</p>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Student Name</span>
              <span className="font-semibold text-slate-900 text-sm">{student.name}</span>
              {student.urduName && <span className="font-urdu block text-slate-600 text-xs">{student.urduName}</span>}
            </div>
            <div>
              <span className="text-slate-500 block">Father's Name</span>
              <span className="font-semibold text-slate-900 text-sm">{student.fatherName}</span>
              {student.urduFatherName && <span className="font-urdu block text-slate-600 text-xs">{student.urduFatherName}</span>}
            </div>
            <div>
              <span className="text-slate-500 block">Roll Number</span>
              <span className="font-mono font-bold text-indigo-700 text-sm">{student.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Class & Section</span>
              <span className="font-semibold text-slate-900 text-sm">{student.classGrade} (Sec {student.section})</span>
            </div>
          </div>

          {/* Exam Title */}
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-900">
              {exam.examTitle}
              {exam.urduExamTitle && (
                <span className="font-urdu text-sm font-normal text-slate-600 ml-2">
                  ({exam.urduExamTitle})
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">{exam.examType} Evaluation Report</p>
          </div>

          {/* Subjects Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Sr.</th>
                  <th className="px-4 py-2.5">Subject</th>
                  <th className="px-4 py-2.5 text-right">Total Marks</th>
                  <th className="px-4 py-2.5 text-right">Obtained</th>
                  <th className="px-4 py-2.5 text-center">Percentage</th>
                  <th className="px-4 py-2.5 text-center">Grade</th>
                  <th className="px-4 py-2.5">Evaluation Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exam.subjectScores.map((sub, idx) => {
                  const perc = Math.round((sub.obtainedMarks / sub.totalMarks) * 100);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-900">
                        {sub.subject}
                        {sub.urduSubject && (
                          <span className="text-slate-500 text-[11px] font-urdu ml-1">
                            ({sub.urduSubject})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-600">
                        {sub.totalMarks}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums font-bold text-slate-900">
                        {sub.obtainedMarks}
                      </td>
                      <td className="px-4 py-2.5 text-center font-mono tabular-nums text-slate-700">
                        {perc}%
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={`font-bold font-mono ${
                          sub.grade === 'A+' || sub.grade === 'A'
                            ? 'text-emerald-700'
                            : sub.grade === 'B'
                            ? 'text-blue-700'
                            : 'text-amber-700'
                        }`}>
                          {sub.grade}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600 text-[11px]">
                        {sub.remarks || 'Satisfactory work'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-100/80 font-bold border-t-2 border-slate-300">
                <tr>
                  <td colSpan={2} className="px-4 py-2.5 text-slate-900 uppercase">
                    Grand Total
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-700">
                    {exam.totalPossible}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono tabular-nums text-indigo-700 text-sm">
                    {exam.totalObtained}
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono tabular-nums text-indigo-700 text-sm">
                    {exam.overallPercentage}%
                  </td>
                  <td className="px-4 py-2.5 text-center font-mono text-emerald-700">
                    {exam.overallPercentage >= 80 ? 'A+' : exam.overallPercentage >= 70 ? 'A' : 'B'}
                  </td>
                  <td className="px-4 py-2.5 text-slate-700 font-normal">
                    {exam.classRank ? `Class Rank: #${exam.classRank}` : 'Passed with distinction'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Teacher Remarks Box */}
          <div className="border border-slate-200 rounded-lg p-4 mb-8 bg-slate-50/50">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
              Faculty Assessment & Recommendations
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed italic mb-1">
              "{exam.teacherRemarks}"
            </p>
            {exam.urduTeacherRemarks && (
              <p className="text-xs text-slate-600 font-urdu leading-relaxed">
                "{exam.urduTeacherRemarks}"
              </p>
            )}
          </div>

          {/* Signatures & Seal */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 text-center text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
              <span className="text-slate-600 font-medium">Class Incharge Teacher</span>
            </div>
            <div>
              <div className="h-10 flex items-center justify-center mb-1">
                <div className="w-16 h-10 border border-slate-300 rounded flex items-center justify-center text-[10px] text-slate-400 uppercase tracking-widest">
                  SEAL
                </div>
              </div>
              <span className="text-slate-600 font-medium">Official Stamp</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-1" />
              <span className="text-slate-600 font-medium">Principal / Academic Director</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
