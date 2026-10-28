import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchMyAttendanceHistory } from '../../store/slices/attendanceSlice';
import { Clock, Calendar, CheckCircle, AlertCircle, MapPin } from 'lucide-react';

export const AttendanceHistoryTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useAppSelector(state => state.attendance.myHistory);

  useEffect(() => {
    dispatch(fetchMyAttendanceHistory());
  }, [dispatch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'late':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'half_day':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'absent':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Attendance Log History</h3>
            <p className="text-xs text-slate-500">Your historical attendance records and active hours</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
          {history.length} records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Clock In</th>
              <th className="py-3 px-4">Clock Out</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Notes / Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {history.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No attendance records found. Clock in to begin your log!
                </td>
              </tr>
            ) : (
              history.map(record => (
                <tr key={record._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    {record.date}
                  </td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap">
                    {new Date(record.clockIn).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap text-slate-500">
                    {record.clockOut
                      ? new Date(record.clockOut).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '— (Active)'}
                  </td>
                  <td className="py-3 px-4 font-semibold whitespace-nowrap">
                    {record.durationHours > 0 ? `${record.durationHours} hrs` : 'In Progress'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {record.workLocation}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium border capitalize ${getStatusBadge(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate text-slate-500">
                    {record.notes || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
