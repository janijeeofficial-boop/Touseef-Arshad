import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { FeeRecord, Student } from '../../types';
import {
  CreditCard,
  Plus,
  Printer,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  DollarSign,
  Send,
  X,
  ArrowLeft,
} from 'lucide-react';
import { PrintableFeeReceipt } from '../common/PrintableFeeReceipt';

interface FeeManagerProps {
  onBack?: () => void;
}

export const FeeManager: React.FC<FeeManagerProps> = ({ onBack }) => {
  const { students, fees, updateFeeStatus, createFeeVoucher, language } = useApp();
  const tr = t(language);
  const isUrdu = language === 'ur';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('October 2026');

  const [printingFee, setPrintingFee] = useState<{ student: Student; fee: FeeRecord } | null>(null);
  const [payingFee, setPayingFee] = useState<FeeRecord | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<FeeRecord['paymentMethod']>('Cash');

  const [isNewVoucherOpen, setIsNewVoucherOpen] = useState(false);
  const [newVoucherStudentId, setNewVoucherStudentId] = useState(students[0]?.id || '');
  const [newTuition, setNewTuition] = useState(6500);
  const [newExamFee, setNewExamFee] = useState(500);
  const [newLabFee, setNewLabFee] = useState(500);
  const [newDiscount, setNewDiscount] = useState(0);
  const [newDueDate, setNewDueDate] = useState('2026-10-10');

  // Filter fees
  const filteredFees = fees.filter((fee) => {
    const student = students.find((s) => s.id === fee.studentId);
    if (!student) return false;

    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || fee.status === selectedStatus;
    const matchesMonth = selectedMonth === 'All' || fee.month === selectedMonth;

    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Calculate statistics
  const totalBilled = filteredFees.reduce((sum, f) => sum + f.totalPayable, 0);
  const totalCollected = filteredFees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalPending = totalBilled - totalCollected;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const handleOpenPayment = (fee: FeeRecord) => {
    setPayingFee(fee);
    setPayAmount(fee.totalPayable - fee.paidAmount);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingFee) return;

    const newTotalPaid = payingFee.paidAmount + Number(payAmount);
    const newStatus: FeeRecord['status'] = newTotalPaid >= payingFee.totalPayable ? 'Paid' : 'Partial';

    updateFeeStatus(payingFee.id, newStatus, newTotalPaid, payMethod);
    setPayingFee(null);
  };

  const handleCreateVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVoucherStudentId) return;

    const totalPayable = newTuition + newExamFee + newLabFee - newDiscount;

    createFeeVoucher({
      studentId: newVoucherStudentId,
      month: selectedMonth,
      tuitionFee: newTuition,
      examFee: newExamFee,
      labFee: newLabFee,
      discount: newDiscount,
      totalPayable,
      paidAmount: 0,
      status: 'Pending',
      dueDate: newDueDate,
    });

    setIsNewVoucherOpen(false);
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

      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-lg font-bold text-slate-900 ${isUrdu ? 'font-urdu' : ''}`}>
            {tr.feeManagement}
          </h2>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? 'اکیڈمی فیس کلیکشن، ماہانہ چالان، واٹس ایپ بقایاجات ریمائنڈرز اور آفیشل رسیدیں جاری کریں۔'
              : 'Manage tuition billing, payment collection, fee challan generation, and automated WhatsApp reminders.'}
          </p>
        </div>

        <button
          onClick={() => setIsNewVoucherOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>{tr.generateVoucher}</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-xs block mb-1">Total Billed</span>
          <div className="text-lg font-bold font-mono text-slate-900 tabular-nums">
            PKR {totalBilled.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 block">{filteredFees.length} vouchers</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
          <span className="text-emerald-700 text-xs block mb-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> {tr.totalCollected}
          </span>
          <div className="text-lg font-bold font-mono text-emerald-800 tabular-nums">
            PKR {totalCollected.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-mono block">{collectionRate}% Recovery</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-2xs">
          <span className="text-rose-700 text-xs block mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {tr.pendingDues}
          </span>
          <div className="text-lg font-bold font-mono text-rose-800 tabular-nums">
            PKR {totalPending.toLocaleString()}
          </div>
          <span className="text-[10px] text-rose-600 block">Uncollected</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-xs block mb-1">Recovery Rate</span>
          <div className="text-lg font-bold font-mono text-indigo-700 tabular-nums">
            {collectionRate}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{ width: `${collectionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by student name, roll number, voucher #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-slate-900 focus:outline-hidden w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 w-full sm:w-auto">
          <span className="text-slate-500 whitespace-nowrap">Month:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent font-medium text-slate-900 focus:outline-hidden"
          >
            <option value="All">All Months</option>
            <option value="October 2026">October 2026</option>
            <option value="September 2026">September 2026</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 w-full sm:w-auto">
          <span className="text-slate-500 whitespace-nowrap">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent font-medium text-slate-900 focus:outline-hidden"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid Only</option>
            <option value="Pending">Pending Only</option>
            <option value="Partial">Partial</option>
          </select>
        </div>
      </div>

      {/* Fees Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Receipt / Voucher #</th>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3 text-right">Payable</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFees.map((fee) => {
                const student = students.find((s) => s.id === fee.studentId);
                if (!student) return null;

                const isPaid = fee.status === 'Paid';
                const isPartial = fee.status === 'Partial';
                const isPending = fee.status === 'Pending';

                const reminderMsg = `Intelligence Academy Fee Notice: Respected Parent of ${student.name} (Roll #${student.rollNumber}), monthly fee for ${fee.month} of PKR ${fee.totalPayable} is due on ${fee.dueDate}. Please clear dues via JazzCash/Bank.`;
                const whatsappUrl = `https://wa.me/${student.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(reminderMsg)}`;

                return (
                  <tr key={fee.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-800">
                      {fee.receiptNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Roll #{student.rollNumber}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {student.classGrade}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      PKR {fee.totalPayable.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-emerald-700">
                      PKR {fee.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isPaid
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : isPartial
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {fee.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-mono">
                      {fee.dueDate}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isPaid && (
                          <button
                            onClick={() => handleOpenPayment(fee)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-[11px] shadow-2xs"
                          >
                            Collect
                          </button>
                        )}
                        <button
                          onClick={() => setPrintingFee({ student, fee })}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                          title="Print Official Challan Voucher"
                        >
                          <Printer className="w-4 h-4 text-indigo-600" />
                        </button>
                        {!isPaid && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Send WhatsApp Fee Reminder"
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {payingFee && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Record Fee Payment ({payingFee.receiptNumber})
              </h3>
              <button
                onClick={() => setPayingFee(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Amount Received (PKR) *
                </label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-indigo-700 focus:bg-white focus:outline-indigo-500"
                />
                <span className="text-[10px] text-slate-400">
                  Total remaining: PKR {payingFee.totalPayable - payingFee.paidAmount}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Payment Method *
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
                >
                  <option value="Cash">Cash at Counter</option>
                  <option value="Bank Transfer">Meezan Bank Online Transfer</option>
                  <option value="JazzCash">JazzCash Mobile Wallet</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPayingFee(null)}
                  className="px-4 py-2 text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
                >
                  Confirm & Mark Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Voucher Modal */}
      {isNewVoucherOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Generate New Monthly Fee Voucher</h3>
              <button
                onClick={() => setIsNewVoucherOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucherSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Student *</label>
                <select
                  value={newVoucherStudentId}
                  onChange={(e) => setNewVoucherStudentId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-indigo-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNumber}) - {s.classGrade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tuition Fee (PKR)</label>
                  <input
                    type="number"
                    value={newTuition}
                    onChange={(e) => setNewTuition(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Exam/Test Fee</label>
                  <input
                    type="number"
                    value={newExamFee}
                    onChange={(e) => setNewExamFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lab / Computer</label>
                  <input
                    type="number"
                    value={newLabFee}
                    onChange={(e) => setNewLabFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Scholarship Discount</label>
                  <input
                    type="number"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-emerald-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-slate-100 font-semibold text-slate-900">
                <span>Total Payable:</span>
                <span className="font-mono text-indigo-700 text-sm">
                  PKR {newTuition + newExamFee + newLabFee - newDiscount}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewVoucherOpen(false)}
                  className="px-4 py-2 text-slate-600 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
                >
                  Issue Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print Receipt Dialog */}
      {printingFee && (
        <PrintableFeeReceipt
          student={printingFee.student}
          fee={printingFee.fee}
          language={language}
          onClose={() => setPrintingFee(null)}
        />
      )}
    </div>
  );
};
