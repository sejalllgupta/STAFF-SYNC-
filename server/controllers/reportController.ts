import { Response } from 'express';
import { UserModel, AttendanceModel, LeaveModel, PerformanceModel } from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getDashboardStats = async (_req: AuthRequest, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const users = await UserModel.find();
    const todayAttendance = await AttendanceModel.find(a => a.date === today);
    const leaves = await LeaveModel.find();
    const reviews = await PerformanceModel.find();

    const totalEmployees = users.length;
    const activeToday = todayAttendance.length;
    const attendanceRate = totalEmployees > 0 ? Math.round((activeToday / totalEmployees) * 100) : 0;

    // Check employees on leave today
    const onLeaveToday = leaves.filter(l => {
      return l.status === 'approved' && l.startDate <= today && l.endDate >= today;
    }).length;

    const pendingLeavesCount = leaves.filter(l => l.status === 'pending').length;

    // Department Headcount
    const departmentHeadcount: Record<string, number> = {};
    users.forEach(u => {
      departmentHeadcount[u.department] = (departmentHeadcount[u.department] || 0) + 1;
    });

    // Leave stats by type
    const leaveStatsByType: Record<string, number> = {
      annual: 0,
      sick: 0,
      casual: 0,
      maternity: 0,
      paternity: 0,
      unpaid: 0
    };
    leaves.forEach(l => {
      leaveStatsByType[l.leaveType] = (leaveStatsByType[l.leaveType] || 0) + l.totalDays;
    });

    // Attendance breakdown
    const attendanceSummary = {
      present: todayAttendance.filter(a => a.status === 'present').length,
      late: todayAttendance.filter(a => a.status === 'late').length,
      half_day: todayAttendance.filter(a => a.status === 'half_day').length,
      absent: Math.max(0, totalEmployees - activeToday - onLeaveToday)
    };

    // Performance averages by department
    const deptScores: Record<string, { sum: number; count: number }> = {};
    reviews.forEach(r => {
      if (!deptScores[r.employeeDepartment]) {
        deptScores[r.employeeDepartment] = { sum: 0, count: 0 };
      }
      deptScores[r.employeeDepartment].sum += r.overallScore;
      deptScores[r.employeeDepartment].count += 1;
    });

    const performanceAvgByDept: Record<string, number> = {};
    Object.entries(deptScores).forEach(([dept, data]) => {
      performanceAvgByDept[dept] = parseFloat((data.sum / data.count).toFixed(2));
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        activeToday,
        attendanceRate,
        onLeaveToday,
        pendingLeavesCount,
        departmentHeadcount,
        leaveStatsByType,
        attendanceSummary,
        performanceAvgByDept
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compute HR reporting statistics.'
    });
  }
};
