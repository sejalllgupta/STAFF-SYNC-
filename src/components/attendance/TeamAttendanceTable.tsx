import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchCompanyAttendance, fetchTeamAttendance } from '../../store/slices/attendanceSlice';
import { Clock, Filter, Search, MapPin, Building2, User } from 'lucide-react';
import { Attendance } from '../../types';

interface Props {
  isHR?: boolean;
}

export const TeamAttendanceTable: React.FC<Props> = ({ isHR = false }) => {
  const dispatch = useAppDispatch();
  const { teamAttendance, companyAttendance } = useAppSelector(state => state.attendance);

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (isHR) {
      dispatch(fetchCompanyAttendance());
    } else {
      dispatch(fetchTeamAttendance());
    }
  }, [dispatch, isHR]);

  const rawRecords = isHR ? companyAttendance : teamAttendance;

  const filteredRecords = rawRecords.filter(record => {
    const matchesDept = selectedDept === 'All' || record.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || record.status === selectedStatus;
    const matchesSearch =
      record.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

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
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isHR ? 'Company-Wide Attendance Monitoring' : 'Team Attendance Board'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHR
                ? 'Real-time overview of attendance compliance across all corporate divisions'
                : 'Monitor direct reports’ daily presence, work location, and logged hours'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              {filteredRecords.length} Active Records
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search employee or department..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          {/* Department Filter (HR) */}
          {isHR && (
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Design">Design</option>
              <option value="Sales">Sales</option>
              <option value="Finance">Finance</option>
            </select>
          )}

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            <option value="All">All Statuses</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="half_day">Half Day</option>
            <option value="absent">Absent</option>
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/75 text-slate-500 font-semibold border-b border-slate-200/80">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Clock In</th>
              <th className="py-3 px-4">Clock Out</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No attendance records matching the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredRecords.map(record => (
                <tr key={record._id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                        {record.userName.charAt(0)}
                      </div>
                      <span>{record.userName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                    {record.department}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500">
                    {record.date}
                  </td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap text-slate-800">
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
                      : 'Active Now'}
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
