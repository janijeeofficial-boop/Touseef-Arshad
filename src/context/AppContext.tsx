import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  AttendanceRecord,
  AttendanceStatus,
  ExamRecord,
  FeeRecord,
  LeaveRequest,
  NotificationItem,
  Announcement,
  Language,
  UserRole,
  PaidSubjectNote,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_EXAMS,
  INITIAL_FEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAID_NOTES,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  language: Language;
  currentStudentId: string | null;
  activeStudent: Student | null;
  students: Student[];
  attendance: AttendanceRecord[];
  exams: ExamRecord[];
  fees: FeeRecord[];
  leaveRequests: LeaveRequest[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  paidNotes: PaidSubjectNote[];
  unreadNotifsCount: number;
  isAdminAuthenticated: boolean;
  
  // State setters & actions
  setRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  setCurrentStudentId: (id: string | null) => void;
  loginAsParent: (studentId: string) => void;
  loginAsAdmin: () => void;
  loginAsAdminWithPassword: (password: string) => boolean;
  logoutAdmin: () => void;
  logout: () => void;
  
  // Attendance actions
  markAttendance: (studentId: string, date: string, status: AttendanceStatus, remarks?: string) => void;
  bulkMarkAttendance: (date: string, status: AttendanceStatus, classGrade?: string) => void;
  dispatchAttendanceNotifications: (date: string) => { sentCount: number; messages: { phone: string; studentName: string; text: string; whatsappUrl: string }[] };
  
  // Student actions
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (student: Student) => void;
  
  // Academic exam actions
  addExamResult: (exam: Omit<ExamRecord, 'id'>) => ExamRecord;
  
  // Fees actions
  updateFeeStatus: (feeId: string, status: FeeRecord['status'], paidAmount: number, paymentMethod?: FeeRecord['paymentMethod']) => void;
  createFeeVoucher: (voucher: Omit<FeeRecord, 'id' | 'receiptNumber'>) => FeeRecord;
  
  // Leave requests
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => void;
  updateLeaveRequestStatus: (id: string, status: 'Approved' | 'Rejected', adminRemarks?: string) => void;
  
  // Announcements & Notifications
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Paid Subject Notes
  addPaidNote: (note: Omit<PaidSubjectNote, 'id' | 'uploadedAt'>) => void;
  deletePaidNote: (id: string) => void;
  updatePaidNote: (note: PaidSubjectNote) => void;
  
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'ia_role',
  LANG: 'ia_lang',
  STUDENT_ID: 'ia_current_student_id',
  STUDENTS: 'ia_students_v1',
  ATTENDANCE: 'ia_attendance_v1',
  EXAMS: 'ia_exams_v1',
  FEES: 'ia_fees_v1',
  LEAVES: 'ia_leaves_v1',
  ANNOUNCEMENTS: 'ia_announcements_v1',
  NOTIFICATIONS: 'ia_notifications_v1',
  PAID_NOTES: 'ia_paid_notes_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always default to 'parent' when anyone opens the app, protecting all admin features!
  const [role, setRoleState] = useState<UserRole>('parent');

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ia_admin_auth') === 'true';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en';
  });

  // Default to null so whenever the app is opened, visitor/parent starts at the Parent Login page
  const [currentStudentId, setCurrentStudentIdState] = useState<string | null>(null);

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed: Student[] = JSON.parse(saved);
        return parsed.map((s) => ({
          ...s,
          parentUsername: s.parentUsername || `IA-${s.name.split(' ')[0].toUpperCase()}`,
          parentPassword: s.parentPassword || 'pass@2026',
        }));
      }
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [exams, setExams] = useState<ExamRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [fees, setFees] = useState<FeeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEES);
      return saved ? JSON.parse(saved) : INITIAL_FEES;
    } catch {
      return INITIAL_FEES;
    }
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
    } catch {
      return INITIAL_LEAVE_REQUESTS;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [paidNotes, setPaidNotes] = useState<PaidSubjectNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAID_NOTES);
      return saved ? JSON.parse(saved) : INITIAL_PAID_NOTES;
    } catch {
      return INITIAL_PAID_NOTES;
    }
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    if (currentStudentId) {
      localStorage.setItem(STORAGE_KEYS.STUDENT_ID, currentStudentId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
    }
  }, [currentStudentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEES, JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PAID_NOTES, JSON.stringify(paidNotes));
    } catch (e) {
      console.warn('Failed to save paid notes', e);
    }
  }, [paidNotes]);

  const ADMIN_PASSWORDS = ['intelligence2026', 'admin@2026', '03185423896', 'admin123'];

  const setRole = (newRole: UserRole) => {
    if (newRole === 'admin' && !isAdminAuthenticated) {
      // Must authenticate first
      return;
    }
    setRoleState(newRole);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCurrentStudentId = (id: string | null) => {
    setCurrentStudentIdState(id);
  };

  const loginAsParent = (studentId: string) => {
    setCurrentStudentIdState(studentId);
    setRoleState('parent');
  };

  const loginAsAdminWithPassword = (password: string): boolean => {
    const clean = password.trim();
    if (ADMIN_PASSWORDS.includes(clean)) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('ia_admin_auth', 'true');
      setRoleState('admin');
      return true;
    }
    return false;
  };

  const loginAsAdmin = () => {
    if (isAdminAuthenticated) {
      setRoleState('admin');
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('ia_admin_auth');
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    setRoleState('parent');
    setCurrentStudentIdState(null);
  };

  const logout = () => {
    setRoleState('parent');
    setCurrentStudentIdState(null);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_ID);
  };

  const activeStudent = students.find((s) => s.id === currentStudentId) || null;

  const markAttendance = (studentId: string, date: string, status: AttendanceStatus, remarks?: string) => {
    setAttendance((prev) => {
      const existingIndex = prev.findIndex((a) => a.studentId === studentId && a.date === date);
      const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          status,
          timeIn: status === 'Present' || status === 'Late' ? updated[existingIndex].timeIn || currentTime : undefined,
          remarks: remarks !== undefined ? remarks : updated[existingIndex].remarks,
        };
        return updated;
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          studentId,
          date,
          status,
          timeIn: status === 'Present' || status === 'Late' ? currentTime : undefined,
          remarks: remarks || '',
        };
        return [newRecord, ...prev];
      }
    });
  };

  const bulkMarkAttendance = (date: string, status: AttendanceStatus, classGrade?: string) => {
    const targetStudents = classGrade
      ? students.filter((s) => s.classGrade === classGrade && s.status === 'Active')
      : students.filter((s) => s.status === 'Active');

    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setAttendance((prev) => {
      const updated = [...prev];
      targetStudents.forEach((std) => {
        const existingIndex = updated.findIndex((a) => a.studentId === std.id && a.date === date);
        if (existingIndex >= 0) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            status,
            timeIn: status === 'Present' || status === 'Late' ? updated[existingIndex].timeIn || currentTime : undefined,
          };
        } else {
          updated.push({
            id: `att-${Date.now()}-${std.id}`,
            studentId: std.id,
            date,
            status,
            timeIn: status === 'Present' || status === 'Late' ? currentTime : undefined,
          });
        }
      });
      return updated;
    });
  };

  const dispatchAttendanceNotifications = (date: string) => {
    const dateRecords = attendance.filter((a) => a.date === date);
    const messages: { phone: string; studentName: string; text: string; whatsappUrl: string }[] = [];
    const newNotifs: NotificationItem[] = [];

    dateRecords.forEach((record) => {
      const student = students.find((s) => s.id === record.studentId);
      if (!student) return;

      const formattedDate = new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      
      let titleEn = '';
      let titleUr = '';
      let textEn = '';
      let textUr = '';

      if (record.status === 'Absent') {
        titleEn = `Attendance Alert: ${student.name} is Absent`;
        titleUr = `حاضری الرٹ: ${student.urduName || student.name} غیر حاضر`;
        textEn = `Intelligence Academy: Respected Parent, your child ${student.name} (Roll #${student.rollNumber}) was marked ABSENT today (${formattedDate}). Kindly inform the academy of the reason or contact us at 0318-5423896.`;
        textUr = `محترم والدین! انٹیلی جنس اکیڈمی کی طرف سے مطلع کیا جاتا ہے کہ آپ کا بچہ ${student.urduName || student.name} (رول نمبر: ${student.rollNumber}) آج مورخہ ${formattedDate} کو غیر حاضر رہا ہے۔ برائے مہربانی فوری رابطہ فرمائیں (03185423896)۔`;
      } else if (record.status === 'Late') {
        titleEn = `Attendance Alert: ${student.name} arrived Late`;
        titleUr = `حاضری الرٹ: ${student.urduName || student.name} تاخیر سے آمد`;
        textEn = `Intelligence Academy: Respected Parent, your child ${student.name} (Roll #${student.rollNumber}) arrived LATE at ${record.timeIn || '08:45 AM'} today (${formattedDate}). Please ensure punctuality.`;
        textUr = `محترم والدین! آپ کا بچہ ${student.urduName || student.name} آج مورخہ ${formattedDate} کو تاخیر سے اکیڈمی پہنچا ہے۔ برائے مہربانی بروقت آمد یقینی بنائیں۔`;
      } else if (record.status === 'Present') {
        titleEn = `Attendance Alert: ${student.name} Present`;
        titleUr = `حاضری الرٹ: ${student.urduName || student.name} باقاعدہ حاضر`;
        textEn = `Intelligence Academy: Respected Parent, your child ${student.name} is safely PRESENT at the academy today (${formattedDate}) at ${record.timeIn || '08:15 AM'}.`;
        textUr = `محترم والدین! ${student.urduName || student.name} آج مورخہ ${formattedDate} کو باقاعدگی سے انٹیلی جنس اکیڈمی حاضر ہو چکے ہیں۔`;
      } else {
        return; // Leave already informed
      }

      const cleanPhone = student.parentPhone.replace(/[^0-9]/g, '');
      const intlPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.substring(1) : cleanPhone;
      const combinedText = `${textUr}\n\n${textEn}`;
      const whatsappUrl = `https://wa.me/${intlPhone}?text=${encodeURIComponent(combinedText)}`;

      messages.push({
        phone: student.parentPhone,
        studentName: student.name,
        text: textUr,
        whatsappUrl,
      });

      newNotifs.push({
        id: `notif-${Date.now()}-${student.id}`,
        title: titleEn,
        urduTitle: titleUr,
        message: textEn,
        urduMessage: textUr,
        type: 'attendance',
        studentId: student.id,
        recipientPhone: student.parentPhone,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
        read: false,
        channel: 'WhatsApp',
      });
    });

    setNotifications((prev) => [...newNotifs, ...prev]);

    // Mark these attendance records as notified
    setAttendance((prev) =>
      prev.map((a) =>
        a.date === date
          ? {
              ...a,
              notifiedAt: new Date().toLocaleString(),
              notificationChannels: ['WhatsApp', 'Portal'],
            }
          : a
      )
    );

    return { sentCount: messages.length, messages };
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const parentUsername = studentData.parentUsername || `IA-${studentData.rollNumber.replace(/[^A-Za-z0-9]/g, '')}`;
    const parentPassword = studentData.parentPassword || 'pass@2026';
    const newStudent: Student = {
      ...studentData,
      parentUsername,
      parentPassword,
      id: `std-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (student: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
  };

  const addExamResult = (examData: Omit<ExamRecord, 'id'>) => {
    const newExam: ExamRecord = {
      ...examData,
      id: `exam-${Date.now()}`,
    };
    setExams((prev) => [newExam, ...prev]);

    // Notify parent
    const student = students.find((s) => s.id === newExam.studentId);
    if (student) {
      setNotifications((prev) => [
        {
          id: `notif-exam-${Date.now()}`,
          title: `Exam Score Released: ${newExam.examTitle}`,
          urduTitle: `امتحانی نتیجہ جاری: ${newExam.urduExamTitle || newExam.examTitle}`,
          message: `${student.name} obtained ${newExam.totalObtained}/${newExam.totalPossible} (${newExam.overallPercentage}%) in ${newExam.examTitle}. View full report card in the portal.`,
          urduMessage: `${student.urduName || student.name} نے ${newExam.urduExamTitle || newExam.examTitle} میں ${newExam.overallPercentage} فیصد نمبر حاصل کیے۔ رپورٹ کارڈ پورٹل پر دستیاب ہے۔`,
          type: 'exam',
          studentId: student.id,
          recipientPhone: student.parentPhone,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          read: false,
          channel: 'Portal',
        },
        ...prev,
      ]);
    }

    return newExam;
  };

  const updateFeeStatus = (
    feeId: string,
    status: FeeRecord['status'],
    paidAmount: number,
    paymentMethod?: FeeRecord['paymentMethod']
  ) => {
    setFees((prev) =>
      prev.map((f) => {
        if (f.id === feeId) {
          return {
            ...f,
            status,
            paidAmount,
            paymentMethod: paymentMethod || f.paymentMethod,
            paidDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : f.paidDate,
          };
        }
        return f;
      })
    );
  };

  const createFeeVoucher = (voucher: Omit<FeeRecord, 'id' | 'receiptNumber'>) => {
    const receiptNumber = `IA-RCP-${Date.now().toString().slice(-6)}`;
    const newRecord: FeeRecord = {
      ...voucher,
      id: `fee-${Date.now()}`,
      receiptNumber,
    };
    setFees((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const submitLeaveRequest = (req: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `lvr-${Date.now()}`,
      status: 'Pending',
      submittedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
  };

  const updateLeaveRequestStatus = (id: string, status: 'Approved' | 'Rejected', adminRemarks?: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status, adminRemarks } : l))
    );

    // If approved, automatically mark attendance as Leave for the dates
    const leaveReq = leaveRequests.find((l) => l.id === id);
    if (leaveReq && status === 'Approved') {
      markAttendance(leaveReq.studentId, leaveReq.startDate, 'Leave', `Approved leave: ${leaveReq.reason}`);
    }
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...announcement,
      id: `anc-${Date.now()}`,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addPaidNote = (note: Omit<PaidSubjectNote, 'id' | 'uploadedAt'>) => {
    const newNote: PaidSubjectNote = {
      ...note,
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setPaidNotes((prev) => [newNote, ...prev]);
  };

  const deletePaidNote = (id: string) => {
    setPaidNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const updatePaidNote = (note: PaidSubjectNote) => {
    setPaidNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
  };

  const resetAllData = () => {
    setStudents(INITIAL_STUDENTS);
    setAttendance(INITIAL_ATTENDANCE);
    setExams(INITIAL_EXAMS);
    setFees(INITIAL_FEES);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPaidNotes(INITIAL_PAID_NOTES);
    localStorage.clear();
  };

  const unreadNotifsCount = notifications.filter((n) => {
    if (role === 'parent' && currentStudentId) {
      return !n.read && (!n.studentId || n.studentId === currentStudentId);
    }
    return !n.read;
  }).length;

  return (
    <AppContext.Provider
      value={{
        role,
        language,
        currentStudentId,
        activeStudent,
        students,
        attendance,
        exams,
        fees,
        leaveRequests,
        announcements,
        notifications,
        paidNotes,
        unreadNotifsCount,
        isAdminAuthenticated,
        setRole,
        setLanguage,
        setCurrentStudentId,
        loginAsParent,
        loginAsAdmin,
        loginAsAdminWithPassword,
        logoutAdmin,
        logout,
        markAttendance,
        bulkMarkAttendance,
        dispatchAttendanceNotifications,
        addStudent,
        updateStudent,
        addExamResult,
        updateFeeStatus,
        createFeeVoucher,
        submitLeaveRequest,
        updateLeaveRequestStatus,
        addAnnouncement,
        markNotificationRead,
        markAllNotificationsRead,
        addPaidNote,
        deletePaidNote,
        updatePaidNote,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
