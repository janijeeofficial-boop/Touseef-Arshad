import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { X, Bell, MessageSquare, CheckCircle, ExternalLink, Calendar, CreditCard, Award } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, language, role, currentStudentId, markNotificationRead, markAllNotificationsRead } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  if (!isOpen) return null;

  // Filter based on role
  const relevantNotifs = notifications.filter((n) => {
    if (role === 'parent' && currentStudentId) {
      return !n.studentId || n.studentId === currentStudentId;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className={`font-semibold text-slate-900 text-sm ${isUrdu ? 'font-urdu' : ''}`}>
              {tr.notifications}
            </h3>
            <span className="text-xs text-slate-500 font-mono">({relevantNotifs.length})</span>
          </div>
          <div className="flex items-center gap-2">
            {relevantNotifs.some((n) => !n.read) && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {isUrdu ? 'سب پڑھیں' : 'Mark all read'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-3 space-y-2">
          {relevantNotifs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              {isUrdu ? 'کوئی نیا نوٹیفیکیشن موجود نہیں ہے۔' : 'No notifications found.'}
            </div>
          ) : (
            relevantNotifs.map((notif) => {
              const isAttendance = notif.type === 'attendance';
              const isFee = notif.type === 'fee';
              const isExam = notif.type === 'exam';

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-white border-slate-100 text-slate-600'
                      : 'bg-indigo-50/40 border-indigo-100 text-slate-900 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      {isAttendance && <Calendar className="w-4 h-4 text-rose-500 shrink-0" />}
                      {isFee && <CreditCard className="w-4 h-4 text-amber-500 shrink-0" />}
                      {isExam && <Award className="w-4 h-4 text-emerald-500 shrink-0" />}
                      <span className="text-xs font-semibold text-slate-900">
                        {isUrdu ? notif.urduTitle : notif.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className={`text-xs text-slate-600 leading-relaxed mb-2 ${isUrdu ? 'font-urdu' : ''}`}>
                    {isUrdu ? notif.urduMessage : notif.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Channel: {notif.channel}
                    </span>
                    {notif.channel === 'WhatsApp' && notif.recipientPhone && (
                      <a
                        href={`https://wa.me/${notif.recipientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          isUrdu ? notif.urduMessage : notif.message
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>{tr.dispatchViaWhatsApp}</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
