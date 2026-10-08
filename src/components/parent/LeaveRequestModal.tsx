import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { X, Send, Calendar, CheckCircle } from 'lucide-react';
import { Student } from '../../types';

interface LeaveRequestModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  const { submitLeaveRequest, language } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    submitLeaveRequest({
      studentId: student.id,
      studentName: student.name,
      parentName: student.fatherName,
      parentPhone: student.parentPhone,
      startDate,
      endDate,
      reason,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className={`font-bold text-slate-900 text-sm ${isUrdu ? 'font-urdu' : ''}`}>
              {isUrdu ? 'طالب علم کی رخصت / چھٹی کی درخواست' : 'Apply for Student Leave'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">
              {isUrdu ? 'درخواست کامیابی سے موصول ہو گئی!' : 'Leave Application Submitted!'}
            </h4>
            <p className="text-xs text-slate-500">
              {isUrdu
                ? 'اکیڈمی انتظامیہ جلد از جلد اس درخواست کا جائزہ لے کر مطلع کرے گی۔'
                : 'Intelligence Academy administration has been notified and will review your request.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Student:</span>
              <span className="font-semibold text-slate-900 text-sm">{student.name}</span>
              <span className="text-[11px] text-slate-500 font-mono block">
                {student.rollNumber} · {student.classGrade}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Reason for Leave (وجہ رخصت) *
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Due to severe viral fever / doctor appointment / urgent family event..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 text-xs"
              >
                {tr.cancel}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
              >
                <Send className="w-4 h-4" />
                <span>{isUrdu ? 'درخواست جمع کرائیں' : 'Submit Application'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
