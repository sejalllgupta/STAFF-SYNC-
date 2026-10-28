import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchMyLeaves,
  fetchTeamLeaves,
  fetchAllLeaves,
  updateLeaveStatusThunk
} from '../../store/slices/leaveSlice';
import {
  CalendarCheck,
  Check,
  X,
  AlertCircle,
  Clock,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';
import { LeaveRequest } from '../../types';
import confetti from 'canvas-confetti';

interface Props {
  viewMode: 'my' | 'team' | 'all';
}

export const LeaveRequestsTable: React.FC<Props> = ({ viewMode }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const { myLeaves, teamLeaves, allLeaves, successMessage } = useAppSelector(state => state.leave);

  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [actionType, setActionType] = useState<'approved' | 'rejected' | null>(null);
  const [reviewerComment, setReviewerComment] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    if (viewMode === 'my') {
      dispatch(fetchMyLeaves());
    } else if (viewMode === 'team') {
      dispatch(fetchTeamLeaves());
    } else {
      dispatch(fetchAllLeaves());
    }
  }, [dispatch, viewMode]);

  const rawLeaves =
    viewMode === 'my' ? myLeaves : viewMode === 'team' ? teamLeaves : allLeaves;

  const filteredLeaves = rawLeaves.filter(leave => {
    if (statusFilter === 'All') return true;
    return leave.status === statusFilter;
  });

  const handleOpenActionModal = (leave: LeaveRequest, action: 'approved' | 'rejected') => {
    setSelectedLeave(leave);
    setActionType(action);
    setReviewerComment(
      action === 'approved'
        ? `Approved by ${user?.name}. Enjoy your time off.`
        : 'Please reschedule due to project milestone overlap.'
    );
  };

  const handleConfirmAction = async () => {
    if (!selectedLeave || !actionType) return;

    const res = await dispatch(
      updateLeaveStatusThunk({
        id: selectedLeave._id,
        status: actionType,
        comments: reviewerComment
      })
    );

    if (updateLeaveStatusThunk.fulfilled.match(res)) {
      if (actionType === 'approved') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 }
        });
      }
      setSelectedLeave(null);
      setActionType(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2
        };
      case 'rejected':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle
        };
      case 'cancelled':
        return {
          bg: 'bg-slate-100 text-slate-600 border-slate-200',
          icon: X
        };
      case 'pending':
      default:
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header and status filter */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {viewMode === 'my'
                ? 'My Leave History'
                : viewMode === 'team'
                ? 'Team Leave Approvals'
                : 'Company-Wide Leave Roster'}
            </h3>
            <p className="text-xs text-slate-500">
              {viewMode === 'my'
                ? 'Track your applied leaves, approval status, and manager feedback'
                : 'Review, approve, or reject employee leave applications'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-200/80">
            <tr>
              {viewMode !== 'my' && <th className="py-3 px-4">Applicant</th>}
              <th className="py-3 px-4">Leave Type</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Dates</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Reviewer Remarks</th>
              {viewMode !== 'my' && <th className="py-3 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan={viewMode !== 'my' ? 8 : 6} className="py-8 text-center text-slate-400">
                  No leave requests found in this view.
                </td>
              </tr>
            ) : (
              filteredLeaves.map(leave => {
                const badge = getStatusBadge(leave.status);
                const BadgeIcon = badge.icon;
                return (
                  <tr key={leave._id} className="hover:bg-slate-50/60 transition-colors">
                    {viewMode !== 'my' && (
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{leave.userName}</div>
                        <div className="text-[11px] text-slate-500">{leave.department}</div>
                      </td>
                    )}
                    <td className="py-3 px-4 whitespace-nowrap font-medium capitalize text-slate-900">
                      {leave.leaveType}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-semibold">
                      {leave.totalDays} day{leave.totalDays !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600">
                      {leave.startDate} → {leave.endDate}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-medium border capitalize ${badge.bg}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-500">
                      {leave.reviewerComments ? (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
                          <span title={leave.reviewerComments}>{leave.reviewerComments}</span>
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    {viewMode !== 'my' && (
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {leave.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenActionModal(leave, 'approved')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleOpenActionModal(leave, 'rejected')}
                              className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1 border border-rose-200 transition-colors cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Processed</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Review Confirmation Modal */}
      {selectedLeave && actionType && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {actionType === 'approved' ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Approve Leave Request
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Reject Leave Request
                </>
              )}
            </h4>

            <p className="text-xs text-slate-600">
              You are about to {actionType} the {selectedLeave.leaveType} leave request for{' '}
              <strong>{selectedLeave.userName}</strong> ({selectedLeave.totalDays} day
              {selectedLeave.totalDays !== 1 ? 's' : ''} from {selectedLeave.startDate} to{' '}
              {selectedLeave.endDate}).
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Reviewer Feedback / Comments
              </label>
              <textarea
                value={reviewerComment}
                onChange={e => setReviewerComment(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                placeholder="Optional notes for the applicant..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedLeave(null);
                  setActionType(null);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
                  actionType === 'approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {actionType === 'approved' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
