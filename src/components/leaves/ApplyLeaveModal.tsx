import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { applyForLeave, clearLeaveMessages } from '../../store/slices/leaveSlice';
import { X, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const { isLoading, error } = useAppSelector(state => state.leave);

  const [leaveType, setLeaveType] = useState<'annual' | 'sick' | 'casual' | 'unpaid'>('annual');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const requestedDays = calculateDays();
  const currentBalance = user?.leaveBalances?.[leaveType] ?? 0;
  const isBalanceExceeded = ['annual', 'sick', 'casual'].includes(leaveType) && requestedDays > currentBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    dispatch(clearLeaveMessages());

    if (new Date(startDate) > new Date(endDate)) {
      setValidationError('Start date must be before or equal to End date.');
      return;
    }

    if (!reason.trim()) {
      setValidationError('Please provide a brief justification for this leave request.');
      return;
    }

    if (isBalanceExceeded) {
      setValidationError(`Requested duration (${requestedDays} days) exceeds available ${leaveType} balance (${currentBalance} days).`);
      return;
    }

    const res = await dispatch(
      applyForLeave({
        leaveType,
        startDate,
        endDate,
        reason
      })
    );

    if (applyForLeave.fulfilled.match(res)) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.5 }
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Apply for Leave</h3>
              <p className="text-xs text-slate-400">Submit a formal time-off application</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {(validationError || error) && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError || error}</span>
            </div>
          )}

          {/* Leave Type */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Leave Category
            </label>
            <select
              value={leaveType}
              onChange={e => setLeaveType(e.target.value as any)}
              className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="annual">Annual Leave (Available: {user?.leaveBalances?.annual ?? 0} days)</option>
              <option value="sick">Medical / Sick Leave (Available: {user?.leaveBalances?.sick ?? 0} days)</option>
              <option value="casual">Casual Leave (Available: {user?.leaveBalances?.casual ?? 0} days)</option>
              <option value="unpaid">Unpaid Leave</option>
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                required
              />
            </div>
          </div>

          {/* Total duration calculation banner */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Calculated Duration:
            </span>
            <span className="font-bold text-slate-900 font-mono">
              {requestedDays} day{requestedDays !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Reason / Handover Notes
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="State the reason for absence and indicate colleague covering emergencies..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 placeholder:text-slate-400"
              required
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isBalanceExceeded}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
