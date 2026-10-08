import React from 'react';
import { Student, FeeRecord, Language } from '../../types';
import { t } from '../../utils/translations';
import { Printer, X, Receipt, CheckCircle, Clock } from 'lucide-react';
import logoUrl from '../../assets/images/academy_official_logo_1791469588319.jpg';

interface PrintableFeeReceiptProps {
  student: Student;
  fee: FeeRecord;
  language: Language;
  onClose: () => void;
}

export const PrintableFeeReceipt: React.FC<PrintableFeeReceiptProps> = ({
  student,
  fee,
  language,
  onClose,
}) => {
  const tr = t(language);
  const isUrdu = language === 'ur';

  const handlePrint = () => {
    window.print();
  };

  const renderChallanCopy = (copyType: string) => (
    <div className="border border-slate-300 rounded-lg p-5 bg-white text-xs text-slate-800 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <img
              src={logoUrl}
              alt="Logo"
              className="w-10 h-10 object-cover rounded-full border border-amber-400/50 shadow-2xs"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-bold text-slate-900 tracking-tight leading-none text-sm">
                INTELLIGENCE ACADEMY
              </h4>
              <p className="text-[10px] text-slate-500 font-urdu mt-0.5">انٹیلی جنس اکیڈمی - فیس واؤچر</p>
              <p className="text-[9px] text-slate-400">
                Holy Family Rd near Tariq Ghani Clinic, St 2, House NW 40, Rawalpindi
              </p>
              <p className="text-[8px] text-slate-400">
                Campuses: Rawalpindi · Islamabad · Sohawa · Helpline: 03185423896
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700 block">
              {copyType}
            </span>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">
              No: {fee.receiptNumber}
            </span>
          </div>
        </div>

        {/* Student & Invoice Meta */}
        <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 mb-3 text-[11px]">
          <div>
            <span className="text-slate-500 block">Student:</span>
            <span className="font-semibold text-slate-900">{student.name}</span>
            <span className="text-slate-500 block font-mono text-[10px]">Roll #{student.rollNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 block">Class:</span>
            <span className="font-medium text-slate-900">{student.classGrade}</span>
            <span className="text-slate-500 block text-[10px]">Month: {fee.month}</span>
          </div>
        </div>

        {/* Fees Breakdown Table */}
        <div className="border border-slate-200 rounded overflow-hidden mb-3">
          <table className="w-full text-[11px]">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-2.5 py-1.5 text-left">Description</th>
                <th className="px-2.5 py-1.5 text-right">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-2.5 py-1.5 text-slate-700">Tuition Fee (ماہانہ فیس)</td>
                <td className="px-2.5 py-1.5 text-right font-mono tabular-nums">{fee.tuitionFee.toLocaleString()}</td>
              </tr>
              {fee.examFee > 0 && (
                <tr>
                  <td className="px-2.5 py-1.5 text-slate-700">Examination & Test Material</td>
                  <td className="px-2.5 py-1.5 text-right font-mono tabular-nums">{fee.examFee.toLocaleString()}</td>
                </tr>
              )}
              {fee.labFee > 0 && (
                <tr>
                  <td className="px-2.5 py-1.5 text-slate-700">Science Lab & IT Charges</td>
                  <td className="px-2.5 py-1.5 text-right font-mono tabular-nums">{fee.labFee.toLocaleString()}</td>
                </tr>
              )}
              {fee.discount > 0 && (
                <tr className="text-emerald-700">
                  <td className="px-2.5 py-1.5">Scholarship Concession (رعایت)</td>
                  <td className="px-2.5 py-1.5 text-right font-mono tabular-nums">-{fee.discount.toLocaleString()}</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
              <tr>
                <td className="px-2.5 py-1.5 text-slate-900">Total Payable Amount</td>
                <td className="px-2.5 py-1.5 text-right font-mono tabular-nums text-slate-950 text-xs">
                  PKR {fee.totalPayable.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between p-2 rounded border border-slate-200 mb-3 bg-slate-50/50">
          <div className="flex items-center gap-1.5">
            {fee.status === 'Paid' ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle className="w-3.5 h-3.5" /> PAID (مکمل ادا شدہ)
              </span>
            ) : (
              <span className="text-amber-700 font-bold flex items-center gap-1 text-[11px]">
                <Clock className="w-3.5 h-3.5" /> DUE / PENDING (بقایا)
              </span>
            )}
          </div>
          <div className="text-right text-[10px] text-slate-500">
            Due Date: <span className="font-semibold text-slate-700">{fee.dueDate}</span>
          </div>
        </div>

        {fee.paidDate && (
          <div className="text-[10px] text-slate-500 mb-2">
            Payment Date: {fee.paidDate} · Method: {fee.paymentMethod || 'Cash'}
          </div>
        )}
      </div>

      {/* Signature */}
      <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-500">
        <div>
          <span>Meezan Bank A/C: 0102-1234567890</span>
          <span className="block font-mono font-medium text-slate-700">JazzCash / EasyPaisa: 03185423896</span>
          <span className="block text-[9px] text-slate-400">Email: touseefali599@gmail.com</span>
        </div>
        <div className="text-right">
          <div className="w-24 border-b border-dashed border-slate-400 mb-1" />
          <span>Accounts Officer</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200">
        {/* Controls - Hidden during print */}
        <div className="no-print bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-semibold text-slate-800">
              {isUrdu ? 'آفیشل اکیڈمی فیس رسید / چالان' : 'Official Academy Fee Voucher / Challan'}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{tr.printReceipt}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area - 2 Copies (Student Copy & Academy Copy) */}
        <div className="print-area p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderChallanCopy('Student Copy (طالب علم کی نقل)')}
            {renderChallanCopy('Academy Copy (اکیڈمی ریکارڈ کی نقل)')}
          </div>
        </div>
      </div>
    </div>
  );
};
