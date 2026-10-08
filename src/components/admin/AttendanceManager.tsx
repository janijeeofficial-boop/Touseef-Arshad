import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { AttendanceStatus } from '../../types';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  MessageSquare,
  Search,
  Filter,
  CheckCheck,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

interface AttendanceManagerProps {
  onBack?: () => void;
}

export const AttendanceManager: React.FC<AttendanceManagerProps> = ({ onBack }) => {
  const {
    students,
    attendance,
    markAttendance,
    bulkMarkAttendance,
    dispatchAttendanceNotifications,
    language,
  } = useApp();

  const tr = t(language);
  const isUrdu = language === 'ur';

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-07');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notificationSummary, setNotificationSummary] = useState<{
    sentCount: number;
    messages: { phone: string; studentName: string; text: string; whatsappUrl: string }[];
  } | null>(null);

  // Filter students
  const filteredStudents = students.filter((std) => {
    const matchesClass = selectedClass === 'All' || std.classGrade.includes(selectedClass);
    const matchesSearch =
      std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (std.urduName && std.urduName.includes(searchQuery)) ||
      std.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSearch && std.status === 'Active';
  });

  // Calculate statistics for selected date
  const dateRecords = attendance.filter((a) => a.date === selectedDate);
  const presentCount = dateRecords.filter((a) => a.status === 'Present').length;
  const absentCount = dateRecords.filter((a) => a.status === 'Absent').length;
  const lateCount = dateRecords.filter((a) => a.status === 'Late').length;
  const leaveCount = dateRecords.filter((a) => a.status === 'Leave').length;
  const totalMarked = dateRecords.length;
  const attendanceRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

  const handleDispatchAlerts = () => {
    const result = dispatchAttendanceNotifications(selectedDate);
    setNotificationSummary(result);
  };

  const getStudentStatus = (studentId: string): AttendanceStatus | undefined => {
    return dateRecords.find((a) => a.studentId === studentId)?.status;
  };

  const getStudentTimeIn = (studentId: string): string | undefined => {
    return dateRecords.find((a) => a.studentId === studentId)?.timeIn;
  };

  const getStudentRemarks = (studentId: string): string | undefined => {
    return dateRecords.find((a) => a.studentId === studentId)?.remarks;
  };

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

      {/* Top Banner / Filter Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className={`text-lg font-bold text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
              {tr.dailyAttendance || 'Daily Student Attendance & Parent Dispatch'}
            </h2>
            <p className="text-xs text-slate-500">
              {isUrdu
                ? 'طلباء کی روزانہ حاضری نشان زد کریں اور غیر حاضر بچوں کے والدین کو فوری واٹس ایپ و ایس ایم ایس الرٹ جاری کریں۔'
                : 'Mark daily attendance records and trigger automated WhatsApp & SMS alerts to parents.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => bulkMarkAttendance(selectedDate, 'Present', selectedClass === 'All' ? undefined : selectedClass)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs whitespace-nowrap"
            >
              <CheckCheck className="w-4 h-4" />
              <span>{tr.markAllPresent}</span>
            </button>
            <button
              onClick={handleDispatchAlerts}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              <span>{tr.sendAttendanceAlerts}</span>
            </button>
          </div>
        </div>

        {/* Date, Class and Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-slate-500 text-xs whitespace-nowrap">{tr.attendanceDate}:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-medium text-slate-900 focus:outline-hidden w-full text-xs"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent font-medium text-slate-900 focus:outline-hidden w-full text-xs"
            >
              <option value="All">{tr.allClasses}</option>
              <option value="Class 9">Class 9 (Science)</option>
              <option value="Class 10">Class 10 (Matric)</option>
              <option value="Pre-Medical">F.Sc Part 1 (Pre-Medical)</option>
              <option value="Pre-Engineering">F.Sc Part 2 (Pre-Engineering)</option>
              <option value="ICS">ICS (Computer Science)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder={tr.searchStudent}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-hidden w-full text-xs"
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-xs block mb-1">Marked / Enrolled</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
              {totalMarked}/{students.length}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">({attendanceRate}%)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-emerald-700 text-xs block mb-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> {tr.present}
          </span>
          <span className="text-xl font-bold font-mono text-emerald-800 tabular-nums">{presentCount}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-2xs">
          <span className="text-rose-700 text-xs block mb-1 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> {tr.absent}
          </span>
          <span className="text-xl font-bold font-mono text-rose-800 tabular-nums">{absentCount}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-2xs">
          <span className="text-amber-700 text-xs block mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {tr.late}
          </span>
          <span className="text-xl font-bold font-mono text-amber-800 tabular-nums">{lateCount}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-2xs">
          <span className="text-blue-700 text-xs block mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> {tr.leave}
          </span>
          <span className="text-xl font-bold font-mono text-blue-800 tabular-nums">{leaveCount}</span>
        </div>
      </div>

      {/* Notification Dispatch Summary Modal / Banner */}
      {notificationSummary && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">
                  {isUrdu ? 'حاضری نوٹیفیکیشنز کامیابی سے تیار کر دیے گئے ہیں!' : 'Attendance Alerts Dispatched Successfully!'}
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {notificationSummary.sentCount} automated parent alerts prepared. You can trigger WhatsApp Web message instantly below:
                </p>
              </div>
            </div>
            <button
              onClick={() => setNotificationSummary(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
            >
              Dismiss
            </button>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {notificationSummary.messages.map((msg, i) => (
              <div key={i} className="bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between gap-2">
                <div className="truncate">
                  <span className="font-semibold text-slate-900 block truncate">{msg.studentName}</span>
                  <span className="text-[11px] text-slate-500 block font-mono">{msg.phone}</span>
                </div>
                <a
                  href={msg.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold whitespace-nowrap shadow-2xs"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Send WhatsApp</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Roll #</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3 text-center">Status (Select)</th>
                <th className="px-4 py-3">Time In</th>
                <th className="px-4 py-3">Remarks / Note</th>
                <th className="px-4 py-3 text-right">Parent WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => {
                const currentStatus = getStudentStatus(std.id);
                const timeIn = getStudentTimeIn(std.id) || '';
                const remarks = getStudentRemarks(std.id) || '';

                return (
                  <tr key={std.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-indigo-700">
                      {std.rollNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{std.name}</div>
                      {std.urduName && (
                        <div className="text-[11px] text-slate-500 font-urdu">{std.urduName}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{std.classGrade}</div>
                      <div className="text-[10px] text-slate-400">Sec {std.section}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => markAttendance(std.id, selectedDate, 'Present')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            currentStatus === 'Present'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          {tr.present}
                        </button>
                        <button
                          onClick={() => markAttendance(std.id, selectedDate, 'Absent')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            currentStatus === 'Absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          {tr.absent}
                        </button>
                        <button
                          onClick={() => markAttendance(std.id, selectedDate, 'Late')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            currentStatus === 'Late'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          {tr.late}
                        </button>
                        <button
                          onClick={() => markAttendance(std.id, selectedDate, 'Leave')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                            currentStatus === 'Leave'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                          }`}
                        >
                          {tr.leave}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="08:15 AM"
                        value={timeIn}
                        onChange={(e) => {
                          if (currentStatus) {
                            markAttendance(std.id, selectedDate, currentStatus, remarks);
                          }
                        }}
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Add teacher note..."
                        value={remarks}
                        onChange={(e) => {
                          if (currentStatus) {
                            markAttendance(std.id, selectedDate, currentStatus, e.target.value);
                          }
                        }}
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs placeholder:text-slate-400"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`https://wa.me/${std.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Intelligence Academy Attendance: ${std.name} (${std.rollNumber}) status on ${selectedDate} is ${currentStatus || 'Pending'}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-emerald-600 text-[11px] font-mono"
                        title="Send Direct WhatsApp Message"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{std.parentPhone}</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
