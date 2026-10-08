import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { Announcement, LeaveRequest } from '../../types';
import {
  Bell,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  User,
  Save,
  ArrowLeft,
} from 'lucide-react';

interface NoticeManagerProps {
  onBack?: () => void;
}

export const NoticeManager: React.FC<NoticeManagerProps> = ({ onBack }) => {
  const {
    announcements,
    addAnnouncement,
    leaveRequests,
    updateLeaveRequestStatus,
    language,
  } = useApp();

  const tr = t(language);
  const isUrdu = language === 'ur';

  const [activeTab, setActiveTab] = useState<'notices' | 'leaves'>('notices');
  const [isNewNoticeOpen, setIsNewNoticeOpen] = useState(false);

  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeUrduTitle, setNoticeUrduTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeUrduContent, setNoticeUrduContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<Announcement['category']>('General');
  const [isUrgent, setIsUrgent] = useState(false);

  const [adminRemarks, setAdminRemarks] = useState<{ [id: string]: string }>({});

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim()) return;

    addAnnouncement({
      title: noticeTitle,
      urduTitle: noticeUrduTitle || noticeTitle,
      content: noticeContent,
      urduContent: noticeUrduContent || noticeContent,
      category: noticeCategory,
      date: new Date().toISOString().split('T')[0],
      urgent: isUrgent,
    });

    setNoticeTitle('');
    setNoticeUrduTitle('');
    setNoticeContent('');
    setNoticeUrduContent('');
    setIsNewNoticeOpen(false);
  };

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');

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

      {/* Top Banner & Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-lg font-bold text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
            {tr.announcements} & {tr.leaveRequests}
          </h2>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? 'اکیڈمی کے اہم اعلانات، امتحانی سرکلرز اور والدین کی طرف سے موصولہ رخصت کی درخواستوں کا انتظام۔'
              : 'Broadcast official academy announcements and review student leave applications submitted by parents.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'notices'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tr.announcements} ({announcements.length})
            </button>
            <button
              onClick={() => setActiveTab('leaves')}
              className={`px-3 py-1.5 rounded-md transition-all relative ${
                activeTab === 'leaves'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tr.leaveRequests}</span>
              {pendingLeaves.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px]">
                  {pendingLeaves.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'notices' && (
            <button
              onClick={() => setIsNewNoticeOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{isUrdu ? 'نیا اعلان شائع کریں' : 'Post Circular'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Notices Tab */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.map((anc) => (
            <div
              key={anc.id}
              className={`bg-white rounded-xl border p-5 shadow-xs transition-colors ${
                anc.urgent ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                    anc.category === 'Exam'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : anc.category === 'Fee Alert'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : anc.category === 'Meeting'
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {anc.category}
                  </span>
                  {anc.urgent && (
                    <span className="text-[10px] font-bold text-rose-600 uppercase flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" /> Urgent
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-mono">{anc.date}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">{anc.title}</h3>
              {anc.urduTitle && (
                <h4 className="text-xs font-bold text-slate-700 font-urdu mb-2">
                  {anc.urduTitle}
                </h4>
              )}

              <p className="text-xs text-slate-600 leading-relaxed mb-3">{anc.content}</p>
              {anc.urduContent && (
                <p className="text-xs text-slate-600 font-urdu leading-relaxed bg-slate-50/70 p-2.5 rounded border border-slate-100">
                  {anc.urduContent}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Leaves Tab */}
      {activeTab === 'leaves' && (
        <div className="space-y-4">
          {leaveRequests.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              No student leave applications received from parents.
            </div>
          ) : (
            leaveRequests.map((req) => {
              const isPending = req.status === 'Pending';
              const isApproved = req.status === 'Approved';

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="font-bold text-sm text-slate-900">{req.studentName}</span>
                        <span className="text-xs text-slate-500 ml-2">
                          Parent: <span className="font-medium text-slate-700">{req.parentName}</span> ({req.parentPhone})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : isPending
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{req.submittedAt}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 mb-3">
                    <div className="flex items-center gap-2 font-semibold text-slate-800 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>
                        Requested Duration: {req.startDate} {req.startDate !== req.endDate ? `to ${req.endDate}` : '(1 Day)'}
                      </span>
                    </div>
                    <p className="italic">"{req.reason}"</p>
                  </div>

                  {req.adminRemarks && (
                    <div className="text-xs text-slate-600 mb-3 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                      <span className="font-semibold text-emerald-800">Admin Remarks: </span>
                      {req.adminRemarks}
                    </div>
                  )}

                  {isPending && (
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                      <input
                        type="text"
                        placeholder="Add sanctioning remarks (optional)..."
                        value={adminRemarks[req.id] || ''}
                        onChange={(e) =>
                          setAdminRemarks({ ...adminRemarks, [req.id]: e.target.value })
                        }
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:bg-white"
                      />
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() =>
                            updateLeaveRequestStatus(req.id, 'Approved', adminRemarks[req.id] || 'Sanctioned by Academy')
                          }
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs transition-colors shadow-2xs"
                        >
                          Approve Leave
                        </button>
                        <button
                          onClick={() =>
                            updateLeaveRequestStatus(req.id, 'Rejected', adminRemarks[req.id] || 'Cannot be sanctioned')
                          }
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold text-xs transition-colors shadow-2xs"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* New Notice Modal */}
      {isNewNoticeOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Post New Circular / Notice</h3>
              <button onClick={() => setIsNewNoticeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Title (English) *</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Examination Datesheet"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 font-urdu">عنوان (اردو)</label>
                <input
                  type="text"
                  value={noticeUrduTitle}
                  onChange={(e) => setNoticeUrduTitle(e.target.value)}
                  placeholder="مثلاً مڈ ٹرم امتحانات کی تاریخیں"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-urdu"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={noticeCategory}
                    onChange={(e) => setNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="General">General</option>
                    <option value="Exam">Exam / Tests</option>
                    <option value="Fee Alert">Fee Alert</option>
                    <option value="Meeting">PTM / Meeting</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isUrgent}
                      onChange={(e) => setIsUrgent(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span>Mark as Urgent Notice</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Details (English)</label>
                <textarea
                  rows={2}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 font-urdu">تفصیلات (اردو)</label>
                <textarea
                  rows={2}
                  value={noticeUrduContent}
                  onChange={(e) => setNoticeUrduContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-urdu"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewNoticeOpen(false)}
                  className="px-4 py-2 text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
