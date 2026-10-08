import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { X, Award, Plus, Trash2, Save } from 'lucide-react';
import { SubjectScore, ExamRecord } from '../../types';

interface AddExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentId?: string;
}

export const AddExamModal: React.FC<AddExamModalProps> = ({
  isOpen,
  onClose,
  defaultStudentId,
}) => {
  const { students, addExamResult, language } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  const [studentId, setStudentId] = useState(defaultStudentId || students[0]?.id || '');
  const [examTitle, setExamTitle] = useState('October Monthly Assessment 2026');
  const [urduExamTitle, setUrduExamTitle] = useState('اکتوبر ماہانہ امتحانی جائزہ 2026');
  const [examType, setExamType] = useState<ExamRecord['examType']>('Monthly Assessment');
  const [date, setDate] = useState('2026-10-06');
  const [teacherRemarks, setTeacherRemarks] = useState('Satisfactory performance. Showing steady improvement in core subjects.');
  const [urduTeacherRemarks, setUrduTeacherRemarks] = useState('اطمینان بخش کارکردگی۔ بنیادی مضامین میں مسلسل بہتری آ رہی ہے۔');

  const [subjects, setSubjects] = useState<SubjectScore[]>([
    { subject: 'Mathematics', urduSubject: 'ریاضی', obtainedMarks: 85, totalMarks: 100, grade: 'A', remarks: 'Good accuracy' },
    { subject: 'Physics', urduSubject: 'فزکس', obtainedMarks: 82, totalMarks: 100, grade: 'A', remarks: 'Concept clear' },
    { subject: 'Chemistry', urduSubject: 'کیمسٹری', obtainedMarks: 80, totalMarks: 100, grade: 'A', remarks: 'Good work' },
    { subject: 'English', urduSubject: 'انگریزی', obtainedMarks: 78, totalMarks: 100, grade: 'B', remarks: 'Improve spelling' },
  ]);

  if (!isOpen) return null;

  const handleScoreChange = (index: number, field: keyof SubjectScore, value: any) => {
    setSubjects((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: value };

      if (field === 'obtainedMarks' || field === 'totalMarks') {
        const perc = (item.obtainedMarks / item.totalMarks) * 100;
        item.grade = perc >= 90 ? 'A+' : perc >= 80 ? 'A' : perc >= 70 ? 'B' : perc >= 60 ? 'C' : perc >= 50 ? 'D' : 'F';
      }

      updated[index] = item;
      return updated;
    });
  };

  const handleAddSubject = () => {
    setSubjects((prev) => [
      ...prev,
      { subject: 'Biology / CS', urduSubject: 'بائیولوجی / کمپیوٹر', obtainedMarks: 75, totalMarks: 100, grade: 'B', remarks: '' },
    ]);
  };

  const handleRemoveSubject = (index: number) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const totalObtained = subjects.reduce((sum, s) => sum + Number(s.obtainedMarks || 0), 0);
  const totalPossible = subjects.reduce((sum, s) => sum + Number(s.totalMarks || 0), 0);
  const overallPercentage = totalPossible > 0 ? parseFloat(((totalObtained / totalPossible) * 100).toFixed(1)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || subjects.length === 0) return;

    addExamResult({
      studentId,
      examTitle,
      urduExamTitle,
      examType,
      date,
      subjectScores: subjects,
      totalObtained,
      totalPossible,
      overallPercentage,
      classRank: Math.floor(Math.random() * 5) + 1,
      teacherRemarks,
      urduTeacherRemarks,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className={`font-bold text-slate-900 text-sm ${isUrdu ? 'font-urdu' : ''}`}>
              {isUrdu ? 'نیا امتحانی نتیجہ درج کریں' : 'Record Student Exam & Test Scores'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Select Student *
              </label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNumber}) - {s.classGrade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Exam / Test Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:bg-white focus:outline-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Exam Title (English) *
              </label>
              <input
                type="text"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 font-urdu">
                امتحان کا نام (اردو)
              </label>
              <input
                type="text"
                value={urduExamTitle}
                onChange={(e) => setUrduExamTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-urdu focus:bg-white focus:outline-indigo-500"
              />
            </div>
          </div>

          {/* Subjects Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900">Subject Breakdown & Marks</span>
              <button
                type="button"
                onClick={handleAddSubject}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Subject</span>
              </button>
            </div>

            <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-48 overflow-y-auto">
              {subjects.map((sub, index) => (
                <div key={index} className="flex items-center gap-2 bg-white p-2 rounded border border-slate-200">
                  <input
                    type="text"
                    value={sub.subject}
                    onChange={(e) => handleScoreChange(index, 'subject', e.target.value)}
                    placeholder="Subject Name"
                    className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500">Marks:</span>
                    <input
                      type="number"
                      value={sub.obtainedMarks}
                      onChange={(e) => handleScoreChange(index, 'obtainedMarks', Number(e.target.value))}
                      className="w-14 px-1.5 py-1 border border-slate-200 rounded text-xs font-mono text-right"
                    />
                    <span className="text-slate-400">/</span>
                    <input
                      type="number"
                      value={sub.totalMarks}
                      onChange={(e) => handleScoreChange(index, 'totalMarks', Number(e.target.value))}
                      className="w-14 px-1.5 py-1 border border-slate-200 rounded text-xs font-mono text-right"
                    />
                  </div>
                  <span className="w-8 text-center font-bold text-indigo-700 font-mono">
                    {sub.grade}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-2 px-2 text-xs font-semibold text-slate-700">
              <span>Total: {totalObtained} / {totalPossible}</span>
              <span className="text-indigo-700 font-bold font-mono">Overall: {overallPercentage}%</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Teacher Assessment Feedback
            </label>
            <textarea
              rows={2}
              value={teacherRemarks}
              onChange={(e) => setTeacherRemarks(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-medium"
            >
              {tr.cancel}
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
            >
              <Save className="w-4 h-4" />
              <span>{tr.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
