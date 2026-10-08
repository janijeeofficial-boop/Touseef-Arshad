import { Language } from '../types';

export const t = (lang: Language) => {
  const isUrdu = lang === 'ur';

  return {
    academyName: isUrdu ? 'انٹیلی جنس اکیڈمی' : 'Intelligence Academy',
    academyTagline: isUrdu ? 'معیاری تعلیم و طلباء کی ہمہ جہت تربیت کا مرکز' : 'Excellence in Coaching & Academic Tracking',
    portalSubtitle: isUrdu ? 'طلباء پروگریس، فیس مینجمنٹ اور والدین پورٹل' : 'Student Progress, Fees & Parent Portal',
    
    // Roles & Navigation
    adminPortal: isUrdu ? 'اکیڈمی ایڈمن پورٹل' : 'Academy Admin Portal',
    parentPortal: isUrdu ? 'والدین پورٹل' : 'Parent Portal',
    switchRole: isUrdu ? 'پورٹل تبدیل کریں' : 'Switch Portal',
    loginAsParent: isUrdu ? 'والدین لاگ ان' : 'Parent Login',
    loginAsAdmin: isUrdu ? 'ایڈمن کنٹرول' : 'Admin Console',
    logout: isUrdu ? 'لاگ آؤٹ' : 'Logout',
    
    // Tabs
    dashboard: isUrdu ? 'ڈیش بورڈ' : 'Dashboard',
    students: isUrdu ? 'طلباء کی فہرست' : 'Students Roster',
    attendance: isUrdu ? 'روزانہ حاضری' : 'Daily Attendance',
    dailyAttendance: isUrdu ? 'روزانہ حاضری' : 'Daily Attendance',
    academicProgress: isUrdu ? 'تعلیمی کارکردگی و امتحانات' : 'Academic Progress',
    feeManagement: isUrdu ? 'فیس مینجمنٹ' : 'Fee Management',
    announcements: isUrdu ? 'اعلانات و نوٹسز' : 'Notices & Circulars',
    paidNotes: isUrdu ? 'پیڈ تمام مضامین کے نوٹس' : 'Paid All Subject Notes',
    notifications: isUrdu ? 'نوٹیفیکیشنز' : 'Notifications',
    leaveRequests: isUrdu ? 'چھٹی کی درخواستیں' : 'Leave Requests',

    // Attendance
    markAttendance: isUrdu ? 'حاضری درج کریں' : 'Mark Attendance',
    attendanceDate: isUrdu ? 'حاضری کی تاریخ' : 'Attendance Date',
    present: isUrdu ? 'حاضر' : 'Present',
    absent: isUrdu ? 'غیر حاضر' : 'Absent',
    late: isUrdu ? 'لیٹ / تاخیر' : 'Late',
    leave: isUrdu ? 'رخصت / چھٹی' : 'Leave',
    markAllPresent: isUrdu ? 'سب کو حاضر نشان زد کریں' : 'Mark All Present',
    sendAttendanceAlerts: isUrdu ? 'والدین کو حاضری نوٹیفیکیشن بھیجیں' : 'Send Daily Attendance Alerts',
    dispatchViaWhatsApp: isUrdu ? 'واٹس ایپ پر میسج بھیجیں' : 'Dispatch via WhatsApp',
    alertHistory: isUrdu ? 'بھیجے گئے نوٹیفیکیشنز کی تفصیل' : 'Alert Dispatch History',
    attendanceRate: isUrdu ? 'مجموعی حاضری کی شرح' : 'Attendance Rate',
    
    // Academic Progress
    testResults: isUrdu ? 'امتحانی نتائج' : 'Exam & Test Results',
    addTestResult: isUrdu ? 'نیا امتحانی نتیجہ درج کریں' : 'Add Exam Score',
    viewReportCard: isUrdu ? 'رپورٹ کارڈ دیکھیں' : 'View Report Card',
    printReportCard: isUrdu ? 'پرنٹ رپورٹ کارڈ' : 'Print Report Card',
    overallMarks: isUrdu ? 'حاصل کردہ نمبر' : 'Total Obtained',
    percentage: isUrdu ? 'فیصد' : 'Percentage',
    grade: isUrdu ? 'گریڈ' : 'Grade',
    classRank: isUrdu ? 'کلاس میں پوزیشن' : 'Class Rank',
    teacherRemarks: isUrdu ? 'استاد کی آراء و ہدایات' : "Teacher's Remarks",
    strengthsWeaknesses: isUrdu ? 'مضامین کی کارکردگی' : 'Subject Performance',

    // Fees
    totalCollected: isUrdu ? 'وصول شدہ فیس' : 'Collected Fees',
    pendingDues: isUrdu ? 'بقایاجات فیس' : 'Pending Dues',
    generateVoucher: isUrdu ? 'نیا فیس واؤچر بنائیں' : 'Generate Fee Voucher',
    collectFee: isUrdu ? 'فیس وصول کریں' : 'Record Payment',
    feeReceipt: isUrdu ? 'فیس رسید' : 'Fee Receipt',
    printReceipt: isUrdu ? 'رسید پرنٹ کریں' : 'Print Voucher',
    paid: isUrdu ? 'ادا شدہ' : 'Paid',
    pending: isUrdu ? 'باقی' : 'Pending',
    overdue: isUrdu ? 'تاخیر شدہ' : 'Overdue',
    partial: isUrdu ? 'جزوی ادا شدہ' : 'Partial',
    dueDate: isUrdu ? 'آخری تاریخ' : 'Due Date',

    // Parent Portal specific
    welcomeParent: isUrdu ? 'خوش آمدید، محترم والدین' : 'Welcome, Respected Parent',
    childOverview: isUrdu ? 'بچے کی مجموعی تعلیمی کارکردگی' : "Child's Academic Overview",
    attendanceSummary: isUrdu ? 'حاضری کا خلاصہ' : 'Attendance Summary',
    recentExams: isUrdu ? 'حالیہ امتحانات کے نتائج' : 'Recent Exam Performance',
    feeStatus: isUrdu ? 'فیس کی موجودہ صورتحال' : 'Fee Status & Slips',
    submitLeave: isUrdu ? 'چھٹی کی درخواست جمع کرائیں' : 'Apply for Student Leave',
    academyHelpline: isUrdu ? 'اکیڈمی ہیلپ لائن' : 'Academy Helpline',
    selectChild: isUrdu ? 'طالب علم منتخب کریں' : 'Select Student',
    
    // Actions & Common
    filterClass: isUrdu ? 'کلاس فلٹر' : 'Filter Class',
    allClasses: isUrdu ? 'تمام کلاسز' : 'All Classes',
    searchStudent: isUrdu ? 'طالب علم کا نام یا رول نمبر تلاش کریں...' : 'Search student by name or roll number...',
    actions: isUrdu ? 'کارروائی' : 'Actions',
    close: isUrdu ? 'بند کریں' : 'Close',
    save: isUrdu ? 'محفوظ کریں' : 'Save Changes',
    cancel: isUrdu ? 'منسوخ کریں' : 'Cancel',
    success: isUrdu ? 'کامیاب' : 'Success',
    currency: 'PKR',
    currencyUrdu: 'روپے',
  };
};
