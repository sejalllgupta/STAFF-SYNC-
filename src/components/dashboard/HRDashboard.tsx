import React from 'react';
import { useAppSelector } from '../../store';
import { StatCard } from '../common/StatCard';
import { TeamAttendanceTable } from '../attendance/TeamAttendanceTable';
import { LeaveRequestsTable } from '../leaves/LeaveRequestsTable';
import { AnnouncementsFeed } from '../announcements/AnnouncementsFeed';
import { EmployeeDirectory } from '../employees/EmployeeDirectory';
import {
  Users,
  CheckCircle2,
  CalendarCheck,
  Megaphone,
  Plus,
  BarChart3,
  UserPlus
} from 'lucide-react';

interface Props {
  onOpenAddEmployee: () => void;
  onOpenCreateAnnouncement: () => void;
  onOpenAddTraining: () => void;
  onViewReports: () => void;
}

export const HRDashboard: React.FC<Props> = ({
  onOpenAddEmployee,
  onOpenCreateAnnouncement,
  onOpenAddTraining,
  onViewReports
}) => {
  const employees = useAppSelector(state => state.employee.employees);
  const allLeaves = useAppSelector(state => state.leave.allLeaves);
  const companyAttendance = useAppSelector(state => state.attendance.companyAttendance);

  const pendingLeaves = allLeaves.filter(l => l.status === 'pending');
  const today = new Date().toISOString().split('T')[0];
  const activeToday = companyAttendance.filter(a => a.date === today && a.status === 'present').length;
  const totalEmployees = employees.length || 7;
  const attendanceRate = totalEmployees > 0 ? Math.round((activeToday / totalEmployees) * 100) : 80;

  return (
    <div className="space-y-6">
      {/* Top HR Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Organization Headcount"
          value={totalEmployees}
          subtitle="Active corporate accounts"
          icon={Users}
          color="indigo"
          trend={{ value: '+2 new this quarter', isPositive: true }}
        />
        <StatCard
          title="Today's Attendance Rate"
          value={`${attendanceRate}%`}
          subtitle={`${activeToday} clocked in on time`}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Pending Leave Review"
          value={pendingLeaves.length}
          subtitle="Across all departments"
          icon={CalendarCheck}
          color="amber"
        />
        <StatCard
          title="Broadcasted Notices"
          value="4 Active"
          subtitle="Company bulletins published"
          icon={Megaphone}
          color="purple"
        />
      </div>

      {/* Quick Action Command Center for HR */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2 text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            HR Personnel Command Central
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Manage global onboarding, company broadcast bulletins, and executive compliance reports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddEmployee}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Onboard Employee</span>
          </button>

          <button
            onClick={onOpenCreateAnnouncement}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Post Notice</span>
          </button>

          <button
            onClick={onViewReports}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Executive Reports</span>
          </button>
        </div>
      </div>

      {/* Company-Wide Leave Queue */}
      <div>
        <LeaveRequestsTable viewMode="all" />
      </div>

      {/* Company-Wide Attendance Tracking */}
      <div>
        <TeamAttendanceTable isHR={true} />
      </div>

      {/* Announcements and Quick Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <AnnouncementsFeed
            isHR={true}
            onOpenCreateModal={onOpenCreateAnnouncement}
          />
        </div>
        <div className="lg:col-span-6">
          <EmployeeDirectory
            isHR={true}
            onOpenAddModal={onOpenAddEmployee}
          />
        </div>
      </div>
    </div>
  );
};
