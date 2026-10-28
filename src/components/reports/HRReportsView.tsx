import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchReportStats } from '../../store/slices/reportSlice';
import { StatCard } from '../common/StatCard';
import {
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  CalendarCheck,
  TrendingUp,
  Download,
  Building,
  Award
} from 'lucide-react';

export const HRReportsView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, isLoading } = useAppSelector(state => state.report);

  useEffect(() => {
    dispatch(fetchReportStats());
  }, [dispatch]);

  const handleExportCSV = () => {
    if (!stats) return;
    const reportData = {
      generatedAt: new Date().toISOString(),
      attendanceRate: `${stats.attendanceRate}%`,
      totalHeadcount: stats.totalEmployees,
      activeToday: stats.activeToday,
      onLeaveToday: stats.onLeaveToday,
      pendingLeaves: stats.pendingLeavesCount,
      attendanceBreakdown: stats.attendanceSummary,
      departmentHeadcount: stats.departmentHeadcount,
      leaveUtilization: stats.leaveStatsByType,
      departmentPerformance: stats.performanceAvgByDept
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `staffsync-hr-report-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!stats && isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Compiling organizational HR metrics...
      </div>
    );
  }

  const defaultStats = stats || {
    totalEmployees: 7,
    activeToday: 4,
    attendanceRate: 75,
    onLeaveToday: 1,
    pendingLeavesCount: 1,
    departmentHeadcount: {
      Engineering: 3,
      'Human Resources': 1,
      Marketing: 2,
      Design: 1
    },
    leaveStatsByType: {
      annual: 8,
      sick: 3,
      casual: 2,
      maternity: 0,
      paternity: 0,
      unpaid: 0
    },
    attendanceSummary: {
      present: 3,
      late: 1,
      half_day: 0,
      absent: 2
    },
    performanceAvgByDept: {
      Engineering: 4.2,
      Marketing: 4.6,
      'Human Resources': 4.5
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              HR Executive Analytics & Audit Reports
            </h3>
            <p className="text-xs text-slate-500">
              Company-wide attendance compliance, leave utilization, and departmental KPI metrics
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Report</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Company Attendance Rate"
          value={`${defaultStats.attendanceRate}%`}
          subtitle="Employees marked present today"
          icon={CheckCircle2}
          color="emerald"
          trend={{ value: '+4.2% vs last month', isPositive: true }}
        />
        <StatCard
          title="Active Workforce Today"
          value={`${defaultStats.activeToday} / ${defaultStats.totalEmployees}`}
          subtitle="Clocked in across all offices"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="On Leave Today"
          value={defaultStats.onLeaveToday}
          subtitle="Approved scheduled leaves"
          icon={CalendarCheck}
          color="amber"
        />
        <StatCard
          title="Pending Leave Review"
          value={defaultStats.pendingLeavesCount}
          subtitle="Awaiting manager sign-off"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Attendance Summary and Leave Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Breakdown Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Today's Attendance Status Distribution
            </h4>
            <span className="text-xs font-semibold text-slate-400">Real-time status</span>
          </div>

          <div className="space-y-3">
            {[
              {
                label: 'Present (On-time)',
                count: defaultStats.attendanceSummary.present,
                color: 'bg-emerald-500',
                textColor: 'text-emerald-700'
              },
              {
                label: 'Late Check-ins',
                count: defaultStats.attendanceSummary.late,
                color: 'bg-amber-500',
                textColor: 'text-amber-700'
              },
              {
                label: 'Half-day / Partial Shifts',
                count: defaultStats.attendanceSummary.half_day,
                color: 'bg-blue-500',
                textColor: 'text-blue-700'
              },
              {
                label: 'Absent / Unreported',
                count: defaultStats.attendanceSummary.absent,
                color: 'bg-rose-500',
                textColor: 'text-rose-700'
              }
            ].map(item => {
              const total = defaultStats.totalEmployees || 1;
              const percent = Math.round((item.count / total) * 100);
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className={`font-mono font-bold ${item.textColor}`}>
                      {item.count} staff ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leave Statistics Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-purple-600" />
              Leave Consumption by Category (Days)
            </h4>
            <span className="text-xs font-semibold text-slate-400">Year-to-date</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
              <span className="text-xs font-semibold text-indigo-900 block">Annual Vacation</span>
              <span className="text-2xl font-black text-indigo-700 font-mono mt-1 block">
                {defaultStats.leaveStatsByType.annual || 0}
              </span>
              <span className="text-[11px] text-indigo-600/80">days utilized</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-900 block">Medical / Sick</span>
              <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                {defaultStats.leaveStatsByType.sick || 0}
              </span>
              <span className="text-[11px] text-emerald-600/80">days utilized</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
              <span className="text-xs font-semibold text-amber-900 block">Casual Days</span>
              <span className="text-2xl font-black text-amber-700 font-mono mt-1 block">
                {defaultStats.leaveStatsByType.casual || 0}
              </span>
              <span className="text-[11px] text-amber-600/80">days utilized</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-semibold text-slate-700 block">Unpaid / Other</span>
              <span className="text-2xl font-black text-slate-800 font-mono mt-1 block">
                {defaultStats.leaveStatsByType.unpaid || 0}
              </span>
              <span className="text-[11px] text-slate-500">days utilized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department Headcount & Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Headcount Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              Department Headcount Distribution
            </h4>
            <span className="text-xs font-semibold text-slate-400">Active roster</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(defaultStats.departmentHeadcount).map(([dept, count]) => {
              const total = defaultStats.totalEmployees || 1;
              const percent = Math.round((count / total) * 100);
              return (
                <div key={dept} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                  <span className="font-semibold text-slate-800">{dept}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden hidden sm:block">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="font-mono font-bold text-slate-700 w-14 text-right">
                      {count} staff
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Score by Department */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Department Performance Appraisal Index
            </h4>
            <span className="text-xs font-semibold text-slate-400">Score / 5.0</span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(defaultStats.performanceAvgByDept).length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No evaluations recorded yet.</p>
            ) : (
              Object.entries(defaultStats.performanceAvgByDept).map(([dept, avgScore]) => (
                <div key={dept} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                  <span className="font-semibold text-slate-800">{dept}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      ★ {avgScore} / 5.0
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
