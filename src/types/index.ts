export type Language = 'en' | 'ur';

export type UserRole = 'admin' | 'parent';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';

export type Campus = 'Rawalpindi' | 'Islamabad' | 'Sohawa';

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  urduName?: string;
  fatherName: string;
  urduFatherName?: string;
  classGrade: string; // e.g. "Class 9 - Science", "Class 10 - Matric", "F.Sc Part 1 - Pre-Medical", "ICS"
  section: string;
  campus?: Campus;
  gender: 'Male' | 'Female';
  phone: string;
  parentPhone: string;
  parentEmail?: string;
  parentUsername: string; // Unique username for Parent Portal login issued by academy
  parentPassword: string; // Secure password / PIN for Parent Portal login
  admissionDate: string;
  monthlyFee: number;
  avatarUrl?: string;
  status: 'Active' | 'Inactive';
}

export const ACADEMY_INFO = {
  name: 'Intelligence Academy',
  urduName: 'انٹیلی جنس اکیڈمی',
  phone: '03185423896',
  intlPhone: '923185423896',
  email: 'touseefali599@gmail.com',
  address: 'Holy Family Road near Tariq Ghani Clinic, Back Side Street 2, House No. NW 40, Intelligence Academy, Rawalpindi',
  urduAddress: 'ہولی فیملی روڈ نزد طارق غنی کلینک، بیک سائیڈ گلی نمبر 2، مکان نمبر NW 40، انٹیلی جنس اکیڈمی، راولپنڈی',
  campuses: ['Rawalpindi', 'Islamabad', 'Sohawa'] as Campus[],
  urduCampuses: ['راولپنڈی', 'اسلام آباد', 'سوہاوہ'],
};

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  timeIn?: string;
  remarks?: string;
  notifiedAt?: string;
  notificationChannels?: ('WhatsApp' | 'SMS' | 'Portal')[];
}

export interface SubjectScore {
  subject: string;
  urduSubject?: string;
  obtainedMarks: number;
  totalMarks: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  remarks?: string;
}

export interface ExamRecord {
  id: string;
  studentId: string;
  examTitle: string;
  urduExamTitle?: string;
  examType: 'Weekly Test' | 'Monthly Assessment' | 'Mid Term' | 'Final Term' | 'Board Mock';
  date: string; // YYYY-MM-DD
  subjectScores: SubjectScore[];
  totalObtained: number;
  totalPossible: number;
  overallPercentage: number;
  classRank?: number;
  teacherRemarks: string;
  urduTeacherRemarks?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  receiptNumber: string;
  month: string; // e.g., "October 2026"
  urduMonth?: string;
  tuitionFee: number;
  examFee: number;
  labFee: number;
  discount: number;
  totalPayable: number;
  paidAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partial';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'JazzCash' | 'EasyPaisa';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  parentName: string;
  parentPhone: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  adminRemarks?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  urduTitle: string;
  message: string;
  urduMessage: string;
  type: 'attendance' | 'fee' | 'exam' | 'announcement';
  studentId?: string;
  recipientPhone?: string;
  timestamp: string;
  read: boolean;
  channel: 'WhatsApp' | 'SMS' | 'Portal';
}

export interface Announcement {
  id: string;
  title: string;
  urduTitle: string;
  content: string;
  urduContent: string;
  category: 'Exam' | 'Holiday' | 'Fee Alert' | 'Meeting' | 'General';
  date: string;
  urgent: boolean;
}

export type NoteClass = 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';

export type NoteSubject = 'Physics' | 'Chemistry' | 'Computer' | 'Biology' | 'English' | 'Urdu';

export interface PaidSubjectNote {
  id: string;
  classGrade: NoteClass;
  subject: NoteSubject;
  isGuessPaper?: boolean;
  chapterNumber?: string | number; // e.g. "Chapter 1", "Ch 2", "Full Book"
  title: string;
  urduTitle?: string;
  description?: string;
  price: number; // 300 PKR per chapter notes
  fileName: string;
  fileSize?: string;
  fileDataUrl?: string; // Data URL or PDF link for uploaded documents
  uploadedAt: string;
  authorOrFaculty?: string;
}

export const NOTE_CLASSES: NoteClass[] = ['Class 9', 'Class 10', 'Class 11', 'Class 12'];

export const NOTE_SUBJECTS: NoteSubject[] = [
  'Physics',
  'Chemistry',
  'Computer',
  'Biology',
  'English',
  'Urdu',
];

export const NOTE_CLASSES_URDU: Record<NoteClass, string> = {
  'Class 9': 'کلاس 9 (ناہم)',
  'Class 10': 'کلاس 10 (دہم)',
  'Class 11': 'کلاس 11 (گیارہویں / فرسٹ ایئر)',
  'Class 12': 'کلاس 12 (بارہویں / سیکنڈ ایئر)',
};

export const NOTE_SUBJECTS_URDU: Record<NoteSubject, string> = {
  Physics: 'فزکس',
  Chemistry: 'کیمسٹری',
  Computer: 'کمپیوٹر سائنس',
  Biology: 'بائیولوجی',
  English: 'انگلش (انگریزی)',
  Urdu: 'اردو',
};
