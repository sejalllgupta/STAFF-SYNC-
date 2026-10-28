import React from 'react';
import { useAppSelector } from '../../store';
import { StatCard } from '../common/StatCard';
import { TeamAttendanceTable } from '../attendance/TeamAttendanceTable';
import { LeaveRequestsTable } from '../leaves/LeaveRequestsTable';
import { AnnouncementsFeed } from '../announcements/AnnouncementsFeed';
import { PerformanceReviewsList } from '../performance/PerformanceReviewsList';
import { Users, Clock, CalendarCheck, Award } from 'lucide-react';

interface Props {
  onOpenCreateReview: () => void;
}

export const ManagerDashboard: React.FC<Props> = ({ onOpenCreateReview }) => {
  const user = useAppSelector(state => state.auth.user);
  const teamAttendance = useAppSelector(state => state.attendance.teamAttendance);
  const teamLeaves = useAppSelector(state => state.leave.teamLeaves);

  const pendingLeaves = teamLeaves.filter(l => l.status === 'pending');
  const today = new Date().toISOString().split('T')[0];
  const presentToday = teamAttendance.filter(a => a.date === today && a.status === 'present');

  return (
    <div className="space-y-6">
      {/* Manager Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Team Present Today"
          value={presentToday.length}
          subtitle={`Department: ${user?.department}`}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Pending Leave Approvals"
          value={pendingLeaves.length}
          subtitle="Requests requiring manager review"
          icon={CalendarCheck}
          color="amber"
        />
        <StatCard
          title="Team Members Logged"
          value={teamAttendance.length}
          subtitle="Recent active records"
          icon={Clock}
          color="emerald"
        />
        <StatCard
          title="Supervisory Domain"
          value={user?.department || 'Engineering'}
          subtitle="Direct operational division"
          icon={Award}
          color="purple"
        />
      </div>

      {/* Primary Manager Actions: Team Leave Approvals */}
      <div>
        <LeaveRequestsTable viewMode="team" />
      </div>

      {/* Team Attendance Board */}
      <div>
        <TeamAttendanceTable isHR={false} />
      </div>

      {/* Team Performance and Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <PerformanceReviewsList
            canReview={true}
            onOpenCreateModal={onOpenCreateReview}
          />
        </div>
        <div className="lg:col-span-5">
          <AnnouncementsFeed />
        </div>
      </div>
    </div>
  );
};
