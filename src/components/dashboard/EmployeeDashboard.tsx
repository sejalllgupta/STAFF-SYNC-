import React from 'react';
import { useAppSelector } from '../../store';
import { AttendanceClockCard } from '../attendance/AttendanceClockCard';
import { LeaveBalanceCards } from '../leaves/LeaveBalanceCards';
import { LeaveRequestsTable } from '../leaves/LeaveRequestsTable';
import { AnnouncementsFeed } from '../announcements/AnnouncementsFeed';
import { TrainingGrid } from '../training/TrainingGrid';
import { PerformanceReviewsList } from '../performance/PerformanceReviewsList';

interface Props {
  onOpenApplyLeave: () => void;
}

export const EmployeeDashboard: React.FC<Props> = ({ onOpenApplyLeave }) => {
  const user = useAppSelector(state => state.auth.user);

  return (
    <div className="space-y-6">
      {/* Top Section: Attendance Clock & Leave Quota Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <AttendanceClockCard />
        </div>
        <div className="lg:col-span-6 flex flex-col justify-between">
          <LeaveBalanceCards onOpenApplyModal={onOpenApplyLeave} />
        </div>
      </div>

      {/* Middle Section: Personal Leaves & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <LeaveRequestsTable viewMode="my" />
        </div>
        <div className="lg:col-span-5">
          <AnnouncementsFeed />
        </div>
      </div>

      {/* Bottom Section: Training & Performance Progress */}
      <div className="space-y-6">
        <TrainingGrid />
        <PerformanceReviewsList canReview={false} />
      </div>
    </div>
  );
};
